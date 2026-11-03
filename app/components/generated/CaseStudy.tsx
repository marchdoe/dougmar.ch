import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Reveal } from './Reveal'
import { VisitLink } from './VisitLink'

type Project = (typeof projects)[number]

function Narrative({ project }: { project: Project }) {
  const blocks = [
    { label: 'Summary', body: project.description },
    { label: 'Problem', body: project.problem },
    { label: 'Approach', body: project.approach },
    { label: 'Outcome', body: project.outcome },
  ].filter((block) => block.body)
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gridColumn: { lg: '6 / 13' },
        gridRow: { lg: '1' },
      })}
    >
      {blocks.map((block) => (
        <div
          key={block.label}
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingBlock: '24px',
            borderTopWidth: '1px',
            borderTopStyle: 'solid',
            borderTopColor: 'border',
          })}
        >
          <span
            className={css({
              textStyle: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: 'accentAlt',
            })}
          >
            {block.label}
          </span>
          <p className={css({ textStyle: 'base', color: 'text', maxWidth: '50ch' })}>
            {block.body}
          </p>
        </div>
      ))}
    </div>
  )
}

function Aside({ project }: { project: Project }) {
  const groups = [
    { label: 'Stack', items: project.stack ?? [] },
    { label: 'Clients', items: (project.clients ?? []).map((client) => client.name) },
  ].filter((group) => group.items.length > 0)
  const url = project.liveUrl ?? project.externalUrl
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        gap: '28px',
        gridColumn: { lg: '1 / 5' },
        gridRow: { lg: '1' },
      })}
    >
      {url && (
        <div
          className={css({
            bg: { base: 'accent', _dark: 'field' },
            display: 'flex',
            justifyContent: 'flex-end',
            paddingBlock: '32px',
            paddingInline: '24px',
          })}
        >
          <VisitLink url={url} />
        </div>
      )}
      {groups.map((group) => (
        <div key={group.label}>
          <div
            className={css({
              textStyle: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              color: 'accentAlt',
              marginBottom: '10px',
            })}
          >
            {group.label}
          </div>
          <ul
            className={css({
              listStyle: 'none',
              margin: '0',
              padding: '0',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            })}
          >
            {group.items.map((item) => (
              <li key={item} className={css({ fontSize: 'sm', fontWeight: '600', color: 'text' })}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function CaseStudy({ project }: { project: Project }) {
  return (
    <Reveal>
      <section
        className={css({
          display: { base: 'flex', lg: 'grid' },
          flexDirection: 'column',
          gridTemplateColumns: { lg: 'repeat(12, minmax(0, 1fr))' },
          columnGap: { lg: '24px' },
          rowGap: '36px',
          alignItems: { lg: 'start' },
          paddingTop: { base: '32px', md: '48px', lg: '64px' },
          paddingBottom: { base: '44px', md: '60px', lg: '72px' },
          paddingLeft: { base: '20px', md: '48px', lg: '40px' },
          paddingRight: { base: '20px', md: '48px', lg: '5vw' },
        })}
      >
        <Narrative project={project} />
        <Aside project={project} />
      </section>
    </Reveal>
  )
}
