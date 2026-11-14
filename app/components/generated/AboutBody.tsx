import { css } from '../../../styled-system/css'
import { AboutAside } from './AboutAside'
import { TimelineList } from './TimelineList'

// No scroll reveal: the section starts inside the first viewport, and the
// held mid-fade dropped its labels under 3:1 on the light ground.
export function AboutBody() {
  return (
    <section
      className={css({
        bg: 'bg',
        color: 'text',
        borderTopWidth: '1px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingBlock: 'clamp(56px, 9vh, 110px)',
        paddingInline: { base: '4', md: '5vw' },
        display: 'grid',
        gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: 'minmax(0, 2.3fr) minmax(280px, 1fr)' },
        gap: { base: '7', lg: '8' },
      })}
    >
      <TimelineList />
      <AboutAside />
    </section>
  )
}
