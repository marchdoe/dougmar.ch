import { css } from '../../../styled-system/css'
import { field } from './fields'

const linkCls = css({
  display: 'inline-block',
  minHeight: '44px',
  paddingBlock: '10px',
  lineHeight: '24px',
  fontSize: 'sm',
  fontWeight: 'bold',
})

type Props = { project: object; slug: string; title: string }

export function FeaturedLinks({ project, slug, title }: Props) {
  const outbound = field(project, 'liveUrl') || field(project, 'externalUrl')
  return (
    <div className={css({ marginTop: '4', display: 'flex', flexWrap: 'wrap', columnGap: '5' })}>
      <a href={`/work/${slug}`} className={linkCls}>
        read the {title.toLowerCase()} story
      </a>
      {outbound ? (
        <a href={outbound} className={linkCls}>
          visit {title.toLowerCase()} ↗
        </a>
      ) : null}
    </div>
  )
}
