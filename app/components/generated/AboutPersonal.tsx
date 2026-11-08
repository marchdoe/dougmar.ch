import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'

const facts = [
  { label: 'Sport', value: personal.sport },
  { label: 'Teams', value: personal.teams.filter(Boolean).join(' · ') },
  { label: 'Current focus', value: personal.currentFocus },
].filter((fact) => fact.value)

export function AboutPersonal() {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'surface',
        textAlign: 'right',
        paddingBlock: 'clamp(48px,6vw,96px)',
        paddingInline: 'var(--pad)',
      })}
    >
      <div className={css({ width: 'clamp(180px,22vw,236px)', marginLeft: 'auto' })}>
        <span
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontWeight: 'normal',
            textTransform: 'uppercase',
            letterSpacing: '0.015em',
            lineHeight: '0.96',
            fontSize: 'clamp(26px,4.4vw,44px)',
            color: 'surface',
            textAlign: 'justify',
            textAlignLast: 'justify',
          })}
        >
          Holes in one
        </span>
        <span
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: 'clamp(120px,15vw,160px)',
            lineHeight: '0.82',
            color: 'fieldInk',
            marginTop: '4px',
            textAlign: 'right',
          })}
        >
          {personal.holesInOne}
        </span>
      </div>
      <dl className={css({ margin: '0', marginTop: '6' })}>
        {facts.map((fact) => (
          <div key={fact.label} className={css({ marginTop: '3' })}>
            <dt
              className={css({
                textStyle: 'xs',
                letterSpacing: 'wider',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: 'fieldInkMuted',
              })}
            >
              {fact.label}
            </dt>
            <dd
              className={css({
                margin: '0',
                textStyle: 'base',
                color: 'surface',
                maxWidth: '46ch',
                marginLeft: 'auto',
              })}
            >
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
