import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import * as yaml from 'js-yaml'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const cliMock = vi.fn()
vi.mock('../../scripts/utils/claude-cli.js', () => ({ callClaudeCLI: cliMock }))
vi.mock('../../scripts/utils/vision-router.js', () => ({ callVisionAgent: vi.fn() }))

const { HANDOFF_FILE, HANDOFF_VERSION, loadResume, parseHandoff, restoreInputs, writeHandoff } =
  await import('../../scripts/utils/handoff.js')
const { callTapedCLI, startTape } = await import('../../scripts/utils/call-tape.js')

const DATE = '2026-09-20'
const SIGNALS = { date: DATE, weather: { temp_f: 61 } }
const TAPE = [
  { agent: 'art-director', text: '===HERO_COPY===\nx', channel: 'cli' },
  { agent: 'mockup-critic', text: '===VERDICT===\nAPPROVE', channel: 'sdk-vision' },
]

const handoff = (over = {}) =>
  JSON.stringify({ version: HANDOFF_VERSION, date: DATE, signals: SIGNALS, tape: TAPE, ...over })

describe('parseHandoff', () => {
  it('reads the signals and the tape', () => {
    expect(parseHandoff(handoff(), { date: DATE })).toEqual({
      signals: SIGNALS,
      references: null,
      tape: TAPE,
    })
  })

  it('reads the references the failed run had, as text', () => {
    const got = parseHandoff(handoff({ references: '## Trending\n- a thing' }), { date: DATE })
    expect(got.references).toBe('## Trending\n- a thing')
  })

  it.each([
    ['references that are not text', { references: { a: 1 } }],
    ['references that are too long', { references: 'x'.repeat(1_000_001) }],
  ])('refuses %s', (_name, over) => {
    expect(() => parseHandoff(handoff(over), { date: DATE })).toThrow(/references/)
  })

  it('keeps only the three fields of a tape entry', () => {
    const noisy = handoff({ tape: [{ ...TAPE[0], extra: '<script>', cost: 4 }] })
    expect(parseHandoff(noisy, { date: DATE }).tape).toEqual([TAPE[0]])
  })

  it.each([
    ['not JSON', 'not json', /not JSON/],
    ['an array', '[]', /version/],
    ['another version', handoff({ version: 2 }), /version/],
    [
      "another day's night",
      handoff({ date: '2026-09-19', signals: { date: '2026-09-19' } }),
      /written for 2026-09-19 and this run is for 2026-09-20/,
    ],
    ['signals for another day', handoff({ signals: { date: '2026-09-19' } }), /signals/],
    ['no signals', handoff({ signals: null }), /signals/],
    ['an empty tape', handoff({ tape: [] }), /tape/],
    ['a tape that is not a list', handoff({ tape: {} }), /tape/],
    [
      'an agent that is not taped',
      handoff({ tape: [{ ...TAPE[0], agent: 'react-engineer' }] }),
      /react-engineer/,
    ],
    ['an entry with no text', handoff({ tape: [{ ...TAPE[0], text: '' }] }), /no text/],
    [
      'an entry with a text that is not a string',
      handoff({ tape: [{ ...TAPE[0], text: 4 }] }),
      /no text/,
    ],
    [
      'an entry with no channel',
      handoff({ tape: [{ ...TAPE[0], channel: undefined }] }),
      /channel/,
    ],
    [
      'an entry that is too long',
      handoff({ tape: [{ ...TAPE[0], text: 'x'.repeat(1_000_001) }] }),
      /over 1000000/,
    ],
    [
      'a tape that is too long',
      handoff({ tape: Array.from({ length: 41 }, () => TAPE[0]) }),
      /over 40 entries/,
    ],
  ])('refuses %s', (_name, text, message) => {
    expect(() => parseHandoff(text, { date: DATE })).toThrow(message)
  })
})

describe('loadResume', () => {
  let dir
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'dm-handoff-'))
  })
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  const fileWith = async (text) => {
    const file = path.join(dir, 'handoff.json')
    await writeFile(file, text)
    return file
  }

  it('is null for a normal run: nothing asked for a resume', async () => {
    expect(await loadResume({}, SIGNALS)).toBeNull()
    expect(await loadResume({ RESUME_HANDOFF: '' }, SIGNALS)).toBeNull()
  })

  it('reads the file the variable names', async () => {
    const env = {
      RESUME_HANDOFF: await fileWith(handoff()),
      GITHUB_EVENT_NAME: 'workflow_dispatch',
    }
    expect(await loadResume(env, SIGNALS)).toEqual({
      signals: SIGNALS,
      references: null,
      tape: TAPE,
    })
  })

  it('reads it for a run outside Actions, which is a person resuming locally', async () => {
    expect(
      (await loadResume({ RESUME_HANDOFF: await fileWith(handoff()) }, SIGNALS)).tape
    ).toHaveLength(2)
  })

  it('never resumes on the schedule event, even with the variable set', async () => {
    const env = { RESUME_HANDOFF: await fileWith(handoff()), GITHUB_EVENT_NAME: 'schedule' }
    await expect(loadResume(env, SIGNALS)).rejects.toThrow(/scheduled run never resumes/)
  })

  it("refuses another day's handoff", async () => {
    const env = { RESUME_HANDOFF: await fileWith(handoff()) }
    await expect(loadResume(env, { date: '2026-09-21' })).rejects.toThrow(/start a normal run/)
  })

  it('fails loudly when the named file is missing, rather than starting a normal run', async () => {
    await expect(
      loadResume({ RESUME_HANDOFF: path.join(dir, 'nope.json') }, SIGNALS)
    ).rejects.toThrow(/ENOENT/)
  })
})

