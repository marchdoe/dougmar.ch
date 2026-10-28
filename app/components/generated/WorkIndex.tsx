import { css } from '../../../styled-system/css'
import { featuredProject, selectedWork } from '../../content/projects'
import { FeaturedProject } from './FeaturedProject'
import { WorkRow } from './WorkRow'

export function WorkIndex() {
  return (
    <div
      className={css({
        // mockup keeps the index on deep teal in both schemes: surface in dark, field in light
        bg: { base: 'surface', _light: 'field' },
        color: { base: 'text', _light: 'fieldInk' },
        padding: 'clamp(24px, 5vw, 80px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 'clamp(28px, 3vw, 44px)',
        borderStyle: 'solid',
        borderColor: { base: 'border', _light: 'fieldBorder' },
        borderTopWidth: { base: '1px', md: '0' },
        borderLeftWidth: { base: '0', md: '1px' },
        borderRightWidth: '0',
        borderBottomWidth: '0',
        minWidth: '0',
      })}
    >
      <span
        className={css({
          fontSize: 'sm',
          fontVariantCaps: 'all-small-caps',
          letterSpacing: 'widest',
          color: { base: 'textMuted', _light: 'fieldInkMuted' },
        })}
      >
        Selected Work
      </span>
      {featuredProject ? <FeaturedProject project={featuredProject} /> : null}
      <div className={css({ display: 'flex', flexDirection: 'column' })}>
        {selectedWork.map((p) => (
          <WorkRow
            key={p.slug}
            href={`/work/${p.slug}`}
            title={p.title}
            meta={`${p.type} · ${p.year}`}
            onField
          />
        ))}
      </div>
    </div>
  )
}
