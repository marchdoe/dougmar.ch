import { css } from '../../../styled-system/css'
import { capabilities } from '../../content/timeline'
import { SectionLabel } from './SectionLabel'

export function Capabilities() {
  return (
    <section
      className={css({
        marginTop: '64px',
        bg: 'surface',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        borderRadius: 'md',
        paddingBlock: '40px',
        paddingInline: '28px',
        md: { paddingBlock: '56px', paddingInline: '48px' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <SectionLabel title="Capabilities" note={`${capabilities.length} disciplines`} />
      <ul
        className={css({
          listStyle: 'none',
          margin: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2',
        })}
      >
        {capabilities.map((c) => (
          <li
            key={c}
            className={css({
              paddingBlock: '1',
              paddingInline: '3',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'accent',
              borderRadius: 'sm',
              color: 'accent',
              fontFamily: 'display',
              fontWeight: 'bold',
              fontVariant: 'small-caps',
              letterSpacing: 'wide',
              fontSize: 'sm',
            })}
          >
            {c}
          </li>
        ))}
      </ul>
    </section>
  )
}
