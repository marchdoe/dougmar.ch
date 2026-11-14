import { css, cx } from '../../../styled-system/css'
import { projects } from '../../content/projects'
import { ClientChip } from './ClientChip'
import { revealOnScroll } from './motion'

const clientProject = projects.find((p) => (p.clients?.length ?? 0) > 0)

const sectionCls = css({
  bg: 'surface',
  paddingBlock: { base: '6', lg: '7' },
  paddingInline: { base: '4', lg: '7', xl: '8' },
})

const eyebrowCls = css({
  display: 'block',
  fontSize: '2xs',
  letterSpacing: 'widest',
  textTransform: 'uppercase',
  color: 'accent',
  fontWeight: 'bold',
  marginBottom: '3',
})

const headCls = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  textTransform: 'lowercase',
  textStyle: 'lg',
  color: 'text',
  maxWidth: '22ch',
  marginBottom: { base: '5', lg: '6' },
})

const chipsCls = css({ display: 'flex', flexWrap: 'wrap', gap: '2' })

export function ClientMarks() {
  if (!clientProject) return null
  const eyebrow = [clientProject.title, clientProject.role, String(clientProject.year)]
    .filter(Boolean)
    .join(' · ')
  return (
    <section className={cx(sectionCls, revealOnScroll)}>
      <span className={eyebrowCls}>{eyebrow}</span>
      <h2 className={headCls}>a decade of brand &amp; product work for</h2>
      <div className={chipsCls}>
        {(clientProject.clients ?? []).map((client) => (
          <ClientChip key={client.name} client={client} lazy />
        ))}
      </div>
    </section>
  )
}
