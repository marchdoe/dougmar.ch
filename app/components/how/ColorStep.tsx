import type { CSSProperties } from 'react'
import { css } from '../../../styled-system/css'
import type { ColorRead } from '../../lib/archive-explainer'
import { Absent, Step } from './Step'
import { defEmpty, defValue, prose } from './styles'

const heroSwatch = css({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginBottom: '18px',
})

const heroChip = css({
  width: '54px',
  height: '54px',
  flexShrink: 0,
  background: 'var(--hero)',
  border: '1px solid',
  borderColor: 'archive.line',
})

export function ColorStep({ color, era }: { color: ColorRead; era: string | null }) {
  return (
    <Step n="03" title="A color was chosen">
      {!color.present ? (
        <Absent field="colorScheme" era={era} noun="color direction" />
      ) : (
        <>
          {color.hsl ? (
            <div className={heroSwatch}>
              <div className={heroChip} style={{ '--hero': color.hsl } as CSSProperties} />
              <div>
                <p className={defValue}>{color.name}</p>
                <p className={defEmpty}>{color.hsl}</p>
              </div>
            </div>
          ) : null}
          {color.story ? <p className={prose}>{color.story}</p> : null}
        </>
      )}
    </Step>
  )
}
