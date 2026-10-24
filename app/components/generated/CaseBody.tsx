import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Kicker } from './Kicker'

type Item = (typeof projects)[number]

const linkCls = css({
  display: 'inline-flex',
  alignItems: 'center',
  minHeight: '44px',
  width: 'fit-content',
  fontWeight: 'bold',
  textStyle: 'sm',
  color: 'text',
  borderBottom: '2px solid',
  borderBottomColor: 'text',
  _hover: { textDecoration: 'none', borderBottomWidth: '4px' },
})

export function CaseBody({ project }: { project: Item }) {
  const story = [
    { label: 'Problem', text: project.problem ?? '' },
    { label: 'Approach', text: project.approach ?? '' },
    { label: 'Outcome', text: project.outcome ?? '' },
  ].filter((s) => s.text !== '')
  const links = [
    { label: 'Visit the live site ↗', href: project.liveUrl ?? '' },
    { label: 'Source on GitHub ↗', href: project.githubUrl ?? '' },
    { label: 'Read more ↗', href: project.externalUrl ?? '' },
  ].filter((l) => l.href !== '')
  return (
    <section
      className={css({
        paddingInline: '5vw',
        paddingBottom: '9',
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
          maxWidth: '760px',
          marginInline: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '7',
        })}
      >
        {story.map((s) => (
          <div key={s.label}>
            <Kicker>{s.label}</Kicker>
            <p className={css({ textStyle: 'lede', color: 'text', maxWidth: '50ch' })}>{s.text}</p>
          </div>
        ))}
        <div>
          <Kicker>Stack</Kicker>
          <ul className={css({ listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '2' })}>
            {(project.stack ?? []).map((tool) => (
              <li
                key={tool}
                className={css({
                  textStyle: 'sm',
                  fontWeight: 'bold',
                  letterSpacing: 'wide',
                  textTransform: 'uppercase',
                  color: 'text',
                  border: '1px solid',
                  borderColor: 'borderStrong',
                  borderRadius: 'sm',
                  paddingBlock: '1',
                  paddingInline: '3',
                })}
              >
                {tool}
              </li>
            ))}
          </ul>
        </div>
        <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '5', rowGap: '2' })}>
          {links.map((l) => (
            <a key={l.label} href={l.href} className={linkCls}>
              {l.label}
            </a>
          ))}
          <a href="/" className={linkCls}>
            Back to the work
          </a>
        </div>
      </div>
    </section>
  )
}
