import { css, cx } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { capabilities, education } from '../../content/timeline'
import { reveal } from './reveal'
import { SectionHead } from './SectionHead'

export function CapabilitiesSection() {
  return (
    <section
      aria-label="Capabilities"
      className={cx(
        reveal,
        css({
          bg: 'bgAlt',
          color: 'text',
          borderBlockStyle: 'solid',
          borderBlockWidth: '1px',
          borderBlockColor: 'borderStrong',
          paddingBlock: { base: '6', lg: '7' },
          paddingInline: { base: '4', lg: '7', xl: '8' },
        })
      )}
    >
      <SectionHead>Capabilities</SectionHead>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', rowGap: '3' })}>
        {capabilities.map((c) => (
          <span key={c} className={css({ textStyle: 'base', color: 'text' })}>
            {c}
          </span>
        ))}
      </div>
    </section>
  )
}

const rowClass = css({
  paddingBlock: '3',
  borderTopStyle: 'solid',
  borderTopWidth: '1px',
  borderTopColor: 'border',
  textStyle: 'base',
})

export function EducationSection() {
  const lines = [
    education.school,
    [education.degree, education.concentration].filter(Boolean).join(' · '),
    education.years,
  ].filter(Boolean)
  return (
    <section
      aria-label="Education"
      className={cx(
        reveal,
        css({
          bg: 'bg',
          color: 'text',
          paddingTop: { base: '6', lg: '8' },
          paddingInline: { base: '4', lg: '7', xl: '8' },
        })
      )}
    >
      <div className={css({ maxWidth: '960px', marginLeft: 'auto' })}>
        <SectionHead>Education</SectionHead>
        {lines.map((l) => (
          <div key={l} className={rowClass}>
            {l}
          </div>
        ))}
      </div>
    </section>
  )
}

export function PersonalSection() {
  const facts = [
    { label: 'Holes in one', value: String(personal.holesInOne) },
    { label: 'Sport', value: personal.sport },
    { label: 'Teams', value: personal.teams.join(', ') },
    { label: 'Current focus', value: personal.currentFocus },
  ]
  return (
    <section
      aria-label="Personal"
      className={cx(
        reveal,
        css({
          bg: 'bg',
          color: 'text',
          paddingBlock: { base: '6', lg: '8' },
          paddingInline: { base: '4', lg: '7', xl: '8' },
        })
      )}
    >
      <dl className={css({ maxWidth: '960px', marginLeft: 'auto', marginBlock: '0' })}>
        {facts.map((f) => (
          <div
            key={f.label}
            className={cx(
              rowClass,
              css({
                display: 'grid',
                gridTemplateColumns: { base: '1fr', md: '160px 1fr' },
                columnGap: '5',
              })
            )}
          >
            <dt
              className={css({
                textStyle: 'xs',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'textFaint',
              })}
            >
              {f.label}
            </dt>
            <dd className={css({ margin: '0', color: 'textMuted' })}>{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
