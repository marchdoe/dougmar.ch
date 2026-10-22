import { css } from '../../../styled-system/css'
import { ThesisPanel } from './Thesis'

export function MissingProject() {
  return (
    <ThesisPanel>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: '3xl',
          color: 'fieldInk',
          marginBottom: '4',
        })}
      >
        Not in the index.
      </h1>
      <a
        href="/work"
        className={css({
          fontFamily: 'body',
          fontWeight: 'bold',
          fontSize: 'sm',
          color: 'fieldInk',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderColor: 'accentAlt',
        })}
      >
        Back to the work
      </a>
    </ThesisPanel>
  )
}
