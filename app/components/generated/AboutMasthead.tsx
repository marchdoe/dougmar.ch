import { css } from '../../../styled-system/css'
import { identity, personal } from '../../content/about'
import { FloodHero } from './FloodHero'
import { HeroChip } from './HeroChip'

export function AboutMasthead() {
  return (
    <FloodHero labelledBy="about-hed">
      <HeroChip>On file · {identity.name}</HeroChip>
      <div
        className={css({
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          columnGap: '4',
          fontFamily: 'display',
          fontWeight: 'bold',
          color: 'fieldInk',
          marginBlock: '14px',
        })}
      >
        <span
          className={css({
            fontSize: { base: '72px', lg: '158px' },
            lineHeight: '0.86',
            letterSpacing: 'tight',
          })}
        >
          {personal.holesInOne}
        </span>
        <span
          className={css({
            fontSize: { base: '24px', lg: '40px' },
            fontVariant: 'small-caps',
            letterSpacing: 'wide',
            textAlign: 'right',
          })}
        >
          Holes in one
        </span>
      </div>
      <h1
        id="about-hed"
        className={css({
          fontFamily: 'display',
          fontWeight: 'normal',
          color: 'fieldInk',
          fontSize: { base: '17px', lg: '20px' },
          lineHeight: 'normal',
          maxWidth: '62ch',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        {identity.statement}
      </h1>
    </FloodHero>
  )
}
