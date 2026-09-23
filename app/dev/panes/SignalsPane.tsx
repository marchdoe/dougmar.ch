import { css } from '../../../styled-system/css'
import type { ArchiveEntry } from '../../server/archive'
import type { Meta, Signals } from '../api'
import { AtmosphereStrip } from '../cards/AtmosphereStrip'
import { BottomRow } from '../cards/BottomRow'
import { GitHubCard } from '../cards/GitHubCard'
import { GolfCard } from '../cards/GolfCard'
import { HackerNewsCard } from '../cards/HackerNewsCard'
import { MarketCard } from '../cards/MarketCard'
import { NewsCard } from '../cards/NewsCard'
import { ProductHuntCard } from '../cards/ProductHuntCard'
import { QuoteBlock } from '../cards/QuoteBlock'
import { SignalsHeader } from '../cards/SignalsHeader'
import { SportsCard } from '../cards/SportsCard'
import { WeatherCard } from '../cards/WeatherCard'

const liveGrid = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '10px',
  marginBottom: '12px',
})

const overridesRow = css({
  display: 'flex',
  gap: '12px',
  marginBottom: '20px',
  marginTop: '24px',
  alignItems: 'flex-end',
})
const fieldGroup = css({ display: 'flex', flexDirection: 'column', gap: '5px' })
const fieldLabel = css({
  fontSize: '10px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.1em',
  color: 'devPanel.dim',
})
const control = {
  border: '1px solid',
  borderColor: 'devPanel.border',
  borderRadius: '4px',
  padding: '7px 10px',
  fontSize: '12px',
  color: 'devPanel.text',
  background: 'devPanel.card',
} as const
const select = css(control, { minWidth: '160px' })
const textarea = css(control, { resize: 'none', height: '56px', width: '340px' })
const saveButton = css({
  background: 'devPanel.card',
  border: '1px solid',
  borderColor: 'devPanel.border',
  borderRadius: '4px',
  padding: '7px 14px',
  fontSize: '12px',
  fontWeight: 700,
  color: 'devPanel.dim',
  cursor: 'pointer',
  height: '34px',
})
const lastRun = css({ fontSize: '11px', color: 'devPanel.muted', marginTop: '8px' })
const lastRunDate = css({ color: 'devPanel.dim' })
const lastRunBrief = css({ color: 'devPanel.muted' })

/** The day's signals, card by card, and the owner's overrides for the next run. */
export function SignalsPane({
  signals,
  meta,
  archive,
  moodOverride,
  setMoodOverride,
  notes,
  setNotes,
  savingOverrides,
  onSaveOverrides,
}: {
  signals: Signals
  meta: Meta | null
  archive: ArchiveEntry[]
  moodOverride: string
  setMoodOverride: (v: string) => void
  notes: string
  setNotes: (v: string) => void
  savingOverrides: boolean
  onSaveOverrides: () => void
}) {
  return (
    <>
      <SignalsHeader meta={meta} date={signals.date ?? ''} />
      <AtmosphereStrip signals={signals} />
      <QuoteBlock signals={signals} />

      {/* Zone 4: live data cards */}
      <div className={liveGrid}>
        <SportsCard signals={signals} />
        <GolfCard signals={signals} />
        <GitHubCard signals={signals} />
        <HackerNewsCard signals={signals} />
        <WeatherCard signals={signals} />
        <NewsCard signals={signals} />
        <MarketCard signals={signals} />
        <ProductHuntCard signals={signals} />
      </div>

      <BottomRow signals={signals} />

      <div className={overridesRow}>
        <div className={fieldGroup}>
          <label htmlFor="mood-override" className={fieldLabel}>
            Mood Override
          </label>
          <select
            id="mood-override"
            data-testid="mood-override-input"
            className={select}
            value={moodOverride}
            onChange={(e) => setMoodOverride(e.target.value)}
          >
            <option value="">-- none (Claude decides) --</option>
            <option value="dark">dark</option>
            <option value="celebratory">celebratory</option>
            <option value="tense">tense</option>
            <option value="playful">playful</option>
          </select>
        </div>
        <div className={fieldGroup}>
          <label htmlFor="notes-claude" className={fieldLabel}>
            Notes for Claude
          </label>
          <textarea
            id="notes-claude"
            className={textarea}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional extra context, e.g. 'I just got a hole in one'"
          />
        </div>
        <button
          type="button"
          data-testid="save-overrides-btn"
          className={saveButton}
          onClick={onSaveOverrides}
          disabled={savingOverrides}
        >
          {savingOverrides ? 'Saving...' : 'Save overrides'}
        </button>
      </div>

      {archive[0] && (
        <div className={lastRun}>
          Last run: <strong className={lastRunDate}>{archive[0].date}</strong> &middot;{' '}
          <em className={lastRunBrief}>{archive[0].brief.slice(0, 50)}...</em>
        </div>
      )}
    </>
  )
}