describe('restoreInputs', () => {
  let root
  beforeEach(async () => {
    root = await mkdtemp(path.join(tmpdir(), 'dm-restore-'))
    await mkdir(path.join(root, 'signals'))
  })
  afterEach(async () => {
    await rm(root, { recursive: true, force: true })
  })

  const readSignals = async () =>
    yaml.load(await readFile(path.join(root, 'signals', 'today.yml'), 'utf8'))

  it("puts the failed run's signals where the copy gate and the collectors read them", async () => {
    // What this run collected: a different draw of the random quote signal.
    await writeFile(
      path.join(root, 'signals', 'today.yml'),
      yaml.dump({ date: DATE, quote: { text: 'another one', author: 'X' } })
    )
    const signals = { date: DATE, quote: { text: 'The quote the hero used', author: 'Hubbard' } }

    await restoreInputs({ signals, references: null, tape: TAPE }, root)

    expect(await readSignals()).toEqual(signals)
  })

  it("puts the references back when the failed run had them, and leaves this run's when it had none", async () => {
    const refs = path.join(root, 'signals', 'today.references.md')
    await writeFile(refs, 'collected this run')

    await restoreInputs({ signals: SIGNALS, references: null, tape: TAPE }, root)
    expect(await readFile(refs, 'utf8')).toBe('collected this run')

    await restoreInputs({ signals: SIGNALS, references: '## the ones it saw', tape: TAPE }, root)
    expect(await readFile(refs, 'utf8')).toBe('## the ones it saw')
  })

  it('creates the signals directory in a checkout that has none yet', async () => {
    await rm(path.join(root, 'signals'), { recursive: true })
    await restoreInputs({ signals: SIGNALS, references: null, tape: TAPE }, root)
    expect(await readSignals()).toEqual(SIGNALS)
  })

  it('writes signals as data: a value that looks like YAML syntax stays a value', async () => {
    const signals = {
      date: DATE,
      news: [{ title: '!!js/function "x" # <script>alert(1)</script>' }],
    }
    await restoreInputs({ signals, references: null, tape: TAPE }, root)
    expect(await readSignals()).toEqual(signals)
  })
})

describe('writeHandoff', () => {
  let dir
  beforeEach(async () => {
    dir = await mkdtemp(path.join(tmpdir(), 'dm-handoff-'))
    cliMock.mockReset()
    startTape()
  })
  afterEach(async () => {
    await rm(dir, { recursive: true, force: true })
  })

  it('writes nothing when no paid stage answered', async () => {
    expect(await writeHandoff(dir, { root: dir, date: DATE, signals: SIGNALS })).toBeNull()
    await expect(readFile(path.join(dir, HANDOFF_FILE))).rejects.toThrow(/ENOENT/)
  })

  it('writes a file parseHandoff reads back to the same tape', async () => {
    cliMock.mockResolvedValue('the reply')
    await callTapedCLI('art-director', 's', 'p', {})

    const file = await writeHandoff(dir, { root: dir, date: DATE, signals: SIGNALS })
    expect(path.basename(file)).toBe('handoff.json')
    const back = parseHandoff(await readFile(file, 'utf8'), { date: DATE })
    expect(back.signals).toEqual(SIGNALS)
    expect(back.references).toBeNull()
    expect(back.tape).toEqual([{ agent: 'art-director', text: 'the reply', channel: 'cli' }])
  })

  it('carries the references file the run read', async () => {
    await mkdir(path.join(dir, 'signals'))
    await writeFile(path.join(dir, 'signals', 'today.references.md'), '## Trending\n- a thing')
    cliMock.mockResolvedValue('the reply')
    await callTapedCLI('art-director', 's', 'p', {})

    const file = await writeHandoff(dir, { root: dir, date: DATE, signals: SIGNALS })
    expect(parseHandoff(await readFile(file, 'utf8'), { date: DATE }).references).toBe(
      '## Trending\n- a thing'
    )
  })
})
