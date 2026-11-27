import { css } from '../../../styled-system/css'
import { heroProject } from './heroProject'

const linkCls = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  color: 'accent',
  fontFamily: 'body',
  textStyle: 'sm',
  fontWeight: 'bold',
  letterSpacing: 'wide',
  textTransform: 'uppercase',
  textDecoration: 'underline',
  textDecorationThickness: '1px',
  textUnderlineOffset: '5px',
  _hover: { color: 'accentAlt' },
})

function FeaturedLinks({ slug, outbound }: { slug: string; outbound?: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        columnGap: '5',
        marginTop: '2',
      })}
    >
      <a href={`/work/${slug}`} className={linkCls}>
        Read the case ↗
      </a>
      {outbound ? (
        <a href={outbound} className={linkCls}>
          Visit the live project ↗
        </a>
      ) : null}
    </div>
  )
}

export function FeaturedDeck() {
  const f = heroProject
  if (!f) return null
  return (
    <div
      className={css({
        fontFamily: 'body',
        fontSize: { base: '17px', lg: '20px' },
        lineHeight: '1.6',
        maxWidth: '46ch',
        color: 'textMuted',
        animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '160ms',
      })}
    >
      <p>{f.description ?? f.problem}</p>
      <FeaturedLinks slug={f.slug} outbound={f.externalUrl ?? f.liveUrl} />
    </div>
  )
}
