import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'

function MetaRow({ k, v }: { k: string; v: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        gap: '8px',
        whiteSpace: 'nowrap',
        alignItems: 'baseline',
        justifyContent: { base: 'flex-start', md: 'flex-end' },
      })}
    >
      <span
        className={css({
          color: 'text',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          textStyle: '2xs',
          fontWeight: 'bold',
        })}
      >
        {k}
      </span>
      <span className={css({ textStyle: 'xs', color: 'textMuted' })}>{v}</span>
    </div>
  )
}

const block = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '3px',
  textAlign: { xl: 'right' },
})

export function SkyMasthead() {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        justifyContent: { md: 'space-between' },
        alignItems: { md: 'flex-start' },
        gap: '36px',
      })}
    >
      <BrandLockup
        variant="stacked-lg"
        mode="original"
        className={css({ alignSelf: 'flex-start', color: 'text' })}
      />
      <div
        className={css({
          display: 'flex',
          flexDirection: { base: 'column', xl: 'row' },
          gap: { base: '12px', xl: '56px' },
          alignItems: { md: 'flex-end', xl: 'flex-start' },
          textAlign: { md: 'right' },
        })}
      >
        <div className={block}>
          <span
            className={css({
              fontFamily: 'display',
              fontWeight: 'normal',
              textStyle: 'lg',
              color: 'text',
              lineHeight: '1.2',
              whiteSpace: 'nowrap',
            })}
          >
            Aldie, Virginia
          </span>
          <MetaRow k="Date" v="Sat, Nov 14, 2026" />
        </div>
        <div className={block}>
          <MetaRow k="Moon" v="waxing crescent · 29% lit" />
          <MetaRow k="Sun" v="rise 06:59 · set 16:50" />
        </div>
      </div>
    </div>
  )
}
