import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { Band } from './Band'

function PullLabel() {
  return (
    <div
      className={css({
        fontSize: 'xs',
        letterSpacing: 'widest',
        textTransform: 'uppercase',
        color: 'fieldInkMuted',
        fontWeight: 'bold',
        marginBottom: '0.7em',
      })}
    >
      In his own words
    </div>
  )
}

export function AboutHero() {
  const statement = identity.statement.replace(/\s*\u2014\s*/g, ', ')
  return (
    <div className={css({ display: 'flex', flexDirection: 'column', width: '100%' })}>
      <div
        className={css({
          paddingInline: 'clamp(28px, 6vw, 104px)',
          paddingTop: 'clamp(14px, 3vw, 24px)',
          paddingBottom: 'clamp(24px, 4vw, 44px)',
        })}
      >
        <div
          className={css({
            fontSize: 'xs',
            letterSpacing: 'widest',
            textTransform: 'uppercase',
            color: 'accent',
            fontWeight: 'bold',
            marginBottom: '0.6em',
          })}
        >
          About
        </div>
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: 'lg',
            lineHeight: '1.4',
            maxWidth: '46ch',
            color: 'text',
          })}
        >
          {statement}
        </h1>
      </div>
      <div className={css({ display: 'flex' })}>
        <Band label={<PullLabel />}>
          <div
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textStyle: { base: '3xl', lg: '4xl' },
              lineHeight: '0.95',
              color: 'fieldInk',
            })}
          >
            <span className={css({ display: 'block' })}>Deep in both.</span>
            <span className={css({ display: 'block' })}>Not a generalist.</span>
          </div>
        </Band>
      </div>
    </div>
  )
}
