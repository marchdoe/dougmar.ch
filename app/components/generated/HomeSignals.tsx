import { css } from '../../../styled-system/css'
import { SignalRow, SignalStack } from './SignalStack'

export function HomeSignals() {
  return (
    <SignalStack head="Today · Oct 7, 2026" label="Today's signals">
      <SignalRow label="NFL">
        Falcons <b>45</b>
        {'\u2013'}24 Saints
      </SignalRow>
      <SignalRow label="Market">
        SPY <b>779.09</b>{' '}
        <span className={css({ color: 'accentAlt', fontWeight: 'bold' })}>+0.55%</span>
      </SignalRow>
      <SignalRow label="Weather">
        Aldie, clear, <b>43.9°F</b>
      </SignalRow>
      <SignalRow label="Nobel">
        Chemistry <b>2026</b> announced today
      </SignalRow>
    </SignalStack>
  )
}
