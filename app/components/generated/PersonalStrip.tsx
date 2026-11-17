import { personal } from '../../content/about'
import { StripFrame, StripLine } from './SignalStrip'

export function PersonalStrip() {
  return (
    <StripFrame title="Off the clock">
      <StripLine name="Aces">{personal.holesInOne} holes in one</StripLine>
      <StripLine name="Sport">{personal.sport}</StripLine>
      <StripLine name="Teams">{personal.teams.join(', ')}</StripLine>
      <StripLine name="Focus">{personal.currentFocus}</StripLine>
    </StripFrame>
  )
}
