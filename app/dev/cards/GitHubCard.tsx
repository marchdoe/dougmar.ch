import type { CSSProperties } from 'react'
import { css, cx } from '../../../styled-system/css'
import { readGitHub } from '../../lib/archive-signals'
import type { Signals } from '../api'
import { card, cardHeading, emptyText, listRow, truncate } from '../styles'

// GitHub's own language colours. They are data about the repository, not the
// panel's palette, so they reach the dot as a custom property rather than as
// tokens; an unlisted language falls back to devPanel.dim.
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Rust: '#dea584',
  Go: '#00ADD8',
  Java: '#b07219',
  Ruby: '#701516',
  'C++': '#f34b7d',
  C: '#555555',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
}

const languageDot = css({
  width: '7px',
  height: '7px',
  borderRadius: '50%',
  background: 'var(--language-color, {colors.devPanel.dim})',
  flexShrink: 0,
})
const repoName = css({ fontSize: '11px', color: 'devPanel.blue' })
const stars = css({ fontSize: '9px', color: 'devPanel.dim' })

export function GitHubCard({ signals }: { signals: Signals }) {
  const repos = readGitHub(signals.github)?.repos ?? []

  return (
    <div className={card()}>
      <h3 className={cardHeading}>
        <span>// GITHUB TRENDING</span>
      </h3>
      {repos.map((repo) => {
        const color = repo.language ? LANGUAGE_COLORS[repo.language] : undefined
        return (
          <div key={repo.name} className={listRow()}>
            {repo.language && (
              <span
                className={languageDot}
                style={color ? ({ '--language-color': color } as CSSProperties) : undefined}
              />
            )}
            <span className={cx(repoName, truncate)}>{repo.name}</span>
            {repo.stars != null && <span className={stars}>{repo.stars.toLocaleString()}</span>}
          </div>
        )
      })}
      {repos.length === 0 && <div className={emptyText}>No data</div>}
    </div>
  )
}
