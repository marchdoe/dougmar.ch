import { css } from '../../../styled-system/css'
import { formatDate, readColor } from '../../lib/archive-explainer'
import type { ArchiveDetail } from '../../types/archive-record'
import { BriefStep } from './BriefStep'
import { BuildStep } from './BuildStep'
import { ColorStep } from './ColorStep'
import { CompositionStep } from './CompositionStep'
import { HowRail } from './HowRail'
import { SignalsStep } from './SignalsStep'
import { TokensStep } from './TokensStep'
import { back } from './styles'

/**
 * The explainer — #159.
 *
 * A day's build read as a sequence, not an inventory. The sections are named
 * for what happened in order — the day arrived, a brief was written, a color
 * was chosen — because that is what the record is: a morning's work, in the
 * order it was done.
 *
 * The brief leads, never the color. Color is absent on 31 of 123 dates, and a
 * color-led hero on those days is a grey slab. Signals (107) and tokens (106)
 * are better covered than color (92).
 *
 * The preserved design is linked, never embedded. A live frame of that day's
 * site inside this page would put two identities on one screen, and this page's
 * whole job is to be the fixed one.
 *
 * Colors arrive at render time and Panda extracts styles statically, so each
 * swatch passes its value as a CSS custom property that a static class reads.
 * That is the one thing `style` is used for here.
 */

const page = css({
  minHeight: '100vh',
  background: 'archive.bg',
  color: 'archive.text',
  fontFamily: 'archive.mono',
  fontSize: 'archive.body',
})

const masthead = css({
  borderBottom: '1px solid',
  borderColor: 'archive.line',
  padding: { base: '32px 20px 26px', md: '48px 48px 32px' },
})

const dateLine = css({
  fontFamily: 'archive.sans',
  fontSize: { base: 'archive.title', md: 'archive.display' },
  lineHeight: '1.15',
  fontWeight: 'normal',
  letterSpacing: '-0.01em',
})

const columns = css({
  display: 'grid',
  gridTemplateColumns: { base: '1fr', lg: '240px minmax(0, 1fr)' },
  gap: { base: '32px', lg: '56px' },
  padding: { base: '28px 20px 96px', md: '40px 48px 120px' },
  maxWidth: '1180px',
  alignItems: 'start',
})

const bodyCol = css({ display: 'flex', flexDirection: 'column', gap: '52px', minWidth: 0 })

export function HowRecord({ date, detail }: { date: string; detail: ArchiveDetail }) {
  const color = readColor(detail.colorScheme)
  const hasDesign = (detail.pages ?? 0) > 0

  return (
    <div className={page}>
      <header className={masthead}>
        <a href="/archive" className={back}>
          ← The archive
        </a>
        <h1 className={dateLine}>{formatDate(date)}</h1>
      </header>

      <div className={columns}>
        <HowRail date={date} detail={detail} color={color} hasDesign={hasDesign} />

        <div className={bodyCol}>
          <SignalsStep detail={detail} />
          <BriefStep detail={detail} />
          <ColorStep color={color} era={detail.era} />
          <TokensStep detail={detail} />
          <CompositionStep detail={detail} />
          <BuildStep detail={detail} hasDesign={hasDesign} />
        </div>
      </div>
    </div>
  )
}
