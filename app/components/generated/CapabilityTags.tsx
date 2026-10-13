import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'

const listCss = css({
  listStyle: 'none',
  margin: '0',
  padding: '0',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '2',
})

const tagCss = css({
  fontFamily: 'body',
  fontSize: 'sm',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'text',
  bg: 'surface',
  paddingBlock: '1',
  paddingInline: '3',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'border',
  borderRadius: 'sm',
})

export function CapabilityTags() {
  return (
    <ul className={listCss}>
      {capabilities.map((cap) => (
        <li key={cap} className={tagCss}>
          {cap}
        </li>
      ))}
    </ul>
  )
}
