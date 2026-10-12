import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { IndexLabel } from './IndexLabel'

type Item = (typeof selectedWork)[number]

function rowHref(p: Item): string {
  const internal = `/work/${p.slug}`
  return p.depth === 'full' ? internal : (p.externalUrl ?? internal)
}

function WorkRow({ p, n, flush }: { p: Item; n: number; flush: boolean }) {
  return (
    <a
      href={rowHref(p)}
      className={`group ${css({
        display: { base: 'block', md: 'grid' },
        gridTemplateColumns: { md: 'repeat(12, minmax(0, 1fr))' },
        columnGap: { md: '24px' },
        rowGap: { md: '8px' },
        alignItems: 'baseline',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
        paddingTop: { base: '14px', md: '18px' },
        paddingBottom: { base: '18px', md: '22px' },
        color: 'text',
        _hover: { borderTopColor: 'borderStrong', color: 'text' },
      })}`}
    >
      <span
        className={css({
          display: 'inline-block',
          fontWeight: 'bold',
          letterSpacing: '0.02em',
          fontSize: { base: 'xl', md: 'lg', xl: 'xl' },
          whiteSpace: 'nowrap',
          color: 'accent',
          marginBottom: { base: '2px', md: '0' },
          gridColumn: { md: '1 / 2' },
        })}
      >
        {String(n).padStart(2, '0')}
      </span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'normal',
          fontVariant: 'small-caps',
          letterSpacing: 'normal',
          fontSize: { base: '44px', md: 'clamp(48px, 6.4vw, 104px)' },
          lineHeight: '0.94',
          color: 'text',
          gridColumn: { md: flush ? '5 / 13' : '2 / 9' },
          textAlign: { base: 'left', md: flush ? 'right' : 'left' },
          _groupHover: { color: 'accent' },
        })}
      >
        {p.title}
      </span>
      <span className={css({ display: { base: 'block', md: 'contents' }, marginTop: '6px' })}>
        <span
          className={css({
            fontWeight: 'bold',
            fontSize: 'sm',
            color: 'accent',
            letterSpacing: '0.04em',
            gridColumn: { md: flush ? '1 / 3' : '9 / 11' },
          })}
        >
          {p.year}
        </span>
        <span
          className={css({
            display: 'block',
            fontSize: 'sm',
            color: 'textMuted',
            letterSpacing: '0.02em',
            gridColumn: { md: flush ? '3 / 5' : '11 / 13' },
          })}
        >
          {[p.type, p.role].filter(Boolean).join(' · ')}
        </span>
      </span>
    </a>
  )
}

export function WorkIndex() {
  const rows = [...selectedWork, ...experiments].sort((a, b) => b.year - a.year)
  return (
    <section
      id="work"
      className={css({
        marginTop: { base: '34px', md: '40px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <IndexLabel>Selected work and experiments, newest first</IndexLabel>
      {rows.map((p, i) => (
        <WorkRow key={p.slug} p={p} n={i + 2} flush={i % 3 === 1} />
      ))}
    </section>
  )
}
