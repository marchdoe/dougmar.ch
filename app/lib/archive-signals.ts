/**
 * One readable line per signal provider — #159.
 *
 * The explainer's job is to say what the pipeline saw that morning. "5 items"
 * does not say that, and "0 items" is worse: it reads as a failure when the
 * true statement is often "nothing was on the shelf that day". Each provider
 * gets a summary written against its own shape, and providers that were
 * genuinely empty say so in words.
 */

import type { JsonValue } from '../types/archive-record'
import { isRecord } from './guards'

export interface SignalLine {
  provider: string
  label: string
  summary: string
  empty: boolean
}

/** Display names. Providers not listed fall back to their key, de-underscored. */
const LABELS: Record<string, string> = {
  books: 'Reading',
  day_of_week: 'Day',
  github: 'GitHub',
  golf: 'Golf',
  hacker_news: 'Hacker News',
  holidays: 'Holidays',
  lunar: 'Moon',
  music: 'Music',
  quote: 'Quote',
  season: 'Season',
  sports: 'Sports',
  sun: 'Daylight',
}

const arr = (v: JsonValue | undefined): JsonValue[] => (Array.isArray(v) ? v : [])
const str = (v: JsonValue | undefined): string | null => (typeof v === 'string' && v ? v : null)
const num = (v: JsonValue | undefined): number | null => (typeof v === 'number' ? v : null)

function titleOf(item: JsonValue): string | null {
  if (typeof item === 'string') return item
  if (!isRecord(item)) return null
  return str(item.title) ?? str(item.name) ?? null
}

function list(items: JsonValue[], max = 2): string {
  const names = items.map(titleOf).filter((n): n is string => Boolean(n))
  if (names.length === 0) return ''
  if (names.length <= max) return names.join(' and ')
  return `${names.slice(0, max).join(', ')}, and ${names.length - max} more`
}

// ─── Provider readers ─────────────────────────────────────────────────────────
//
// One typed reader per provider payload, shared by the summaries below and the
// dev panel's signal cards (#227). The cards used to cast each payload to a
// hand-written shape (`signals.weather as {…} | undefined`); a field of the
// wrong type then reached the page as whatever it happened to be. A reader
// keeps a field only when it has the type the collector writes, and returns
// undefined for a payload that is not an object at all.

const asString = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined)
const asNumber = (v: unknown): number | undefined => (typeof v === 'number' ? v : undefined)
const asBoolean = (v: unknown): boolean | undefined => (typeof v === 'boolean' ? v : undefined)
const records = (v: unknown): Record<string, unknown>[] =>
  Array.isArray(v) ? v.filter(isRecord) : []
const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string') : []

export interface SeasonSignal {
  season?: string
  month_name?: string
  day_of_year?: number
}
export function readSeason(v: unknown): SeasonSignal | undefined {
  if (!isRecord(v)) return undefined
  return {
    season: asString(v.season),
    month_name: asString(v.month_name),
    day_of_year: asNumber(v.day_of_year),
  }
}

export interface DayOfWeekSignal {
  day?: string
  is_weekend?: boolean
}
export function readDayOfWeek(v: unknown): DayOfWeekSignal | undefined {
  if (!isRecord(v)) return undefined
  return { day: asString(v.day), is_weekend: asBoolean(v.is_weekend) }
}

export interface SunSignal {
  sunrise?: string
  sunset?: string
  daylight_hours?: number
}
export function readSun(v: unknown): SunSignal | undefined {
  if (!isRecord(v)) return undefined
  return {
    sunrise: asString(v.sunrise),
    sunset: asString(v.sunset),
    daylight_hours: asNumber(v.daylight_hours),
  }
}

export interface LunarSignal {
  phase?: string
  illumination?: number
}
export function readLunar(v: unknown): LunarSignal | undefined {
  if (!isRecord(v)) return undefined
  return { phase: asString(v.phase), illumination: asNumber(v.illumination) }
}

export interface HolidaysSignal {
  today?: string
  upcoming: Array<{ name: string; days_away?: number }>
}
export function readHolidays(v: unknown): HolidaysSignal | undefined {
  if (!isRecord(v)) return undefined
  return {
    today: asString(v.today),
    upcoming: records(v.upcoming).flatMap((h) => {
      const name = asString(h.name)
      return name === undefined ? [] : [{ name, days_away: asNumber(h.days_away) }]
    }),
  }
}

export interface QuoteSignal {
  text?: string
  author?: string
}
export function readQuote(v: unknown): QuoteSignal | undefined {
  if (!isRecord(v)) return undefined
  return { text: asString(v.text), author: asString(v.author) }
}

