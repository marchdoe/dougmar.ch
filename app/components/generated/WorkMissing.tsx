import { css } from '../../../styled-system/css'

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  fontSize: 'base',
  fontWeight: 'bold',
  color: 'accent',
})

export function WorkMissing() {
  return (
    <section
      className={css({
        flex: '1',
        bg: 'bg',
        paddingBlock: 'clamp(56px, 8vw, 112px)',
        paddingInline: 'clamp(40px, 6vw, 112px)',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontStyle: 'italic',
          fontWeight: 'bold',
          fontSize: 'clamp(36px, 6vw, 88px)',
          lineHeight: 'tight',
          color: 'accent',
          margin: '0',
        })}
      >
        Nothing filed under that name.
      </h1>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '6', marginTop: '5' })}>
        <a href="/work" className={linkClass}>
          See the work
        </a>
        <a href="/about" className={linkClass}>
          About Doug
        </a>
      </div>
    </section>
  )
}
