import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { ColophonBlock, ColophonLead, ColophonLine, ColophonScore } from './ColophonParts'

export function AboutPersonal() {
  return (
    <section
      aria-label="Personal"
      className={css({
        bg: 'bgAlt',
        paddingTop: 'clamp(40px, 5vw, 72px)',
        paddingInline: 'clamp(16px, 5vw, 80px)',
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', lg: 'repeat(3, 1fr)' },
          rowGap: '26px',
          columnGap: '48px',
        })}
      >
        <ColophonBlock label="Holes in one">
          <ColophonLead>{personal.holesInOne}</ColophonLead>
          <ColophonLine>{personal.sport}</ColophonLine>
        </ColophonBlock>
        <ColophonBlock label="Teams">
          {personal.teams.map((team) => (
            <ColophonScore key={team}>{team}</ColophonScore>
          ))}
        </ColophonBlock>
        <ColophonBlock label="Current focus">
          <ColophonLine>{personal.currentFocus}</ColophonLine>
        </ColophonBlock>
      </div>
    </section>
  )
}
