import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

type Props = { workHref: string; placement: 'hero' | 'top' }

const linkCls = css({
  display: 'inline-block',
  minWidth: '44px',
  minHeight: '44px',
  paddingBlock: '10px',
  paddingInline: '2px',
  lineHeight: '24px',
  textAlign: 'center',
})

const heroCls = css({
  position: { base: 'relative', lg: 'absolute' },
  bottom: { lg: '48px' },
  left: { lg: '6vw' },
  zIndex: 3,
  marginTop: { base: '6px', lg: '0' },
  fontSize: 'sm',
  lineHeight: '2.1',
  color: 'textMuted',
  maxWidth: '34ch',
  textTransform: 'lowercase',
})

const topCls = css({
  position: 'relative',
  zIndex: 3,
  fontSize: 'sm',
  lineHeight: '2.1',
  color: 'textMuted',
  maxWidth: '34ch',
  textTransform: 'lowercase',
})

export function SentenceNav({ workHref, placement }: Props) {
  return (
    <nav aria-label="Primary" className={placement === 'hero' ? heroCls : topCls}>
      look through the{' '}
      <a href={workHref} className={linkCls}>
        work
      </a>
      , read{' '}
      <a href="/about" className={linkCls}>
        about doug
      </a>
      , or{' '}
      <a href={`mailto:${identity.email}`} className={linkCls}>
        get in touch
      </a>
      .
    </nav>
  )
}
