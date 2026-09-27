import { css } from '../../../styled-system/css'

export function ProseBlocks({ blocks }: { blocks: { k: string; v: string }[] }) {
  return (
    <div>
      {blocks.map((block) => (
        <div
          key={block.k}
          className={css({
            display: { base: 'block', lg: 'grid' },
            gridTemplateColumns: { lg: '180px minmax(0, 1fr)' },
            columnGap: { lg: '5' },
            paddingBlock: '4',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'border',
          })}
        >
          <div
            className={css({
              fontFamily: 'display',
              fontSize: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'accent',
              marginBottom: { base: '2', lg: '0' },
            })}
          >
            {block.k}
          </div>
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'base',
              color: 'text',
              maxWidth: '52ch',
            })}
          >
            {block.v}
          </p>
        </div>
      ))}
    </div>
  )
}
