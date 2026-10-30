import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const meta = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: '2xs',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'textFaint',
})

export function Sidebar() {
  return (
    <aside
      className={css({
        display: 'flex',
        flexWrap: { base: 'wrap', lg: 'nowrap' },
        flexDirection: { base: 'row', lg: 'column' },
        alignItems: { base: 'baseline', lg: 'flex-start' },
        rowGap: { base: '12px', lg: '18px' },
        columnGap: '18px',
        paddingBottom: { base: '16px', lg: '0' },
        marginBottom: { base: '20px', lg: '0' },
        paddingRight: { lg: '3vw' },
        borderBottomWidth: { base: '1px', lg: '0' },
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        borderRightWidth: { base: '0', lg: '1px' },
        borderRightStyle: 'solid',
        borderRightColor: 'border',
        gridColumn: { lg: '1' },
        gridRow: { lg: '1 / span 2' },
        minWidth: '0',
      })}
    >
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: '13px', lg: '14px' },
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          color: 'text',
        })}
      >
        {identity.name}
      </span>
      <span className={meta}>Type Specimen № 001</span>
      <span className={meta}>{identity.role}</span>
      <span className={meta}>One Person</span>
      <span className={meta}>Aldie, Virginia</span>
    </aside>
  )
}
