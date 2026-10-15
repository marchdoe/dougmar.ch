import { css } from '../../../styled-system/css'

export function CaseHead({ title, type }: { title: string; type: string }) {
  return (
    <div className={css({ paddingBlock: '2', textAlign: 'left', minWidth: '0' })}>
      <h1
        className={css({
          fontFamily: 'display',
          textStyle: { base: 'xl', xl: '2xl' },
          fontWeight: 'light',
          lineHeight: 'tight',
          color: 'text',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) 0ms both',
          animationDelay: '0ms',
        })}
      >
        {title}
      </h1>
      <div
        className={css({
          fontWeight: 'bold',
          fontSize: 'lg',
          letterSpacing: 'wide',
          color: 'accentAlt',
          marginTop: '12px',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) 80ms both',
          animationDelay: '80ms',
        })}
      >
        {type}
      </div>
    </div>
  )
}
