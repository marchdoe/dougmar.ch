import { css } from '../../../styled-system/css'

type HeaderProject = {
  title: string
  type: string
  year: number
  role?: string
  timeline?: string
  status?: string
}

export function CaseHeader({ project }: { project: HeaderProject }) {
  const meta = [
    { k: 'type', v: project.type },
    { k: 'year', v: String(project.year) },
    { k: 'role', v: project.role },
    { k: 'timeline', v: project.timeline },
    { k: 'status', v: project.status },
  ].filter((m) => Boolean(m.v))
  return (
    <section
      className={css({
        bg: 'bg',
        paddingTop: '7',
        paddingBottom: '6',
        paddingInline: '6vw',
        /* list links in the case body that follows get a full thumb-height tap target */
        '& ~ * li a[href]': {
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
        },
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: '1fr auto' },
          alignItems: 'end',
          gap: '5',
          maxWidth: '1200px',
          marginInline: 'auto',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontSize: { base: '3xl', lg: '5xl' },
            lineHeight: 'snug',
            fontWeight: 'normal',
            textTransform: 'lowercase',
            color: 'text',
            minWidth: '0',
          })}
        >
          {project.title}
        </h1>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '1',
            fontSize: 'md',
            color: 'textMuted',
            textAlign: { base: 'left', lg: 'right' },
          })}
        >
          {meta.map((m) => (
            <span key={m.k}>{m.v}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
