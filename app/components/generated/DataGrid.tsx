import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

export type DataGridItem = { k: string; v: string; sub?: string; accentUp?: boolean }

const headCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
  marginBottom: '4',
})

const gridCss = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', md: '1fr 1fr', lg: 'repeat(3, 1fr)' },
  columnGap: { base: '0', md: '9' },
  borderTop: '1px solid',
  borderColor: 'border',
})

const cellCss = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  gap: '3',
  padding: '4 1',
  borderBottom: '1px solid',
  borderColor: 'border',
})

const kCss = css({
  fontSize: 'xs',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'textFaint',
})

const vCss = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: 'lg',
  color: 'text',
  textAlign: 'right',
})

const upCss = css({ color: 'accentAlt', fontSize: 'sm', marginLeft: '1' })
const subCss = css({
  fontFamily: 'body',
  fontWeight: '400',
  fontSize: 'sm',
  color: 'textMuted',
  marginLeft: '1',
})

export function DataGrid({ items, heading }: { items: DataGridItem[]; heading?: string }) {
  return (
    <Box
      as="section"
      padding={{ base: '24px 20px', md: '32px 7vw' }}
      borderTop="1px solid"
      borderColor="border"
    >
      {heading && <Box className={headCss}>{heading}</Box>}
      <Box className={gridCss}>
        {items.map((item) => (
          <Box key={item.k} className={cellCss}>
            <span className={kCss}>{item.k}</span>
            <span className={vCss + ' tnum'}>
              {item.v}
              {item.accentUp && <span className={upCss}>&#9650;</span>}
              {item.sub && <small className={subCss}>{item.sub}</small>}
            </span>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
