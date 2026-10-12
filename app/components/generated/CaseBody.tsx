import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

function CaseStack({ stack }: { stack?: string[] }) {
  if (!stack || stack.length === 0) return null
  return (
    <ul
      className={css({
        listStyle: 'none',
        padding: '0',
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '4',
        rowGap: '2',
      })}
    >
      {stack.map((s) => (
        <li
          key={s}
          className={css({
            fontSize: 'sm',
            fontWeight: 'bold',
            fontVariantCaps: 'all-small-caps',
            letterSpacing: 'wide',
            color: 'text',
          })}
        >
          {s}
        </li>
      ))}
    </ul>
  )
}

function CaseLink({ href, title }: { href?: string; title: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      className={css({
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: '44px',
        fontWeight: 'bold',
        color: 'accent',
        textDecorationLine: 'underline',
        textDecorationColor: 'accentAlt',
        textUnderlineOffset: '3px',
        textDecorationThickness: '2px',
        _hover: { color: 'field' },
      })}
    >
      Visit {title} →
    </a>
  )
}

export function CaseBody({ project }: { project: Project }) {
  const parts: [string, string][] = [
    ['Overview', project.description ?? ''],
    ['Problem', project.problem ?? ''],
    ['Approach', project.approach ?? ''],
    ['Outcome', project.outcome ?? ''],
  ]
  return (
    <section
      className={css({
        marginTop: { base: '34px', md: '40px' },
        marginBottom: '48px',
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
      })}
    >
      {parts
        .filter(([, v]) => v !== '')
        .map(([k, v]) => (
          <div
            key={k}
            className={css({
              display: { base: 'block', md: 'grid' },
              gridTemplateColumns: { md: 'minmax(0, 1fr) minmax(0, 2fr)' },
              columnGap: { md: '24px' },
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'border',
              paddingBlock: '5',
            })}
          >
            <h2
              className={css({
                fontFamily: 'display',
                fontWeight: 'normal',
                fontVariant: 'small-caps',
                textStyle: 'xl',
                color: 'text',
              })}
            >
              {k}
            </h2>
            <p
              className={css({
                marginTop: { base: '8px', md: '0' },
                maxWidth: '50ch',
                fontSize: 'base',
                lineHeight: '1.5',
                color: 'textMuted',
              })}
            >
              {v}
            </p>
          </div>
        ))}
      <div
        className={css({
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          paddingTop: '5',
          display: 'flex',
          flexDirection: 'column',
          gap: '3',
        })}
      >
        <CaseStack stack={project.stack} />
        <CaseLink href={project.liveUrl ?? project.externalUrl} title={project.title} />
      </div>
    </section>
  )
}
