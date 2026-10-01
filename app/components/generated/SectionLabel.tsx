import { css } from '../../../styled-system/css'

export function SectionLabel({ title, note }: { title: string; note: string }) {
  return (
    <h2
      className={css({
        fontFamily: 'display',
        fontWeight: 'bold',
        fontVariant: 'small-caps',
        letterSpacing: 'wide',
        fontSize: '15px',
        lineHeight: 'snug',
        color: 'accent',
        paddingBottom: '10px',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        columnGap: '4',
        rowGap: '1',
      })}
    >
      {title}
      <span
        className={css({
          fontFamily: 'body',
          fontVariant: 'normal',
          fontWeight: 'normal',
          letterSpacing: 'wider',
          fontSize: '12px',
          textTransform: 'uppercase',
          color: 'textFaint',
          fontVariantNumeric: 'tabular-nums lining-nums',
        })}
      >
        {note}
      </span>
    </h2>
  )
}
