import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { ThesisTop } from './ThesisTop'

type Project = (typeof projects)[number] & { timeline?: string; status?: string }

function metaFor(p: Project) {
  const clients = (p.clients ?? []).map((c) => c.name).join(', ')
  return [
    { label: 'Year', value: String(p.year) },
    { label: 'Role', value: p.role ?? '' },
    { label: 'Timeline', value: String(p.timeline ?? '') },
    { label: 'Status', value: String(p.status ?? '') },
    { label: 'Clients', value: clients },
  ].filter((m) => m.value !== '')
}

export function WorkHead({ project }: { project: Project }) {
  return (
    <>
      <div className={css({ bg: 'field', color: 'fieldInk', padding: 'clamp(28px, 6vw, 72px)' })}>
        <ThesisTop />
      </div>
      <section
        className={css({
          bg: 'bgAlt',
          paddingTop: 'clamp(32px, 6vw, 72px)',
          paddingBottom: 'clamp(24px, 4vw, 48px)',
          paddingInline: 'clamp(20px, 5vw, 72px)',
        })}
      >
        <span
          className={css({
            display: 'inline-block',
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            fontSize: '2xs',
            color: 'accentText',
            bg: 'accent',
            borderRadius: 'sm',
            paddingBlock: '4px',
            paddingInline: '9px',
            marginBottom: '16px',
          })}
        >
          {project.type}
        </span>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '24px',
            borderBottomWidth: '2px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'borderStrong',
            paddingBottom: '24px',
          })}
        >
          <h1
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              lineHeight: '0.95',
              letterSpacing: '-0.03em',
              color: 'text',
              fontSize: { base: 'clamp(38px, 9.5vw, 134px)', md: 'clamp(58px, 9vw, 134px)' },
              animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
              animationDelay: '0ms',
            })}
          >
            {project.title}
          </h1>
          <dl
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: '24px',
              rowGap: '12px',
              margin: '0',
            })}
          >
            {metaFor(project).map((m) => (
              <div
                key={m.label}
                className={css({ display: 'flex', flexDirection: 'column', gap: '2px' })}
              >
                <dt
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    fontVariant: 'small-caps',
                    letterSpacing: 'wide',
                    fontSize: '2xs',
                    color: 'textMuted',
                  })}
                >
                  {m.label}
                </dt>
                <dd
                  className={css({
                    margin: '0',
                    fontFamily: 'body',
                    textStyle: 'sm',
                    color: 'text',
                    fontVariantNumeric: 'tabular-nums',
                  })}
                >
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