export interface TeamSignal {
  name: string
  league?: string
  result?: string
  score?: string
}
export function readSports(v: unknown): { teams: TeamSignal[] } | undefined {
  if (!isRecord(v)) return undefined
  return {
    teams: records(v.teams).flatMap((t) => {
      const name = asString(t.name)
      if (name === undefined) return []
      return [
        {
          name,
          league: asString(t.league),
          result: asString(t.result),
          score: asString(t.score),
        },
      ]
    }),
  }
}

export interface GolfSignal {
  tournament?: string
  status?: string
  leaders: Array<{ name: string; position?: string; score?: string }>
}
export function readGolf(v: unknown): GolfSignal | undefined {
  if (!isRecord(v)) return undefined
  return {
    tournament: asString(v.tournament),
    status: asString(v.status),
    leaders: records(v.leaders).flatMap((l) => {
      const name = asString(l.name)
      if (name === undefined) return []
      return [{ name, position: asString(l.position), score: asString(l.score) }]
    }),
  }
}

export interface RepoSignal {
  name: string
  language?: string
  stars?: number
}
export function readGitHub(v: unknown): { repos: RepoSignal[] } | undefined {
  if (!isRecord(v)) return undefined
  return {
    repos: records(v.repos).flatMap((r) => {
      const name = asString(r.name)
      if (name === undefined) return []
      return [{ name, language: asString(r.language), stars: asNumber(r.stars) }]
    }),
  }
}

export interface StorySignal {
  title: string
  score?: number
}
export function readHackerNews(v: unknown): { stories: StorySignal[] } | undefined {
  if (!isRecord(v)) return undefined
  return {
    stories: records(v.stories).flatMap((s) => {
      const title = asString(s.title)
      return title === undefined ? [] : [{ title, score: asNumber(s.score) }]
    }),
  }
}

export interface WeatherSignal {
  location?: string
  conditions?: string
  temp_f?: number
  humidity?: number
  wind_mph?: number
  wind_dir?: string
  feels_like_f?: number
}
export function readWeather(v: unknown): WeatherSignal | undefined {
  if (!isRecord(v)) return undefined
  return {
    location: asString(v.location),
    conditions: asString(v.conditions),
    temp_f: asNumber(v.temp_f),
    humidity: asNumber(v.humidity),
    wind_mph: asNumber(v.wind_mph),
    wind_dir: asString(v.wind_dir),
    feels_like_f: asNumber(v.feels_like_f),
  }
}

export interface AirQualitySignal {
  aqi_index?: number
  uv_index?: number
  air_quality_label?: string
}
export function readAirQuality(v: unknown): AirQualitySignal | undefined {
  if (!isRecord(v)) return undefined
  return {
    aqi_index: asNumber(v.aqi_index),
    uv_index: asNumber(v.uv_index),
    air_quality_label: asString(v.air_quality_label),
  }
}

export interface HeadlineSignal {
  title: string
  source?: string
}
export function readNews(v: unknown): { headlines: HeadlineSignal[] } | undefined {
  if (!isRecord(v)) return undefined
  return {
    headlines: records(v.headlines).flatMap((h) => {
      const title = asString(h.title)
      return title === undefined ? [] : [{ title, source: asString(h.source) }]
    }),
  }
}

export interface MarketSignal {
  symbol?: string
  price?: string
  change?: string
  change_percent?: string
  direction?: string
}
export function readMarket(v: unknown): MarketSignal | undefined {
  if (!isRecord(v)) return undefined
  return {
    symbol: asString(v.symbol),
    price: asString(v.price),
    change: asString(v.change),
    change_percent: asString(v.change_percent),
    direction: asString(v.direction),
  }
}

export interface ProductSignal {
  name: string
  votes?: number
}
export function readProductHunt(v: unknown): { products: ProductSignal[] } | undefined {
  if (!isRecord(v)) return undefined
  return {
    products: records(v.products).flatMap((p) => {
      const name = asString(p.name)
      return name === undefined ? [] : [{ name, votes: asNumber(p.votes) }]
    }),
  }
}

export function readMusic(v: unknown): { bands: string[] } | undefined {
  if (!isRecord(v)) return undefined
  return { bands: strings(v.bands) }
}

export function readBooks(v: unknown): { currently_reading: string[] } | undefined {
  if (!isRecord(v)) return undefined
  return { currently_reading: strings(v.currently_reading) }
}

