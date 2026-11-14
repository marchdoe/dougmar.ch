import { css, cx } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { revealOnScroll } from './motion'

const lines = [
  { k: 'holes in one', v: String(personal.holesInOne) },
  { k: 'sport', v: personal.sport },
  { k: 'teams', v: personal.teams.join(', ') },
  { k: 'current focus', v: personal.currentFocus },
].filter((l) => l.v)

const sectionCls = css({
  bg: 'field',
  color: 'fieldInk',
  paddingBlock: { base: '7', lg: '8' },
  paddingInline: { base: '4', lg: '7', xl: '8' },
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'fieldBorder',
})

const h2Cls = css({
  fontSize: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
  fontWeight: 'bold',
  marginBottom: '4',
})

const gridCls = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)' },
  rowGap: '4',
  columnGap: '7',
})
const lineCls = css({
  fontSize: 'sm',
  lineHeight: 'normal',
  maxWidth: '46ch',
  display: 'flex',
  flexDirection: 'column',
  gap: '1',
})
const kCls = css({
  color: 'fieldInkMuted',
  fontSize: 'xs',
  letterSpacing: 'wide',
  textTransform: 'uppercase',
})
const vCls = css({ fontWeight: 'bold', fontSize: 'base' })

export function PersonalSection() {
  return (
    <section className={cx(sectionCls, revealOnScroll)}>
      <h2 className={h2Cls}>off the clock</h2>
      <div className={gridCls}>
        {lines.map((l) => (
          <p key={l.k} className={lineCls}>
            <span className={kCls}>{l.k}</span>
            <span className={vCls}>{l.v}</span>
          </p>
        ))}
      </div>
    </section>
  )
}
