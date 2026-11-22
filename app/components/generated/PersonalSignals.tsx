import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { SignalBand } from './SignalBand'

export function PersonalSignals() {
  const rows = [
    {
      label: personal.sport,
      body: (
        <>
          <span className={css({ color: 'accent', fontWeight: 'bold' })}>
            {personal.holesInOne}
          </span>
          holes in one
        </>
      ),
    },
    { label: 'teams', body: personal.teams.join(', ') },
    { label: 'current focus', body: personal.currentFocus },
  ]
  return <SignalBand title="off the clock" rows={rows} />
}
