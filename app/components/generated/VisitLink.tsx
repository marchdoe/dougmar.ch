import { css } from '../../../styled-system/css'

export function VisitLink({ url }: { url: string }) {
  const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      className={css({
        color: 'fieldInk',
        fontWeight: 'bold',
        fontSize: '13px',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        paddingBottom: '3px',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'fieldInk',
        _hover: { color: 'fieldInkMuted', borderBottomColor: 'fieldInkMuted' },
      })}
    >
      Visit {host} →
    </a>
  )
}
