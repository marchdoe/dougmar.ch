import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { FeaturedCard } from './FeaturedCard'
import { IndexList } from './IndexList'
import { SectionHead } from './SectionHead'

type Project = (typeof projects)[number]

export function WorkIndex({
  featured,
  work,
  experiments,
}: {
  featured: Project | undefined
  work: Project[]
  experiments: Project[]
}) {
  return (
    <section
      id="work"
      aria-labelledby="wi-h"
      className={css({
        paddingTop: { base: '5', lg: '7' },
        paddingBottom: { base: '2', lg: '7' },
        paddingLeft: { base: '3', lg: '6vw' },
        paddingRight: { base: '3', lg: '4vw' },
        borderStyle: 'solid',
        borderColor: 'borderStrong',
        borderTopWidth: '0',
        borderLeftWidth: '0',
        borderRightWidth: { base: '0', lg: '1px' },
        borderBottomWidth: { base: '0', lg: '1px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionHead id="wi-h" label="Selected Work" aside="Index" />
      {featured ? <FeaturedCard project={featured} /> : null}
      <IndexList items={work} />
      <div className={css({ marginTop: '40px' })}>
        <SectionHead label="Experiments" aside="Archive" />
      </div>
      <IndexList items={experiments} />
    </section>
  )
}
