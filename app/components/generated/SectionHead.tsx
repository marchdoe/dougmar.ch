import { css } from '../../../styled-system/css'

export function SectionHead({ title, tag }: { title: string; tag: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: '3',
        borderBottom: '1px solid',
        borderColor: 'borderStrong',
        paddingBottom: '10px',
        marginBottom: '2',
      })}
    >
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: { base: 'lg', lg: 'xl' },
          letterSpacing: '0.02em',
          color: 'text',
        })}
      >
        {title}
      </h2>
      <span
        className={css({
          fontSize: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        {tag}
      </span>
    </div>
  )
}
