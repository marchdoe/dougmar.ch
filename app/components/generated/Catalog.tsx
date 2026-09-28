import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'
import type { projects } from '../../content/projects'

type Project = (typeof projects)[number]

const pad = (n: number) => String(n).padStart(2, '0')

function outbound(p: Project): string {
  return p.externalUrl ?? p.liveUrl ?? `/work/${p.slug}`
}

const label = css({
  fontFamily: 'body',
  fontSize: '2xs',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'textFaint',
  fontWeight: 'bold',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'border',
  paddingBottom: '6px',
  marginBottom: '2px',
})

function WorkRow({ project, num, href }: { project: Project; num: string; href: string }) {
  return (
    <a
      href={href}
      className={css({
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'baseline',
        gap: '10px',
        minHeight: '48px',
        paddingBlock: '2',
        paddingInline: '2px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'border',
        _hover: { borderBottomColor: 'borderStrong' },
      })}
    >
      <span
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          letterSpacing: '0.06em',
          color: 'textFaint',
        })}
      >
        {num}
      </span>
      <span
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'lg',
          fontSize: '22px',
          lineHeight: '1.05',
          textTransform: 'uppercase',
          letterSpacing: '0.01em',
          minWidth: '0',
        })}
      >
        {project.title}
      </span>
      <span
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          color: 'textMuted',
          textAlign: 'right',
          whiteSpace: 'nowrap',
        })}
      >
        {project.type} · {project.year}
      </span>
    </a>
  )
}

export function Catalog() {
  const offset = selectedWork.length
  return (
    <div
      className={css({
        marginTop: '4',
        display: { base: 'block', sm: 'grid', lg: 'block' },
        gridTemplateColumns: { sm: 'repeat(2, 1fr)' },
        columnGap: '32px',
      })}
    >
      <div className={css({ marginBottom: '4', minWidth: '0' })}>
        <div className={label}>Selected work</div>
        {selectedWork.map((p, i) => (
          <WorkRow key={p.slug} project={p} num={pad(i + 1)} href={`/work/${p.slug}`} />
        ))}
      </div>
      <div className={css({ marginBottom: '4', minWidth: '0' })}>
        <div className={label}>Experiments</div>
        {experiments.map((p, i) => (
          <WorkRow key={p.slug} project={p} num={pad(offset + i + 1)} href={outbound(p)} />
        ))}
      </div>
    </div>
  )
}
