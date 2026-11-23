import { css, cx } from '../../../styled-system/css'
import { capabilities, education } from '../../content/timeline'
import { BandHead } from './BandHead'
import { band, cell, label, reveal } from './styles'

export function CapabilitiesSection() {
  const lines = [education.degree, education.concentration, education.years].filter(Boolean)
  return (
    <section aria-label="Capabilities and education" className={cx(band, reveal)}>
      <BandHead title="What the hands do" sub="Capabilities, and where it started" />
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(12, minmax(0, 1fr))' },
          gap: 'clamp(12px, 1.4vw, 24px)',
        })}
      >
        <div
          className={css({
            gridColumn: { sm: 'span 12', lg: 'span 8' },
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2',
            alignContent: 'flex-start',
          })}
        >
          {capabilities.map((c) => (
            <span
              key={c}
              className={css({
                textStyle: '2xs',
                fontWeight: 'bold',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'text',
                bg: 'surface',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'border',
                borderRadius: 'sm',
                paddingBlock: '2',
                paddingInline: '3',
              })}
            >
              {c}
            </span>
          ))}
        </div>
        <div className={cx(cell, css({ gridColumn: { sm: 'span 12', lg: 'span 4' } }))}>
          <span className={label}>Education</span>
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textStyle: 'lg',
              color: 'text',
            })}
          >
            {education.school}
          </div>
          {lines.map((t) => (
            <div key={t} className={css({ textStyle: 'sm', color: 'textMuted', marginTop: '1' })}>
              {t}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
