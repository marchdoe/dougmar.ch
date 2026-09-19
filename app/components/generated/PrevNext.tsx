import { css } from '../../../styled-system/css'

type Props = { prevHref?: string; prevLabel?: string; nextHref?: string; nextLabel?: string }

export function PrevNext({ prevHref, prevLabel, nextHref, nextLabel }: Props) {
  const linkCss = css({ color: 'accentAlt', fontWeight: 'bold', textStyle: 'sm' })
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        gap: '4',
        pt: '5',
        borderTop: '1px solid',
        borderColor: 'fieldBorder',
      })}
    >
      {prevHref ? (
        <a href={prevHref} className={linkCss}>
          ← {prevLabel}
        </a>
      ) : (
        <span />
      )}
      {nextHref ? (
        <a href={nextHref} className={linkCss}>
          {nextLabel} →
        </a>
      ) : (
        <span />
      )}
    </div>
  )
}
