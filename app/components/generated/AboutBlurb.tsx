import { css } from '../../../styled-system/css'
import { RevealSection } from './RevealSection'

export function AboutBlurb() {
  return (
    <RevealSection id="about" sub="About" tone="bgAlt">
      <p
        className={css({
          margin: '0',
          maxWidth: '50ch',
          textStyle: 'lede',
          lineHeight: 'normal',
          color: 'textMuted',
        })}
      >
        <b className={css({ color: 'text', fontWeight: 'normal' })}>
          Spaceman is the name on the work.
        </b>{' '}
        Doug March has run it since 2018 as the shop the side products came out of. FishSticks
        shipped from it, 15th Club is in the works, and so will the next one. Design and
        engineering, one person, both.
      </p>
    </RevealSection>
  )
}
