import { css } from '../../../styled-system/css'
import { identity, personal } from '../../content/about'
import { DataGrid } from './DataGrid'
import type { Datum } from './DataGrid'

const SIGNALS: Datum[] = [
  { lbl: 'Detroit', val: personal.teams.join(' · ') },
  { lbl: 'On rotation', val: 'Wet Leg · Tobin Sprout · The War on Drugs' },
  // Mockup sets the change in accentAlt; it fails contrast on field, so it stays in fieldInk.
  { lbl: 'Markets', val: 'SPY 762.63 ▼0.21%' },
  { lbl: 'Aldie, VA', val: '60°F, cloudy' },
  { lbl: 'Moon', val: 'Last quarter, 69% lit' },
  { lbl: 'Air', val: 'AQI good' },
]

export function DataStrip() {
  return (
    <footer
      className={css({
        position: 'relative',
        bg: 'field',
        color: 'fieldInk',
        paddingTop: '36px',
        paddingBottom: '44px',
        paddingInline: '24px',
        md: { paddingTop: '48px', paddingBottom: '56px', paddingInline: '6vw' },
      })}
    >
      <DataGrid items={SIGNALS} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          marginTop: '28px',
          paddingTop: '16px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
          fontSize: '12px',
          letterSpacing: 'wide',
          color: 'fieldInkMuted',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          rowGap: '6px',
          columnGap: '16px',
          justifyContent: 'space-between',
        })}
      >
        <span>
          {identity.name}, {identity.role}
        </span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            color: 'fieldInk',
            textDecoration: 'underline',
            _hover: { color: 'fieldInkMuted' },
          })}
        >
          {identity.email}
        </a>
        <span className={css({ fontVariantNumeric: 'tabular-nums lining-nums' })}>
          © 2026 · dougmar.ch
        </span>
      </div>
    </footer>
  )
}
