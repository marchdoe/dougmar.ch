import { css } from '../../../styled-system/css'
import { Box } from '../../../styled-system/jsx'

type IndexItem = { key: string; title: string; type: string; year: number | string; href: string }

const revealCss = css({
  '@supports (animation-timeline: view())': {
    animationName: 'rise',
    animationTimeline: 'view()',
    animationRange: 'entry 0% entry 40%',
    animationFillMode: 'both',
  },
})

export function WorkIndexList({
  label,
  count,
  items,
}: {
  label: string
  count: string
  items: IndexItem[]
}) {
  return (
    <Box
      as="section"
      borderTop="1px solid"
      borderColor="fieldBorder"
      className={css({ pt: '5', pb: '5' })}
    >
      <Box className={revealCss}>
        <Box
          className={css({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            color: 'fieldInkMuted',
            mb: '4',
            fontSize: 'sm',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
          })}
        >
          <span>{label}</span>
          <span className={css({ color: 'accentAlt', fontVariantNumeric: 'tabular-nums' })}>
            {count}
          </span>
        </Box>
        <Box as="ul" className={css({ listStyle: 'none', margin: 0, padding: 0 })}>
          {items.map((item) => (
            <Box
              as="li"
              key={item.key}
              borderTop="1px solid"
              borderColor="fieldBorder"
              className={css({ _first: { borderTop: 'none' } })}
            >
              <a
                href={item.href}
                className={css({
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: '3',
                  py: '3',
                  minHeight: '44px',
                })}
              >
                <span
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    fontSize: 'lg',
                    color: 'fieldInk',
                  })}
                >
                  {item.title}
                </span>
                <span
                  className={css({
                    display: 'flex',
                    gap: '3',
                    fontSize: '2xs',
                    textTransform: 'uppercase',
                    letterSpacing: 'wide',
                    color: 'fieldInkMuted',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0,
                  })}
                >
                  <span>{item.type}</span>
                  <span>{item.year}</span>
                </span>
              </a>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
