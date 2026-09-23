import { describe, expect, it } from 'vitest'

import {
  readGitHub,
  readHolidays,
  readMarket,
  readNews,
  readSports,
  readWeather,
  signalLines,
} from '../../app/lib/archive-signals'

const line = (signals: Record<string, unknown>, provider: string) =>
  // biome-ignore lint/suspicious/noExplicitAny: test fixtures are raw record JSON
  signalLines(signals as any).find((l) => l.provider === provider)

describe('signalLines', () => {
  it('skips the date, which is the page’s subject rather than an observation', () => {
    // biome-ignore lint/suspicious/noExplicitAny: test fixture
    const lines = signalLines({ date: '2026-06-28', lunar: { phase: 'full moon' } } as any)
    expect(lines.map((l) => l.provider)).toEqual(['lunar'])
  })

  it('returns nothing at all when the era recorded no signals', () => {
    expect(signalLines(null)).toEqual([])
  })
})

describe('a line per provider', () => {
  it('reads the moon', () => {
    expect(line({ lunar: { phase: 'full moon', illumination: 0.992 } }, 'lunar')?.summary).toBe(
      'full moon, 99% lit'
    )
  })

  it('reads daylight', () => {
    expect(
      line({ sun: { sunrise: '04:51', sunset: '19:35', daylight_hours: 14.7 } }, 'sun')?.summary
    ).toBe('04:51 to 19:35, 14.7 hours of light')
  })

  it('reads the season', () => {
    expect(
      line({ season: { season: 'summer', month_name: 'June', day_of_year: 179 } }, 'season')
        ?.summary
    ).toBe('summer, June — day 179 of the year')
  })

  it('notes a weekend', () => {
    expect(line({ day_of_week: { day: 'Sunday', is_weekend: true } }, 'day_of_week')?.summary).toBe(
      'Sunday, a weekend'
    )
    expect(
      line({ day_of_week: { day: 'Tuesday', is_weekend: false } }, 'day_of_week')?.summary
    ).toBe('Tuesday')
  })

  it('quotes with attribution', () => {
    expect(line({ quote: { text: 'Be here now.', author: 'Ram Dass' } }, 'quote')?.summary).toBe(
      '“Be here now.” — Ram Dass'
    )
  })

  it('names the bands', () => {
    expect(line({ music: { bands: ['Wet Leg', 'My Morning Jacket'] } }, 'music')?.summary).toBe(
      'From the standing rotation: Wet Leg and My Morning Jacket'
    )
  })

  it('names the leading story and how many there were', () => {
    const signals = {
      hacker_news: {
        stories: [
          { title: 'Marfa Public Radio Puts You to Sleep', score: 243 },
          { title: 'Bashblog', score: 100 },
        ],
      },
    }
    expect(line(signals, 'hacker_news')?.summary).toBe(
      'Top story: “Marfa Public Radio Puts You to Sleep” at 243 points, of 2'
    )
  })

  it('reads the golf leaderboard', () => {
    const signals = {
      golf: {
        tournament: 'Travelers Championship',
        status: 'In Progress',
        leaders: [{ name: 'Viktor Hovland', score: '-20' }],
      },
    }
    expect(line(signals, 'golf')?.summary).toBe(
      'Travelers Championship, in progress — Viktor Hovland leading at -20'
    )
  })

  it('says which teams played and which did not', () => {
    const offSeason = {
      sports: {
        teams: [
          { name: 'Detroit Lions', result: 'off season' },
          { name: 'Detroit Red Wings', result: 'off season' },
        ],
      },
    }
    expect(line(offSeason, 'sports')?.summary).toBe('2 teams followed, none playing')

    const played = {
      sports: {
        teams: [
          { name: 'Detroit Tigers', result: 'won', score: '10-4' },
          { name: 'Detroit Lions', result: 'off season' },
        ],
      },
    }
    expect(line(played, 'sports')?.summary).toBe('Detroit Tigers won 10-4')
  })

  it('prefers today’s holiday over the next one', () => {
    expect(
      line({ holidays: { today: { name: 'Independence Day' }, upcoming: [] } }, 'holidays')?.summary
    ).toBe('Independence Day, today')
    expect(
      line(
        { holidays: { today: null, upcoming: [{ name: 'Independence Day', days_away: 6 }] } },
        'holidays'
      )?.summary
    ).toBe('Independence Day in 6 days')
  })

  it('agrees with English on a single day', () => {
    expect(
      line({ holidays: { today: null, upcoming: [{ name: 'May Day', days_away: 1 }] } }, 'holidays')
        ?.summary
    ).toBe('May Day in 1 day')
  })
})

