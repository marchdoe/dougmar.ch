import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

const inlineCss = css({
  position: 'relative',
  zIndex: 3,
  display: 'inline-flex',
  bg: 'bg',
  color: 'text',
  paddingBlock: '2',
  paddingInline: '3',
  borderRadius: 'sm',
})

const floatingCss = css({
  position: { base: 'relative', lg: 'absolute' },
  top: { lg: '0' },
  left: { lg: '0' },
  zIndex: 3,
  display: 'inline-flex',
  bg: 'bg',
  color: 'text',
  paddingBlock: '2',
  paddingInline: '3',
  borderRadius: 'sm',
})

export function LockupBadge({ floating = false }: { floating?: boolean }) {
  return (
    <div className={floating ? floatingCss : inlineCss}>
      <BrandLockup variant="stacked-md" mode="single-color" />
    </div>
  )
}
