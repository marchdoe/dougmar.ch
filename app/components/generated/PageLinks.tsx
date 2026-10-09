import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const linkCls = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '48px',
  minWidth: '48px',
  paddingInline: '1',
  fontVariant: 'small-caps',
  letterSpacing: 'wider',
  fontSize: 'base',
  color: 'text',
  _hover: { color: 'accentAlt' },
})

const arCls = css({ marginLeft: '2', color: 'textFaint', fontSize: 'xs' })

export function PageLinks() {
  return (
    <div
      className={css({
        paddingBlock: '30px',
        paddingInline: '24px',
        borderTop: '1px solid',
        borderColor: 'border',
        display: 'flex',
        flexWrap: 'wrap',
        rowGap: '0',
        columnGap: '40px',
        lg: { paddingBlock: '36px', paddingInline: '4vw' },
        xl: { paddingInline: '5vw' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <a href="/work" className={linkCls}>
        Work <span className={arCls}>index ↗</span>
      </a>
      <a href="/about" className={linkCls}>
        About <span className={arCls}>↗</span>
      </a>
      <a href={`mailto:${identity.email}`} className={linkCls}>
        Contact <span className={arCls}>↗</span>
      </a>
    </div>
  )
}
