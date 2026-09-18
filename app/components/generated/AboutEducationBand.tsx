import { css } from '../../../styled-system/css'

type Education = { school: string; degree: string; concentration: string; years: string }

export function AboutEducationBand({ education }: { education: Education }) {
  return (
    <section
      className={css({
        bg: 'field',
        color: 'fieldInk',
        padding: { base: '5', md: '7' },
        display: 'grid',
        gridTemplateColumns: { base: '1fr', md: 'repeat(3, 1fr)' },
        gap: '1',
      })}
    >
      <div
        className={css({
          borderRight: { md: '1px solid' },
          borderColor: 'fieldBorder',
          padding: '4',
          display: 'flex',
          flexDirection: 'column',
          gap: '1',
        })}
      >
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            fontSize: '2xs',
            color: 'fieldInkMuted',
          })}
        >
          School
        </span>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'md',
            color: 'fieldInk',
          })}
        >
          {education.school}
        </span>
        <span className={css({ fontSize: 'sm', color: 'fieldInkMuted' })}>{education.degree}</span>
      </div>
      <div
        className={css({
          borderRight: { md: '1px solid' },
          borderColor: 'fieldBorder',
          padding: '4',
          display: 'flex',
          flexDirection: 'column',
          gap: '1',
        })}
      >
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            fontSize: '2xs',
            color: 'fieldInkMuted',
          })}
        >
          Concentration
        </span>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'md',
            color: 'fieldInk',
          })}
        >
          {education.concentration}
        </span>
      </div>
      <div className={css({ padding: '4', display: 'flex', flexDirection: 'column', gap: '1' })}>
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 'wide',
            fontSize: '2xs',
            color: 'fieldInkMuted',
          })}
        >
          Years
        </span>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'bold',
            fontSize: 'md',
            color: 'fieldInk',
          })}
        >
          {education.years}
        </span>
      </div>
    </section>
  )
}