describe('the providers the grammar era added', () => {
  it('reads the weather', () => {
    expect(
      line(
        { weather: { location: 'Aldie, Virginia', conditions: 'Sunny', temp_f: 80.8 } },
        'weather'
      )?.summary
    ).toBe('Sunny, 81°F, Aldie, Virginia')
  })

  it('reads air quality', () => {
    expect(
      line(
        { air_quality: { aqi_index: 1, uv_index: 0.8, air_quality_label: 'Good' } },
        'air_quality'
      )?.summary
    ).toBe('Air good, UV 0.8')
  })

  it('reads the market, and signs the move', () => {
    expect(
      line(
        {
          market: { symbol: 'SPY', price: '765.7200', change_percent: '0.4091%', direction: 'up' },
        },
        'market'
      )?.summary
    ).toBe('SPY at 765.72, +0.4091%')
    expect(
      line(
        { market: { symbol: 'SPY', price: '700.0000', change_percent: '1.2%', direction: 'down' } },
        'market'
      )?.summary
    ).toBe('SPY at 700.00, −1.2%')
  })

  it('strips the source a feed appends to its own headline', () => {
    expect(
      line(
        {
          news: {
            headlines: [
              { title: 'Something happened - USA Today', source: 'USA Today' },
              { title: 'Another thing', source: 'BBC' },
            ],
          },
        },
        'news'
      )?.summary
    ).toBe('“Something happened” — USA Today, of 2')
  })

  it('names the site of the day', () => {
    expect(
      line({ awwwards: { sites_of_the_day: [{ title: 'Where the Shadow Fell' }] } }, 'awwwards')
        ?.summary
    ).toBe('Site of the day: Where the Shadow Fell')
  })
})

describe('providers that were empty', () => {
  // The prototype rendered "0 items", which reads as a failure. Most of the
  // time the true statement is that there was nothing on the shelf that day.
  it('says so in words, and marks itself empty', () => {
    const l = line({ books: { currently_reading: [] } }, 'books')
    expect(l?.summary).toBe('Nothing that day.')
    expect(l?.empty).toBe(true)
  })

  it('treats a missing payload the same way', () => {
    const l = line({ github: null }, 'github')
    expect(l?.empty).toBe(true)
  })

  it('does not mark a real reading list as empty', () => {
    const l = line({ books: { currently_reading: [{ title: 'Ficciones' }] } }, 'books')
    expect(l?.summary).toBe('Reading Ficciones')
    expect(l?.empty).toBe(false)
  })
})

describe('labels', () => {
  it('gives each provider a human name', () => {
    expect(line({ hacker_news: { stories: [] } }, 'hacker_news')?.label).toBe('Hacker News')
    expect(line({ lunar: {} }, 'lunar')?.label).toBe('Moon')
  })

  it('falls back readably for a provider added after this file was written', () => {
    expect(line({ tide_charts: { x: 1 } }, 'tide_charts')?.label).toBe('Tide charts')
  })
})

