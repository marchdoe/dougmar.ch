import { css } from '../../../styled-system/css'

export function LiveLink({ url }: { url?: string }) {
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={css({
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: '44px',
        marginTop: '7',
        paddingBlock: '3',
        textStyle: 'md',
        fontWeight: 'bold',
        letterSpacing: 'wide',
        color: 'text',
        borderBottomWidth: '2px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'accent',
        _hover: { textDecoration: 'none', borderBottomColor: 'text' },
      })}
    >
      Visit the live site
    </a>
  )
}
