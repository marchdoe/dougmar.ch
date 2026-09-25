import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const figs: { label: string; value: string }[] = [
  { label: 'Moon', value: '99.8%' },
  { label: 'SPY', value: '−0.08%' },
  { label: 'Aldie', value: '47°F' },
  { label: 'Red Wings', value: '3–2' },
]

export function Colophon() {
  return (
    <footer
      className={css({
        bg: 'bgAlt',
        color: 'text',
        paddingBlock: { base: '5', lg: '6' },
        paddingInline: { base: '4', lg: '7' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3',
        textAlign: 'center',
      })}
    >
      <div
        className={css({
          textStyle: 'xs',
          fontVariant: 'small-caps',
          letterSpacing: 'wider',
          color: 'textMuted',
        })}
      >
        {identity.name} · 2026 · Ashburn, Virginia
      </div>
      <div className={css({ textStyle: 'xs', letterSpacing: 'wide', color: 'textMuted' })}>
        {identity.role}
      </div>
      <a
        href={`mailto:${identity.email}`}
        className={css({
          display: 'inline-block',
          paddingBlock: '3',
          paddingInline: '1',
          textStyle: 'sm',
          color: 'text',
          borderBottom: '1px solid',
          borderColor: 'fieldBorder',
          lineHeight: '1',
          _hover: { color: 'accent', borderColor: 'accent' },
        })}
      >
        {identity.email}
      </a>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          rowGap: '2',
          columnGap: '4',
          textStyle: 'xs',
          letterSpacing: 'wide',
          color: 'textMuted',
          fontVariantNumeric: 'tabular-nums',
        })}
      >
        {figs.map((fig) => (
          <span key={fig.label}>
            {fig.label} <span className={css({ color: 'accentAlt' })}>{fig.value}</span>
          </span>
        ))}
      </div>
    </footer>
  )
}
