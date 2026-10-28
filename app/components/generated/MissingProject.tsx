import { css } from '../../../styled-system/css'
import { FogField } from './FogField'

export function MissingProject() {
  return (
    <FogField>
      <div className={css({ paddingTop: 'clamp(48px, 10vh, 120px)' })}>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'light',
            textStyle: '3xl',
            color: 'text',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          No project at this address
        </h1>
        <a
          href="/work"
          className={css({
            display: 'inline-block',
            marginTop: '4',
            fontSize: 'base',
            color: 'text',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderColor: 'accent',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          See all work →
        </a>
      </div>
    </FogField>
  )
}
