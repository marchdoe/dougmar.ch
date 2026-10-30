import { css } from '../../../styled-system/css'
import { featuredProject } from '../../content/projects'
import { ArtifactLabel } from './ArtifactLabel'
import { HeroBand } from './HeroBand'

const name = css({
  textDecoration: 'underline',
  textDecorationThickness: '0.055em',
  textUnderlineOffset: '0.1em',
})

export function HomeHero() {
  const title = featuredProject?.title ?? 'Spaceman'
  const right = [featuredProject?.role, featuredProject?.year].filter(Boolean).join(' · ')
  return (
    <>
      <ArtifactLabel left={`Featured Work · ${title}`} right={right} />
      <HeroBand>
        {/* stepped down so the whole word fits its band: 922px inner box at 1440, 624px at 1024, 614px at 768 */}
        <h2
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: {
              base: 'clamp(30px, 9vw, 40px)',
              md: 'min(10vw, 84px)',
              lg: 'min(7.6vw, 112px)',
            },
            lineHeight: { base: '0.96', lg: '0.92' },
            letterSpacing: { base: '0.01em', lg: '0.005em' },
            textTransform: 'uppercase',
            color: 'fieldInk',
            textWrap: 'nowrap',
          })}
        >
          {title}
        </h2>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontVariant: 'small-caps',
            fontSize: 'clamp(22px, 5.4vw, 40px)',
            lineHeight: '1.14',
            letterSpacing: 'wide',
            textAlign: 'justify',
            textAlignLast: 'left',
            textWrap: 'wrap',
            color: 'fieldInk',
            marginTop: { base: '18px', lg: '28px' },
            maxWidth: { base: '22ch', md: '24ch', lg: '26ch' },
          })}
        >
          <span className={name}>Zeldman</span> and <span className={name}>Rolex</span> hired one
          person for both.
        </h1>
      </HeroBand>
    </>
  )
}
