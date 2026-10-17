import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseExtras } from './CaseExtras'
import { Reveal } from './Reveal'

type Project = (typeof projects)[number]

export function CaseStudy({ project }: { project: Project }) {
  const parts: [string, string | undefined][] = [
    ['Overview', project.description],
    ['Problem', project.problem],
    ['Approach', project.approach],
    ['Outcome', project.outcome],
  ]
  const shown = parts.filter(([, text]) => Boolean(text))
  return (
    <Reveal label={`${project.title} case study`}>
      <div
        className={css({
          bg: 'bg',
          paddingInline: 'clamp(24px, 6vw, 112px)',
          paddingTop: 'clamp(10px, 3vw, 40px)',
          paddingBottom: 'clamp(48px, 6vw, 96px)',
          display: { base: 'block', lg: 'grid' },
          gridTemplateColumns: { lg: 'repeat(12, 1fr)' },
          columnGap: { lg: 'clamp(16px, 2vw, 32px)' },
        })}
      >
        <div className={css({ gridColumn: { lg: '4 / 13' }, minWidth: '0' })}>
          {shown.map(([label, text]) => (
            <div key={label} className={css({ marginTop: '7' })}>
              <h2
                className={css({
                  fontFamily: 'body',
                  fontWeight: 'bold',
                  textStyle: 'xs',
                  letterSpacing: 'widest',
                  textTransform: 'uppercase',
                  color: 'textMuted',
                  marginBottom: '3',
                })}
              >
                {label}
              </h2>
              <p
                className={css({
                  textStyle: 'base',
                  lineHeight: 'normal',
                  color: 'text',
                  maxWidth: '52ch',
                })}
              >
                {text}
              </p>
            </div>
          ))}
          <CaseExtras project={project} />
        </div>
      </div>
    </Reveal>
  )
}
