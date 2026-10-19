import { css } from '../../../styled-system/css'

export function CaseMissing({ slug }: { slug: string }) {
  return (
    <section className={css({ paddingBlock: '8', paddingInline: { base: '24px', sm: '6vw' } })}>
      <h1
        className={css({
          textStyle: '3xl',
          fontFamily: 'display',
          fontWeight: 'normal',
          textTransform: 'lowercase',
          color: 'text',
        })}
      >
        no project called {slug}
      </h1>
      <p
        className={css({ textStyle: 'base', color: 'textMuted', marginTop: '4', maxWidth: '48ch' })}
      >
        The index lists every project with a page of its own.{' '}
        <a href="/#index">Back to the index</a>.
      </p>
    </section>
  )
}
