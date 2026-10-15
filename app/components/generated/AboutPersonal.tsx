import { personal } from '../../content/about'
import { Score, Sig, SigNote } from './Rail'

export function AboutPersonal() {
  return (
    <>
      <Sig label="Holes in one">
        <Score>{personal.holesInOne}</Score>
        <SigNote>On the card, and counted.</SigNote>
      </Sig>
      <Sig label={personal.sport}>
        <SigNote>{personal.teams.join(', ')}</SigNote>
      </Sig>
      <Sig label="Current focus">
        <SigNote>{personal.currentFocus}</SigNote>
      </Sig>
    </>
  )
}
