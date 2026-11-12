import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { capabilities } from '../../content/timeline'
import { Label, track } from './LedgerParts'

const intro = css({ rowGap: '40px', alignItems: 'start' })

const title = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  textStyle: { base: '3xl', md: '4xl' },
  lineHeight: '1',
  textTransform: 'uppercase',
  textAlign: 'left',
  color: 'text',
})

const standfirst = css({
  marginTop: { base: '16px', md: '24px' },
  fontFamily: 'body',
  textStyle: 'xl',
  lineHeight: '1.25',
  color: 'text',
  maxWidth: '34ch',
})

const list = css({
  listStyle: 'none',
  marginTop: '8px',
  marginBottom: '0px',
  padding: 0,
})

const item = css({
  textStyle: 'sm',
  lineHeight: '1.5',
  color: 'text',
  paddingTop: '8px',
  paddingBottom: '8px',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
})

export function AboutIntro() {
  return (
    <section className={`${track} ${intro}`}>
      <div className={css({ minWidth: 0 })}>
        <h1 className={title}>{identity.name}</h1>
        <p className={standfirst}>{identity.statement}</p>
      </div>
      <aside aria-label="Capabilities" className={css({ minWidth: 0, paddingTop: { md: '12px' } })}>
        <Label>Capabilities</Label>
        <ul className={list}>
          {capabilities.map((capability) => (
            <li key={capability} className={item}>
              {capability}
            </li>
          ))}
        </ul>
      </aside>
    </section>
  )
}
