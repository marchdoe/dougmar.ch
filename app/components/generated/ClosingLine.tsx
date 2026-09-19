import { css } from '../../../styled-system/css'

type Props = {
  firstHref: string
  firstLabel: string
  secondHref: string
  secondLabel: string
  email: string
}

export function ClosingLine({ firstHref, firstLabel, secondHref, secondLabel, email }: Props) {
  const linkCss = css({
    color: 'accentAlt',
    fontWeight: 'bold',
    display: 'inline-block',
    py: '1',
  })
  return (
    <p
      className={css({
        textStyle: 'base',
        lineHeight: 'loose',
        color: 'fieldInkMuted',
        borderTop: '1px solid',
        borderColor: 'fieldBorder',
        pt: '5',
        mt: 'auto',
      })}
    >
      See{' '}
      <a href={firstHref} className={linkCss}>
        {firstLabel}
      </a>
      , read{' '}
      <a href={secondHref} className={linkCss}>
        {secondLabel}
      </a>
      , or get in{' '}
      <a href={`mailto:${email}`} className={linkCss}>
        touch
      </a>
      .
    </p>
  )
}
