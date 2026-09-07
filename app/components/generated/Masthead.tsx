import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'
import { BrandLockup } from '../BrandLockup'
import { identity } from '../../content/about'

type Props = { onField?: boolean }

export function Masthead({ onField = false }: Props) {
  const linkColor = onField ? 'fieldInkMuted' : 'textMuted'
  const dotColor = onField ? 'fieldBorder' : 'borderStrong'

  const linkClass = css({
    fontFamily: 'body',
    color: linkColor,
    fontVariantCaps: 'all-small-caps',
    textTransform: 'lowercase',
    textStyle: 'sm',
    letterSpacing: 'wide',
    fontWeight: '500',
    padding: '3 0',
    lineHeight: '1',
    minHeight: '44px',
    display: 'inline-flex',
    alignItems: 'center',
  })

  const dotClass = css({ color: dotColor, padding: '0 0.7em', userSelect: 'none' })

  return (
    <header
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: { base: '3', lg: '4' },
        marginBottom: { base: '8', lg: '9' },
        color: onField ? 'fieldInk' : 'text',
        textAlign: 'left',
      })}
    >
      <Box alignSelf="flex-start" display="inline-block" textAlign="left">
        <BrandLockup
          variant="stacked-lg"
          mode="original"
          className={css({ textAlign: 'left', marginInline: '0' })}
        />
      </Box>
      <nav
        aria-label="Primary"
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'flex-start',
          alignSelf: 'flex-start',
        })}
      >
        <a href="/#work-index" className={linkClass}>
          work
        </a>
        <span className={dotClass} aria-hidden="true">
          ·
        </span>
        <a href="/about" className={linkClass}>
          about
        </a>
        <span className={dotClass} aria-hidden="true">
          ·
        </span>
        <a href={`mailto:${identity.email}`} className={linkClass}>
          contact
        </a>
      </nav>
    </header>
  )
}
