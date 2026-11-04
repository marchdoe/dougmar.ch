import { css } from '../../../styled-system/css'

type MetaCell = { k: string; v: string | number | undefined }
type MetaLink = { k: string; href: string | undefined }

const keyClass = css({
  fontFamily: 'display',
  textStyle: '2xs',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'fieldInkMuted',
})

const valueClass = css({ fontFamily: 'body', fontSize: '15px', color: 'fieldInk' })

const cellClass = css({ display: 'flex', flexDirection: 'column', gap: '3px' })

function hostOf(href: string) {
  return href.replace(/^https?:\/\//, '').split('/')[0]
}

export function BoardMeta({ cells, links }: { cells: MetaCell[]; links: MetaLink[] }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: {
          base: 'repeat(2, minmax(0, 1fr))',
          md: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(auto, 1fr))',
        },
        rowGap: '14px',
        columnGap: '24px',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'fieldBorder',
        paddingTop: '20px',
        marginBottom: '26px',
        animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
        animationDelay: '240ms',
      })}
    >
      {cells
        .filter((cell) => cell.v)
        .map((cell) => (
          <div key={cell.k} className={cellClass}>
            <span className={keyClass}>{cell.k}</span>
            <span className={valueClass}>{cell.v}</span>
          </div>
        ))}
      {links.flatMap((link) =>
        link.href
          ? [
              <div key={link.k} className={cellClass}>
                <span className={keyClass}>{link.k}</span>
                <span className={valueClass}>
                  <a
                    href={link.href}
                    className={css({
                      color: 'accentAlt',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      _hover: { color: 'fieldInk' },
                    })}
                  >
                    {`${hostOf(link.href)} ↗`}
                  </a>
                </span>
              </div>,
            ]
          : []
      )}
    </div>
  )
}
