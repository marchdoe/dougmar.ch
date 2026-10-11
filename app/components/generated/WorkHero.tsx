import { css, cx } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { CaseFacts } from './CaseFacts'
import { HeroShell } from './HeroShell'
import { Lab } from './Lab'
import { wipeFirst, wipeSecond } from './motion'

type Project = (typeof projects)[number]

// Marquee steps down from the home size so an eleven-letter title fits the lead column.
// Its flat bg box is padded past the tight leading so no rule line crosses the glyphs.
export function WorkHero({ project }: { project: Project }) {
  return (
    <HeroShell
      tall
      lead={
        <>
          <h1
            className={cx(
              wipeFirst,
              css({
                fontFamily: 'display',
                fontStyle: 'italic',
                fontWeight: 'bold',
                fontSize: 'clamp(44px, 6.5vw, 96px)',
                lineHeight: '0.9',
                letterSpacing: 'tight',
                color: 'accentAlt',
                marginTop: 'clamp(26px, 4vw, 40px)',
                paddingTop: '0.14em',
                paddingBottom: '0.18em',
                paddingInlineEnd: '0.12em',
                bg: 'bg',
                width: 'fit-content',
                maxWidth: '100%',
              })
            )}
          >
            {project.title}
          </h1>
          <div className={cx(wipeSecond, css({ marginTop: '4', bg: 'bg', width: 'fit-content' }))}>
            <Lab>{`${project.type} · ${project.year}`}</Lab>
          </div>
        </>
      }
      aside={<CaseFacts project={project} />}
    />
  )
}
