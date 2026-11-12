import { css } from '../../../styled-system/css'

const title = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  textStyle: { base: '3xl', md: '4xl' },
  lineHeight: '1',
  textTransform: 'uppercase',
  color: 'text',
})

const note = css({
  marginTop: '16px',
  marginBottom: '48px',
  textStyle: 'base',
  lineHeight: '1.55',
  color: 'textMuted',
  maxWidth: '46ch',
})

const link = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  color: 'text',
})

export function WorkMissing() {
  return (
    <section>
      <h1 className={title}>No project here</h1>
      <p className={note}>
        That address does not match a project.{' '}
        <a href="/#work" className={link}>
          Back to the work
        </a>
      </p>
    </section>
  )
}
