import { css } from '../../../styled-system/css'
import { ProjectBanner } from './ProjectBanner'

export function MissingProject({ slug }: { slug: string }) {
  return (
    <>
      <ProjectBanner title="Not in the index" kicker={slug} />
      <section className={css({ paddingBlock: '5', paddingInline: { base: '3', lg: '6vw' } })}>
        <a
          href="/work"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            fontFamily: 'display',
            fontSize: 'sm',
            color: 'text',
            textDecoration: 'underline',
            textDecorationColor: 'accent',
            textUnderlineOffset: '4px',
          })}
        >
          Back to the work
        </a>
      </section>
    </>
  )
}
