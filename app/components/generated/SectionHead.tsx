import { css } from '../../../styled-system/css'

const headCss = css({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '4',
  marginBottom: '40px',
})

// Mockup sets section heads at 26px on the phone.
const titleCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'normal',
  fontSize: { base: '26px', lg: '2xl' },
  lineHeight: 'tight',
  color: 'text',
})

const eyebrowCss = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'xs',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  color: 'accentAlt',
})

export function SectionHead({ title, eyebrow }: { title: string; eyebrow: string }) {
  return (
    <div className={headCss}>
      <h2 className={titleCss}>{title}</h2>
      <span className={eyebrowCss}>{eyebrow}</span>
    </div>
  )
}
