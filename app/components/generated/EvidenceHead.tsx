import { css } from '../../../styled-system/css'

export function EvidenceHead({ title, count }: { title: string; count: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        paddingBottom: '2',
        columnGap: '12px',
        rowGap: '1',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'lg',
          fontSize: '24px',
          lineHeight: '1.05',
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
        })}
      >
        {title}
      </h2>
      <span
        className={css({
          fontFamily: 'body',
          fontSize: 'xs',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        {count}
      </span>
    </div>
  )
}
