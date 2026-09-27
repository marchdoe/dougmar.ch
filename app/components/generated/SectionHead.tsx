import { css } from '../../../styled-system/css'

export function SectionHead({ label, aside, id }: { label: string; aside: string; id?: string }) {
  return (
    <h2
      id={id}
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '12px',
        paddingBottom: '12px',
        fontFamily: 'display',
        fontSize: 'xs',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        color: 'textFaint',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      <span>{label}</span>
      <span className={css({ color: 'accent', fontSize: '2xs', letterSpacing: 'wider' })}>
        {aside}
      </span>
    </h2>
  )
}
