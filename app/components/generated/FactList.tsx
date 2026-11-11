import { css } from '../../../styled-system/css'

type Fact = { label: string; value: string }

export function FactList({ title, facts }: { title: string; facts: Fact[] }) {
  return (
    <div className={css({ display: 'grid', gap: '4', alignContent: 'start' })}>
      <h3
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(22px, 2.6vw, 28px)',
          color: 'fieldInk',
        })}
      >
        {title}
      </h3>
      {facts
        .filter((f) => f.value !== '')
        .map((f) => (
          <div
            key={f.label}
            className={css({ display: 'flex', flexDirection: 'column', gap: '1' })}
          >
            <span
              className={css({
                fontFamily: 'body',
                fontWeight: 'bold',
                fontSize: '2xs',
                textTransform: 'uppercase',
                letterSpacing: 'wider',
                color: 'accent',
              })}
            >
              {f.label}
            </span>
            <span
              className={css({
                fontFamily: 'body',
                fontSize: 'sm',
                color: 'fieldInk',
                lineHeight: '1.45',
                maxWidth: '44ch',
              })}
            >
              {f.value}
            </span>
          </div>
        ))}
    </div>
  )
}
