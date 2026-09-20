import { css } from '../../../styled-system/css'
import { formatDate } from '../../lib/archive-explainer'
import { back } from './styles'

const notFound = css({
  minHeight: '100vh',
  background: 'archive.bg',
  color: 'archive.text',
  fontFamily: 'archive.mono',
  fontSize: 'archive.body',
  padding: '96px 24px',
  textAlign: 'center',
})

export function HowMissing({ date }: { date: string }) {
  return (
    <div className={notFound}>
      <p>Nothing archived for {date}.</p>
      <p>
        <a href="/archive" className={back}>
          ← The archive
        </a>
      </p>
    </div>
  )
}

export function HowLoading({ date }: { date: string }) {
  return (
    <div className={notFound}>
      <p>Loading {formatDate(date)}…</p>
    </div>
  )
}
