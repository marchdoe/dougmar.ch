import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'

const items = [identity.name, identity.role, 'Aldie, VA', 'Oct 7, 2026', 'Waning crescent 11%']

export function FootStrip() {
  return (
    <footer
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        rowGap: '2',
        columnGap: '22px',
        paddingBlock: '4',
        paddingInline: '20px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'borderStrong',
        bg: 'bgAlt',
        fontFamily: 'body',
        textStyle: '2xs',
        letterSpacing: 'normal',
        color: 'textMuted',
        lg: { gridColumn: '2', gridRow: '2' },
      })}
    >
      {items.map((item) => (
        <span key={item} className={css({ whiteSpace: 'nowrap' })}>
          {item}
        </span>
      ))}
      <span className={css({ flex: '1 1 220px', minWidth: '0' })}>
        On rotation: The War on Drugs, My Morning Jacket, Guided by Voices
      </span>
    </footer>
  )
}
