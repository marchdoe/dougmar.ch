import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { OutLink } from './OutLink'

export function FeaturedCard() {
  const p = featuredProject
  if (!p) return null
  const meta = [p.role, String(p.year)].filter(Boolean).join(' · ')
  const out = p.externalUrl ?? p.liveUrl
  return (
    <div
      className={css({
        bg: 'surface',
        borderRadius: 'sm',
        padding: 'clamp(26px, 4vw, 56px)',
        marginBottom: 'clamp(36px, 5vw, 64px)',
      })}
    >
      <p
        className={css({
          fontSize: 'sm',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'textMuted',
          fontWeight: 'bold',
          marginBottom: '14px',
        })}
      >
        Featured, the proof
      </p>
      <h3
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: 'clamp(36px, 5.4vw, 78px)',
          letterSpacing: 'tight',
          lineHeight: '0.95',
          color: 'text',
        })}
      >
        {p.title}
      </h3>
      <p
        className={css({
          fontSize: 'sm',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textMuted',
          fontWeight: 'bold',
          marginTop: '12px',
        })}
      >
        {meta}
      </p>
      <p
        className={css({
          marginTop: '20px',
          fontSize: { base: 'base', lg: 'lede' },
          lineHeight: 'normal',
          color: 'textMuted',
          maxWidth: '56ch',
        })}
      >
        {p.problem ?? p.description}
      </p>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: '5',
          rowGap: '2',
          marginTop: '22px',
        })}
      >
        <a
          href={`/work/${p.slug}`}
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '44px',
            paddingBlock: '10px',
            paddingInline: '18px',
            bg: 'accent',
            color: 'accentText',
            textDecoration: 'none',
            borderRadius: 'md',
            fontWeight: 'bold',
            fontSize: 'sm',
            _hover: { bg: 'field', color: 'accentText' },
          })}
        >
          View the case study →
        </a>
        <OutLink href={out} label={`Visit ${p.title}`} />
      </div>
    </div>
  )
}
