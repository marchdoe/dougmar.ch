import { css } from '../../../styled-system/css'

type WorkRowProps = { href: string; title: string; meta: string; onField?: boolean }

const rowBase = css({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  columnGap: '4',
  rowGap: '1',
  paddingBlock: '3',
  minHeight: '44px',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderColor: 'border',
  transition: 'color .2s ease',
  _last: { borderBottomWidth: '1px', borderBottomStyle: 'solid' },
})

const inkPlain = css({ color: 'text', _hover: { color: 'accent' } })

// on the index column the light scheme floods it with field, so inks follow fieldInk there
const inkField = css({
  color: { base: 'text', _light: 'fieldInk' },
  _hover: { color: { base: 'accent', _light: 'accentAlt' } },
})

const metaBase = css({
  fontSize: 'sm',
  fontVariantCaps: 'all-small-caps',
  letterSpacing: 'wide',
  whiteSpace: 'nowrap',
})

const metaPlain = css({ color: 'textMuted' })

const metaField = css({ color: { base: 'textMuted', _light: 'fieldInkMuted' } })

export function WorkRow({ href, title, meta, onField = false }: WorkRowProps) {
  return (
    <a href={href} className={`${rowBase} ${onField ? inkField : inkPlain}`}>
      <span
        className={css({
          fontFamily: 'display',
          textStyle: 'xl',
          lineHeight: '1.05',
          whiteSpace: 'nowrap',
        })}
      >
        {title}
      </span>
      <span className={`${metaBase} ${onField ? metaField : metaPlain}`}>{meta}</span>
    </a>
  )
}
