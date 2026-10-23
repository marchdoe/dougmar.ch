import { css } from '../../../styled-system/css'

const linkClass = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: '44px',
  fontSize: '15px',
  fontWeight: 'bold',
  color: 'accent',
  borderBottomWidth: '2px',
  borderBottomStyle: 'solid',
  borderBottomColor: 'accent',
})

export function CaseLinks({ liveUrl, githubUrl }: { liveUrl?: string; githubUrl?: string }) {
  return (
    <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '20px' })}>
      {liveUrl && (
        <a href={liveUrl} className={linkClass}>
          visit the live project <span aria-hidden="true">→</span>
        </a>
      )}
      {githubUrl && (
        <a href={githubUrl} className={linkClass}>
          source on github <span aria-hidden="true">→</span>
        </a>
      )}
    </div>
  )
}
