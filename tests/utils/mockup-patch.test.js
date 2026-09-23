import { describe, expect, it } from 'vitest'
import { applyMockupPatch, parseMockupPatch } from '../../scripts/utils/mockup-patch.js'

const edit = (find, replace) => `<<<<<<< FIND\n${find}\n=======\n${replace}\n>>>>>>> REPLACE`

describe('parseMockupPatch', () => {
  it('returns null when the reply has no PATCH block', () => {
    expect(parseMockupPatch('===FILE:mockup.html===\n<html></html>')).toBeNull()
  })

  it('reads every edit in order, stopping at the next block', () => {
    const raw = [
      '===PATCH:mockup.html===',
      edit('a {}', 'a { color: red; }'),
      '',
      edit('<p>one</p>\n<p>two</p>', '<p>one</p>'),
      '===INTERIOR_NOTES===',
      edit('not', 'an edit'),
    ].join('\n')
    expect(parseMockupPatch(raw)).toEqual([
      { find: 'a {}', replace: 'a { color: red; }' },
      { find: '<p>one</p>\n<p>two</p>', replace: '<p>one</p>' },
    ])
  })

  it('reads an empty REPLACE as a deletion', () => {
    const raw = `===PATCH:mockup.html===\n<<<<<<< FIND\n<hr>\n=======\n>>>>>>> REPLACE\n`
    expect(parseMockupPatch(raw)).toEqual([{ find: '<hr>', replace: '' }])
  })

  it('returns an empty list for a PATCH block with no edits in it', () => {
    expect(parseMockupPatch('===PATCH:mockup.html===\nI changed the mark.\n')).toEqual([])
  })
})

describe('applyMockupPatch', () => {
  const page = '<style>\n.mark { height: 24px; }\n.hero { font-size: 48px; }\n</style>\n<h1>Hi</h1>'

  it('applies edits in order, each to the result of the last', () => {
    const r = applyMockupPatch(page, [
      { find: '.mark { height: 24px; }', replace: '.mark { height: 52px; }' },
      { find: '.mark { height: 52px; }', replace: '.mark { height: 56px; }' },
    ])
    expect(r).toEqual({ ok: true, html: page.replace('24px', '56px'), applied: 2 })
  })

  it('fails the whole patch on a FIND that is not there', () => {
    const r = applyMockupPatch(page, [
      { find: '.mark { height: 24px; }', replace: '.mark { height: 52px; }' },
      { find: '.nav {}', replace: '.nav { gap: 0; }' },
    ])
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/^edit 2's FIND text is not in the previous mockup/)
  })

  it('fails on a FIND that is not unique', () => {
    const r = applyMockupPatch('<p>x</p><p>x</p>', [{ find: '<p>x</p>', replace: '' }])
    expect(r.ok).toBe(false)
    expect(r.error).toMatch(/occurs more than once/)
  })

  it('matches through trailing whitespace the model dropped', () => {
    const withTrailing = '<style>  \n.mark { height: 24px; }   \n</style>'
    const r = applyMockupPatch(withTrailing, [
      { find: '<style>\n.mark { height: 24px; }', replace: '<style>\n.mark { height: 52px; }' },
    ])
    expect(r.ok).toBe(true)
    expect(r.html).toContain('.mark { height: 52px; }')
  })

  it('fails on no edits and on an empty FIND', () => {
    expect(applyMockupPatch(page, []).ok).toBe(false)
    expect(applyMockupPatch(page, [{ find: '  ', replace: 'x' }]).ok).toBe(false)
  })

  it('treats replacement text literally, $ patterns included', () => {
    const r = applyMockupPatch(page, [{ find: '<h1>Hi</h1>', replace: '<h1>$& $1</h1>' }])
    expect(r.ok && r.html.endsWith('<h1>$& $1</h1>')).toBe(true)
  })
})
