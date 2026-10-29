import { css } from '../../../styled-system/css'
import { selectedWork } from '../../content/projects'

export function PeerList({ current }: { current: string }) {
  const peers = selectedWork.filter((p) => p.slug !== current)
  if (peers.length === 0) return null
  return (
    <div className={css({ marginTop: '7' })}>
      <h2
        className={css({
          fontSize: 'xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '3',
        })}
      >
        Selected work
      </h2>
      <ul>
        {peers.map((p) => (
          <li
            key={p.slug}
            className={css({
              borderTopWidth: '1px',
              borderTopStyle: 'solid',
              borderTopColor: 'borderStrong',
            })}
          >
            <a
              href={`/work/${p.slug}`}
              className={css({
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                columnGap: '4',
                rowGap: '1',
                minHeight: '44px',
                paddingBlock: '4',
              })}
            >
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'bold',
                  fontSize: 'md',
                  color: 'text',
                })}
              >
                {p.title}
              </span>
              <span className={css({ fontSize: 'sm', color: 'textMuted' })}>
                {p.type}, {p.year}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
