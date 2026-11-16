import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]
type Extra = Project & { timeline?: string; status?: string }

export function WorkHero({ project }: { project: Project }) {
  const p = project as Extra
  const facts = [
    { k: 'Role', v: p.role ?? '' },
    { k: 'Timeline', v: p.timeline ?? '' },
    { k: 'Status', v: p.status ?? '' },
  ].filter((fact) => fact.v !== '')
  return (
    <section
      data-split=""
      className={css({
        gridArea: 'hero',
        minWidth: '0',
        bg: 'bg',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: { base: '48px', lg: '96px' },
        paddingBottom: { base: '48px', lg: '64px' },
        paddingInline: { base: '24px', lg: '6vw' },
        minHeight: { lg: '420px' },
      })}
    >
      <div
        className={css({
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: 'textMuted',
          marginBottom: { base: '28px', lg: '40px' },
        })}
      >
        {project.type} · {project.year}
      </div>
      {/* Sized to the hero column at each width: the longest titles
          ("Twittertale", "dougmar.ch") run about 9.1x the font size in the
          display face, so each step keeps them inside their column. */}
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: { base: '30px', sm: '44px', md: '68px', lg: '54px', xl: '76px' },
          lineHeight: '0.95',
          color: 'text',
          maxWidth: '100%',
        })}
      >
        {project.title}
      </h1>
      <div
        className={css({
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: '6',
          rowGap: '3',
          marginTop: { base: '6', lg: '7' },
        })}
      >
        {facts.map((fact) => (
          <div key={fact.k}>
            <div
              className={css({
                textStyle: '2xs',
                letterSpacing: 'widest',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: 'textFaint',
              })}
            >
              {fact.k}
            </div>
            <div
              className={css({
                marginTop: '1',
                textStyle: 'sm',
                fontWeight: 'bold',
                color: 'text',
              })}
            >
              {fact.v}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
