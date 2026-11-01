import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { FeaturedCard } from './FeaturedCard'
import { IndexList } from './IndexList'
import { RevealSection } from './RevealSection'
import { SectionHead } from './SectionHead'

type Project = (typeof projects)[number]
type Props = { featured: Project | undefined; selected: Project[]; experiments: Project[] }

export function WorkIndex({ featured, selected, experiments }: Props) {
  return (
    <RevealSection
      id="work"
      className={css({
        bg: 'bg',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '5', md: '7', xl: '8' },
      })}
    >
      {featured ? (
        <>
          <SectionHead>Featured</SectionHead>
          <FeaturedCard project={featured} />
        </>
      ) : null}
      <IndexList heading="Selected work" items={selected} />
      <IndexList heading="Experiments" items={experiments} external spaced />
    </RevealSection>
  )
}
