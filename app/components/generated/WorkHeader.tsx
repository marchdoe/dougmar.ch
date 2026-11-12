import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { bleed } from './LedgerParts'

type Project = (typeof projects)[number]

/* Below md the size is set against the 328px column so the longest title stays on one line. */
const title = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'bold',
  textStyle: { base: '3xl', md: '4xl' },
  fontSize: { base: 'clamp(36px, 11.2vw, 64px)', md: '4xl' },
  lineHeight: '1',
  textTransform: 'uppercase',
  textAlign: 'left',
  minWidth: 0,
})

const plain = css({ color: 'text', paddingBottom: { base: '16px', md: '24px' } })

/* The one mint field on an interior page: the featured studio's title band. */
const band = css({
  bg: 'field',
  color: 'fieldInk',
  paddingTop: { base: '28px', md: '40px' },
  paddingBottom: { base: '24px', md: '36px' },
  marginBottom: { base: '24px', md: '32px' },
})

export function WorkHeader({ project }: { project: Project }) {
  return project.featured ? (
    <header className={`${bleed} ${band}`}>
      <h1 className={title}>{project.title}</h1>
    </header>
  ) : (
    <header className={plain}>
      <h1 className={title}>{project.title}</h1>
    </header>
  )
}