/** Human summary for one provider's payload, or null when there is nothing to say. */
function summarize(provider: string, value: JsonValue | undefined): string | null {
  if (value === undefined || value === null) return null

  switch (provider) {
    case 'lunar': {
      const lunar = readLunar(value)
      if (!lunar) return null
      const phase = str(lunar.phase)
      const pct = num(lunar.illumination)
      if (!phase) return null
      return pct === null ? phase : `${phase}, ${Math.round(pct * 100)}% lit`
    }

    case 'sun': {
      const sun = readSun(value)
      if (!sun) return null
      const rise = str(sun.sunrise)
      const set = str(sun.sunset)
      const hours = num(sun.daylight_hours)
      if (!rise || !set) return null
      return `${rise} to ${set}${hours === null ? '' : `, ${hours} hours of light`}`
    }

    case 'season': {
      const read = readSeason(value)
      if (!read) return null
      const season = str(read.season)
      const monthName = str(read.month_name)
      const doy = num(read.day_of_year)
      if (!season) return null
      return `${season}${monthName ? `, ${monthName}` : ''}${doy === null ? '' : ` — day ${doy} of the year`}`
    }

    case 'day_of_week': {
      const read = readDayOfWeek(value)
      if (!read) return null
      const day = str(read.day)
      if (!day) return null
      return read.is_weekend === true ? `${day}, a weekend` : day
    }

    case 'quote': {
      const quote = readQuote(value)
      if (!quote) return null
      const text = str(quote.text)
      if (!text) return null
      const author = str(quote.author)
      return author ? `“${text}” — ${author}` : `“${text}”`
    }

    case 'music': {
      // A standing rotation from profile.yml, picked by date — not something
      // that happened that day, so it must not read like the score beside it.
      const bands = arr(isRecord(value) ? value.bands : value)
      return bands.length ? `From the standing rotation: ${list(bands)}` : null
    }

    case 'books': {
      const reading = arr(isRecord(value) ? value.currently_reading : value)
      return reading.length ? `Reading ${list(reading)}` : null
    }

    case 'hacker_news': {
      const stories = arr(isRecord(value) ? value.stories : value)
      if (!stories.length) return null
      const top = stories[0]
      const title = titleOf(top)
      const score = isRecord(top) ? num(top.score) : null
      return title
        ? `Top story: “${title}”${score === null ? '' : ` at ${score} points`}, of ${stories.length}`
        : `${stories.length} stories`
    }

    case 'github': {
      const repos = arr(isRecord(value) ? value.repos : value)
      return repos.length ? `Trending: ${list(repos)}` : null
    }

    case 'golf': {
      if (!isRecord(value)) return null
      const tournament = str(value.tournament)
      if (!tournament) return null
      const status = str(value.status)
      const leaders = arr(value.leaders)
      const lead = leaders.length && isRecord(leaders[0]) ? leaders[0] : null
      const who = lead ? str(lead.name) : null
      const score = lead ? str(lead.score) : null
      const head = status ? `${tournament}, ${status.toLowerCase()}` : tournament
      return who ? `${head} — ${who} leading${score ? ` at ${score}` : ''}` : head
    }

    case 'sports': {
      const teams = arr(isRecord(value) ? value.teams : value)
      if (!teams.length) return null
      // 'error' and 'unknown league' are how the collector records a read it
      // could not make, not a result. Excluding only 'off season' meant a
      // network failure rendered to a visitor as "Detroit Lions error".
      const NON_RESULTS = new Set(['off season', 'error', 'unknown league'])
      const played = teams.filter(
        (t) => isRecord(t) && str(t.result) && !NON_RESULTS.has(str(t.result) as string)
      )
      if (!played.length) return `${teams.length} teams followed, none playing`
      const first = played[0]
      const name = isRecord(first) ? str(first.name) : null
      const result = isRecord(first) ? str(first.result) : null
      const score = isRecord(first) ? str(first.score) : null
      return name
        ? `${name} ${result}${score ? ` ${score}` : ''}${played.length > 1 ? `, and ${played.length - 1} other result${played.length > 2 ? 's' : ''}` : ''}`
        : `${played.length} results`
    }

    case 'weather': {
      const weather = readWeather(value)
      if (!weather) return null
      const conditions = str(weather.conditions)
      const f = num(weather.temp_f)
      const where = str(weather.location)
      if (!conditions && f === null) return null
      const head = [conditions, f === null ? null : `${Math.round(f)}°F`].filter(Boolean).join(', ')
      return where ? `${head}, ${where}` : head
    }

    case 'air_quality': {
      const aq = readAirQuality(value)
      if (!aq) return null
      const label = str(aq.air_quality_label)
      const uv = num(aq.uv_index)
      if (!label && uv === null) return null
      const head = label ? `Air ${label.toLowerCase()}` : 'Air'
      return uv === null ? head : `${head}, UV ${uv}`
    }

    case 'market': {
      const market = readMarket(value)
      if (!market) return null
      const symbol = str(market.symbol)
      const price = str(market.price)
      if (!symbol || !price) return null
      const pct = str(market.change_percent)
      const dir = str(market.direction)
      const money = Number.parseFloat(price)
      const shown = Number.isFinite(money) ? money.toFixed(2) : price
      return `${symbol} at ${shown}${pct ? `, ${dir === 'down' ? '−' : '+'}${pct.replace(/^[-+]/, '')}` : ''}`
    }

    case 'news': {
      const headlines = arr(isRecord(value) ? value.headlines : value)
      if (!headlines.length) return null
      const top = headlines[0]
      const title = titleOf(top)
      const source = isRecord(top) ? str(top.source) : null
      if (!title) return `${headlines.length} headlines`
      // Feeds append " - Source" to the title; the source is carried separately.
      const clean = source ? title.replace(new RegExp(`\\s*[-–—]\\s*${source}$`), '') : title
      return `“${clean}”${source ? ` — ${source}` : ''}, of ${headlines.length}`
    }

    case 'awwwards': {
      const sites = arr(isRecord(value) ? value.sites_of_the_day : value)
      return sites.length ? `Site of the day: ${list(sites, 1)}` : null
    }

    case 'holidays': {
      if (!isRecord(value)) return null
      const today = value.today
      const todayName = titleOf(today as JsonValue)
      if (todayName) return `${todayName}, today`
      const upcoming = arr(value.upcoming)
      const next = upcoming.length && isRecord(upcoming[0]) ? upcoming[0] : null
      if (!next) return null
      const name = str(next.name)
      const days = num(next.days_away)
      if (!name) return null
      return days === null ? `${name} coming up` : `${name} in ${days} day${days === 1 ? '' : 's'}`
    }

    default:
      return null
  }
}

