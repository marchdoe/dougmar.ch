import type { ReactNode } from 'react'
import { css } from '../../../styled-system/css'

export function RunningFoot() {
  return (
    <footer
      className={css({
        position: 'relative',
        bg: 'bgAlt',
        borderTop: '3px solid',
        borderColor: 'borderStrong',
        paddingBottom: { base: '10', md: '16' },
        '@supports (animation-timeline: view())': {
          animationName: 'rise',
          animationTimeline: 'view()',
          animationRange: 'entry 0% entry 40%',
          animationFillMode: 'both',
        },
      })}
    >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '2',
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
          paddingTop: { base: '5', md: '6' },
          paddingBottom: '4',
          paddingLeft: { base: '5', md: '6vw' },
          paddingRight: { base: '5', md: '6vw' },
        })}
      >
        <span>running foot, the closing rows</span>
        <span>20 sep 2026, ashburn va</span>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: { base: '1fr', md: 'repeat(2, 1fr)', lg: '1.2fr 1fr 1fr' },
          columnGap: { md: '14' },
          borderTop: '1px solid',
          borderColor: 'border',
          paddingLeft: { base: '5', md: '6vw' },
          paddingRight: { base: '5', md: '6vw' },
        })}
      >
        <FootBlock label="detroit">
          <FootRow left="lions" right="31 to 41" tag="loss" />
          <FootRow left="tigers" right="1 to 3" tag="loss" />
        </FootBlock>
        <FootBlock label="biltmore championship">
          <FootRow left="shipley" right="-21" />
          <FootRow left="kohles" right="-20" />
          <FootRow left="cole" right="-17" />
        </FootBlock>
        <FootBlock label="conditions" span>
          <div className={css({ display: 'flex', flexWrap: 'wrap', gap: '6' })}>
            <Metric v="63.7°F" k="fog" />
            <Metric v="71%" k="waxing gibbous" />
            <Metric v="761.69, up 0.13%" k="spy" />
          </div>
        </FootBlock>
        <FootBlock label="in rotation" span>
          <div className={css({ fontFamily: 'display', fontSize: 'base', color: 'text' })}>
            <span className={css({ color: 'accent' })}>wet leg</span>
            {' \u00b7 '}
            <span className={css({ color: 'accent' })}>tobin sprout</span>
          </div>
        </FootBlock>
        <p
          className={css({
            gridColumn: '1 / -1',
            paddingTop: '6',
            paddingBottom: '6',
            fontFamily: 'display',
            fontStyle: 'italic',
            fontSize: 'sm',
            lineHeight: 'normal',
            color: 'textMuted',
            maxWidth: '62ch',
          })}
        >
          the highest level of wisdom is when you not only accept but love adversity.{' '}
          <cite className={css({ fontStyle: 'normal', color: 'textFaint' })}>j. lagace</cite>
        </p>
      </div>
    </footer>
  )
}

function FootBlock({
  label,
  span,
  children,
}: {
  label: string
  span?: boolean
  children: ReactNode
}) {
  return (
    <div
      className={css({
        gridColumn: span ? '1 / -1' : 'auto',
        paddingTop: '6',
        paddingBottom: '6',
        borderBottom: '1px solid',
        borderColor: 'border',
      })}
    >
      <div
        className={css({
          fontWeight: 'bold',
          fontSize: '2xs',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          color: 'textFaint',
          marginBottom: '3',
        })}
      >
        {label}
      </div>
      {children}
    </div>
  )
}

function FootRow({ left, right, tag }: { left: string; right: string; tag?: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        gap: '4',
        fontFamily: 'display',
        fontSize: 'base',
        color: 'text',
        paddingTop: '1',
        paddingBottom: '1',
      })}
    >
      <span>{left}</span>
      <span className={css({ color: 'accent', fontWeight: 'bold' })}>
        {right}
        {tag && (
          <span
            className={css({
              color: 'textMuted',
              fontWeight: 'normal',
              textTransform: 'lowercase',
              marginLeft: '2',
            })}
          >
            {' '}
            {tag}
          </span>
        )}
      </span>
    </div>
  )
}

function Metric({ v, k }: { v: string; k: string }) {
  return (
    <div>
      <div className={css({ fontFamily: 'display', fontSize: 'lg', color: 'text' })}>{v}</div>
      <div
        className={css({
          fontFamily: 'body',
          fontSize: '2xs',
          color: 'textFaint',
          textTransform: 'uppercase',
          letterSpacing: 'wide',
          marginTop: '1',
        })}
      >
        {k}
      </div>
    </div>
  )
}
