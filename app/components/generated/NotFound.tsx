import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { Column } from './Column'

export function NotFound() {
  return (
    <Column>
      <div className={css({ color: 'text', marginBottom: '6', lg: { display: 'none' } })}>
        <BrandLockup variant="stacked-md" mode="single-color" />
      </div>
      <h1
        className={css({
          textStyle: '4xl',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'text',
        })}
      >
        Project not found
      </h1>
      <a
        href="/work"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          minHeight: '44px',
          marginTop: '4',
          fontWeight: 'bold',
          color: 'accent',
        })}
      >
        Back to the work index
      </a>
    </Column>
  )
}
