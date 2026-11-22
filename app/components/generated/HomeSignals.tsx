import { css } from '../../../styled-system/css'
import { SignalBand } from './SignalBand'

/* mockup brick #93382f has no semantic token; accentAlt is the nearest deep ink */
const down = css({ color: 'accentAlt', fontWeight: 'bold' })
const pos = css({ color: 'accent', fontWeight: 'bold' })
const names = css({ color: 'textFaint', textStyle: 'sm' })

export function HomeSignals() {
  const rows = [
    {
      label: 'Red Wings',
      body: (
        <>
          2–3, loss <span className={down}>▼</span>
        </>
      ),
    },
    {
      label: 'RSM Classic',
      body: (
        <>
          in progress, three at <span className={pos}>−9</span>
          <span className={names}>Penge · Neergaard-Petersen · Thorbjørnsen</span>
        </>
      ),
    },
    {
      label: 'SPY',
      body: (
        <>
          689.81 <span className={down}>▼ 3.64%</span> on the day
        </>
      ),
    },
    { label: 'Thanksgiving', body: 'four days out' },
  ]
  return <SignalBand title="the day" rows={rows} />
}
