import { Flex } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export function CapabilitiesTags({ items }: { items: string[] }) {
  return (
    <Flex wrap="wrap" gap="2">
      {items.map((item) => (
        <span
          key={item}
          className={css({
            textStyle: 'xs',
            fontVariantCaps: 'all-small-caps',
            letterSpacing: 'wide',
            color: 'textMuted',
            border: '1px solid',
            borderColor: 'border',
            borderRadius: 'full',
            paddingX: '3',
            paddingY: '1',
          })}
        >
          {item}
        </span>
      ))}
    </Flex>
  )
}
