import { css } from '../../../styled-system/css'
import { NavSentence } from './NavSentence'

export function CaseMissing() {
  return (
    <section
      className={css({
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: '24px',
        marginBottom: '48px',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'normal',
          textStyle: '2xl',
          color: 'text',
        })}
      >
        Not in the index.
      </h1>
      <NavSentence className={css({ marginTop: '14px' })} />
    </section>
  )
}
