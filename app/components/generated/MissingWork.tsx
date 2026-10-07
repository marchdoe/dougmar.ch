import { css } from '../../../styled-system/css'
import { Field } from './Field'

export function MissingWork() {
  return (
    <Field>
      <div
        className={css({
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          textAlign: 'center',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            textStyle: '3xl',
            fontWeight: 'bold',
            textTransform: 'lowercase',
            lineHeight: '0.95',
            color: 'text',
            maxWidth: '16ch',
          })}
        >
          No project by that name.
        </h1>
        <a
          href="/work"
          className={css({
            fontFamily: 'body',
            textStyle: 'base',
            fontWeight: 'bold',
            color: 'accentAlt',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderColor: 'accent',
          })}
        >
          See all work →
        </a>
      </div>
    </Field>
  )
}
