import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { TopLockup } from './TopLockup'

type CaseProject = (typeof projects)[number] & { timeline?: string; status?: string }

function metaItems(p: CaseProject) {
  return [
    { label: 'Year', value: String(p.year) },
    { label: 'Type', value: p.type },
    { label: 'Role', value: p.role ?? '' },
    { label: 'Timeline', value: p.timeline ?? '' },
    { label: 'Status', value: p.status ?? '' },
  ].filter((m) => m.value !== '')
}

export function WorkHero({ project }: { project: CaseProject }) {
  return (
    <section
      className={css({
        bg: 'bgAlt',
        color: 'text',
        display: { base: 'flex', lg: 'grid' },
        flexDirection: 'column',
        gridTemplateColumns: { lg: '1.4fr 0.6fr' },
        gridTemplateRows: { lg: 'auto 1fr' },
        columnGap: { lg: '4vw' },
        rowGap: { base: '28px', lg: '24px' },
        paddingTop: { base: '28px', lg: '40px' },
        paddingInline: '6vw',
        paddingBottom: { base: '40px', lg: '56px' },
      })}
    >
      <TopLockup />
      <div
        className={css({
          gridColumn: { lg: '1' },
          gridRow: { lg: '1 / span 2' },
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          minWidth: '0',
        })}
      >
        <a
          href="/work"
          className={css({
            fontSize: 'xs',
            textTransform: 'uppercase',
            letterSpacing: '.14em',
            minHeight: '44px',
            display: 'inline-flex',
            alignItems: 'center',
          })}
        >
          ← All work
        </a>
        {/* At 360 the hero step outruns the 317px column for one-word titles; a fixed size fits it. */}
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: '40px', md: 'hero' },
            lineHeight: '0.88',
            letterSpacing: 'tight',
            color: 'text',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
      </div>
      <dl
        className={css({
          gridColumn: { lg: '2' },
          gridRow: { lg: '2' },
          alignSelf: { lg: 'end' },
          margin: '0',
          display: 'flex',
          flexDirection: 'column',
        })}
      >
        {metaItems(project).map((m) => (
          <div
            key={m.label}
            className={css({
              display: 'grid',
              gridTemplateColumns: '96px 1fr',
              columnGap: '12px',
              alignItems: 'baseline',
              paddingBlock: '10px',
              borderBottomWidth: '1px',
              borderBottomStyle: 'solid',
              borderBottomColor: 'border',
            })}
          >
            <dt
              className={css({
                fontSize: 'xs',
                textTransform: 'uppercase',
                letterSpacing: '.1em',
                color: 'textMuted',
              })}
            >
              {m.label}
            </dt>
            <dd className={css({ margin: '0', textStyle: 'sm', color: 'text', minWidth: '0' })}>
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
