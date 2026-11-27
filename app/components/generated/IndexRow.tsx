import { css } from '../../../styled-system/css'

type IndexRowProps = { href: string; title: string; meta: string; quiet?: boolean }

const row = css({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: '4',
  paddingBlock: '15px',
  minHeight: '48px',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  '&:first-of-type': { borderTopColor: 'borderStrong' },
})

const loud = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textStyle: 'lg',
  lineHeight: '1',
  color: 'text',
  'a:hover &': { color: 'accent' },
})

const soft = css({
  fontFamily: 'body',
  fontWeight: 'normal',
  textStyle: 'base',
  color: 'textMuted',
  'a:hover &': { color: 'accent' },
})

const metaCls = css({
  textStyle: 'sm',
  color: 'textMuted',
  whiteSpace: 'nowrap',
  letterSpacing: 'wide',
  textTransform: 'lowercase',
})

export function IndexRow({ href, title, meta, quiet }: IndexRowProps) {
  return (
    <a href={href} className={row}>
      <span className={quiet ? soft : loud}>{title}</span>
      <span className={metaCls}>{meta}</span>
    </a>
  )
}
