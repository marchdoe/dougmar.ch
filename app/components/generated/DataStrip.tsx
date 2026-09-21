import { css } from '../../../styled-system/css'

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: 'xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '2',
        })}
      >
        {label}
      </div>
      <div
        className={css({
          fontFamily: 'body',
          fontWeight: 'medium',
          fontSize: 'sm',
          color: 'textMuted',
          lineHeight: 'normal',
        })}
      >
        {value}
      </div>
    </div>
  )
}

export function DataStrip() {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(5, 1fr)' },
        columnGap: '6',
        rowGap: '5',
        borderTop: '1px solid',
        borderColor: 'border',
        paddingTop: '7',
      })}
    >
      <Cell label="Lions" value="Lost 31–41" />
      <Cell label="SPY" value="773.51 · +1.55%" />
      <Cell label="Aldie, VA" value="Patchy rain · 68°F" />
      <Cell label="Moon" value="Waxing gibbous · 83%" />
      <Cell label="In rotation" value="Guided by Voices, Tobin Sprout, My Morning Jacket" />
      <div
        className={css({
          gridColumn: '1 / -1',
          marginTop: '2',
          paddingTop: '5',
          borderTop: '1px solid',
          borderColor: 'border',
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '4',
          rowGap: '2',
          justifyContent: 'space-between',
          fontFamily: 'body',
          fontSize: 'xs',
          letterSpacing: 'wide',
          color: 'textFaint',
        })}
      >
        <span>Doug March. Design and engineering.</span>
        <span>Sunday, September 21, 2026.</span>
      </div>
    </div>
  )
}
