import { css } from '../../../styled-system/css'

type Entry = { year: string; role: string; company: string; description: string }

export function TimelineSection({ entries }: { entries: Entry[] }) {
  return (
    <section
      className={css({
        position: 'relative',
        bg: 'bg',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div className={kickerClass}>
        <span>the record, ten years of roles</span>
        <span>2006 to present</span>
      </div>
      <div className={css({ borderTop: '1px solid', borderColor: 'borderStrong' })}>
        {entries.map((entry) => (
          <div key={entry.year + entry.company} className={rowClass}>
            <span className={yearClass}>{entry.year.replace(/\s*—\s*/g, ', ')}</span>
            <div className={css({ minWidth: 0 })}>
              <div className={titleClass}>
                {entry.role}, {entry.company}
              </div>
              <p className={descClass}>{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const kickerClass = css({
  display: 'flex',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '2',
  fontWeight: 'bold',
  fontSize: '2xs',
  textTransform: 'uppercase',
  letterSpacing: 'wide',
  color: 'accent',
  paddingTop: { base: '6', md: '8' },
  paddingBottom: '4',
  paddingLeft: { base: '5', md: '6vw' },
  paddingRight: { base: '5', md: '6vw' },
})

const rowClass = css({
  display: 'flex',
  flexDirection: { base: 'column', md: 'row' },
  gap: { base: '2', md: '6' },
  paddingTop: { base: '5', md: '6' },
  paddingBottom: { base: '5', md: '6' },
  paddingLeft: { base: '5', md: '6vw' },
  paddingRight: { base: '5', md: '6vw' },
  borderBottom: '1px solid',
  borderColor: 'border',
})

const yearClass = css({
  fontFamily: 'display',
  color: 'accent',
  fontWeight: 'bold',
  fontSize: 'sm',
  minWidth: { base: 'auto', md: '120px' },
  flexShrink: 0,
})

const titleClass = css({
  fontFamily: 'display',
  textTransform: 'lowercase',
  letterSpacing: 'tight',
  color: 'text',
  fontSize: { base: 'lg', md: 'xl' },
  marginBottom: '2',
  overflowWrap: 'anywhere',
})

const descClass = css({
  fontFamily: 'body',
  color: 'textMuted',
  fontSize: 'base',
  maxWidth: '62ch',
})
