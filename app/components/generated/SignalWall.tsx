import { HeroTile } from './HeroTile'
import { ScoreTiles } from './ScoreTiles'
import { StatTiles } from './StatTiles'
import { grid } from './styles'

export function SignalWall() {
  return (
    <section aria-label="Last night's numbers" className={grid}>
      <HeroTile />
      <ScoreTiles />
      <StatTiles />
    </section>
  )
}
