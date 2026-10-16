import { css } from '../../../styled-system/css'

export function ActPhrase() {
  return (
    <>
      {'Do you want to know who you are? Don’t ask. '}
      <span className={css({ color: 'accent' })}>Act!</span>
      {' Action will delineate and define you.'}
    </>
  )
}
