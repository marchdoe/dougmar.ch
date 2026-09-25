import { css } from '../../styled-system/css'
import { BrandLockup } from './BrandLockup'
import { NavSentence } from './generated/NavSentence'

export function Sidebar() {
  return (
    <div className={css({ position: 'relative', zIndex: '5', bg: 'bg' })}>
      <header
        className={css({
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          paddingInline: { base: '4', lg: '7' },
        })}
      >
        <a
          href="/"
          aria-label="Doug March, home"
          className={css({ color: 'text', display: 'inline-flex', alignItems: 'center' })}
        >
          <BrandLockup variant="horizontal-md" mode="single-color" />
        </a>
      </header>
      {/* On interiors the running sentence sits under the mast; home carries it low in the hero field. */}
      <div
        className={css({
          paddingInline: { base: '4', lg: '7' },
          paddingBottom: '3',
          'body:has([data-home-hero]) &': { display: 'none' },
        })}
      >
        <NavSentence />
      </div>
    </div>
  )
}
