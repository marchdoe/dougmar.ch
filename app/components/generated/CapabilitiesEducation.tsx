import { css } from '../../../styled-system/css'

type Education = { school: string; degree: string; concentration: string; years: string }

export function CapabilitiesEducation({
  capabilities,
  education,
}: {
  capabilities: string[]
  education: Education
}) {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        paddingInline: '6vw',
        paddingBlock: '8',
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
        md: { display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '8' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'lg',
            color: 'text',
            marginBottom: '4',
          })}
        >
          Capabilities
        </h2>
        <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
          {capabilities.map((cap) => (
            <span
              key={cap}
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                letterSpacing: 'wide',
                textTransform: 'uppercase',
                color: 'text',
                bg: 'surface',
                border: '1px solid',
                borderColor: 'border',
                borderRadius: 'sm',
                paddingInline: '3',
                paddingBlock: '2',
              })}
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'lg',
            color: 'text',
            marginBottom: '4',
          })}
        >
          Education
        </h2>
        <div className={css({ borderTop: '1px solid', borderColor: 'border', paddingTop: '3' })}>
          <p
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: 'base',
              color: 'text',
            })}
          >
            {education.school}
          </p>
          <p className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '1' })}>
            {education.degree}, {education.concentration}
          </p>
          {education.years && (
            <p className={css({ fontSize: 'sm', color: 'textFaint', marginTop: '1' })}>
              {education.years}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
