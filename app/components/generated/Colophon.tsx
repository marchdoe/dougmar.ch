import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { joinParts } from './join'

function TbCell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className={css({
        paddingBlock: '18px',
        paddingInline: '20px',
        borderStyle: 'solid',
        borderColor: 'border',
        borderBottomWidth: '1px',
        borderRightWidth: { base: '0', sm: '1px' },
        borderTopWidth: '0',
        borderLeftWidth: '0',
        _last: { borderBottomWidth: '0' },
        '&:nth-child(2n)': { borderRightWidth: '0' },
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          fontSize: '2xs',
          fontWeight: 'bold',
          color: 'textMuted',
          marginBottom: '2',
        })}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

const valClass = css({ fontFamily: 'display', fontSize: '17px', color: 'text', lineHeight: 'snug' })
const metaClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  rowGap: '1',
  columnGap: '18px',
  fontFamily: 'body',
  fontSize: '2xs',
  letterSpacing: 'wide',
  color: 'textMuted',
  '& b': { color: 'text', fontWeight: 'bold' },
})

export function Colophon() {
  return (
    <footer
      className={css({
        bg: 'bgAlt',
        paddingTop: '40px',
        paddingBottom: '48px',
        paddingInline: 'clamp(40px, 6vw, 112px)',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderColor: 'fieldBorder',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderStrong',
          borderRadius: 'md',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: '1fr 1fr' },
        })}
      >
        <TbCell label="Drawing">
          <div className={valClass}>What ships should look like what was Designed.</div>
        </TbCell>
        <TbCell label="By">
          <div className={valClass}>{joinParts([identity.name, identity.role], ', ')}</div>
          <div className={css({ marginTop: '2' })}>
            <div className={metaClass}>
              <span>Aldie, VA</span>
              <span>
                <b>2026-11-20</b>
              </span>
            </div>
          </div>
        </TbCell>
        <TbCell label="On rotation">
          <div
            className={css({
              fontFamily: 'body',
              fontSize: 'sm',
              color: 'textMuted',
              lineHeight: 'loose',
            })}
          >
            Radiohead · Tobin Sprout · My Morning Jacket
          </div>
        </TbCell>
        <TbCell label="Notes">
          <div className={metaClass}>
            <span>
              Thanksgiving in <b>6 days</b>
            </span>
            <span>
              moon <b>88%</b>
            </span>
            <span>
              AQI <b>good</b>
            </span>
          </div>
        </TbCell>
      </div>
      <div
        className={css({
          marginTop: '18px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '2',
          fontFamily: 'body',
          fontSize: '2xs',
          letterSpacing: 'wider',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        <span>Fraunces · Karla · Ultramarine &amp; Chalk Amber</span>
        <span>Rev. 2026.11.20</span>
      </div>
    </footer>
  )
}
