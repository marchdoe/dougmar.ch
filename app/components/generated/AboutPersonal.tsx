import { css } from '../../../styled-system/css'
import { personal } from '../../content/about'
import { Ledger } from './Ledger'
import { SectionHead } from './SectionHead'

export function AboutPersonal() {
  return (
    <section>
      <SectionHead label="Off the clock" />
      <div className={css({ textAlign: 'center', paddingBottom: '4' })}>
        <div
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'bold',
            textStyle: '4xl',
            lineHeight: 'tight',
            color: 'accent',
            fontVariantNumeric: 'tabular-nums',
          })}
        >
          {personal.holesInOne}
        </div>
        <div
          className={css({
            marginTop: '2',
            textStyle: 'xs',
            fontVariant: 'small-caps',
            letterSpacing: 'wider',
            color: 'textMuted',
          })}
        >
          Holes in one
        </div>
      </div>
      <Ledger
        rows={[
          { k: 'Sport', v: personal.sport },
          { k: 'Teams', v: personal.teams.join(', ') },
          { k: 'Current focus', v: personal.currentFocus },
        ]}
      />
    </section>
  )
}
