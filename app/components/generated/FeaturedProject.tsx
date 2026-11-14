import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { featuredProject } from '../../content/projects'

type Entry = (typeof projects)[number]

function featuredUrl(p: Entry): string {
  return p.externalUrl ?? p.liveUrl ?? `/work/${p.slug}`
}

export function FeaturedProject() {
  const p = featuredProject
  if (!p) return null
  const tag = ['Featured', p.role].filter(Boolean).join(' · ')
  return (
    <div
      className={css({
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'accent',
        paddingTop: '4',
        marginBottom: '7',
      })}
    >
      <div
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: { base: 'accent', _light: 'accentAlt' },
          marginBottom: '3',
        })}
      >
        {tag}
      </div>
      <a
        href={`/work/${p.slug}`}
        className={css({
          display: 'block',
          minHeight: '44px',
          fontFamily: 'display',
          fontSize: '4xl',
          lineHeight: 'tight',
          color: 'text',
          marginBottom: '2',
        })}
      >
        {p.title}
      </a>
      <div
        className={css({
          fontFamily: 'body',
          fontSize: 'sm',
          color: 'textFaint',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          marginBottom: '4',
        })}
      >
        {p.type} · {p.year}
      </div>
      <p
        className={css({
          fontFamily: 'display',
          fontSize: { base: 'lede', lg: 'lg' },
          lineHeight: 'normal',
          color: 'textMuted',
          maxWidth: '50ch',
          marginBottom: '4',
        })}
      >
        {p.problem ?? p.description}
      </p>
      <a
        href={featuredUrl(p)}
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2',
          minHeight: '44px',
          fontFamily: 'body',
          fontSize: 'sm',
          letterSpacing: 'wide',
          color: { base: 'accent', _light: 'accentAlt' },
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        Visit the project
        <span aria-hidden="true">→</span>
      </a>
    </div>
  )
}
