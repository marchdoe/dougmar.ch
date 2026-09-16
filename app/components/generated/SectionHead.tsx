import { css } from '../../../styled-system/css'

export function SectionHead({ eyebrow, heading }: { eyebrow: string; heading: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '4',
        flexWrap: 'wrap',
        px: { base: '4', md: '6', lg: '96px' },
        pb: { base: '5', md: '6' },
      })}
    >
      <span
        className={css({
          fontSize: 'sm',
          color: 'textFaint',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          textTransform: 'lowercase',
        })}
      >
        {eyebrow}
      </span>
      <h2
        className={css({
          fontFamily: 'display',
          textStyle: 'xl',
          color: 'text',
          lineHeight: 'tight',
          textTransform: 'lowercase',
        })}
      >
        {heading}
      </h2>
    </div>
  )
}
