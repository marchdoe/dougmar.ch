import { css } from '../../../styled-system/css'
import { Masthead } from './Masthead'

function MastMeta() {
  return (
    <div
      className={css({
        bg: 'field',
        paddingBlock: '1',
        paddingInline: '2',
        textAlign: 'right',
        textStyle: 'xs',
        lineHeight: 'normal',
        letterSpacing: 'wide',
        color: 'fieldInkMuted',
        fontVariantNumeric: 'tabular-nums',
      })}
    >
      <span className={css({ color: 'fieldInk' })}>Aldie, Virginia.</span> Clear, 44°F.
      <br />
      Full moon, 99%.
    </div>
  )
}

export function HomeHero() {
  return (
    <Masthead aside={<MastMeta />}>
      <h1
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: '30px', lg: '56px' },
          lineHeight: 'tight',
          fontVariant: 'small-caps',
          letterSpacing: 'wide',
          color: 'fieldInk',
          width: '100%',
          textAlign: 'justify',
          textAlignLast: 'justify',
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '0ms',
        })}
      >
        Deep in both. Not a generalist.
      </h1>
    </Masthead>
  )
}
