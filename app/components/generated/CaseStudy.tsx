import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseMeta } from './CaseMeta'

type CaseProject = (typeof projects)[number] & { timeline?: string; status?: string }

const head = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: '2xl',
  lineHeight: 'tight',
  color: 'text',
  marginTop: '7',
  marginBottom: '4',
})

// accent ink measured under 4.5:1 on surface; link set in text with an accent underline
const linkClass = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'sm',
  color: 'text',
  textDecoration: 'underline',
  textDecorationColor: 'accent',
  textDecorationThickness: '2px',
  textUnderlineOffset: '4px',
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  _hover: { color: 'text', textDecorationColor: 'text' },
})

export function CaseStudy({ project }: { project: CaseProject }) {
  const narrative = [
    { head: 'Summary', body: project.description },
    { head: 'Problem', body: project.problem },
    { head: 'Approach', body: project.approach },
    { head: 'Outcome', body: project.outcome },
  ].filter((part) => Boolean(part.body))
  const links = [
    { label: 'Live site →', url: project.liveUrl },
    { label: 'Source on GitHub →', url: project.githubUrl },
    { label: 'Visit →', url: project.externalUrl },
  ].filter((link) => Boolean(link.url))
  return (
    <section
      className={css({
        bg: 'surface',
        color: 'text',
        borderTop: '2px solid',
        borderTopColor: 'borderStrong',
        paddingBlock: 'clamp(32px, 5vw, 72px)',
        paddingInline: 'clamp(18px, 6vw, 96px)',
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <CaseMeta
        items={[
          { label: 'Year', value: String(project.year) },
          { label: 'Type', value: project.type },
          { label: 'Role', value: project.role },
          { label: 'Timeline', value: project.timeline },
          { label: 'Status', value: project.status },
        ]}
      />
      {narrative.map((part) => (
        <div key={part.head}>
          <h2 className={head}>{part.head}</h2>
          <p
            className={css({
              fontFamily: 'body',
              fontSize: 'base',
              lineHeight: '1.6',
              color: 'text',
              maxWidth: '48ch',
            })}
          >
            {part.body}
          </p>
        </div>
      ))}
      {project.stack?.length ? (
        <div>
          <h2 className={head}>Stack</h2>
          <ul
            className={css({
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2',
              listStyle: 'none',
              margin: '0',
              padding: '0',
            })}
          >
            {project.stack.map((item) => (
              <li
                key={item}
                className={css({
                  border: '1px solid',
                  borderColor: 'border',
                  borderRadius: 'sm',
                  paddingBlock: '6px',
                  paddingInline: '10px',
                  fontFamily: 'body',
                  fontSize: 'sm',
                })}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '5',
          rowGap: '0',
          marginTop: '6',
        })}
      >
        {links.map((link) => (
          <a key={link.label} href={link.url} className={linkClass}>
            {link.label}
          </a>
        ))}
      </div>
    </section>
  )
}
