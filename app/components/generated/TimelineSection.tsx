import { css, cx } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { BandHead } from './BandHead'
import { band, reveal } from './styles'

export function TimelineSection() {
  return (
    <section aria-label="Record" className={cx(band, reveal)}>
      <BandHead title="The record" sub="Roles held, 2006 to present" />
      <ol className={css({ listStyle: 'none', margin: '0', padding: '0' })}>
        {timeline.map((e) => (
          <li
            key={`${e.year}-${e.company}-${e.role}`}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', lg: '140px minmax(0, 1fr) minmax(0, 1.2fr)' },
              columnGap: '6',
              rowGap: '2',
              paddingBlock: '5',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                fontWeight: 'bold',
                textStyle: 'base',
                color: 'accent',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {e.year}
            </span>
            <div className={css({ minWidth: '0' })}>
              <span
                className={css({
                  display: 'block',
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  textStyle: { base: 'base', lg: 'lg' },
                  color: 'text',
                })}
              >
                {e.role}
              </span>
              <span className={css({ display: 'block', textStyle: 'sm', color: 'textMuted' })}>
                {e.company}
              </span>
            </div>
            {e.description ? (
              <p
                className={css({
                  textStyle: 'sm',
                  color: 'textMuted',
                  maxWidth: '58ch',
                  lineHeight: 'normal',
                })}
              >
                {e.description}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  )
}
