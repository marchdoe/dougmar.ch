import { css } from '../../../styled-system/css'

type Row = {
  slug: string
  title: string
  type: string
  year: number
  role?: string
  problem?: string
  liveUrl?: string
  externalUrl?: string
}

export function WorkIndex({ featured, rest }: { featured?: Row; rest: Row[] }) {
  const total = rest.length + (featured ? 1 : 0)
  return (
    <section className={css({ position: 'relative', bg: 'bg' })}>
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '3',
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'accent',
          paddingTop: { base: '5', md: '7' },
          paddingBottom: '4',
          paddingLeft: { base: '5', md: '6vw' },
          paddingRight: { base: '5', md: '6vw' },
        })}
      >
        <span>the register, a decade of experiments</span>
        <span className={css({ color: 'textFaint', letterSpacing: 'wide' })}>
          2008 to 2026, {String(total).padStart(2, '0')} entries
        </span>
      </div>
      <div
        className={css({
          borderTop: '1px solid',
          borderColor: 'borderStrong',
          '@supports (animation-timeline: view())': {
            animationName: 'rise',
            animationTimeline: 'view()',
            animationRange: 'entry 0% entry 40%',
            animationFillMode: 'both',
          },
        })}
      >
        {featured && <FeaturedRow project={featured} />}
        {rest.map((project, i) => (
          <ListRow key={project.slug} project={project} num={i + (featured ? 2 : 1)} />
        ))}
      </div>
    </section>
  )
}

function FeaturedRow({ project }: { project: Row }) {
  const href = project.externalUrl ?? project.liveUrl
  return (
    <a
      href={href ?? '/'}
      target={href ? '_blank' : undefined}
      rel={href ? 'noopener' : undefined}
      className={rowClass}
    >
      <span className={numClass}>01</span>
      <span className={featuredTitleClass}>{project.title}</span>
      <span className={metaClass}>
        <span className={yrClass}>{project.year}</span>
        <span className={roleClass}>{project.role ?? project.type}</span>
      </span>
      {project.problem && <div className={featuredBodyClass}>{project.problem}</div>}
      {href && <span className={featuredLinkClass}>visit {href.replace(/^https?:\/\//, '')}</span>}
    </a>
  )
}

function ListRow({ project, num }: { project: Row; num: number }) {
  const href = project.externalUrl ?? `/work/${project.slug}`
  const external = Boolean(project.externalUrl)
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
      className={rowClass}
    >
      <span className={numClass}>{String(num).padStart(2, '0')}</span>
      <span className={titleClass}>{project.title}</span>
      <span className={metaClass}>
        <span className={yrClass}>{project.year}</span>
        <span className={roleClass}>{project.type}</span>
      </span>
    </a>
  )
}

const rowClass = css({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: { base: '2.6rem 1fr', md: '4rem minmax(0, 1fr) 5rem 9rem' },
  gridTemplateAreas: { base: '"num title" "num meta"', md: '"num title yr role"' },
  columnGap: { base: '3', md: '6' },
  rowGap: '2',
  paddingTop: { base: '6', md: '0' },
  paddingBottom: { base: '6', md: '0' },
  paddingLeft: { base: '5', md: '6vw' },
  paddingRight: { base: '5', md: '6vw' },
  minHeight: { base: '112px', md: '150px' },
  alignItems: { base: 'center', md: 'baseline' },
  borderBottom: '1px solid',
  borderColor: 'border',
  color: 'text',
  _hover: { bg: 'surface' },
})

const numClass = css({
  gridArea: 'num',
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'sm',
  color: 'textFaint',
  alignSelf: { base: 'start', md: 'baseline' },
})

const titleClass = css({
  gridArea: 'title',
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'lowercase',
  letterSpacing: 'tight',
  lineHeight: 'tight',
  color: 'text',
  fontSize: { base: 'md', md: 'xl', lg: '2xl', xl: '3xl' },
})

const featuredTitleClass = css({
  gridArea: 'title',
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'lowercase',
  letterSpacing: 'tight',
  lineHeight: 'tight',
  color: 'fieldInk',
  fontSize: { base: 'md', md: 'xl', lg: '2xl', xl: '3xl' },
})

const featuredBodyClass = css({
  gridColumn: { base: '1 / -1', md: '2 / -1' },
  fontFamily: 'body',
  fontSize: 'base',
  color: 'textMuted',
  maxWidth: '58ch',
  marginTop: '3',
})

const featuredLinkClass = css({
  gridColumn: '1 / -1',
  display: 'inline-flex',
  gap: '2',
  marginTop: '3',
  fontFamily: 'display',
  fontSize: 'xs',
  color: 'accent',
  textTransform: 'lowercase',
  textDecoration: 'underline',
})

const metaClass = css({
  gridArea: 'meta',
  display: { base: 'flex', md: 'contents' },
  gap: '4',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  fontFamily: 'display',
  fontSize: 'xs',
})

const yrClass = css({ gridArea: { md: 'yr' }, color: 'accent', fontWeight: 'bold' })
const roleClass = css({ gridArea: { md: 'role' }, color: 'textMuted', textTransform: 'lowercase' })
