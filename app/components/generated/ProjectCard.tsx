import { css } from '../../../styled-system/css'

type CardProps = { title: string; type: string; year: number; href: string }

export function ProjectCard({ title, type, year, href }: CardProps) {
  return (
    <div
      className={css({
        bg: 'surface',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'border',
        borderRadius: 'sm',
        paddingBlock: '20px',
        paddingInline: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minHeight: '112px',
      })}
    >
      <a
        href={href}
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: 'clamp(22px, 2.6vw, 28px)',
          lineHeight: '1',
          color: 'text',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
        })}
      >
        {title}
      </a>
      {/* mockup row ink was textFaint; textMuted clears 4.5:1 on surface */}
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '3',
          fontFamily: 'body',
          fontSize: 'xs',
          color: 'textMuted',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'border',
          paddingTop: '10px',
          marginTop: 'auto',
        })}
      >
        <span>{type}</span>
        <span>{year}</span>
      </div>
    </div>
  )
}
