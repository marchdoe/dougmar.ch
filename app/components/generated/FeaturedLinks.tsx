import { css } from '../../../styled-system/css'

const readlink = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  marginTop: '2',
  fontWeight: 'bold',
  color: 'accent',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'transparent',
  _hover: { borderBottomColor: 'accent' },
})

export function FeaturedLinks({
  slug,
  title,
  external,
}: {
  slug: string
  title: string
  external?: string
}) {
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', rowGap: '0' })}>
      <a href={`/work/${slug}`} className={readlink}>
        Read the case →
      </a>
      {external && (
        <a href={external} className={readlink}>
          Visit {title} →
        </a>
      )}
    </div>
  )
}
