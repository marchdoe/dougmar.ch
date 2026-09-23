import { css, cva } from '../../../styled-system/css'
import {
  readDayOfWeek,
  readHolidays,
  readLunar,
  readSeason,
  readSun,
} from '../../lib/archive-signals'
import type { Signals } from '../api'

const strip = css({
  display: 'flex',
  background: 'devPanel.card',
  border: '1px solid',
  borderColor: 'devPanel.border',
  borderRadius: '4px',
  marginBottom: '12px',
  overflow: 'hidden',
})
const cell = css({ flex: 1, padding: '12px 16px', minWidth: 0 })
const divider = css({ width: '1px', background: 'devPanel.border' })
const label = css({
  fontSize: '9px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.12em',
  color: 'devPanel.muted',
  marginBottom: '4px',
})

const value = cva({
  base: { fontWeight: 700 },
  variants: {
    size: { lg: { fontSize: '16px' }, md: { fontSize: '14px' } },
    tone: {
      green: { color: 'devPanel.green' },
      text: { color: 'devPanel.text' },
      secondary: { color: 'devPanel.secondary' },
      blue: { color: 'devPanel.blue' },
      muted: { color: 'devPanel.muted' },
    },
  },
})

const sub = cva({
  base: { fontSize: '10px', marginTop: '2px', color: 'devPanel.dim' },
  variants: {
    tone: {
      cyan: { color: 'devPanel.cyan' },
      blue: { color: 'devPanel.blueDim' },
      green: { color: 'devPanel.green' },
    },
  },
})

const daylightUnit = css({
  fontSize: '11px',
  fontWeight: 400,
  color: 'devPanel.dim',
  marginLeft: '4px',
})

function SeasonCell({ signals }: { signals: Signals }) {
  const season = readSeason(signals.season)
  return (
    <div className={cell}>
      <div className={label}>SEASON</div>
      <div className={value({ size: 'lg', tone: 'green' })}>{season?.season ?? '--'}</div>
      <div className={sub()}>
        {season?.month_name ?? '--'} · Day {season?.day_of_year ?? '--'}
      </div>
    </div>
  )
}

function DayCell({ signals }: { signals: Signals }) {
  const dayOfWeek = readDayOfWeek(signals.day_of_week)
  const weekend = dayOfWeek?.is_weekend
  return (
    <div className={cell}>
      <div className={label}>DAY</div>
      <div className={value({ size: 'lg', tone: 'text' })}>{dayOfWeek?.day ?? '--'}</div>
      <div className={sub({ tone: weekend ? 'cyan' : undefined })}>
        {weekend ? 'Weekend' : 'Weekday'}
      </div>
    </div>
  )
}

function SunCell({ signals }: { signals: Signals }) {
  const sun = readSun(signals.sun)
  return (
    <div className={cell}>
      <div className={label}>SUN</div>
      <div className={value({ size: 'lg', tone: 'secondary' })}>
        {sun?.daylight_hours ?? '--'}h<span className={daylightUnit}>daylight</span>
      </div>
      <div className={sub()}>
        {sun?.sunrise ?? '--'} &#8593; {sun?.sunset ?? '--'} &#8595;
      </div>
    </div>
  )
}

function LunarCell({ signals }: { signals: Signals }) {
  const lunar = readLunar(signals.lunar)
  const lit = lunar?.illumination
  return (
    <div className={cell}>
      <div className={label}>LUNAR</div>
      <div className={value({ size: 'md', tone: 'blue' })}>{lunar?.phase ?? '--'}</div>
      <div className={sub({ tone: 'blue' })}>
        {lit != null ? `${Math.round(lit * 100)}% illuminated` : '--'}
      </div>
    </div>
  )
}

/** Today's holiday, else the next one and how far away it is. */
function nextHoliday(signals: Signals): { name: string; sub: string } | null {
  const holidays = readHolidays(signals.holidays)
  if (holidays?.today) return { name: holidays.today, sub: 'Today!' }
  const next = holidays?.upcoming[0]
  if (!next) return null
  return { name: next.name, sub: `in ${next.days_away} day${next.days_away !== 1 ? 's' : ''}` }
}

function HolidayCell({ signals }: { signals: Signals }) {
  const holiday = nextHoliday(signals)
  return (
    <div className={cell}>
      <div className={label}>UPCOMING</div>
      {holiday ? (
        <>
          <div className={value({ size: 'md', tone: 'green' })}>{holiday.name}</div>
          <div className={sub({ tone: 'green' })}>{holiday.sub}</div>
        </>
      ) : (
        <div className={value({ size: 'md', tone: 'muted' })}>None nearby</div>
      )}
    </div>
  )
}

/** Zone 2: season, day, sun, moon and the next holiday, in one strip. */
export function AtmosphereStrip({ signals }: { signals: Signals }) {
  return (
    <div className={strip}>
      <SeasonCell signals={signals} />
      <div className={divider} />
      <DayCell signals={signals} />
      <div className={divider} />
      <SunCell signals={signals} />
      <div className={divider} />
      <LunarCell signals={signals} />
      <div className={divider} />
      <HolidayCell signals={signals} />
    </div>
  )
}
