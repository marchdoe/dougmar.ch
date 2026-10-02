import { css } from '../../../styled-system/css'
import { projects } from '../../content/projects'

const link = css({
  display: 'inline-flex',
  alignItems: 'baseline',
  columnGap: '2',
  minHeight: '44px',
  paddingBlock: '3',
  color: 'text',
  textStyle: 'sm',
  _hover: { color: 'accent' },
})

export function CaseNav({ slug }: { slug: string }) {
  const n = projects.length
  const i = projects.findIndex((p) => p.slug === slug)
  const links = [
    { label: 'Previous', project: projects[(i - 1 + n) % n] },
    { label: 'Next', project: projects[(i + 1) % n] },
  ]
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', columnGap: '6' })}>
      {links.map((item) =>
        item.project ? (
          <a key={item.label} href={`/work/${item.project.slug}`} className={link}>
            <span
              className={css({
                textStyle: 'xs',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'textMuted',
              })}
            >
              {item.label}
            </span>
            <span>{item.project.title}</span>
          </a>
        ) : null
      )}
    </div>
  )
}
