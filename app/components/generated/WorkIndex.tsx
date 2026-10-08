import { experiments, selectedWork } from '../../content/projects'
import { Band, SecHead } from './Band'
import { FeaturedCard } from './FeaturedCard'
import { IndexGroup } from './IndexGroup'

export function WorkIndex() {
  return (
    <Band label="Selected work">
      <SecHead
        title="The work"
        std="Tuning design and engineering until they ship in sync. Founder projects, shipping products, and experiments."
      />
      <FeaturedCard />
      <IndexGroup heading="Selected work" items={selectedWork} />
      <IndexGroup heading="Experiments" items={experiments} />
    </Band>
  )
}
