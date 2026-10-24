import { css, cx } from '../../../styled-system/css'

const place = {
  golf: css({ lg: { position: 'absolute', top: '8%', left: '1%' } }),
  moon: css({ lg: { position: 'absolute', top: '2%', right: '2%' } }),
  market: css({ lg: { position: 'absolute', bottom: '13%', left: '4%' } }),
  weather: css({ lg: { position: 'absolute', bottom: '9%', right: '1%' } }),
  none: css({}),
}

const shell = css({
  flexShrink: 0,
  width: { base: '152px', sm: '172px', lg: '188px' },
  height: { base: '152px', sm: '172px', lg: '188px' },
  borderRadius: 'full',
  border: '1px solid',
  borderColor: 'border',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  gap: '7px',
  padding: '14px',
})

const open = css({ bg: 'transparent' })
// the moon disc is amber 300 in the mockup; fieldInkMuted carries that value
const filled = css({ bg: 'fieldInkMuted' })

const labelCls = css({
  textStyle: '2xs',
  fontWeight: 'bold',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textMuted',
})
const valueCls = css({ fontFamily: 'display', textStyle: '2xl', lineHeight: '0.95', color: 'text' })
const subCls = css({ textStyle: '2xs', lineHeight: '1.3', color: 'textMuted', maxWidth: '15ch' })
const downCls = css({
  textStyle: '2xs',
  fontWeight: 'bold',
  paddingBlock: '3px',
  paddingInline: '7px',
  bg: 'accent',
  color: 'accentText',
  borderRadius: 'sm',
})

type PodProps = {
  label: string
  value: string
  sub?: string
  down?: boolean
  solid?: boolean
  at?: keyof typeof place
  className?: string
}

export function Pod({
  label,
  value,
  sub,
  down = false,
  solid = false,
  at = 'none',
  className,
}: PodProps) {
  return (
    <div className={cx(shell, solid ? filled : open, place[at], className)}>
      <span className={labelCls}>{label}</span>
      <span className={valueCls}>{value}</span>
      {sub ? <span className={down ? downCls : subCls}>{sub}</span> : null}
    </div>
  )
}
