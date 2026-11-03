import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { FactGrid, FactRow } from './FactRow'

const facts = [
  { label: 'Pistons', value: '124–91', size: 'big' as const },
  { label: 'Lions', value: '19–15' },
  { label: 'Red Wings', value: '5–3' },
  { label: 'Mexico Open · Novak', value: '−25' },
  { label: 'SPY', value: '752.10', note: '−0.48%' },
  { label: 'Moon', value: 'Last quarter', size: 'quiet' as const },
]

function ColophonTail() {
  return (
    <div
      className={css({
        marginTop: '22px',
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: '1fr 1fr' },
        columnGap: { lg: '56px' },
        rowGap: { base: '14px', lg: '24px' },
        alignItems: { lg: 'end' },
      })}
    >
      <div className={css({ display: 'flex', flexDirection: 'column', gap: '14px' })}>
        <p
          className={css({
            fontSize: 'sm',
            letterSpacing: '0.03em',
            color: { base: 'fieldInkMuted', _dark: 'fieldInk' },
          })}
        >
          In rotation:{' '}
          <b className={css({ color: 'fieldInk', fontWeight: '600' })}>My Morning Jacket</b> &amp;{' '}
          <b className={css({ color: 'fieldInk', fontWeight: '600' })}>Tobin Sprout</b>.
        </p>
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '6px' })}>
          <span
            className={css({
              fontSize: '12px',
              letterSpacing: '0.09em',
              textTransform: 'uppercase',
              fontWeight: '600',
              color: 'fieldInk',
            })}
          >
            {identity.name}, {identity.role}
          </span>
          <a
            href={`mailto:${identity.email}`}
            className={css({
              fontSize: 'sm',
              fontWeight: '600',
              color: 'fieldInk',
              textDecoration: 'underline',
            })}
          >
            {identity.email}
          </a>
        </div>
      </div>
      <figure className={css({ margin: '0' })}>
        <blockquote
          className={css({
            margin: '0',
            fontSize: '16px',
            fontStyle: 'italic',
            lineHeight: '1.4',
            maxWidth: '50ch',
            color: 'fieldInk',
          })}
        >
          “Circumstances do not make the man, they reveal him.”
        </blockquote>
        <figcaption
          className={css({
            fontSize: '12px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginTop: '8px',
            color: { base: 'fieldInkMuted', _dark: 'fieldInk' },
          })}
        >
          James Allen
        </figcaption>
      </figure>
    </div>
  )
}

export function Colophon() {
  return (
    <footer
      id="contact"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingTop: { base: '38px', md: '52px', lg: '60px' },
        paddingBottom: { base: '44px', md: '56px', lg: '60px' },
        paddingLeft: { base: '20px', md: '48px', lg: '40px' },
        paddingRight: { base: '20px', md: '48px', lg: '5vw' },
      })}
    >
      <div
        className={css({
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: { base: 'fieldInkMuted', _dark: 'fieldInk' },
          paddingBottom: '12px',
          marginBottom: '20px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        Colophon · Nov 3, 2026 · Detroit
      </div>
      <FactGrid>
        {facts.map((fact) => (
          <FactRow key={fact.label} {...fact} />
        ))}
      </FactGrid>
      <ColophonTail />
    </footer>
  )
}
