import { css } from '../../../styled-system/css'

export function Rings() {
  return (
    <>
      <div
        aria-hidden="true"
        data-allow-x-overflow
        className={css({
          display: { base: 'none', lg: 'block' },
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '560px',
          height: '560px',
          borderRadius: 'full',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
          pointerEvents: 'none',
          zIndex: 1,
        })}
      />
      <div
        aria-hidden="true"
        data-allow-x-overflow
        className={css({
          display: { base: 'none', lg: 'block' },
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '860px',
          height: '860px',
          borderRadius: 'full',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderStrong',
          opacity: 0.5,
          pointerEvents: 'none',
          zIndex: 1,
        })}
      />
      <div
        aria-hidden="true"
        data-allow-x-overflow
        className={css({
          display: { base: 'none', xl: 'block' },
          position: 'absolute',
          top: '46%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1180px',
          height: '1180px',
          borderRadius: 'full',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
          opacity: 0.7,
          pointerEvents: 'none',
          zIndex: 1,
        })}
      />
    </>
  )
}
