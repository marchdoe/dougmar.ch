import { css } from '../../../styled-system/css'
import { LedgerSection } from './LedgerSection'
import { TagList } from './TagList'

export function BuildSection({ stack, liveUrl }: { stack: string[]; liveUrl: string | undefined }) {
  if (stack.length === 0 && !liveUrl) return null
  return (
    <LedgerSection label="Build" aside="Stack">
      <TagList items={stack} />
      {liveUrl ? (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            marginTop: '3',
            fontFamily: 'display',
            fontSize: 'sm',
            color: 'text',
            textDecoration: 'underline',
            textDecorationColor: 'accent',
            textDecorationThickness: '2px',
            textUnderlineOffset: '4px',
            _hover: { color: 'accent' },
          })}
        >
          Live site ↗
        </a>
      ) : null}
    </LedgerSection>
  )
}
