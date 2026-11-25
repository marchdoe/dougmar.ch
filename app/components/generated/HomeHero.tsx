import { css } from '../../../styled-system/css'
import { FloodHero } from './FloodHero'
import { HeroChip } from './HeroChip'

export function HomeHero() {
  return (
    <FloodHero labelledBy="hed" tall>
      <HeroChip>dougmar.ch · November 25, 2026 · Detroit Edition</HeroChip>
      <div
        aria-hidden="true"
        className={css({
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          fontFamily: 'display',
          fontWeight: 'bold',
          color: 'fieldInk',
          fontSize: { base: '72px', lg: '158px' },
          lineHeight: '0.86',
          letterSpacing: 'tight',
          marginBlock: '14px',
        })}
      >
        <span>104</span>
        <span className={css({ opacity: 0.72, fontWeight: 'normal', paddingInline: '0.08em' })}>
          {'\u2013'}
        </span>
        <span>86</span>
      </div>
      <h1
        id="hed"
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          color: 'fieldInk',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          lineHeight: '1.03',
          fontSize: { base: '30px', lg: '56px' },
          maxWidth: { base: '18ch', lg: '20ch' },
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        The Pistons held them to 86.
      </h1>
    </FloodHero>
  )
}
