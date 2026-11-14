import { css } from '../../../styled-system/css'
import { HeroBand } from './HeroBand'
import { Sky } from './Sky'
import { SkyMasthead } from './SkyMasthead'

export function HomeHero() {
  return (
    <section className={css({ minHeight: '92vh', display: 'grid', gridTemplateRows: '1fr auto' })}>
      <Sky>
        <SkyMasthead />
      </Sky>
      <HeroBand />
    </section>
  )
}
