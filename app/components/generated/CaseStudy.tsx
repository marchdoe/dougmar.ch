import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseCta } from './CaseCta'
import { SectionHead, revealSection } from './SectionHead'

type P = (typeof projects)[number]

function StackList({ stack }: { stack: string[] }) {
  if (stack.length === 0) return null
  return (
    <div className={css({ paddingTop: '48px' })}>
      <SectionHead>Stack</SectionHead>
      <ul
        className={css({
          listStyle: 'none',
          marginTop: '16px',
          marginBottom: '0',
          padding: '0',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
        })}
      >
        {stack.map((s) => (
          <li
            key={s}
            className={css({
              fontSize: 'sm',
              paddingBlock: '6px',
              paddingInline: '12px',
              bg: 'surface',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'borderStrong',
              borderRadius: 'sm',
            })}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function CaseStudy({ project }: { project: P }) {
  const parts = [
    { label: 'Overview', body: project.description },
    { label: 'Problem', body: project.problem },
    { label: 'Approach', body: project.approach },
    { label: 'Outcome', body: project.outcome },
  ].filter((p) => p.body)
  return (
    <>
      <section
        className={cx(
          css({
            bg: 'bgAlt',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'borderStrong',
            paddingBottom: 'clamp(36px, 6vh, 64px)',
            paddingInline: { base: '6vw', lg: '5vw' },
          }),
          revealSection
        )}
      >
        {parts.map((p) => (
          <div
            key={p.label}
            className={css({
              paddingTop: '48px',
              display: { base: 'block', lg: 'grid' },
              gridTemplateColumns: { lg: 'repeat(12, 1fr)' },
              columnGap: { lg: '2vw' },
              alignItems: { lg: 'start' },
            })}
          >
            <div className={css({ gridColumn: { lg: '1 / 5' }, minWidth: '0' })}>
              <SectionHead>{p.label}</SectionHead>
            </div>
            <p
              className={css({
                gridColumn: { lg: '5 / 12' },
                fontSize: 'base',
                lineHeight: '1.6',
                color: 'text',
                marginTop: { base: '16px', lg: '0' },
                marginBottom: '0',
                maxWidth: '48ch',
              })}
            >
              {p.body}
            </p>
          </div>
        ))}
        <StackList stack={project.stack ?? []} />
      </section>
      <CaseCta project={project} />
    </>
  )
}
