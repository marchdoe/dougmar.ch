import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'

export function FeaturedProject() {
  if (!featuredProject) return null

  return (
    <section aria-labelledby="feat-h" className={css({ display: 'flex', flexDirection: 'column' })}>
      <span
        className={css({
          textStyle: 'xs',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
          display: 'block',
          marginBottom: '5',
        })}
      >
        Featured
      </span>
      <h2
        id="feat-h"
        className={css({
          fontFamily: 'display',
          fontWeight: '700',
          textStyle: '2xl',
          letterSpacing: 'tight',
          color: 'text',
          marginBottom: '5',
        })}
      >
        {featuredProject.title}
      </h2>
      <p
        className={css({
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'accent',
          fontWeight: '600',
          marginBottom: '7',
        })}
      >
        {featuredProject.type} · {featuredProject.year}
      </p>
      {featuredProject.problem && (
        <p
          className={css({
            fontFamily: 'display',
            textStyle: 'lg',
            color: 'textMuted',
            maxWidth: '60ch',
            marginBottom: '6',
          })}
        >
          {featuredProject.problem}
        </p>
      )}
      {featuredProject.description && (
        <p
          className={css({
            textStyle: 'base',
            color: 'textMuted',
            maxWidth: '62ch',
            marginBottom: '8',
          })}
        >
          {featuredProject.description}
        </p>
      )}
      {featuredProject.externalUrl && (
        <a
          href={featuredProject.externalUrl}
          rel="noopener"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3',
            textStyle: 'sm',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            color: 'accentText',
            bg: 'accent',
            paddingInline: '6',
            paddingBlock: '4',
            width: 'fit-content',
          })}
        >
          Visit {featuredProject.title} <span>↗</span>
        </a>
      )}
    </section>
  )
}
