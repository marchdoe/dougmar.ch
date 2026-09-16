import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type IndexItem = {
  num: string
  title: string
  meta: string[]
  href: string
  linkLabel: string
  description?: string
}

export function IndexRows({ items }: { items: IndexItem[] }) {
  return (
    <Box
      className={css({
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' },
        columnGap: { md: '8', lg: '12' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {items.map((item) => (
        <a
          key={item.num}
          href={item.href}
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: 'auto minmax(0, 1fr)', md: 'auto minmax(0, 1fr) auto' },
            gap: '2',
            alignItems: 'baseline',
            py: '5',
            borderTop: '1px solid',
            borderColor: 'border',
            minWidth: '0',
          })}
        >
          <span className={css({ fontFamily: 'display', textStyle: 'md', color: 'fieldBorder' })}>
            {item.num}
          </span>
          <span
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '1',
              minWidth: '0',
            })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: 'lg',
                lineHeight: 'snug',
                color: 'text',
                overflowWrap: 'break-word',
                wordBreak: 'break-word',
              })}
            >
              {item.title}
            </span>
            <span
              className={css({
                display: 'flex',
                gap: '4',
                fontSize: 'sm',
                color: 'textFaint',
                flexWrap: 'wrap',
              })}
            >
              {item.meta.map((m) => (
                <span key={m}>{m}</span>
              ))}
            </span>
            {item.description && (
              <span className={css({ textStyle: 'md', color: 'textMuted', maxW: '64ch', mt: '2' })}>
                {item.description}
              </span>
            )}
          </span>
          <span
            className={css({
              fontSize: 'sm',
              color: 'accentAlt',
              alignSelf: { md: 'end' },
              whiteSpace: 'nowrap',
            })}
          >
            {item.linkLabel} &rarr;
          </span>
        </a>
      ))}
    </Box>
  )
}
