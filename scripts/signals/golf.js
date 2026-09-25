import { fetchJson } from '../utils/signal-fetch.js'

export const name = 'golf'
export const timeout = 10000

export async function collect(_profile, { signal } = {}) {
  const url = 'https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard'
  const json = await fetchJson(url, {
    signal,
    timeoutMs: timeout,
    source: 'ESPN golf',
    // ESPN's site.api rejects any custom User-Agent with a 403 — a browser
    // string included — and answers 200 to the runtime default. Sending the
    // shared signals UA broke this collector; stay anonymous here.
    userAgent: null,
  })
  const events = json.events || []

  if (events.length === 0) {
    return {
      data: { tournament: null, status: 'no active tournament', leaders: [] },
      meta: { source: 'espn', items: 0 },
    }
  }

  const event = events[0]
  const tournament = event.name || null
  const statusDescription = event.status?.type?.description || 'Unknown'
  const statusState = event.status?.type?.state || 'pre'

  // Don't return fake leaders before play has started — competitors are just
  // field-entry order at this stage, all showing E (even par).
  if (statusState === 'pre') {
    return {
      data: { tournament, status: statusDescription, leaders: [] },
      meta: { source: 'espn', items: 0 },
    }
  }

  const competitors = event.competitions?.[0]?.competitors || []

  // Sort by ESPN's order field (leaderboard position during/after play),
  // then take the top 5.
  const sorted = [...competitors].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

  // A missing displayName used to fall back to the shared literal 'Unknown'.
  // Two competitors ESPN sent without an athlete name then got the same
  // name, which the panel used as a React key and broke the dev-panel E2E
  // job on 2026-09-25. `i` is this leaderboard slice's own array index —
  // unlike `order`, it can never repeat within the slice, so the fallback
  // stays unique even when ESPN's own ordering doesn't.
  const leaders = sorted.slice(0, 5).map((c, i) => ({
    name: c.athlete?.displayName || `Unranked competitor #${i + 1}`,
    position: String(c.order ?? '?'),
    score: typeof c.score === 'string' ? c.score : c.score?.displayValue || 'E',
  }))

  return {
    data: { tournament, status: statusDescription, leaders },
    meta: { source: 'espn', items: leaders.length },
  }
}
