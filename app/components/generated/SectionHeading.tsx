import { css } from '../../../styled-system/css'

type Props = { label: string; title: string; flush?: boolean }

export function SectionHeading({ label, title, flush }: Props) {
  return (
    <>
      <div
        className={css({
          fontFamily: 'body',
          fontSize: 'xs',
          fontWeight: '500',
          textTransform: 'lowercase',
          letterSpacing: '0.2em',
          color: 'textMuted',
          textAlign: flush ? 'left' : 'center',
          marginBottom: '8px',
        })}
      >
        {label}
      </div>
      <h2
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          fontSize: { base: '24px', md: 'xl' },
          lineHeight: '1.15',
          whiteSpace: 'normal',
          maxWidth: '100%',
          textTransform: 'lowercase',
          letterSpacing: '-0.005em',
          textAlign: flush ? 'left' : 'center',
          color: 'text',
        })}
      >
        {title}
      </h2>
    </>
  )
}
