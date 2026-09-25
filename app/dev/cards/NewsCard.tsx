import { css, cx } from '../../../styled-system/css'
import { readNews } from '../../lib/archive-signals'
import type { Signals } from '../api'
import { card, cardHeading, emptyText, listRow, truncate } from '../styles'
import { CardError } from './CardError'

const title = css({ fontSize: '11px', color: 'devPanel.text' })
const source = css({ fontSize: '9px', color: 'devPanel.muted', flexShrink: 0 })

export function NewsCard({ signals }: { signals: Signals }) {
  const news = readNews(signals.news)
  if (!news) return <CardError label="// NEWS" reason="NEWS_API_KEY not set" />

  return (
    <div className={card()}>
      <h3 className={cardHeading}>
        <span>// NEWS</span>
      </h3>
      {news.headlines.map((h, i) => {
        // Wire syndication can hand back the same headline from two
        // sources, so the index rules out a duplicate key.
        const rowKey = h.title + i
        return (
          <div key={rowKey} className={listRow({ align: 'baseline' })}>
            <span className={cx(title, truncate)}>{h.title}</span>
            {h.source && <span className={source}>{h.source}</span>}
          </div>
        )
      })}
      {news.headlines.length === 0 && <div className={emptyText}>No headlines</div>}
    </div>
  )
}
