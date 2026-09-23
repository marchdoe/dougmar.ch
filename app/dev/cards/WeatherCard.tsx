import { css, cva } from '../../../styled-system/css'
import { readAirQuality, readWeather } from '../../lib/archive-signals'
import type { Signals } from '../api'
import { card, cardHeading } from '../styles'
import { CardError } from './CardError'

const headline = css({ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' })
const temp = css({ fontSize: '22px', fontWeight: 700, color: 'devPanel.text' })
const conditions = css({ fontSize: '11px', color: 'devPanel.dim' })
const details = css({ fontSize: '10px', color: 'devPanel.muted', lineHeight: '1.8' })
const location = css({ color: 'devPanel.dim', marginTop: '2px' })
const airRow = css({
  marginTop: '8px',
  paddingTop: '8px',
  borderTop: '1px solid',
  borderTopColor: 'devPanel.border',
})
const airFigures = css({ display: 'flex', gap: '12px', fontSize: '10px' })
const airLabel = css({ color: 'devPanel.muted' })

const reading = cva({
  base: { fontWeight: 700 },
  variants: {
    level: {
      good: { color: 'devPanel.green' },
      fair: { color: 'devPanel.yellow' },
      poor: { color: 'devPanel.red' },
    },
  },
})

type Level = 'good' | 'fair' | 'poor'

function aqiLevel(index: number | undefined): Level {
  return index === 1 ? 'good' : index === 2 ? 'fair' : 'poor'
}

function uvLevel(uv: number): Level {
  return uv <= 2 ? 'good' : uv <= 5 ? 'fair' : 'poor'
}

export function WeatherCard({ signals }: { signals: Signals }) {
  const weather = readWeather(signals.weather)
  const aq = readAirQuality(signals.air_quality)

  if (!weather && !aq) return <CardError label="// WEATHER" reason="WEATHER_API_KEY not set" />

  return (
    <div className={card()}>
      <h3 className={cardHeading}>
        <span>// WEATHER</span>
      </h3>
      {weather && (
        <>
          <div className={headline}>
            <span className={temp}>{Math.round(weather.temp_f ?? 0)}&deg;F</span>
            <span className={conditions}>{weather.conditions}</span>
          </div>
          <div className={details}>
            <div>
              Feels like {Math.round(weather.feels_like_f ?? 0)}&deg;F &middot; {weather.humidity}%
              humidity
            </div>
            <div>
              Wind {weather.wind_mph} mph {weather.wind_dir}
            </div>
            <div className={location}>{weather.location}</div>
          </div>
        </>
      )}
      {aq && (
        <div className={airRow}>
          <div className={airFigures}>
            <span>
              <span className={airLabel}>AQI </span>
              <span className={reading({ level: aqiLevel(aq.aqi_index) })}>
                {aq.air_quality_label}
              </span>
            </span>
            <span>
              <span className={airLabel}>UV </span>
              <span className={reading({ level: uvLevel(aq.uv_index ?? 0) })}>{aq.uv_index}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
