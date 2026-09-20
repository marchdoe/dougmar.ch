import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { css, cx } from '../../../styled-system/css'
import { badge, mutedText, errorText, archiveLink, ratingNotes, archiveRow } from './styles'
import { loadArchiveIndex } from '../../lib/archive-data'

import type { ArchiveIndexEntry } from '../../types/archive-record'

type State =
  | { kind: 'loading' }
  | { kind: 'loaded'; entries: ArchiveIndexEntry[] }
  | { kind: 'error'; message: string }

export function ArchiveTab() {
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    loadArchiveIndex()
      .then((entries) => setState({ kind: 'loaded', entries }))
      .catch((err: unknown) => {
        setState({
          kind: 'error',
          message: err instanceof Error ? err.message : 'Failed to load archive',
        })
      })
  }, [])

  if (state.kind === 'loading') return <p className={mutedText}>Loading…</p>
  if (state.kind === 'error')
    return (
      <p role="alert" className={errorText}>
        {state.message}
      </p>
    )

  const entries = state.entries
  if (entries.length === 0) return <p className={mutedText}>No archive entries yet.</p>

  return (
    <ul className={css({ listStyle: 'none', padding: '0', margin: '0' })}>
      {entries.map((e) => (
        <li key={e.date} className={archiveRow}>
          <div className={css({ display: 'flex', gap: '8px', alignItems: 'center' })}>
            <Link to="/how/$date" params={{ date: e.date }} className={archiveLink}>
              {e.date}
            </Link>
            <span className={badge({ kind: e.rating ? 'graded' : 'none' })}>
              {e.rating?.grade ?? '—'}
            </span>
            <span className={mutedText}>{e.legacyArchetype ?? e.chassis}</span>
          </div>
          <p className={cx(mutedText, css({ marginTop: '3px' }))}>{e.brief}</p>
          {e.rating && (e.rating.worked || e.rating.didnt || e.rating.try) && (
            <p className={ratingNotes}>
              {e.rating.worked && <>✓ {e.rating.worked} </>}
              {e.rating.didnt && <>✗ {e.rating.didnt} </>}
              {e.rating.try && <>→ {e.rating.try}</>}
            </p>
          )}
        </li>
      ))}
    </ul>
  )
}
