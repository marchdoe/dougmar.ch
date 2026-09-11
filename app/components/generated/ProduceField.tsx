import type { ReactNode } from 'react'
import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

// mockup ghost ink (sage-300) has no exact token; textFaint is the nearest quiet ink
const variantClass = {
  big: css({
    fontWeight: 'bold',
    textStyle: '2xl',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    color: 'text',
    fontFamily: 'display',
  }),
  bigGhost: css({
    fontWeight: 'bold',
    textStyle: '2xl',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    color: 'textFaint',
    fontFamily: 'display',
  }),
  mid: css({
    fontWeight: 'bold',
    textStyle: 'xl',
    lineHeight: 'tight',
    letterSpacing: 'tight',
    color: 'textMuted',
    fontFamily: 'display',
  }),
  sig: css({ textStyle: '2xs', lineHeight: 'normal', color: 'textMuted', fontFamily: 'display' }),
  chip: css({
    bg: 'accent',
    color: 'accentText',
    fontWeight: 'bold',
    textStyle: 'sm',
    display: 'flex',
    alignItems: 'center',
    padding: '3',
    fontFamily: 'display',
  }),
  chipDk: css({
    bg: 'accentAlt',
    color: 'fieldInk',
    fontWeight: 'bold',
    textStyle: 'sm',
    display: 'flex',
    alignItems: 'center',
    padding: '3',
    fontFamily: 'display',
  }),
  code: css({
    textStyle: '2xs',
    lineHeight: 'normal',
    color: 'textFaint',
    bg: 'bgAlt',
    border: '1px solid',
    borderColor: 'border',
    padding: '3',
    fontFamily: 'display',
  }),
} as const

const dollarClass = css({ color: 'accentAlt', fontWeight: 'bold' })

type Variant = keyof typeof variantClass
type Item = { v: Variant; lg: string; node: ReactNode }

const items: Item[] = [
  { v: 'big', lg: '1 / 8', node: 'FREE TO PRODUCE.' },
  { v: 'chip', lg: '8 / 13', node: 'code · tests · policy · docs — almost free' },
  {
    v: 'code',
    lg: '1 / 6',
    node: (
      <>
        <span className={dollarClass}>$</span> generate --code --tests --docs --policy &amp; ship ×∞
      </>
    ),
  },
  {
    v: 'sig',
    lg: '6 / 10',
    node: (
      <>
        <b>DET</b> · all clubs · off season · no game
      </>
    ),
  },
  {
    v: 'sig',
    lg: '9 / 13',
    node: (
      <>
        <b>spy</b> −0.60% · close · muted
      </>
    ),
  },
  { v: 'bigGhost', lg: '1 / 7', node: 'free to produce.' },
  { v: 'chipDk', lg: '7 / 13', node: 'why products get worse — worse on purpose' },
  {
    v: 'sig',
    lg: '1 / 4',
    node: (
      <>
        <b>new moon</b> · 0% illum · cycle day 0
      </>
    ),
  },
  {
    v: 'sig',
    lg: '4 / 7',
    node: (
      <>
        <b>aqi 1</b> good · uv 0
      </>
    ),
  },
  {
    v: 'sig',
    lg: '7 / 10',
    node: (
      <>
        <b>aldie va</b> · overcast · 74°F
      </>
    ),
  },
  { v: 'mid', lg: '10 / 13', node: 'free to produce.' },
  { v: 'big', lg: '3 / 11', node: 'FREE TO PRODUCE.' },
  {
    v: 'code',
    lg: '1 / 5',
    node: (
      <>
        <span className={dollarClass}>$</span> rebuild self --nightly --autonomous
      </>
    ),
  },
  { v: 'chip', lg: '4 / 8', node: 'quality drained, no metric moved' },
  {
    v: 'sig',
    lg: '8 / 11',
    node: (
      <>
        on rotation ▸ <b>guided by voices</b> · the war on drugs
      </>
    ),
  },
  { v: 'mid', lg: '11 / 13', node: 'produce.' },
  { v: 'bigGhost', lg: '1 / 7', node: 'free to produce.' },
  {
    v: 'code',
    lg: '7 / 13',
    node: (
      <>
        <span className={dollarClass}>$</span> diff yesterday today — abundance ↑ · ownership ?
      </>
    ),
  },
]

export function ProduceField() {
  return (
    <Box
      as="section"
      aria-label="The abundance clause — over-production as texture"
      className={css({
        order: { base: 2, lg: 1 },
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '7', lg: '9' },
        display: 'grid',
        gridTemplateColumns: { base: 'repeat(2, 1fr)', lg: 'repeat(12, 1fr)' },
        gap: '6px',
        borderBottom: '2px solid',
        borderColor: 'borderStrong',
      })}
    >
      <Box
        className={css({
          gridColumn: '1 / -1',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '3',
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          paddingBottom: '2',
        })}
      >
        <span>build log ▸ over-produced</span>
        <span>2026·09·11 · aldie va</span>
      </Box>
      {items.map((item, i) => (
        <Box
          key={i}
          className={css({ gridColumn: { base: 'auto', lg: item.lg }, overflowWrap: 'anywhere' })}
        >
          <span className={variantClass[item.v]}>{item.node}</span>
        </Box>
      ))}
    </Box>
  )
}
