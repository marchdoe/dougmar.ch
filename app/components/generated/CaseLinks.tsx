import { css } from '../../../styled-system/css'

type LinkProps = { liveUrl?: string; externalUrl?: string; githubUrl?: string }

export function CaseLinks({ liveUrl, externalUrl, githubUrl }: LinkProps) {
  const links = [
    { k: 'visit the live site', v: liveUrl },
    { k: 'open the project', v: externalUrl },
    { k: 'read the code', v: githubUrl },
  ].filter((l): l is { k: string; v: string } => Boolean(l.v))
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '1',
      })}
    >
      {links.map((l) => (
        <a
          key={l.k}
          href={l.v}
          rel="noreferrer"
          target="_blank"
          className={css({
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: '44px',
            fontSize: 'lede',
            color: 'text',
            textDecoration: 'underline',
            textDecorationColor: 'accent',
            textUnderlineOffset: '4px',
            _hover: { color: 'accent' },
          })}
        >
          {l.k}
        </a>
      ))}
    </div>
  )
}
