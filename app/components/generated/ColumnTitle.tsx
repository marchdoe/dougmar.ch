import { css } from '../../../styled-system/css'

export function ColumnTitle({ label }: { label: string }) {
  return (
    <div
      className={css({
        fontFamily: 'body',
        fontSize: 'xs',
        fontWeight: 600,
        fontVariantCaps: 'all-small-caps',
        letterSpacing: 'wide',
        color: 'accent',
        paddingBottom: '10px',
        marginBottom: '2px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
      })}
    >
      {label}
    </div>
  )
}
