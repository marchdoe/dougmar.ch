import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Ground } from '../Material'
import { HeroBrand } from './HeroBrand'

export function AboutHero() {
  const statement = identity.statement.replace(/\s*\u2014\s*/g, ', ')
  return (
    <header className={css({ position: 'relative', overflow: 'hidden', bg: 'bg' })}>
      <Ground material="rule" seed={625116155} />
      <div
        className={css({
          position: 'relative',
          zIndex: 1,
          paddingInline: { base: '5', md: '7', xl: '8' },
          paddingTop: { base: '4', lg: '6' },
          paddingBottom: { base: '7', lg: '8' },
          display: 'grid',
          gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: '0.9fr 1.1fr' },
          gridTemplateAreas: { base: '"brand" "title"', lg: '"brand title"' },
          rowGap: '6',
          columnGap: { base: '0', lg: '8' },
          minHeight: { base: 'auto', lg: '48vh' },
        })}
      >
        <HeroBrand />
        <h1
          className={css({
            gridArea: 'title',
            position: 'relative',
            zIndex: 1,
            alignSelf: 'end',
            justifySelf: { base: 'start', lg: 'end' },
            textAlign: 'left',
            fontFamily: 'display',
            fontWeight: 'semibold',
            fontSize: { base: 'lg', lg: '28px' },
            lineHeight: '1.3',
            letterSpacing: '-0.01em',
            color: 'text',
            bg: 'bg',
            maxWidth: '44ch',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {statement}
        </h1>
      </div>
    </header>
  )
}
