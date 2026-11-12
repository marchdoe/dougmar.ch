import { css } from '../../../styled-system/css'
import { Label } from './LedgerParts'

const eyebrow = css({
  marginBottom: { base: '20px', md: '28px', lg: '32px' },
  maxWidth: '60ch',
})

const phrase = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  textStyle: '2xl',
  lineHeight: { base: '1.04', lg: '1.02' },
  textTransform: 'uppercase',
  textAlign: 'left',
  color: 'text',
  textWrap: 'balance',
})

const line = css({ display: { lg: 'block' } })

const deck = css({
  marginTop: { base: '16px', md: '20px' },
  textStyle: { base: 'md', md: 'lede' },
  lineHeight: '1.5',
  color: 'textMuted',
  maxWidth: '52ch',
})

export function HomeHero() {
  return (
    <header>
      <div className={eyebrow}>
        <Label>Thursday, November 12. 44°F, partly cloudy. Aldie, Virginia.</Label>
      </div>
      <h1 className={phrase}>
        <span className={line}>{"Cut what doesn't matter. "}</span>
        <span className={line}>{"Ship what's left."}</span>
      </h1>
      <p className={deck}>Seven projects, 2008 to 2026. Biggest first.</p>
    </header>
  )
}
