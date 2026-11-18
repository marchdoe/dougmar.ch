import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { capabilities, education } from '../../content/timeline'

const labelClass = css({
  display: 'block',
  marginBottom: '4',
  textStyle: 'xs',
  fontWeight: 'semibold',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textMuted',
})

const factClass = css({
  margin: '0',
  textStyle: 'base',
  color: 'textMuted',
  borderTopWidth: '1px',
  borderTopStyle: 'solid',
  borderTopColor: 'border',
  paddingTop: '3',
})

export function AboutDetails() {
  const edu = [education.school, education.degree, education.concentration, education.years].filter(
    Boolean
  )
  const facts = [
    { k: 'Holes in one', v: String(personal.holesInOne) },
    { k: 'Sport', v: personal.sport },
    { k: 'Teams', v: personal.teams.join(', ') },
    { k: 'Current focus', v: personal.currentFocus },
  ]
  return (
    <section
      className={css({
        paddingBottom: 'clamp(40px, 6vw, 96px)',
        paddingInline: 'clamp(1.25rem, 6vw, 4rem)',
        display: 'grid',
        gap: '8',
      })}
    >
      <div
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: '5',
        })}
      >
        <h2 className={labelClass}>Capabilities</h2>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '5',
            rowGap: '2',
          })}
        >
          {capabilities.map((c) => (
            <li
              key={c}
              className={css({ textStyle: 'md', fontVariant: 'small-caps', letterSpacing: 'wide' })}
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: '5',
        })}
      >
        <h2 className={labelClass}>Education</h2>
        <ul
          className={css({
            listStyle: 'none',
            margin: '0',
            padding: '0',
            display: 'grid',
            gap: '2',
          })}
        >
          {edu.map((line) => (
            <li
              key={line}
              className={css({
                textStyle: 'base',
                borderTopWidth: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'border',
                paddingTop: '2',
              })}
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: '5',
        })}
      >
        <h2 className={labelClass}>Off the clock</h2>
        <div
          className={css({
            display: 'grid',
            gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: '5',
          })}
        >
          {facts.map((f) => (
            <p key={f.k} className={factClass}>
              <span className={css({ display: 'block', color: 'text', fontWeight: 'semibold' })}>
                {f.k}
              </span>
              {f.v}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
