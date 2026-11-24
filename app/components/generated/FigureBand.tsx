import { css } from '../../../styled-system/css'

type Row = { label: string; value: string }
type Group = { title: string; rows: Row[] }

export function FigureBand({ groups }: { groups: Group[] }) {
  return (
    <section
      aria-label="Education and personal"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: 'clamp(44px, 6vw, 72px)',
        paddingInline: 'clamp(24px, 5vw, 88px)',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1fr 1fr' },
        gap: { base: '36px', lg: '48px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      {groups.map((group) => (
        <div
          key={group.title}
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'fieldBorder',
            paddingTop: '14px',
          })}
        >
          <div
            className={css({
              fontFamily: 'body',
              fontWeight: 'bold',
              textStyle: '2xs',
              textTransform: 'uppercase',
              letterSpacing: 'wider',
              color: 'accentAlt',
              marginBottom: '10px',
            })}
          >
            {group.title}
          </div>
          {group.rows
            .filter((row) => Boolean(row.value))
            .map((row) => (
              <div
                key={row.label}
                className={css({
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  columnGap: '4',
                  rowGap: '1',
                  paddingBlock: '6px',
                  borderBottomWidth: '1px',
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'fieldBorder',
                  _last: { borderBottomWidth: '0' },
                })}
              >
                <span
                  className={css({ fontFamily: 'body', textStyle: 'sm', color: 'fieldInkMuted' })}
                >
                  {row.label}
                </span>
                <span
                  className={css({
                    fontFamily: 'body',
                    fontWeight: 'bold',
                    textStyle: 'sm',
                    color: 'fieldInk',
                    textAlign: 'right',
                    maxWidth: '40ch',
                  })}
                >
                  {row.value}
                </span>
              </div>
            ))}
        </div>
      ))}
    </section>
  )
}
