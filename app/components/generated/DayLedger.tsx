import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { DayRow } from './DayRow'
import { bleed, mintRule, SectionHead } from './LedgerParts'

const fig = css({ color: 'accent' })

type Signal = { label: string; value: ReactNode; meta?: string }

const signals: Signal[] = [
  {
    label: 'Weather',
    value: '44°F, partly cloudy',
    meta: 'Aldie, Virginia. Humidity 93%. Wind S 2 mph.',
  },
  { label: 'Sun', value: 'Sunset 4:52 PM', meta: '9.9 hours of daylight.' },
  { label: 'Moon', value: 'Waxing crescent, 12%' },
  {
    label: 'Market',
    value: (
      <>
        SPY <span className={fig}>759.81</span>, up 1.32%
      </>
    ),
  },
  { label: 'Golf', value: 'Austin Championship', meta: 'Scheduled. No leaders yet.' },
  { label: 'Detroit', value: 'No scores today.', meta: 'Lions, Tigers, Pistons, Red Wings.' },
  {
    label: 'Hacker News',
    value: 'Tim Peters, 1952–2026',
    meta: 'He wrote the Zen of Python. Top story, 1,257 points.',
  },
]

const pull = css({
  margin: 0,
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  paddingTop: { base: '40px', md: '64px' },
  paddingBottom: { base: '40px', md: '64px' },
})

const quote = css({
  margin: 0,
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  textStyle: 'xl',
  lineHeight: '1.2',
  color: 'text',
  maxWidth: '28ch',
})

const caption = css({
  marginTop: '12px',
  textStyle: 'xs',
  fontWeight: 'normal',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textMuted',
})

const reading = css({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  fontFamily: 'body',
  fontWeight: 'normal',
  textStyle: 'base',
  lineHeight: '1.55',
})

const readingLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  fontWeight: 'normal',
})

const readingSource = css({
  display: 'block',
  textStyle: 'sm',
  color: 'textFaint',
  marginTop: '-6px',
})

function PullQuote() {
  return (
    <figure className={pull}>
      <blockquote className={quote}>
        When you lose your desire for things that do not matter, you will be free.
      </blockquote>
      <figcaption className={caption}>Morihei Ueshiba</figcaption>
    </figure>
  )
}

function ReadingRow() {
  return (
    <div id="reading">
      <DayRow label="Reading">
        <ul className={reading}>
          <li>
            <a href="#reading" className={readingLink}>
              By taking away
            </a>
            <span className={readingSource}>On software as sculpture</span>
          </li>
        </ul>
      </DayRow>
    </div>
  )
}

export function DayLedger() {
  return (
    <section aria-labelledby="day-h">
      <SectionHead id="day-h">Thursday</SectionHead>
      <div className={`${bleed} ${mintRule}`}>
        {signals.map((signal) => (
          <DayRow key={signal.label} label={signal.label} meta={signal.meta}>
            {signal.value}
          </DayRow>
        ))}
        <PullQuote />
        <ReadingRow />
        <DayRow label="In rotation">Tobin Sprout, Guided by Voices</DayRow>
      </div>
    </section>
  )
}
