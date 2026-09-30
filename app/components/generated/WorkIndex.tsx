import { css, cx } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import { reveal } from './reveal'
import { SectionHead } from './SectionHead'

type Item = { slug: string; title: string; type: string; year: number; externalUrl?: string }

function IndexRow({ item, href, first }: { item: Item; href: string; first: boolean }) {
  return (
    <a
      href={href}
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        columnGap: '4',
        rowGap: '1',
        minHeight: '44px',
        paddingBlock: '4',
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: first ? 'borderStrong' : 'border',
        '&:hover [data-ix]': { color: { base: 'accentAlt', _light: 'text' } },
      })}
    >
      <span
        data-ix=""
        className={css({
          flexGrow: 1,
          fontFamily: 'display',
          fontWeight: 'normal',
          textStyle: 'xl',
          lineHeight: 'tight',
          color: 'text',
        })}
      >
        {item.title}
      </span>
      <span className={css({ display: 'inline-flex', alignItems: 'center', columnGap: '4' })}>
        <span
          className={css({
            textStyle: 'xs',
            letterSpacing: 'wide',
            textTransform: 'uppercase',
            color: 'textFaint',
          })}
        >
          {item.type}
        </span>
        <span
          data-ix=""
          className={css({
            textStyle: 'sm',
            color: 'textMuted',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {item.year}
        </span>
      </span>
    </a>
  )
}

const workCol = css({ display: 'flex', flexDirection: 'column', gridColumn: { lg: '1 / 8' } })
const expCol = css({ display: 'flex', flexDirection: 'column', gridColumn: { lg: '9 / 13' } })

export function WorkIndex() {
  return (
    <section
      id="work"
      aria-label="Work index"
      className={cx(
        reveal,
        css({
          bg: 'bgAlt',
          color: 'text',
          display: 'grid',
          gridTemplateColumns: { lg: 'repeat(12, minmax(0, 1fr))' },
          rowGap: { base: '6', lg: '7' },
          columnGap: '6',
          paddingBlock: { base: '6', lg: '8' },
          paddingInline: { base: '4', lg: '7', xl: '8' },
        })
      )}
    >
      <div className={workCol}>
        <SectionHead>Selected work</SectionHead>
        {selectedWork.map((p, i) => (
          <IndexRow key={p.slug} item={p} href={`/work/${p.slug}`} first={i === 0} />
        ))}
      </div>
      <div className={expCol}>
        <SectionHead>Experiments</SectionHead>
        {experiments.map((p, i) => (
          <IndexRow
            key={p.slug}
            item={p}
            href={p.externalUrl ?? `/work/${p.slug}`}
            first={i === 0}
          />
        ))}
      </div>
    </section>
  )
}
