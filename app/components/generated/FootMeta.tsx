import { css } from '../../../styled-system/css'

type Item = { k: string; v: string }

const gridCss = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  rowGap: '4',
  columnGap: '5',
})

const keyCss = css({
  display: 'block',
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  color: 'textFaint',
  marginBottom: '1',
})

const valueCss = css({
  fontFamily: 'body',
  fontSize: 'sm',
  lineHeight: 'snug',
  color: 'textMuted',
  maxWidth: '45ch',
})

export function FootMeta({ items }: { items: Item[] }) {
  return (
    <div className={gridCss}>
      {items.map((item) => (
        <div key={item.k}>
          <span className={keyCss}>{item.k}</span>
          <p className={valueCss}>{item.v}</p>
        </div>
      ))}
    </div>
  )
}
