import { css } from '../../../styled-system/css'

const eyebrow = css({
  display: 'block',
  fontFamily: 'body',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'wider',
  fontSize: 'xs',
  lineHeight: 'normal',
  color: 'accentAlt',
  marginBottom: '2',
})

const spec = css({
  display: 'block',
  width: 'fit-content',
  marginLeft: { lg: 'auto' },
  fontFamily: 'body',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: 'widest',
  fontSize: '2xs',
  lineHeight: 'normal',
  color: 'accentAlt',
  marginBottom: '2',
  paddingBottom: '6px',
  borderBottomWidth: '1px',
  borderBottomStyle: 'solid',
  borderColor: 'fieldBorder',
})

const deck = css({
  display: 'block',
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(22px, 6vw, 28px)',
  lineHeight: '1.12',
  color: 'fieldInk',
  maxWidth: { base: '18ch', lg: '16ch' },
  marginLeft: { lg: 'auto' },
})

const h1Base = css({ lineHeight: '1', textAlign: { lg: 'right' } })

export function HomeHeading() {
  return (
    <h1 className={h1Base}>
      <span className={eyebrow}>Ten years independent.</span>
      <span className={spec}>Bitter 900 · 128pt</span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: 'clamp(56px, 15vw, 128px)', lg: 'clamp(56px, 8.5vw, 128px)' },
          lineHeight: '0.9',
          letterSpacing: 'tight',
          color: 'fieldInk',
          whiteSpace: 'nowrap',
          marginBottom: '4',
        })}
      >
        vehicle.
      </span>
      <span className={deck}>Still the vehicle for the next experiment.</span>
    </h1>
  )
}

export function StatementHeading({ statement }: { statement: string }) {
  return (
    <h1 className={h1Base}>
      <span className={eyebrow}>Ten years independent.</span>
      <span className={spec}>About Doug March</span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'xl',
          color: 'fieldInk',
          maxWidth: '24ch',
          marginLeft: { lg: 'auto' },
        })}
      >
        {statement}
      </span>
    </h1>
  )
}

export function TitleHeading({ title, facts }: { title: string; facts: string[] }) {
  const line = facts.filter((f) => f !== '').join(' · ')
  return (
    <h1 className={h1Base}>
      <span className={eyebrow}>Case study</span>
      <span className={spec}>{line}</span>
      <span
        className={css({
          display: 'block',
          fontFamily: 'display',
          fontWeight: 'bold',
          fontSize: { base: 'clamp(44px, 12vw, 128px)', lg: 'clamp(48px, 6.5vw, 112px)' },
          lineHeight: '0.9',
          letterSpacing: 'tight',
          color: 'fieldInk',
        })}
      >
        {title}
      </span>
    </h1>
  )
}
