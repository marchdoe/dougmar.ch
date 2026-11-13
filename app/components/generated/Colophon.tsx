import { css } from '../../../styled-system/css'
import { identity, personal } from '../../content/about'
import { FactList } from './FactList'

const ch = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontVariant: 'small-caps',
  fontSize: '22px',
  marginBottom: '14px',
})
const fnav = css({ display: 'flex', flexWrap: 'wrap', columnGap: '4', marginTop: '18px' })
const linkBase = {
  fontSize: '13px',
  textTransform: 'lowercase',
  letterSpacing: '0.06em',
  minHeight: '44px',
  minWidth: '44px',
  display: 'inline-flex',
  alignItems: 'center',
} as const
const linkGround = css({ ...linkBase, color: 'textMuted' })
const linkField = css({ ...linkBase, color: 'fieldInk' })
const col = {
  paddingTop: '32px',
  paddingBottom: '40px',
  paddingInline: 'clamp(16px, 5vw, 64px)',
} as const

export function Colophon() {
  return (
    <footer
      id="contact"
      className={css({
        marginTop: '80px',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1fr 1fr' },
      })}
    >
      <div className={css({ ...col, bg: 'bgAlt', color: 'text' })}>
        <div className={css({ color: 'text' })}>
          <div className={ch}>{identity.name}</div>
        </div>
        <FactList
          onField={false}
          rows={[
            { term: 'Role', detail: identity.role },
            { term: 'Focus', detail: personal.currentFocus },
          ]}
        />
        <div className={fnav}>
          <a href="/#work" className={linkGround}>
            work
          </a>
          <a href="/about" className={linkGround}>
            about
          </a>
          <a href={`mailto:${identity.email}`} className={linkGround}>
            contact
          </a>
        </div>
        <div className={css({ marginTop: '16px', fontSize: '2xs', color: 'textFaint' })}>
          © 2026 Doug March
        </div>
      </div>
      <div className={css({ ...col, bg: 'field', color: 'fieldInk' })}>
        <div className={ch}>Nov 13, 2026</div>
        <FactList
          onField
          rows={[
            { term: 'Last night', detail: 'Pistons 144, 140' },
            { term: 'Wings', detail: '4–5 OT loss' },
            { term: 'Sky', detail: '43°F, waxing crescent 20%' },
            { term: 'Golf', detail: 'Trace Crowe −10, Austin' },
          ]}
        />
        <div className={fnav}>
          <a href="https://dougmar.ch" className={linkField}>
            dougmar.ch
          </a>
          <a href="/#work" className={linkField}>
            index
          </a>
        </div>
        <div className={css({ marginTop: '16px', fontSize: '2xs', color: 'fieldInk' })}>
          Aldie, Virginia
        </div>
      </div>
    </footer>
  )
}
