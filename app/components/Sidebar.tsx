import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { ColophonNav } from './generated/ColophonNav'
import { ColophonSignals } from './generated/ColophonSignals'

const footerCls = css({
  bg: 'field',
  color: 'fieldInk',
  paddingTop: { base: '5', lg: '6' },
  paddingBottom: { base: '6', lg: '6' },
  paddingInline: { base: '4', lg: '7', xl: '8' },
})

const idCls = css({
  marginTop: { base: '6', lg: '7' },
  paddingTop: '4',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'fieldBorder',
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
})

const nameCls = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'md',
  color: 'fieldInk',
})
const roleCls = css({ fontSize: 'sm', color: 'fieldInkMuted', maxWidth: '48ch' })

export function Sidebar() {
  return (
    <footer className={footerCls}>
      <ColophonNav />
      <ColophonSignals />
      <div className={idCls}>
        <span className={nameCls}>{identity.name}</span>
        <span className={roleCls}>{identity.role}</span>
      </div>
    </footer>
  )
}
