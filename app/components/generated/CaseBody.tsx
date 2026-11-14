import { css } from '../../../styled-system/css'
import { type Project, field } from './projectFields'
import { RevealSection } from './RevealSection'
import { StackList } from './StackList'

function linksFor(project: Project) {
  return [
    { label: 'Visit the live site ↗', href: field(project, 'liveUrl') },
    { label: 'Source on GitHub ↗', href: field(project, 'githubUrl') },
    { label: 'Visit the project ↗', href: field(project, 'externalUrl') },
  ].filter((l) => l.href !== '')
}

export function CaseBody({ project }: { project: Project }) {
  const blocks = [
    { label: 'Approach', text: field(project, 'approach') },
    { label: 'Outcome', text: field(project, 'outcome') },
    { label: 'Overview', text: field(project, 'description') },
  ].filter((b) => b.text !== '')
  return (
    <RevealSection
      className={css({
        paddingTop: 'clamp(40px, 5vw, 72px)',
        paddingBottom: 'clamp(40px, 5vw, 64px)',
        paddingInline: 'clamp(24px, 6vw, 112px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '40px',
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
          columnGap: '56px',
          rowGap: '40px',
        })}
      >
        {blocks.map((b) => (
          <div
            key={b.label}
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              paddingTop: '20px',
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'borderStrong',
              minWidth: '0',
            })}
          >
            <h2
              className={css({
                fontFamily: 'display',
                fontWeight: 'normal',
                textStyle: 'lg',
                color: 'text',
              })}
            >
              {b.label}
            </h2>
            <p
              className={css({
                textStyle: 'base',
                lineHeight: '1.6',
                color: 'text',
                maxWidth: '50ch',
              })}
            >
              {b.text}
            </p>
          </div>
        ))}
      </div>
      <StackList project={project} />
      <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '32px', rowGap: '8px' })}>
        {linksFor(project).map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              textStyle: 'base',
              fontWeight: 'bold',
              color: 'text',
              textDecoration: 'underline',
              textDecorationColor: 'accentAlt',
              textDecorationThickness: '2px',
              textUnderlineOffset: '4px',
              _hover: { color: 'accentAlt' },
            })}
          >
            {l.label}
          </a>
        ))}
      </div>
    </RevealSection>
  )
}
