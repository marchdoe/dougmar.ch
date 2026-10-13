import { css } from '../../../styled-system/css'

type Item = { slug: string; title: string; type: string; year: number; href: string }

const gridCss = css({
  display: 'grid',
  gridTemplateColumns: { base: 'repeat(auto-fit, minmax(240px, 1fr))', lg: 'repeat(3, 1fr)' },
  gap: '4',
})
const cardCss = css({
  boxSizing: 'border-box',
  minWidth: '0',
  display: 'flex',
  flexDirection: 'column',
  gap: '2',
  minHeight: '44px',
  padding: '5',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border',
  borderRadius: 'md',
  bg: 'bg',
  transition: 'transform 160ms ease',
  _hover: { transform: 'translateY(-2px)', borderColor: 'borderStrong' },
})
const titleCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: 'lg',
  lineHeight: 'tight',
  color: 'text',
})
const titleMutedCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  fontSize: 'lg',
  lineHeight: 'tight',
  color: 'textMuted',
})
const rowCss = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: '3',
  fontFamily: 'body',
  fontSize: 'xs',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
})
const typeCss = css({ color: 'textMuted' })
const yearCss = css({ color: 'textFaint', fontVariantNumeric: 'tabular-nums' })

export function ProjectGrid({ items, muted = false }: { items: Item[]; muted?: boolean }) {
  return (
    <div className={gridCss}>
      {items.map((item) => (
        <a key={item.slug} href={item.href} className={cardCss}>
          <div className={muted ? titleMutedCss : titleCss}>{item.title}</div>
          <div className={rowCss}>
            <span className={typeCss}>{item.type}</span>
            <span className={yearCss}>{item.year}</span>
          </div>
        </a>
      ))}
    </div>
  )
}
