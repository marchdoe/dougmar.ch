import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const rowClass = css({
  display: 'flex',
  gap: '3',
  padding: '1 0',
  borderBottom: '1px solid',
  borderColor: 'border',
  flexWrap: 'wrap',
})

const kClass = css({ color: 'accentAlt', fontWeight: 'bold', minWidth: '90px' })

export function BuildLogFoot() {
  return (
    <Box
      as="footer"
      id="contact"
      aria-label="Build log"
      bg="bgAlt"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '8', lg: '9' },
      })}
    >
      <hr
        className={css({
          height: 0,
          border: 0,
          borderTop: '2px solid',
          borderColor: 'accent',
          marginBottom: '6',
        })}
      />
      <div
        className={css({
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '4',
        })}
      >
        build log · 2026·09·11 · signals as produced
      </div>
      <Box
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
          columnGap: '8',
          gap: '0px',
          fontFamily: 'display',
          textStyle: 'sm',
          color: 'textMuted',
        })}
      >
        <div className={rowClass}>
          <span className={kClass}>sports</span> DET · all clubs · off season · <b>no game</b>
        </div>
        <div className={rowClass}>
          <span className={kClass}>market</span> SPY <b>−0.60%</b> · close · muted
        </div>
        <div className={rowClass}>
          <span className={kClass}>moon</span> new moon · <b>0% illum</b> · cycle day 0
        </div>
        <div className={rowClass}>
          <span className={kClass}>air</span> AQI <b>1</b> good · UV 0
        </div>
        <div className={rowClass}>
          <span className={kClass}>weather</span> Aldie VA · overcast · <b>74°F</b>
        </div>
        <div className={rowClass}>
          <span className={kClass}>rotation</span> guided by voices · <b>the war on drugs</b>
        </div>
      </Box>
      <p
        className={css({
          marginTop: '6',
          fontFamily: 'display',
          textStyle: 'sm',
          color: 'textFaint',
          maxWidth: '70ch',
        })}
      >
        footnote —{' '}
        <span className={css({ color: 'text' })}>
          "You cannot control what you cannot measure."
        </span>{' '}
        Brian Tracy. Logged, not enshrined; the metric that didn't move is the one this build is
        about.
      </p>
      <div
        className={css({
          marginTop: '6',
          fontFamily: 'display',
          textStyle: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textFaint',
          display: 'flex',
          gap: '4',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        })}
      >
        <span>
          {identity.name} · {identity.role}
        </span>
        <a href={`mailto:${identity.email}`} className={css({ _hover: { color: 'accentAlt' } })}>
          {identity.email}
        </a>
        <span>free to produce — not free to own</span>
      </div>
    </Box>
  )
}
