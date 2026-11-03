import { css } from '../../../styled-system/css'
import { experiments, projects } from '../../content/projects'
import { FeaturedPanel, MARQUEE_SLUG } from './FeaturedPanel'
import { WorkRow } from './WorkRow'

const listedWork = projects.filter(
  (project) => project.depth === 'full' && project.slug !== MARQUEE_SLUG
)
const listedExperiments = experiments.filter((project) => project.slug !== MARQUEE_SLUG)

function Standfirst() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        textAlign: 'right',
        gap: { base: '10px', lg: '8px' },
        paddingTop: { base: '32px', md: '48px', lg: '0' },
        paddingBottom: { base: '22px', md: '28px', lg: '18px' },
        paddingInline: { base: '20px', md: '48px', lg: '0' },
        gridColumn: { lg: '6 / 13' },
        gridRow: { lg: '1' },
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontSize: { base: 'clamp(28px,8.5vw,34px)', lg: 'clamp(40px,4.4vw,60px)' },
          lineHeight: { base: '1.02', lg: '1' },
          textTransform: 'lowercase',
          fontVariant: 'small-caps',
          letterSpacing: '0.02em',
          fontWeight: 'normal',
          color: 'accent',
        })}
      >
        Four holes in one.
      </h1>
    </div>
  )
}

function IndexHead() {
  return (
    <div
      className={css({
        display: { base: 'block', lg: 'none' },
        textStyle: '2xs',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        color: 'accentAlt',
        paddingInline: { base: '40px', md: '68px' },
        paddingBottom: '10px',
        marginBottom: '2px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
      })}
    >
      Selected work &amp; experiments
    </div>
  )
}

export function WorkStage() {
  return (
    <div
      id="work"
      className={css({
        display: { base: 'block', lg: 'grid' },
        gridTemplateColumns: { lg: 'repeat(12, minmax(0, 1fr))' },
        columnGap: { lg: '24px' },
        rowGap: { lg: '0' },
        alignContent: { lg: 'start' },
        paddingTop: { lg: '48px' },
        paddingRight: { lg: '5vw' },
        paddingBottom: { lg: '40px' },
        paddingLeft: { lg: '40px' },
      })}
    >
      <Standfirst />
      <IndexHead />
      <FeaturedPanel />
      {listedWork.map((project) => (
        <WorkRow key={project.slug} project={project} size="lead" />
      ))}
      {listedExperiments.map((project) => (
        <WorkRow key={project.slug} project={project} size="small" />
      ))}
    </div>
  )
}

export function CloseLine() {
  return (
    <p
      className={css({
        fontFamily: 'display',
        textAlign: 'right',
        fontSize: { base: 'clamp(26px,8vw,34px)', lg: 'clamp(40px,4.4vw,60px)' },
        lineHeight: '1.02',
        textTransform: 'lowercase',
        fontVariant: 'small-caps',
        letterSpacing: '0.02em',
        fontWeight: 'normal',
        color: 'accent',
        paddingTop: { base: '34px', md: '40px', lg: '44px' },
        paddingBottom: { base: '46px', md: '56px', lg: '60px' },
        paddingLeft: { base: '20px', md: '48px', lg: '40px' },
        paddingRight: { base: '20px', md: '48px', lg: '5vw' },
      })}
    >
      The scorecard is the first experiment.
    </p>
  )
}