const prettyKey = (k: string) => k.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase())

/** Nothing was recorded: absent, an empty container, or a container of nothings. */
function isEmptyPayload(value: JsonValue | undefined): boolean {
  if (value === undefined || value === null) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (isRecord(value)) {
    const values = Object.values(value)
    return values.length === 0 || values.every((v) => isEmptyPayload(v))
  }
  return false
}

/**
 * A last resort for a provider added after this file was written.
 *
 * It says less than a real handler, but it never says "nothing" about data that
 * exists — which is the one thing a record of what the pipeline saw must not do.
 * A provider showing up here is a prompt to write it a proper case above.
 */
function genericSummary(value: JsonValue): string {
  if (Array.isArray(value)) {
    const named = list(value, 2)
    return named || `${value.length} recorded`
  }
  if (isRecord(value)) {
    const parts: string[] = []
    for (const [k, v] of Object.entries(value)) {
      if (parts.length === 2) break
      if (typeof v === 'string' && v) parts.push(`${prettyKey(k).toLowerCase()} ${v}`)
      else if (typeof v === 'number') parts.push(`${prettyKey(k).toLowerCase()} ${v}`)
      else if (Array.isArray(v) && v.length) parts.push(`${v.length} ${k.replace(/_/g, ' ')}`)
    }
    if (parts.length) return `${parts.join(', ').replace(/^./, (c) => c.toUpperCase())}`
  }
  return 'Recorded.'
}

/**
 * Every provider the record carries, in a stable order, each with a line.
 *
 * `date` is skipped: it is the page's own subject, not something observed.
 */
export function signalLines(signals: Record<string, JsonValue> | null): SignalLine[] {
  if (!signals) return []
  return Object.keys(signals)
    .filter((k) => k !== 'date')
    .sort()
    .map((provider) => {
      const value = signals[provider]
      const label = LABELS[provider] ?? prettyKey(provider)
      const known = summarize(provider, value)
      if (known) return { provider, label, summary: known, empty: false }

      // Order matters. Claiming "nothing" about a payload that has data is the
      // one lie this page can tell, so emptiness must be proven, not assumed
      // from the absence of a handler.
      if (isEmptyPayload(value)) {
        return { provider, label, summary: 'Nothing that day.', empty: true }
      }
      return { provider, label, summary: genericSummary(value as JsonValue), empty: false }
    })
}
