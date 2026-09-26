import { css } from '../../../styled-system/css'

type Props = { title: string; meta: string; id?: string; tight?: boolean }

export function SectionHead({ title, meta, id, tight = false }: Props) {
  return (
    <div
      data-tight={tight}
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        columnGap: '4',
        rowGap: '1',
        marginTop: '56px',
        marginBottom: '18px',
        paddingBottom: '14px',
        borderBottom: '1px solid',
        borderColor: 'border',
        '&[data-tight=true]': { marginTop: '48px' },
      })}
    >
      <h2
        id={id}
        className={css({
          fontFamily: 'display',
          fontSize: { base: '28px', lg: '32px' },
          lineHeight: 'snug',
          fontWeight: 'normal',
          color: 'text',
          minWidth: '0',
        })}
      >
        {title}
      </h2>
      <span
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          minWidth: '0',
        })}
      >
        {meta}
      </span>
    </div>
  )
}
