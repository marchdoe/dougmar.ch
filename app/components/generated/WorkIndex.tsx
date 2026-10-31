import { css } from '../../../styled-system/css'
import { experiments, selectedWork } from '../../content/projects'

const numberWords = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
]
const enDash = '\u2013'

const items = [
  ...selectedWork.map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
    year: p.year,
    href: `/work/${p.slug}`,
    kicker: 'selected work',
  })),
  ...experiments.map((p) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
    year: p.year,
    href: p.externalUrl ?? `/work/${p.slug}`,
    kicker: 'experiment',
  })),
]

export function WorkIndex() {
  const years = items.map((i) => i.year)
  const range = `${Math.min(...years)}${enDash}${Math.max(...years)}`
  const countWord = numberWords[items.length] ?? String(items.length)
  return (
    <section
      id="index"
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingBlock: { base: '7', lg: '8' },
        paddingInline: { base: '5', md: '7', xl: '8' },
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
          alignItems: 'baseline',
          flexWrap: 'wrap',
          gap: '3',
          marginBottom: { base: '5', lg: '6' },
          paddingBottom: '4',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'fieldBorder',
        })}
      >
        <div>
          <span
            className={css({
              fontSize: 'xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'lowercase',
              color: 'fieldInkMuted',
            })}
          >
            the work
          </span>
          <h2
            className={css({
              fontFamily: 'display',
              fontWeight: 'bold',
              fontSize: { base: '28px', lg: '40px' },
              lineHeight: '1',
              letterSpacing: '-0.02em',
              textTransform: 'lowercase',
              color: 'fieldInk',
            })}
          >
            one hand, {countWord} builds
          </h2>
        </div>
        <span
          className={css({
            fontFamily: 'display',
            fontWeight: 'semibold',
            fontSize: 'sm',
            color: 'fieldInkMuted',
          })}
        >
          {range}
        </span>
      </div>
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: {
            base: 'minmax(0, 1fr)',
            md: 'repeat(2, minmax(0, 1fr))',
            lg: 'repeat(3, minmax(0, 1fr))',
          },
          gap: '1px',
          bg: 'fieldBorder',
        })}
      >
        {items.map((item) => (
          <div
            key={item.slug}
            className={css({
              bg: 'field',
              paddingBlock: { base: '5', lg: '6' },
              paddingInline: { base: '0', md: '5' },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '2',
            })}
          >
            <span
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                letterSpacing: 'widest',
                textTransform: 'lowercase',
                color: 'fieldInkMuted',
              })}
            >
              {item.kicker}
            </span>
            <a
              href={item.href}
              className={css({
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                fontFamily: 'display',
                fontWeight: 'bold',
                textStyle: 'xl',
                lineHeight: '0.95',
                letterSpacing: '-0.02em',
                color: 'fieldInk',
                textTransform: 'lowercase',
                _hover: { textDecoration: 'underline', textDecorationColor: 'fieldInkMuted' },
              })}
            >
              {item.title}
            </a>
            <span
              className={css({
                display: 'flex',
                gap: '4',
                alignItems: 'baseline',
                fontSize: 'sm',
                fontWeight: 'medium',
                color: 'fieldInkMuted',
              })}
            >
              <span>{item.type}</span>
              <span
                className={css({
                  fontFamily: 'display',
                  fontWeight: 'semibold',
                  color: 'fieldInk',
                })}
              >
                {item.year}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
