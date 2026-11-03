import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { FactGrid, FactRow } from './FactRow'

export function AboutPersonal() {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingTop: { base: '38px', md: '52px', lg: '60px' },
        paddingBottom: { base: '38px', md: '52px', lg: '60px' },
        paddingLeft: { base: '20px', md: '48px', lg: '40px' },
        paddingRight: { base: '20px', md: '48px', lg: '5vw' },
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'fieldBorder',
      })}
    >
      <h2
        className={css({
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          fontWeight: 'bold',
          color: { base: 'fieldInkMuted', _dark: 'fieldInk' },
          paddingBottom: '12px',
          marginBottom: '20px',
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        Personal
      </h2>
      <FactGrid>
        <FactRow label="Holes in one" value={personal.holesInOne} size="big" />
        <FactRow label="Sport" value={personal.sport} size="quiet" />
        <FactRow label="Teams" value={personal.teams.join(', ')} size="quiet" />
        <FactRow label="Current focus" value={personal.currentFocus} size="quiet" />
      </FactGrid>
    </section>
  )
}
