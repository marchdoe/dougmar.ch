import { css } from '../../../styled-system/css'
import { identity } from '../../content/about'
import { NavSentence } from './NavSentence'

export function AboutStandfirst() {
  return (
    <section
      className={css({
        display: { base: 'block', md: 'grid' },
        gridTemplateColumns: { md: 'repeat(12, minmax(0, 1fr))' },
        columnGap: { md: '24px' },
        rowGap: { md: '14px' },
        borderTopWidth: '2px',
        borderTopStyle: 'solid',
        borderTopColor: 'borderStrong',
        paddingTop: { base: '18px', md: '24px' },
      })}
    >
      <div
        className={css({
          bg: 'bgAlt',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'border',
          borderRadius: 'sm',
          paddingTop: { base: '22px', md: '28px' },
          paddingInline: { base: '20px', md: '28px' },
          paddingBottom: { base: '24px', md: '30px' },
          gridColumn: { md: '1 / 10' },
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontStyle: 'italic',
            fontWeight: 'normal',
            textStyle: 'lede',
            lineHeight: '1.5',
            maxWidth: '48ch',
            color: 'text',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {identity.statement}
        </h1>
      </div>
      <NavSentence
        className={css({
          gridColumn: { md: '1 / 10' },
          marginTop: { base: '14px', md: '0' },
          animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      />
    </section>
  )
}
