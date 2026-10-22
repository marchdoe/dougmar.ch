import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { BonePanel, EvLabel } from './Panel'

type Project = (typeof projects)[number]

function hrefFor(p: Project): string {
  return p.depth === 'full' ? `/work/${p.slug}` : (p.externalUrl ?? `/work/${p.slug}`)
}

const small = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontVariantNumeric: 'tabular-nums',
  color: 'textMuted',
  flexShrink: 0,
})

export function WorkIndex({ items }: { items: Project[] }) {
  return (
    <BonePanel id="work" label="The evidence, a decade of work">
      <EvLabel>The evidence. The work, 2008 to now</EvLabel>
      <p
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: 'clamp(20px, 5vw, 26px)', xl: '28px' },
          lineHeight: '1.3',
          color: 'text',
          maxWidth: '30ch',
          marginBottom: '4',
        })}
      >
        Everyone in the feed is starting over. I&rsquo;ve run Spaceman for a decade, the same
        vehicle that carries whatever comes next.
      </p>
      <hr
        className={css({
          borderWidth: '0',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'borderStrong',
          marginTop: '0',
          marginBottom: '4',
        })}
      />
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          fontSize: '2xs',
          color: 'textFaint',
          paddingBottom: '2',
          marginBottom: '2',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderColor: 'border',
        })}
      >
        <span>Project</span>
        <span>Type</span>
      </div>
      <div className={css({ marginBottom: '5' })}>
        {items.map((p, i) => (
          <div
            key={p.slug}
            className={css({
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderColor: 'border',
            })}
          >
            <a
              href={hrefFor(p)}
              className={css({
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '3',
                paddingBlock: '14px',
                color: 'text',
                _hover: {
                  color: 'text',
                  '& .wk-title': { boxShadow: 'inset 0 -2px 0 currentColor' },
                },
              })}
            >
              <span
                className={css({
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '12px',
                  minWidth: 0,
                })}
              >
                <span className={css({ fontSize: '2xs' })}>
                  <span className={small}>{String(i + 1).padStart(2, '0')}</span>
                </span>
                <span className={css({ fontSize: 'sm' })}>
                  <span className={small}>{p.year}</span>
                </span>
                <span
                  className={`wk-title ${css({ fontFamily: 'display', fontWeight: 'bold', fontSize: 'clamp(20px, 5.5vw, 26px)', lineHeight: '1.05', color: 'text' })}`}
                >
                  {p.title}
                </span>
              </span>
              <span
                className={css({
                  flexShrink: 0,
                  textAlign: 'right',
                  fontFamily: 'body',
                  fontWeight: 'normal',
                  fontSize: 'xs',
                  letterSpacing: 'wide',
                  textTransform: 'uppercase',
                  color: 'textFaint',
                })}
              >
                {p.type}
              </span>
            </a>
          </div>
        ))}
      </div>
      <div
        className={css({
          marginTop: 'auto',
          paddingTop: '4',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderColor: 'border',
        })}
      >
        <blockquote
          className={css({
            margin: '0',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            fontSize: '18px',
            lineHeight: '1.4',
            color: 'textMuted',
            maxWidth: '34ch',
          })}
        >
          &ldquo;Learn as if you were to live forever.&rdquo;
        </blockquote>
        <div
          className={css({
            marginTop: '2',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'wider',
            fontSize: '2xs',
            color: 'textFaint',
          })}
        >
          Gandhi, on reinvention
        </div>
      </div>
    </BonePanel>
  )
}
