import { css } from '../../../styled-system/css'
import { experiments, featuredProject, selectedWork } from '../../content/projects'
import { FeaturedBand } from './FeaturedBand'
import { bleed, Label, track } from './LedgerParts'

type Size = 'a' | 'b' | 'c'
type Row = { slug: string; title: string; year: number; type: string; href: string; size: Size }

const selectedRows: Row[] = selectedWork.map((project, index) => ({
  slug: project.slug,
  title: project.title,
  year: project.year,
  type: project.type,
  href: `/work/${project.slug}`,
  size: index < 2 ? 'a' : 'b',
}))

const experimentRows: Row[] = experiments.map((project) => ({
  slug: project.slug,
  title: project.title,
  year: project.year,
  type: project.type,
  href: project.externalUrl ?? `/work/${project.slug}`,
  size: 'c',
}))

const rows = [...selectedRows, ...experimentRows]

const ledger = css({ marginTop: { base: '32px', md: '48px', lg: '56px' } })

const row = css({
  rowGap: '8px',
  alignItems: 'baseline',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  textDecoration: 'none',
  color: 'text',
  transition: 'background-color 120ms, border-color 120ms',
  '&:first-of-type': { borderTopWidth: '0px' },
  '&:hover': { bg: 'surface', borderTopColor: 'borderStrong' },
  '&:focus-visible': { bg: 'surface', borderTopColor: 'borderStrong' },
})

const title = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  lineHeight: '0.94',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  minWidth: 0,
})

const pad: Record<Size, string> = {
  a: css({ paddingTop: { base: '20px', md: '32px' }, paddingBottom: { base: '18px', md: '32px' } }),
  b: css({ paddingTop: { base: '18px', md: '24px' }, paddingBottom: { base: '16px', md: '24px' } }),
  c: css({ paddingTop: '16px', paddingBottom: { base: '14px', md: '16px' } }),
}

/* From md the sizes are set against the title track so the longest name fits it:
   96px, 72px and 54px at 1440, each a step under the 128px featured band above. */
const step: Record<Size, string> = {
  a: css({
    textStyle: { base: '2xl', md: '4xl' },
    fontSize: { md: 'calc(10.4vw - 25px)', lg: 'clamp(72px, 6.7vw, 96px)' },
  }),
  b: css({
    textStyle: { base: '2xl', md: '3xl' },
    fontSize: { md: 'calc(8.4vw - 20px)', lg: 'clamp(54px, 5vw, 72px)' },
  }),
  c: css({
    textStyle: { base: 'xl', md: '2xl' },
    fontSize: { md: 'calc(6.4vw - 15px)', lg: 'clamp(40px, 3.75vw, 54px)' },
  }),
}

function WorkRow({ item }: { item: Row }) {
  return (
    <a href={item.href} className={`${bleed} ${track} ${row} ${pad[item.size]}`}>
      <h2 className={`${title} ${step[item.size]}`}>{item.title}</h2>
      <Label parts={[String(item.year), item.type]} />
    </a>
  )
}

export function WorkLedger() {
  return (
    <section id="work" aria-label="Work" className={ledger}>
      {featuredProject ? <FeaturedBand project={featuredProject} /> : null}
      {rows.map((item) => (
        <WorkRow key={item.slug} item={item} />
      ))}
    </section>
  )
}
