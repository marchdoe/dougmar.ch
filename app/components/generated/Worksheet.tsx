import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'
import { Ground } from '../Material'
import { revealClass } from './reveal'

/* The approved mockup rules the worksheet half of the split field, so the
   declared material sits here. Every text box carries a flat bg so no rule
   runs through its glyphs. */
export function Worksheet({ label, children }: { label: string; children: ReactNode }) {
  return (
    <aside
      aria-label={label}
      className={cx(
        revealClass,
        css({
          position: 'relative',
          minWidth: '0',
          gridArea: { lg: 'sheet' },
          bg: 'bg',
          color: 'text',
          borderTopWidth: { base: '3px', lg: '0' },
          borderTopStyle: 'solid',
          borderTopColor: 'borderStrong',
          paddingTop: { base: '28px', md: '40px', lg: '28px' },
          paddingBottom: { base: '40px', md: '56px' },
          paddingInline: { base: '16px', md: '40px', lg: '2.4vw' },
        })
      )}
    >
      <Ground material="rule" seed={1466264654} />
      <div className={css({ position: 'relative', zIndex: 1 })}>{children}</div>
    </aside>
  )
}

export function WorksheetHead({ title, detail }: { title: string; detail: string }) {
  return (
    <div className={css({ marginBottom: '22px' })}>
      <div
        className={css({
          width: 'fit-content',
          bg: 'bg',
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
        })}
      >
        {title}
      </div>
      <div
        className={css({
          width: 'fit-content',
          bg: 'bg',
          fontFamily: 'display',
          fontSize: '15px',
          color: 'text',
          marginTop: '4px',
        })}
      >
        {detail}
      </div>
    </div>
  )
}

export function LedgerRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      className={css({
        display: 'grid',
        gridTemplateColumns: 'minmax(var(--ledger-key, 78px), auto) 1fr',
        columnGap: '12px',
        alignItems: 'baseline',
        minHeight: '36px',
        paddingTop: '9px',
      })}
    >
      <span
        className={css({
          justifySelf: 'start',
          bg: 'bg',
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'wide',
          textTransform: 'uppercase',
          color: 'textMuted',
        })}
      >
        {label}
      </span>
      <span
        className={css({
          justifySelf: 'start',
          minWidth: '0',
          bg: 'bg',
          fontFamily: 'display',
          textStyle: 'sm',
          lineHeight: '1.35',
          color: 'text',
        })}
      >
        {children}
      </span>
    </div>
  )
}

const blockClass = css({ marginTop: '36px' })
const wideBlockClass = css({ marginTop: '36px', '--ledger-key': '112px' })

export function LedgerBlock({
  title,
  wide = false,
  children,
}: {
  title: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <section className={wide ? wideBlockClass : blockClass}>
      <h2
        className={css({
          width: 'fit-content',
          bg: 'bg',
          fontFamily: 'display',
          textStyle: '2xs',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
          color: 'textFaint',
          marginBottom: '8px',
        })}
      >
        {title}
      </h2>
      {children}
    </section>
  )
}

export function TagRun({ tags }: { tags: string[] }) {
  return (
    <ul className={css({ display: 'flex', flexWrap: 'wrap', gap: '8px' })}>
      {tags.map((tag) => (
        <li
          key={tag}
          className={css({
            bg: 'bg',
            fontFamily: 'display',
            textStyle: 'sm',
            color: 'text',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'border',
            paddingBlock: '2px',
            paddingInline: '8px',
          })}
        >
          {tag}
        </li>
      ))}
    </ul>
  )
}
