import { css, cx } from '../../../styled-system/css'
import { ExtLink } from './ExtLink'
import { reveal } from './reveal'

type CaseProject = {
  description?: string
  problem?: string
  approach?: string
  outcome?: string
  stack?: string[]
  liveUrl?: string
  externalUrl?: string
  githubUrl?: string
}

type Beat = { label: string; text?: string }

function Narrative({ beats }: { beats: Beat[] }) {
  return (
    <>
      {beats.map((b) =>
        b.text ? (
          <div key={b.label} className={css({ paddingTop: '6' })}>
            <div
              className={css({
                textStyle: '2xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'textFaint',
                marginBottom: '3',
              })}
            >
              {b.label}
            </div>
            <p className={css({ textStyle: 'base', color: 'text', maxWidth: '48ch' })}>{b.text}</p>
          </div>
        ) : null
      )}
    </>
  )
}

function Stack({ items }: { items: string[] }) {
  if (items.length === 0) return null
  return (
    <div className={css({ paddingTop: '6' })}>
      <div
        className={css({
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '3',
        })}
      >
        Stack
      </div>
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '4', rowGap: '2' })}>
        {items.map((s) => (
          <span key={s} className={css({ textStyle: 'sm', color: 'textMuted' })}>
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export function CaseStudy({ project }: { project: CaseProject }) {
  const beats = [
    { label: 'Overview', text: project.description },
    { label: 'Problem', text: project.problem },
    { label: 'Approach', text: project.approach },
    { label: 'Outcome', text: project.outcome },
  ]
  return (
    <section
      aria-label="Case study"
      className={cx(
        reveal,
        css({
          bg: 'bg',
          color: 'text',
          paddingBottom: { base: '6', lg: '8' },
          paddingInline: { base: '4', lg: '7', xl: '8' },
        })
      )}
    >
      <div className={css({ maxWidth: '720px', marginLeft: 'auto' })}>
        <Narrative beats={beats} />
        <Stack items={project.stack ?? []} />
        <div
          className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', paddingTop: '5' })}
        >
          <ExtLink href={project.liveUrl ?? project.externalUrl} label="Visit the live site" />
          <ExtLink href={project.githubUrl} label="Source on GitHub" />
        </div>
      </div>
    </section>
  )
}
