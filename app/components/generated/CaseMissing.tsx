import { css } from '../../../styled-system/css'
import { FieldHero } from './FieldHero'
import { visit } from './rows'

export function CaseMissing() {
  return (
    <FieldHero label="selected work">
      <h1
        className={css({
          alignSelf: 'flex-end',
          textAlign: 'right',
          marginTop: 'auto',
          paddingTop: '48px',
          fontFamily: 'display',
          fontWeight: 'normal',
          textTransform: 'lowercase',
          textStyle: { base: '3xl', md: '4xl' },
          color: 'fieldInk',
          maxWidth: '14ch',
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Not in the index.
      </h1>
      <p className={css({ alignSelf: 'flex-end', marginTop: '4' })}>
        <a href="/" className={visit}>
          back to the index
        </a>
      </p>
    </FieldHero>
  )
}
