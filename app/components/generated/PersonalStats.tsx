import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className={css({ minWidth: '0' })}>
      <div
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontSize: { base: 'sm', lg: 'xl' },
          color: 'accent',
          lineHeight: 'snug',
          overflowWrap: 'break-word',
        })}
      >
        {value}
      </div>
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginTop: '2',
        })}
      >
        {label}
      </div>
    </div>
  )
}

export function PersonalStats() {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
        columnGap: '6',
        rowGap: '6',
        bg: 'bgAlt',
        paddingBlock: '8',
        paddingInline: { base: '6vw', lg: '5vw' },
      })}
    >
      <Stat value={String(personal.holesInOne)} label="Holes in one" />
      <Stat value={personal.sport} label="Sport" />
      <Stat value={personal.teams.join(', ')} label="Teams" />
      <Stat value={personal.currentFocus} label="Current focus" />
    </div>
  )
}
