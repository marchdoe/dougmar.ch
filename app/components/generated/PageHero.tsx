import { css } from '../../../styled-system/css'
import { HeroField } from './HeroField'
import { LockupBadge } from './LockupBadge'

const boxCss = css({
  boxSizing: 'border-box',
  marginTop: '7',
  marginInline: 'auto',
  width: 'fit-content',
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '3',
  textAlign: 'center',
  bg: 'bg',
  padding: { base: '3', lg: '5' },
  borderRadius: 'sm',
})

const titleCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  textAlign: 'center',
  fontSize: { base: 'xl', lg: '5xl' },
  lineHeight: 'tight',
  color: 'text',
  maxWidth: '100%',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const statementCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  textAlign: 'center',
  fontSize: 'lg',
  lineHeight: 'snug',
  maxWidth: '40ch',
  color: 'text',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const captionCss = css({
  fontFamily: 'body',
  fontSize: 'sm',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  color: 'textMuted',
  maxWidth: '100%',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

type Props = { title: string; caption: string; compact?: boolean }

export function PageHero({ title, caption, compact = false }: Props) {
  return (
    <HeroField banner>
      <LockupBadge />
      <div className={boxCss}>
        <h1 className={compact ? statementCss : titleCss}>{title}</h1>
        {caption ? <p className={captionCss}>{caption}</p> : null}
      </div>
    </HeroField>
  )
}
