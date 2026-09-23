import type { CSSProperties } from 'react'
import { css, cx } from '../../../styled-system/css'
import { readHackerNews } from '../../lib/archive-signals'
import type { Signals } from '../api'
import { card, cardHeading, emptyText, listRow, truncate } from '../styles'

const mark = css({ color: 'devPanel.orange', fontWeight: 700, marginRight: '4px' })
// Brighter for high scores, fainter for low: the opacity is the story's own
// figure, so it arrives as a custom property.
const score = css({
  fontSize: '10px',
  fontWeight: 700,
  color: 'devPanel.orange',
  minWidth: '32px',
  textAlign: 'right',
  opacity: 'var(--score-opacity)',
})
const title = css({ fontSize: '11px', color: 'devPanel.text' })

export function HackerNewsCard({ signals }: { signals: Signals }) {
  const stories = readHackerNews(signals.hacker_news)?.stories ?? []

  return (
    <div className={card()}>
      <h3 className={cardHeading}>
        <span>
          <span className={mark}>Y</span>
          HACKER NEWS
        </span>
      </h3>
      {stories.map((story) => {
        const opacity = Math.min(1, 0.7 + ((story.score ?? 0) / 500) * 0.3)
        return (
          <div key={story.title} className={listRow({ align: 'baseline' })}>
            <span className={score} style={{ '--score-opacity': opacity } as CSSProperties}>
              {story.score}
            </span>
            <span className={cx(title, truncate)}>{story.title}</span>
          </div>
        )
      })}
      {stories.length === 0 && <div className={emptyText}>No stories</div>}
    </div>
  )
}
