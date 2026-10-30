import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { ArtifactLabel } from './ArtifactLabel'
import { HeroBand } from './HeroBand'

export function AboutStatement() {
  return (
    <>
      <ArtifactLabel left="Biography Specimen" right={identity.role} />
      <HeroBand>
        <span
          className={css({
            display: 'block',
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: '30px', md: '56px', lg: '72px' },
            lineHeight: '0.96',
            textTransform: 'uppercase',
            color: 'fieldInk',
            marginBottom: { base: '16px', lg: '24px' },
          })}
        >
          {identity.name}
        </span>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: { base: '20px', md: '26px', lg: '32px' },
            lineHeight: '1.2',
            color: 'fieldInk',
            maxWidth: '34ch',
            textWrap: 'pretty',
          })}
        >
          {identity.statement}
        </h1>
      </HeroBand>
    </>
  )
}
