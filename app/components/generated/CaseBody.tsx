import type { projects } from '../../content/projects'
import { css } from '../../../styled-system/css'
import { field, list } from './fields'
import { PageSection } from './PageSection'

type Proj = (typeof projects)[number]

export function CaseBody({ project }: { project: Proj }) {
  const facts = [
    { label: 'Timeline', value: field(project, 'timeline') },
    { label: 'Status', value: field(project, 'status') },
    { label: 'Stack', value: list(project, 'stack').join(', ') },
  ].filter((f) => f.value)
  const story = [
    { label: 'overview', text: field(project, 'description') },
    { label: 'problem', text: field(project, 'problem') },
    { label: 'approach', text: field(project, 'approach') },
    { label: 'outcome', text: field(project, 'outcome') },
  ].filter((s) => s.text)
  const links = [
    { label: 'visit the live site ↗', url: field(project, 'liveUrl') },
    { label: 'source on github ↗', url: field(project, 'githubUrl') },
    { label: 'external link ↗', url: field(project, 'externalUrl') },
  ].filter((l, i, arr) => l.url && arr.findIndex((x) => x.url === l.url) === i)
  return (
    <PageSection title="the work">
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', sm: 'repeat(3, 1fr)' },
          gap: '5',
          marginBottom: '6',
        })}
      >
        {facts.map((f) => (
          <div key={f.label}>
            <div
              className={css({
                fontSize: '2xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                color: 'textMuted',
                fontWeight: 'bold',
                marginBottom: '6px',
              })}
            >
              {f.label}
            </div>
            <p className={css({ textStyle: 'base', color: 'text' })}>{f.value}</p>
          </div>
        ))}
      </div>
      {story.map((s) => (
        <div
          key={s.label}
          className={css({
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
            paddingBlock: '5',
          })}
        >
          <h3
            className={css({
              textStyle: 'xl',
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'lowercase',
              color: 'text',
              marginBottom: '3',
            })}
          >
            {s.label}
          </h3>
          <p
            className={css({
              textStyle: 'base',
              lineHeight: 'normal',
              color: 'text',
              maxWidth: '58ch',
            })}
          >
            {s.text}
          </p>
        </div>
      ))}
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', marginTop: '4' })}>
        {links.map((l) => (
          <a
            key={l.url}
            href={l.url}
            className={css({
              display: 'inline-block',
              minHeight: '44px',
              paddingBlock: '10px',
              lineHeight: '24px',
              fontSize: 'sm',
              fontWeight: 'bold',
            })}
          >
            {l.label}
          </a>
        ))}
      </div>
    </PageSection>
  )
}
