import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { SectionLabel } from './SectionLabel'
import { SignalRow, SignalStack } from './SignalStack'

type Project = (typeof projects)[number]

function textOf(project: Project, key: string): string {
  const record: Record<string, unknown> = { ...project }
  const value = record[key]
  return typeof value === 'string' ? value : ''
}

function Narrative({ label, text }: { label: string; text?: string }) {
  if (!text) return null
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', gap: '3' })}>
      <SectionLabel>{label}</SectionLabel>
      <p
        className={css({
          fontFamily: 'body',
          textStyle: 'base',
          color: 'textMuted',
          maxWidth: '50ch',
        })}
      >
        {text}
      </p>
    </div>
  )
}

function StackTags({ stack }: { stack?: string[] }) {
  if (!stack || stack.length === 0) return null
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '2' })}>
      {stack.map((item) => (
        <span
          key={item}
          className={css({
            fontFamily: 'body',
            textStyle: 'xs',
            fontWeight: 'bold',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
            paddingBlock: '2',
            paddingInline: '3',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            borderRadius: 'sm',
          })}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function LiveLink({ href }: { href?: string }) {
  if (!href) return null
  return (
    <a
      href={href}
      className={css({
        alignSelf: 'flex-start',
        fontFamily: 'body',
        textStyle: 'base',
        fontWeight: 'bold',
        color: 'accentAlt',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderColor: 'accent',
        paddingBottom: '1',
      })}
    >
      Open the live project →
    </a>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  const meta = [
    { label: 'Year', value: String(project.year) },
    { label: 'Type', value: project.type },
    { label: 'Role', value: project.role ?? '' },
    { label: 'Timeline', value: textOf(project, 'timeline') },
    { label: 'Status', value: textOf(project, 'status') },
  ].filter((row) => row.value !== '')
  return (
    <section
      aria-label="Case study"
      className={css({
        bg: 'bg',
        paddingInline: '7vw',
        paddingBlock: '7',
        display: 'flex',
        justifyContent: 'center',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          width: '100%',
          maxWidth: '1040px',
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '7',
          lg: { gridTemplateColumns: '1fr 300px' },
        })}
      >
        <div className={css({ display: 'flex', flexDirection: 'column', gap: '6', minWidth: '0' })}>
          {project.problem ? (
            <p
              className={css({
                fontFamily: 'body',
                textStyle: 'lede',
                color: 'text',
                maxWidth: '46ch',
              })}
            >
              {project.problem}
            </p>
          ) : null}
          <Narrative label="Approach" text={project.approach} />
          <Narrative label="Outcome" text={project.outcome} />
          <StackTags stack={project.stack} />
          <LiveLink href={project.liveUrl ?? project.externalUrl} />
        </div>
        <div className={css({ minWidth: '0', lg: { gridColumn: '2', gridRow: '1' } })}>
          <SignalStack head="Project" label="Project details">
            {meta.map((row) => (
              <SignalRow key={row.label} label={row.label}>
                {row.value}
              </SignalRow>
            ))}
          </SignalStack>
        </div>
      </div>
    </section>
  )
}
