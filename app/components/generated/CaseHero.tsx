import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { BrandLockup } from '../BrandLockup'
import { Ground } from '../Material'

type Project = (typeof projects)[number] & { timeline?: string; status?: string }

export function CaseHero({ project }: { project: Project }) {
  const meta = [
    { k: 'Type', v: project.type },
    { k: 'Year', v: String(project.year) },
    { k: 'Role', v: project.role },
    { k: 'Timeline', v: project.timeline },
    { k: 'Status', v: project.status },
  ].filter((m): m is { k: string; v: string } => Boolean(m.v))
  return (
    <header
      className={css({
        position: 'relative',
        overflow: 'hidden',
        bg: 'bg',
        display: 'grid',
        gridTemplateColumns: { base: '1fr', lg: '1fr 1.4fr' },
        gridTemplateRows: 'auto 1fr auto',
        minHeight: { lg: '70vh' },
        paddingTop: { base: '24px', md: '34px', lg: '44px' },
        paddingBottom: { base: '40px', md: '48px', lg: '56px' },
        paddingInline: { base: '22px', md: '40px', lg: '6vw' },
      })}
    >
      <div
        className={css({
          gridRow: '1',
          gridColumn: { lg: '1' },
          alignSelf: 'start',
          zIndex: 3,
          color: 'text',
          width: 'max-content',
        })}
      >
        <BrandLockup variant="stacked-md" mode="single-color" />
      </div>
      <div
        className={css({
          gridRow: { base: '2', lg: '1 / span 3' },
          gridColumn: { lg: '2' },
          position: 'relative',
          marginTop: { base: '20px', lg: '0' },
          borderRadius: 'md',
          bg: 'field',
          overflow: 'hidden',
          display: 'grid',
          alignContent: 'end',
          minWidth: '0',
          minHeight: { base: '40vh', lg: 'auto' },
          paddingTop: { base: '28px', lg: '44px' },
          paddingBottom: { base: '30px', lg: '46px' },
          paddingInline: { base: '22px', lg: '48px' },
        })}
      >
        <Ground material="dots" seed={1875299892} />
        <h1
          className={css({
            position: 'relative',
            zIndex: 1,
            minWidth: '0',
            fontFamily: 'display',
            fontSize: { base: '36px', md: '56px', xl: '96px' },
            lineHeight: '0.95',
            fontWeight: 'normal',
            color: 'accent',
            textAlign: 'right',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
      </div>
      <dl
        className={css({
          gridRow: '3',
          gridColumn: { lg: '1' },
          alignSelf: { lg: 'end' },
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '4',
          marginTop: { base: '22px', lg: '0' },
          marginBottom: '0',
          paddingRight: { lg: '5' },
          animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
          animationDelay: '80ms',
        })}
      >
        {meta.map((m) => (
          <div key={m.k}>
            <dt
              className={css({
                fontSize: 'xs',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: 'widest',
                color: 'textFaint',
              })}
            >
              {m.k}
            </dt>
            <dd
              className={css({
                margin: '0',
                fontSize: 'sm',
                color: 'text',
                fontVariantNumeric: 'tabular-nums',
              })}
            >
              {m.v}
            </dd>
          </div>
        ))}
      </dl>
    </header>
  )
}
