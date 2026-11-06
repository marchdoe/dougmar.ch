import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { RevealSection } from './RevealSection'

const items = [...(featuredProject ? [featuredProject] : []), ...selectedWork, ...experiments]

export function WorkIndex() {
  return (
    <RevealSection id="work" title="Selected work" sub="Out of the shop">
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'border',
        })}
      >
        {items.map((p) => (
          <div
            key={p.slug}
            className={css({
              display: 'grid',
              gridTemplateColumns: { base: '1fr', sm: '1fr auto' },
              alignItems: 'baseline',
              rowGap: '1',
              columnGap: '5',
              paddingBlock: '4',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderColor: 'border',
            })}
          >
            <a
              href={p.depth === 'lightweight' && p.externalUrl ? p.externalUrl : `/work/${p.slug}`}
              className={css({
                fontFamily: 'display',
                fontWeight: 'normal',
                fontSize: { base: '28px', lg: '38px' },
                lineHeight: 'tight',
                letterSpacing: 'tight',
                minWidth: '0',
                color: p.featured ? 'accentAlt' : 'text',
                _hover: { color: 'accentAlt' },
              })}
            >
              {p.title}
            </a>
            <span
              className={css({
                textStyle: 'xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'textMuted',
                textAlign: { base: 'left', sm: 'right' },
                whiteSpace: 'nowrap',
              })}
            >
              {p.type} ·{' '}
              <span className={css({ color: 'text', fontVariantNumeric: 'tabular-nums' })}>
                {p.year}
              </span>
            </span>
          </div>
        ))}
      </div>
    </RevealSection>
  )
}
