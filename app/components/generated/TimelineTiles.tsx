import { css, cx } from '../../../styled-system/css'
import { timeline } from '../../content/timeline'
import { reveal, stackGrid, whead, wheadTitle } from './styles'

function joinParts(parts: string[]): string {
  return parts.filter((p) => p !== '').join(', ')
}

export function TimelineTiles() {
  return (
    <section className={cx(reveal, css({ marginTop: '80px' }))}>
      <div className={stackGrid}>
        <div className={whead}>
          <h2 className={wheadTitle}>Timeline</h2>
        </div>
        {timeline.map((t) => (
          <div
            key={`${t.year}-${t.role}-${t.company}`}
            className={css({
              bg: 'bgAlt',
              display: 'grid',
              gridTemplateColumns: { base: '1fr', md: '140px 1fr' },
              columnGap: '6',
              rowGap: '2',
              paddingBlock: '22px',
              paddingInline: '22px',
            })}
          >
            <span
              className={css({ fontSize: 'sm', color: 'textMuted', minWidth: { md: '140px' } })}
            >
              {t.year}
            </span>
            <div className={css({ minWidth: '0' })}>
              <h3
                className={css({
                  fontFamily: { base: 'body', md: 'display' },
                  fontWeight: 'normal',
                  fontSize: { base: 'base', md: 'xl' },
                  lineHeight: 'snug',
                  color: 'text',
                })}
              >
                {joinParts([t.role, t.company])}
              </h3>
              {t.description ? (
                <p
                  className={css({
                    fontSize: 'base',
                    lineHeight: '1.55',
                    color: 'textMuted',
                    maxWidth: '62ch',
                    marginTop: '2',
                    marginBottom: '0',
                  })}
                >
                  {t.description}
                </p>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
