import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

export function ProjectRows({
  label,
  items,
  marginTop,
}: {
  label: string
  items: Project[]
  marginTop?: string
}) {
  return (
    <Box className={css({ marginTop: marginTop ?? '9' })}>
      <p
        className={css({
          textStyle: '2xs',
          fontWeight: '700',
          fontVariant: 'small-caps',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '5',
        })}
      >
        {label}
      </p>
      <Box className={css({ borderTop: '1px solid', borderColor: 'borderStrong' })}>
        {items.map((item) => (
          <a
            key={item.slug}
            href={
              item.depth === 'full'
                ? `/work/${item.slug}`
                : (item.externalUrl ?? item.liveUrl ?? `/work/${item.slug}`)
            }
            className={css({
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              alignItems: 'baseline',
              rowGap: '2',
              columnGap: '4',
              paddingY: { base: '4', lg: '6' },
              paddingX: '1',
              minHeight: '44px',
              borderBottom: '1px solid',
              borderColor: 'border',
              _hover: { color: 'border' },
            })}
          >
            <span
              className={css({
                fontFamily: 'display',
                textStyle: { base: 'xl', lg: '2xl' },
                lineHeight: 'tight',
                color: 'text',
              })}
            >
              {item.title}
            </span>
            <span
              className={css({
                textStyle: '2xs',
                fontWeight: '600',
                fontVariant: 'small-caps',
                letterSpacing: 'wide',
                color: 'textMuted',
                whiteSpace: 'nowrap',
              })}
            >
              {item.type} · {item.year}
            </span>
          </a>
        ))}
      </Box>
    </Box>
  )
}
