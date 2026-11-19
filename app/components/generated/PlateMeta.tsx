import { css } from '../../../styled-system/css'

type Row = { k: string; v: string }

export function PlateMeta({ rows }: { rows: Row[] }) {
  return (
    <dl className={css({ display: 'flex', flexDirection: 'column', margin: '0' })}>
      {rows
        .filter((r) => r.v !== '')
        .map((r) => (
          <div
            key={r.k}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
              borderTop: '1px solid',
              borderColor: 'fieldBorder',
              paddingTop: '3',
              paddingBottom: '1',
            })}
          >
            <dt
              className={css({
                fontSize: '2xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                color: 'fieldInkMuted',
              })}
            >
              {r.k}
            </dt>
            <dd
              className={css({
                margin: '0',
                fontFamily: 'display',
                fontWeight: 'bold',
                fontSize: { base: 'md', lg: 'lg' },
                letterSpacing: '0.01em',
                textTransform: 'uppercase',
                lineHeight: '1.05',
                color: 'fieldInk',
              })}
            >
              {r.v}
            </dd>
          </div>
        ))}
    </dl>
  )
}
