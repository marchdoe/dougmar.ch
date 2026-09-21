import { css } from '../../../styled-system/css'
import { NavSentence } from './NavSentence'
import { DataStrip } from './DataStrip'

export function SiteFooter() {
  return (
    <footer
      className={css({
        bg: 'bgAlt',
        borderTop: '2px solid',
        borderColor: 'borderStrong',
        paddingInline: '6vw',
        paddingBlock: '9',
      })}
    >
      <NavSentence />
      <DataStrip />
    </footer>
  )
}
