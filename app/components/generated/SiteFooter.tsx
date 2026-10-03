import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const line = css({
  fontSize: 'xs',
  color: 'textMuted',
  textTransform: 'lowercase',
  letterSpacing: '0.04em',
})

const strong = css({ color: 'text', fontWeight: '500' })

export function SiteFooter() {
  const nameRole = [identity.name, identity.role].filter(Boolean).join(' · ')
  return (
    <footer
      className={css({
        paddingTop: '40px',
        paddingBottom: '56px',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        textAlign: 'center',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'border',
      })}
    >
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          alignItems: 'center',
          maxWidth: '640px',
          marginInline: 'auto',
        })}
      >
        <span className={line}>
          on rotation: <b className={strong}>My Morning Jacket</b>, Radiohead, The War on Drugs
        </span>
        <span className={line}>golf, Detroit, and the small products in between</span>
        <a
          href={`mailto:${identity.email}`}
          className={css({
            fontSize: 'sm',
            color: 'text',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'fieldBorder',
            _hover: { color: 'accentAlt' },
          })}
        >
          {identity.email}
        </a>
      </div>
      <div
        className={css({
          marginTop: '18px',
          fontSize: 'xs',
          color: 'textFaint',
          textTransform: 'lowercase',
          letterSpacing: '0.06em',
        })}
      >
        {nameRole} · aldie, virginia · october 3, 2026
      </div>
    </footer>
  )
}
