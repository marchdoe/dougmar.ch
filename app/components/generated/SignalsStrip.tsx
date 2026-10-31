import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

type Fact = { label: string; value: string; loud?: boolean }

export const todaySignals: Fact[] = [
  { label: 'pistons', value: '110\u201394 W', loud: true },
  { label: 'mexico open', value: 'Novak, 14 under' },
  { label: 'markets · spy', value: 'down 1.77%' },
  { label: 'today', value: 'Halloween' },
  { label: 'moon', value: 'last quarter · 64%' },
  { label: 'aldie, va', value: '45°F cloudy' },
  { label: 'rotation', value: 'My Morning Jacket · Tobin Sprout' },
  { label: 'holes in one', value: `${personal.holesInOne} · ${personal.sport}` },
]

const valClass = css({ fontSize: 'sm', fontWeight: 'medium', color: 'text' })
const loudClass = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textStyle: 'lg',
  color: { base: 'accent', _light: 'fieldBorder' },
  fontVariantNumeric: 'tabular-nums',
})

export function SignalsStrip({ kicker, facts }: { kicker: string; facts: Fact[] }) {
  return (
    <section
      className={css({
        bg: 'bg',
        paddingBlock: { base: '6', lg: '7' },
        paddingInline: { base: '5', md: '7', xl: '8' },
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {/* accent (amber.600) fails on the light ground, so light takes fieldBorder (amber.700) */}
      <span
        className={css({
          display: 'block',
          marginBottom: '5',
          fontSize: 'xs',
          fontWeight: 'bold',
          letterSpacing: 'widest',
          textTransform: 'lowercase',
          color: { base: 'accent', _light: 'fieldBorder' },
        })}
      >
        {kicker}
      </span>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: 'repeat(2, minmax(0, 1fr))',
            md: 'repeat(4, minmax(0, 1fr))',
          },
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'fieldBorder',
        })}
      >
        {facts.map((fact) => (
          <div
            key={fact.label}
            className={css({
              paddingBlock: '4',
              paddingInline: { base: '3', lg: '5' },
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'fieldBorder',
              borderRightWidth: '1px',
              borderRightStyle: 'solid',
              borderRightColor: 'fieldBorder',
              display: 'flex',
              flexDirection: 'column',
              gap: '1',
              minWidth: '0',
            })}
          >
            <span
              className={css({
                fontSize: 'xs',
                fontWeight: 'semibold',
                letterSpacing: 'wide',
                textTransform: 'lowercase',
                color: 'textMuted',
              })}
            >
              {fact.label}
            </span>
            <span className={fact.loud ? loudClass : valClass}>{fact.value}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
