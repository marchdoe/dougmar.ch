import { css } from '../../../styled-system/css'

type Props = { school: string; degree: string; concentration: string; years: string }

export function EducationLedger({ school, degree, concentration, years }: Props) {
  return (
    <div className={css({ borderTop: '1px solid', borderColor: 'fieldBorder', pt: '4' })}>
      <div
        className={css({
          textStyle: 'sm',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'fieldInkMuted',
          mb: '2',
        })}
      >
        Education
      </div>
      <div className={css({ textStyle: 'base', fontWeight: 'bold', color: 'fieldInk' })}>
        {school}
      </div>
      <div className={css({ textStyle: 'sm', color: 'fieldInkMuted', mt: '1' })}>
        {degree}, {concentration} · {years}
      </div>
    </div>
  )
}
