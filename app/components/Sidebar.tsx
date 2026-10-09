import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { SigRow } from './generated/SigRow'

const signals = [
  { label: 'Weather', value: 'Aldie, Virginia · Overcast · 52°F' },
  { label: 'Moon', value: 'New moon · 1.5% lit' },
  { label: 'Market', value: 'SPY 773.93 ▾ 0.42%' },
  { label: 'Golf', value: 'Baycurrent Classic · Mitchell −11 · Bridgeman −11' },
  { label: 'Rotation', value: 'My Morning Jacket, Radiohead, The War on Drugs' },
]

const linkCls = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  minWidth: '44px',
  fontSize: 'sm',
  fontVariant: 'small-caps',
  letterSpacing: 'wider',
  color: 'accentAlt',
  _hover: { color: 'text' },
})

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'bgAlt',
        color: 'textMuted',
        paddingTop: '44px',
        paddingInline: '24px',
        paddingBottom: '54px',
        borderTop: '2px solid',
        borderColor: 'borderStrong',
        lg: {
          display: 'grid',
          gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
          columnGap: '2vw',
          rowGap: '0',
          paddingTop: '60px',
          paddingInline: '4vw',
          paddingBottom: '68px',
        },
        xl: { paddingInline: '5vw' },
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          fontSize: 'sm',
          color: 'textFaint',
          marginBottom: '18px',
          lg: { gridColumn: '1 / 13' },
        })}
      >
        Colophon · 09 October 2026
      </h2>
      <div className={css({ lg: { gridColumn: '1 / 9' } })}>
        {signals.map((s) => (
          <SigRow key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
      <div
        className={css({
          marginTop: '6',
          lg: { gridColumn: '10 / 13', marginTop: '0', alignSelf: 'start' },
        })}
      >
        <div
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: 'lg',
            color: 'text',
          })}
        >
          {identity.name}
        </div>
        <div className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '1' })}>
          {identity.role}
        </div>
        <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', marginTop: '2' })}>
          <a href={`mailto:${identity.email}`} className={linkCls}>
            {identity.email}
          </a>
          <a href="/about" className={linkCls}>
            About
          </a>
        </div>
        <div
          className={css({
            marginTop: '22px',
            fontSize: '2xs',
            color: 'textFaint',
            fontVariant: 'small-caps',
            letterSpacing: 'wider',
          })}
        >
          Columbus Day, Monday
        </div>
        <div
          className={css({
            marginTop: '14px',
            fontSize: '2xs',
            color: 'textFaint',
            letterSpacing: 'wide',
          })}
        >
          {identity.name} · Spectral &amp; Albert Sans · set in spruce and bone
        </div>
      </div>
    </footer>
  )
}
