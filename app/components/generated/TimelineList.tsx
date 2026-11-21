import { css } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { Reveal } from './Reveal'
import { SectionHead } from './SectionHead'

export function TimelineList() {
  return (
    <Reveal
      className={css({
        paddingTop: { base: '48px', lg: '72px' },
        paddingInline: '6vw',
        paddingBottom: '24px',
      })}
    >
      <SectionHead title="Record" note="2006 to present" />
      {timeline.map((entry) => (
        <div
          key={`${entry.year}-${entry.company}-${entry.role}`}
          className={css({
            display: { base: 'flex', md: 'grid' },
            flexDirection: 'column',
            gridTemplateColumns: { md: '140px 1fr' },
            columnGap: '24px',
            rowGap: '6px',
            paddingBlock: '16px',
            paddingInline: '4px',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <span
            className={css({
              textStyle: 'sm',
              color: 'textFaint',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '.06em',
              minWidth: { md: '140px' },
            })}
          >
            {entry.year}
          </span>
          <div
            className={css({ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' })}
          >
            <span
              className={css({
                fontFamily: { base: 'body', md: 'display' },
                fontSize: { base: '16px', md: '30px' },
                fontWeight: { base: 'bold', md: 'normal' },
                lineHeight: '1.1',
                letterSpacing: { md: '.02em' },
                color: 'text',
              })}
            >
              {entry.role}
            </span>
            <span className={css({ textStyle: 'sm', color: 'textMuted' })}>{entry.company}</span>
            {entry.description ? (
              <p
                className={css({
                  textStyle: 'base',
                  color: 'textMuted',
                  maxWidth: '58ch',
                  marginTop: '6px',
                })}
              >
                {entry.description}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </Reveal>
  )
}
