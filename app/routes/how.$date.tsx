import { createFileRoute } from '@tanstack/react-router'

import { HowLoading, HowMissing } from '../components/how/HowNotice'
import { HowRecord } from '../components/how/HowRecord'
import { loadArchiveDetail } from '../lib/archive-data'
import { readArchiveFile } from '../lib/archive-source'
import { CANONICAL_ORIGIN } from '../../scripts/utils/site-origin.js'

// Which dates have a real captured OG card under public/og/, baked in by
// vite.config.ts at build time (#399) — head() ships in the client bundle,
// so it cannot ask the filesystem itself.
declare const __OG_IMAGE_DATES__: string[]

export const Route = createFileRoute('/how/$date')({
  component: HowPage,
  // The record loads here rather than in an effect, so the prerender renders
  // the page instead of its loading state. A day with no record is null, not a
  // thrown error. pendingMs 0 shows the loading line at once, as the effect's
  // first render did, when the page is reached without a prerendered copy.
  loader: ({ params }) => loadArchiveDetail(params.date, readArchiveFile),
  pendingComponent: HowPending,
  pendingMs: 0,
  pendingMinMs: 0,
  // Without its own og:url and canonical, this page carried the day's home
  // page card and the home page's URL — the shell's default, meant for pages
  // that don't say otherwise (#327). This page always says otherwise. Every
  // og:/twitter: key the shell sets is repeated here (og:image:width
  // included) — meta dedupes per key, so a key left out leaks the day's
  // value through next to this page's own og:title/og:image. The image
  // follows the same /og/<date>.png convention the home page card uses; a
  // date the pipeline never captured a card for names default.png instead,
  // same as the home page's own og:image falls back today (#399).
  head: ({ params }) => {
    const title = `How the ${params.date} design was made`
    const url = `${CANONICAL_ORIGIN}/how/${params.date}`
    const image = __OG_IMAGE_DATES__.includes(params.date)
      ? `${CANONICAL_ORIGIN}/og/${params.date}.png`
      : `${CANONICAL_ORIGIN}/og/default.png`
    return {
      meta: [
        { title },
        { property: 'og:title', content: title },
        {
          property: 'og:description',
          content: `A day-by-day look at how this site built its ${params.date} design.`,
        },
        { property: 'og:image', content: image },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:image', content: image },
      ],
      links: [{ rel: 'canonical', href: url }],
    }
  },
})

function HowPage() {
  const { date } = Route.useParams()
  const detail = Route.useLoaderData()
  return detail ? <HowRecord date={date} detail={detail} /> : <HowMissing date={date} />
}

function HowPending() {
  const { date } = Route.useParams()
  return <HowLoading date={date} />
}
