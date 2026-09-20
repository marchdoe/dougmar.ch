import type { CSSProperties } from 'react'
import { css } from '../../../styled-system/css'
import { type Pair, type Ramp, pairs, ramps } from '../../lib/archive-explainer'
import type { ArchiveDetail } from '../../types/archive-record'
import { Absent, Step } from './Step'
import { defKey, defList, defRow, defValue, subhead } from './styles'

const rampRow = css({ marginBottom: '18px' })

const rampName = css({
  fontSize: 'archive.label',
  letterSpacing: '0.12em',
  color: 'archive.dim',
  marginBottom: '6px',
})

const rampStops = css({ display: 'flex', flexWrap: 'wrap', gap: '2px' })

const stop = css({
  width: '72px',
  minHeight: '56px',
  background: 'var(--stop)',
  border: '1px solid',
  borderColor: 'archive.lineSoft',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: '2px',
  padding: '4px',
  fontSize: 'archive.label',
  lineHeight: '1.3',
  color: 'archive.text',
})

const stopMeta = css({
  background: 'archive.bg',
  padding: '1px 3px',
  alignSelf: 'flex-start',
  opacity: 0.92,
})

function RampList({ colorRamps }: { colorRamps: Ramp[] }) {
  if (colorRamps.length === 0) return null
  const stopCount = colorRamps.reduce((n, r) => n + r.stops.length, 0)
  return (
    <>
      <p className={subhead}>
        Color — {colorRamps.length} ramps, {stopCount} stops
      </p>
      {colorRamps.map((r) => (
        <div key={r.name} className={rampRow}>
          <p className={rampName}>{r.name}</p>
          <div className={rampStops}>
            {r.stops.map((s) => (
              <div
                key={`${r.name}.${s.name}`}
                className={stop}
                style={{ '--stop': s.hex } as CSSProperties}
                title={`${r.name}.${s.name} — ${s.hex}`}
              >
                <span className={stopMeta}>{s.name}</span>
                <span className={stopMeta}>{s.hex}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

function PairList({ title, items }: { title: string; items: Pair[] }) {
  if (items.length === 0) return null
  return (
    <>
      <p className={subhead}>{title}</p>
      <div className={defList}>
        {items.map((f) => (
          <div key={f.name} className={defRow}>
            <span className={defKey}>{f.name}</span>
            <span className={defValue}>{f.value}</span>
          </div>
        ))}
      </div>
    </>
  )
}

export function TokensStep({ detail }: { detail: ArchiveDetail }) {
  const colorRamps = ramps(detail.tokens)
  const fonts = pairs(detail.tokens, 'fonts')
  const fontSizes = pairs(detail.tokens, 'fontSizes')
  const empty = colorRamps.length === 0 && fonts.length === 0 && fontSizes.length === 0
  return (
    <Step n="04" title="Tokens were generated">
      {empty ? (
        <Absent field="tokens" era={detail.era} noun="token set" />
      ) : (
        <>
          <RampList colorRamps={colorRamps} />
          <PairList title="Type" items={fonts} />
          <PairList title="Scale" items={fontSizes} />
        </>
      )}
    </Step>
  )
}
