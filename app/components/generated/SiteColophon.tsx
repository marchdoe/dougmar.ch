import type { AlmanacRow } from './AlmanacGrid'
import { ColophonFooter } from './ColophonFooter'
import { featuredProject, selectedWork, experiments } from '../../content/projects'

export function SiteColophon({ extraRows = [] }: { extraRows?: AlmanacRow[] }) {
  const allProjects = [featuredProject, ...selectedWork, ...experiments].filter(
    (p): p is NonNullable<typeof featuredProject> => Boolean(p)
  )

  const rows: AlmanacRow[] = [
    { k: 'Sky', v: 'Clear · 63.7°F · calm — Daylight 12.6h · AQI Good' },
    { k: 'Moon', v: 'Waning crescent · 15% lit' },
    { k: 'Detroit Tigers', v: 'DET 2 · OPP 3 — loss' },
    { k: 'Market', v: 'SPY 770.19 ▼ 0.39%' },
    { k: 'On rotation', v: 'Guided by Voices · The War on Drugs · Radiohead' },
    { k: 'Reading', v: 'Hacker News — "Programming is Art"' },
    {
      k: 'The work',
      id: 'work-index',
      v: (
        <>
          {allProjects.map((p, i) => (
            <span key={p.slug}>
              <a href={p.liveUrl || p.externalUrl || `/work/${p.slug}`}>{p.title}</a>
              {i < allProjects.length - 1 ? ', ' : ''}
            </span>
          ))}
        </>
      ),
    },
    ...extraRows,
    {
      k: 'Colophon',
      v: (
        <>
          Set in Zilla Slab &amp; Work Sans. One thought, rendered nightly —{' '}
          <a href="/about">about</a>
        </>
      ),
    },
  ]

  return <ColophonFooter heading="Almanac — Aldie, Virginia · 7 September 2026" rows={rows} />
}
