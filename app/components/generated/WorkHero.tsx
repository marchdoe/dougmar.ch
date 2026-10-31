import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Ground } from '../Material'
import { HeroBrand } from './HeroBrand'

type Project = (typeof projects)[number]

const asText = (value: unknown): string => (typeof value === 'string' ? value : '')

const shellClass = css({
  position: 'relative',
  zIndex: 1,
  paddingInline: { base: '5', md: '7', xl: '8' },
  paddingTop: { base: '4', lg: '6' },
  paddingBottom: { base: '7', lg: '8' },
  display: 'grid',
  gridTemplateColumns: { base: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 320px' },
  gridTemplateAreas: { base: '"brand" "title" "meta"', lg: '"brand brand" "title meta"' },
  rowGap: '6',
  columnGap: { base: '0', lg: '8' },
})

// accent (amber.600) fails 3:1 over the light ground's rules, so light takes fieldBorder (amber.700)
const titleClass = css({
  fontFamily: 'display',
  fontWeight: 'bold',
  fontSize: { base: '44px', lg: 'clamp(72px, 8.5vw, 128px)' },
  lineHeight: '0.9',
  letterSpacing: '-0.03em',
  textTransform: 'lowercase',
  color: { base: 'accent', _light: 'fieldBorder' },
  animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

export function WorkHero({ project }: { project: Project }) {
  const extra = project as unknown as Record<string, unknown>
  const description = (project.description ?? '').replace(/\s*\u2014\s*/g, ', ')
  const rows: [string, string][] = [
    ['type', project.type],
    ['year', String(project.year)],
    ['role', project.role ?? ''],
    ['timeline', asText(extra.timeline)],
    ['status', asText(extra.status)],
  ]
  return (
    <header className={css({ position: 'relative', overflow: 'hidden', bg: 'bg' })}>
      <Ground material="rule" seed={625116155} />
      <div className={shellClass}>
        <HeroBrand />
        <div
          className={css({
            gridArea: 'title',
            position: 'relative',
            zIndex: 1,
            alignSelf: 'end',
            minWidth: '0',
          })}
        >
          <h1 className={titleClass}>{project.title}</h1>
          {description ? (
            <p
              className={css({
                margin: '0',
                marginTop: '5',
                fontFamily: 'body',
                fontSize: { base: 'base', lg: 'lede' },
                lineHeight: '1.55',
                color: 'text',
                bg: 'bg',
                maxWidth: '46ch',
                animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
                animationDelay: '160ms',
              })}
            >
              {description}
            </p>
          ) : null}
        </div>
        <dl
          className={css({
            gridArea: 'meta',
            position: 'relative',
            zIndex: 1,
            margin: '0',
            alignSelf: 'end',
            bg: 'surface',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: 'borderStrong',
            borderRadius: 'sm',
            padding: '5',
            display: 'grid',
            gap: '3',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '240ms',
          })}
        >
          {rows
            .filter((row) => row[1] !== '')
            .map((row) => (
              <div
                key={row[0]}
                className={css({
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '4',
                  alignItems: 'baseline',
                })}
              >
                <dt
                  className={css({
                    fontSize: 'xs',
                    fontWeight: 'bold',
                    letterSpacing: 'widest',
                    textTransform: 'lowercase',
                    color: 'textMuted',
                  })}
                >
                  {row[0]}
                </dt>
                <dd
                  className={css({
                    margin: '0',
                    fontSize: 'sm',
                    fontWeight: 'bold',
                    color: 'text',
                    textAlign: 'right',
                  })}
                >
                  {row[1]}
                </dd>
              </div>
            ))}
        </dl>
      </div>
    </header>
  )
}

export function MissingProject({ slug }: { slug: string }) {
  return (
    <header className={css({ position: 'relative', overflow: 'hidden', bg: 'bg' })}>
      <Ground material="rule" seed={625116155} />
      <div className={shellClass}>
        <HeroBrand />
        <div className={css({ gridArea: 'title', position: 'relative', zIndex: 1 })}>
          <h1 className={titleClass}>not found</h1>
          <div className={css({ marginTop: '4', fontSize: 'base', color: 'textMuted' })}>
            Nothing is filed under {slug}. <a href="/work">See the work index.</a>
          </div>
        </div>
      </div>
    </header>
  )
}
