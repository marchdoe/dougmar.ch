import { css } from '../../../styled-system/css'
import { Block, ClusterRow, LedeRow, SubRow } from './LedgerRows'
import { Rail } from './Rail'

const chasers = [
  { name: 'Doug Ghim', fig: '−24' },
  { name: 'Ford', fig: '−23' },
  { name: 'Crowe', fig: '−23' },
  { name: 'James', fig: '−22' },
]

const sky = [
  { name: 'Clear', value: '43.9°F' },
  { name: 'Waning crescent', value: '18%' },
  { name: 'AQI · Good', value: '1 · UV 0' },
]

const winClass = css({ fontWeight: 'bold', letterSpacing: 'wide', color: 'accentAlt' })
const lossClass = css({ fontWeight: 'bold', letterSpacing: 'wide', color: 'fieldInkMuted' })
const arrowClass = css({ color: 'accentAlt', fontWeight: 'bold' })
const faintClass = css({ textStyle: '2xs', color: 'fieldInkMuted', letterSpacing: 'wide' })

const rotationClass = css({
  marginTop: 'auto',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'fieldBorder',
  paddingTop: '14px',
})

const listClass = css({
  listStyle: 'none',
  margin: '0',
  padding: '0',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})
const itemClass = css({ fontSize: '15px', color: 'fieldInk' })

export function Ledger() {
  return (
    <Rail label="Today's signals" title="The Ledger" meta="Oct 6, 2026">
      <Block label="Golf · Bank of Utah Championship · Final">
        <LedeRow name="Austin Smotherman" sub="Leader" fig="−26" big />
        {chasers.map((row) => (
          <SubRow key={row.name} name={row.name} fig={row.fig} />
        ))}
      </Block>
      <Block label="Detroit">
        <LedeRow
          name="Pistons"
          sub={
            <>
              Final · <span className={winClass}>Win</span>
            </>
          }
          fig="109–107"
        />
        <LedeRow
          name="Lions"
          sub={
            <>
              Final · <span className={lossClass}>Loss</span>
            </>
          }
          fig="26–32"
        />
      </Block>
      <Block label="Market">
        <LedeRow
          name="SPY"
          sub={
            <>
              <span className={arrowClass}>▲</span> +0.67%
            </>
          }
          fig="774.83"
        />
      </Block>
      <Block label="Aldie, VA · sky and air">
        {sky.map((row) => (
          <ClusterRow key={row.name} name={row.name} value={row.value} />
        ))}
        <div className={faintClass}>Columbus Day, Oct 12</div>
      </Block>
      <div className={rotationClass}>
        <Block label="In rotation">
          <ul className={listClass}>
            <li className={itemClass}>Wet Leg</li>
            <li className={itemClass}>The War on Drugs</li>
          </ul>
        </Block>
      </div>
    </Rail>
  )
}
