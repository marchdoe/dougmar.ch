import { Box, Flex } from '../../styled-system/jsx'
import { css } from '../../styled-system/css'
import { identity } from '../content/about'

const navItems = [
  { label: 'work', href: '/' },
  { label: 'about', href: '/about' },
  { label: 'contact', href: `mailto:${identity.email}` },
]

export function Sidebar() {
  return (
    <Box
      as="footer"
      bg="bgAlt"
      borderTop="3px solid"
      borderColor="borderStrong"
      px={{ base: '4', md: '6', lg: '96px' }}
      py={{ base: '8', md: '10' }}
      className={css({
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <Flex direction="column" gap="6">
        <nav aria-label="Primary" className={css({ display: 'flex', flexDirection: 'column' })}>
          <span
            className={css({
              fontSize: 'sm',
              color: 'textFaint',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              textTransform: 'lowercase',
              mb: '2',
            })}
          >
            index
          </span>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={css({
                display: 'flex',
                alignItems: 'center',
                minHeight: '48px',
                fontSize: 'sm',
                color: 'text',
                borderTop: '1px solid',
                borderColor: 'border',
                textTransform: 'lowercase',
                letterSpacing: 'wide',
                _hover: { color: 'accentAlt' },
              })}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <p
          className={css({
            fontStyle: 'italic',
            textStyle: 'md',
            color: 'textMuted',
            maxW: '60ch',
            lineHeight: 'loose',
          })}
        >
          &ldquo;Try to be a rainbow in someone&rsquo;s cloud.&rdquo;{' '}
          <cite className={css({ fontStyle: 'normal', color: 'textFaint', fontSize: 'sm' })}>
            Maya Angelou
          </cite>
        </p>

        <Flex
          justify="space-between"
          align="flex-end"
          gap="5"
          wrap="wrap"
          borderTop="1px solid"
          borderColor="border"
          pt="5"
        >
          <span
            className={css({
              fontFamily: 'display',
              textStyle: '2xl',
              letterSpacing: 'tight',
              color: 'text',
              textTransform: 'lowercase',
            })}
          >
            dougmar.ch
          </span>
          {/* sand500 has no exact semantic token; nearest is textFaint */}
          <span className={css({ fontSize: 'xs', color: 'textFaint' })}>
            Doug March. Design and engineering.
          </span>
        </Flex>
      </Flex>
    </Box>
  )
}
