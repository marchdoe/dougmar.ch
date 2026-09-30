import { css } from '../../../styled-system/css'
import { HeroField } from './HeroField'
import { HeroMeta } from './HeroMeta'

type HeroProject = {
  title: string
  type: string
  year: number
  role?: string
  timeline?: string
  status?: string
}

export function WorkHero({ project }: { project: HeroProject }) {
  const facts = [
    { label: 'Type', value: project.type },
    { label: 'Year', value: String(project.year) },
    { label: 'Role', value: project.role ?? '' },
    { label: 'Timeline', value: project.timeline ?? '' },
    { label: 'Status', value: project.status ?? '' },
  ].filter((f) => f.value !== '')
  return (
    <HeroField meta={<HeroMeta kicker="Case study" line={String(project.year)} />}>
      <div
        className={css({
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          textAlign: 'right',
          marginTop: 'auto',
          paddingTop: { base: '6', lg: '8' },
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            textStyle: '5xl',
            lineHeight: '0.95',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {project.title}
        </h1>
        <dl
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
            columnGap: '6',
            rowGap: '3',
            marginTop: '5',
            marginBottom: '0',
            animation: 'settle 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
          })}
        >
          {facts.map((f) => (
            <div key={f.label}>
              <dt
                className={css({
                  textStyle: '2xs',
                  letterSpacing: 'widest',
                  textTransform: 'uppercase',
                  color: 'textFaint',
                })}
              >
                {f.label}
              </dt>
              <dd className={css({ margin: '0', textStyle: 'base', color: 'text' })}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </HeroField>
  )
}