describe('a provider with no handler yet', () => {
  // This is the failure that actually happened: five providers arrived in the
  // grammar era with real payloads and the page said "Nothing that day" about
  // all of them. Claiming nothing about data that exists is the one lie this
  // page must not tell.
  it('never claims emptiness about a payload that has data', () => {
    const l = line({ tide_charts: { high: '06:12', low: '12:40' } }, 'tide_charts')
    expect(l?.empty).toBe(false)
    expect(l?.summary).not.toBe('Nothing that day.')
    expect(l?.summary).toBe('High 06:12, low 12:40')
  })

  it('names what it can from a list', () => {
    const l = line(
      { tide_charts: [{ name: 'Morning tide' }, { name: 'Evening tide' }] },
      'tide_charts'
    )
    expect(l?.summary).toBe('Morning tide and Evening tide')
    expect(l?.empty).toBe(false)
  })

  it('still reports emptiness when the payload is genuinely hollow', () => {
    expect(line({ tide_charts: { high: null, low: [] } }, 'tide_charts')?.empty).toBe(true)
    expect(line({ tide_charts: [] }, 'tide_charts')?.empty).toBe(true)
    expect(line({ tide_charts: {} }, 'tide_charts')?.empty).toBe(true)
  })
})

describe('a failed read is not a result', () => {
  // sports.js records a team it could not fetch as `result: 'error'`, and a
  // league it does not recognise as 'unknown league'. The filter here excluded
  // only 'off season', so a network failure rendered to a visitor as
  // "Detroit Lions error".
  it('does not render a failed team fetch as a score', () => {
    const summary = line(
      {
        sports: {
          teams: [
            { name: 'Detroit Lions', league: 'NFL', result: 'error', score: null },
            { name: 'Detroit Tigers', league: 'MLB', result: 'won 14-0', score: '14-0' },
          ],
        },
      },
      'sports'
    )?.summary
    expect(summary).not.toContain('error')
    expect(summary).toContain('Detroit Tigers')
  })

  it('does not render an unknown league as a result', () => {
    const summary = line(
      {
        sports: {
          teams: [
            { name: 'Detroit Pistons', league: 'XFL', result: 'unknown league', score: null },
          ],
        },
      },
      'sports'
    )?.summary
    expect(summary).not.toContain('unknown league')
    expect(summary).toBe('1 teams followed, none playing')
  })

  it('still reports a real result', () => {
    const summary = line(
      {
        sports: {
          teams: [{ name: 'Detroit Lions', league: 'NFL', result: 'won 24-20', score: '24-20' }],
        },
      },
      'sports'
    )?.summary
    expect(summary).toContain('Detroit Lions')
    expect(summary).toContain('won 24-20')
  })
})

// The typed readers the dev panel's cards share with the summaries (#227).
describe('provider readers', () => {
  it('return undefined for a payload that is not an object', () => {
    expect(readWeather(undefined)).toBeUndefined()
    expect(readWeather(null)).toBeUndefined()
    expect(readNews(['a'])).toBeUndefined()
  })

  it('keep a field only when it has the collector’s type', () => {
    expect(readWeather({ temp_f: '71', conditions: 'Clear', humidity: 40 })).toEqual({
      location: undefined,
      conditions: 'Clear',
      temp_f: undefined,
      humidity: 40,
      wind_mph: undefined,
      wind_dir: undefined,
      feels_like_f: undefined,
    })
    expect(readMarket({ symbol: 'SPY', price: 769.35 })?.price).toBeUndefined()
  })

  it('drop list items without a name and keep the rest', () => {
    expect(
      readSports({ teams: [{ name: 'Lions', result: 'W' }, { result: 'L' }, 'Tigers'] })?.teams
    ).toEqual([{ name: 'Lions', league: undefined, result: 'W', score: undefined }])
    // GitHub reports stars as null when it has none; null is not a number.
    expect(readGitHub({ repos: [{ name: 'a/b', stars: null }] })?.repos).toEqual([
      { name: 'a/b', language: undefined, stars: undefined },
    ])
  })

  it('read a holiday today, or the next one', () => {
    expect(readHolidays({ today: null, upcoming: [{ name: 'Labor Day', days_away: 7 }] })).toEqual({
      today: undefined,
      upcoming: [{ name: 'Labor Day', days_away: 7 }],
    })
    expect(readHolidays({ today: 'Fixture Day' })).toEqual({ today: 'Fixture Day', upcoming: [] })
  })
})
