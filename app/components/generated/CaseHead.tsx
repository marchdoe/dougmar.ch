import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number] & { timeline?: string; status?: string }

export function CaseHead({ project }: { project: Project }) {
  const meta = [
    { label: 'Year', value: String(project.year) },
    { label: 'Type', value: project.type },
    { label: 'Role', value: project.role },
    { label: 'Timeline', value: project.timeline },
    { label: 'Status', value: project.status },
  ].filter((item) => Boolean(item.value))
  return (
    <section
      data-beside-margin=""
      className={css({
        gridColumn: { md: '1 / 9', lg: '1 / 10' },
        gridRow: { md: '1' },
        minWidth: '0',
        bg: 'bg',
        color: 'text',
        paddingTop: 'clamp(24px, 4.5vw, 56px)',
        paddingBottom: 'clamp(22px, 4vw, 48px)',
        paddingInline: '5vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        gap: 'clamp(16px, 2.4vw, 32px)',
        minHeight: { md: 'clamp(260px, 34vh, 360px)' },
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderColor: 'borderStrong',
      })}
    >
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: 'clamp(52px, 15vw, 88px)', md: 'clamp(88px, 11vw, 150px)' },
          lineHeight: { base: '0.9', md: '0.84' },
          color: 'accent',
          textAlign: { base: 'left', md: 'right' },
          animationName: 'rise',
          animationDuration: '500ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
          animationDelay: '0ms',
        })}
      >
        {project.title}
      </h1>
      <dl
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: { base: 'flex-start', md: 'flex-end' },
          columnGap: 'clamp(18px, 3vw, 40px)',
          rowGap: '12px',
          margin: '0',
          animationName: 'rise',
          animationDuration: '500ms',
          animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
          animationFillMode: 'both',
          animationDelay: '80ms',
        })}
      >
        {meta.map((item) => (
          <div
            key={item.label}
            className={css({ display: 'flex', flexDirection: 'column', gap: '2px' })}
          >
            <dt
              className={css({
                fontSize: '13px',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'textFaint',
              })}
            >
              {item.label}
            </dt>
            <dd className={css({ margin: '0', textStyle: 'md', color: 'text' })}>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
