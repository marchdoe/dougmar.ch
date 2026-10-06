import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { HeroNav } from './HeroNav'
import { SplitHero } from './SplitHero'

type Project = (typeof projects)[number]

const titleClass = css({
  fontFamily: 'display',
  fontWeight: 'normal',
  fontSize: 'clamp(44px, 6vw, 96px)',
  lineHeight: '0.88',
  textTransform: 'uppercase',
  textAlign: 'justify',
  color: 'text',
  maxWidth: '100%',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '0ms',
})

const attrClass = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '80ms',
})

const ruleClass = css({
  width: 'min(260px, 70%)',
  height: '3px',
  bg: 'accent',
  borderWidth: '0',
  margin: '0',
})

const metaClass = css({
  display: 'flex',
  flexWrap: 'wrap',
  columnGap: '18px',
  rowGap: '4px',
  textStyle: 'md',
  letterSpacing: 'wider',
  textTransform: 'uppercase',
  color: 'textMuted',
})

const navMotion = css({
  animation: 'rise 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
  animationDelay: '160ms',
})

const backClass = css({ textStyle: 'lede', color: 'textMuted' })

export function CaseHero({ project }: { project: Project }) {
  const meta = [project.type, project.role, String(project.year)].filter((v): v is string =>
    Boolean(v)
  )
  return (
    <>
      <h1 className={titleClass}>{project.title}</h1>
      <div className={attrClass}>
        <hr className={ruleClass} />
        <div className={metaClass}>
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <HeroNav className={navMotion} />
    </>
  )
}

export function CaseMissing() {
  return (
    <SplitHero>
      <h1 className={titleClass}>Not found</h1>
      <p className={backClass}>
        That project is not in the index. <a href="/#work">See the selected work</a>.
      </p>
      <HeroNav className={navMotion} />
    </SplitHero>
  )
}
