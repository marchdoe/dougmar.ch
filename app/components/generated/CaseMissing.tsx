import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

const heroCls = css({
  bg: 'bg',
  display: 'flex',
  flexDirection: 'column',
  gap: '7',
  paddingTop: { base: '5', lg: '7' },
  paddingBottom: '8',
  paddingInline: { base: '4', lg: '7', xl: '8' },
})

const h1Cls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'lowercase',
  textStyle: '3xl',
  color: 'text',
})
const linkCls = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  width: 'max-content',
  fontWeight: 'bold',
  fontSize: 'sm',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
})

export function CaseMissing() {
  return (
    <section className={heroCls}>
      <BrandLockup variant="stacked-lg" mode="original" />
      <h1 className={h1Cls}>no project by that name</h1>
      <a href="/work" className={linkCls}>
        all work
      </a>
    </section>
  )
}
