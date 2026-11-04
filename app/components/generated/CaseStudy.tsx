import { css } from '../../../styled-system/css'
import type { projects } from '../../content/projects'
import { Board, BoardHeroTitle, BoardKicker, BoardStandfirst } from './Board'
import { BoardClients } from './ClientPanel'
import { BoardMeta } from './ProjectMeta'
import { SplitPage } from './Split'
import { LedgerBlock, LedgerRow, TagRun, Worksheet, WorksheetHead } from './Worksheet'

type Project = (typeof projects)[number]

function hostLabel(href: string) {
  return href.replace(/^https?:\/\//, '').split('/')[0]
}

function CaseBoard({ project }: { project: Project }) {
  return (
    <Board pinned>
      <BoardKicker>{`work · ${project.type}`}</BoardKicker>
      <BoardHeroTitle>{project.title}</BoardHeroTitle>
      {project.description ? <BoardStandfirst>{project.description}</BoardStandfirst> : null}
      <BoardMeta
        cells={[
          { k: 'year', v: project.year },
          { k: 'type', v: project.type },
          { k: 'role', v: project.role },
          { k: 'timeline', v: project.timeline },
          { k: 'status', v: project.status },
        ]}
        links={[
          { k: 'visit', href: project.liveUrl ?? project.externalUrl },
          { k: 'code', href: project.githubUrl },
        ]}
      />
      <BoardClients clients={project.clients ?? []} label="clients" marks />
    </Board>
  )
}

function Narrative({ project }: { project: Project }) {
  const sections = [
    { label: 'problem', body: project.problem },
    { label: 'approach', body: project.approach },
    { label: 'outcome', body: project.outcome },
  ]
  return (
    <>
      {sections
        .filter((section) => section.body)
        .map((section) => (
          <LedgerBlock key={section.label} title={section.label}>
            <p
              className={css({
                width: 'fit-content',
                bg: 'bg',
                fontFamily: 'body',
                textStyle: 'base',
                color: 'text',
                maxWidth: '50ch',
              })}
            >
              {section.body}
            </p>
          </LedgerBlock>
        ))}
    </>
  )
}

function CaseSheet({ project }: { project: Project }) {
  const href = project.liveUrl ?? project.externalUrl
  return (
    <Worksheet label="Project file">
      <WorksheetHead
        title="project file · ledger"
        detail={`${project.title}, ${project.year}`.toLowerCase()}
      />
      <Narrative project={project} />
      {project.stack?.length ? (
        <LedgerBlock title="stack">
          <TagRun tags={project.stack} />
        </LedgerBlock>
      ) : null}
      {href ? (
        <LedgerBlock title="elsewhere">
          <LedgerRow label="visit">
            <a
              href={href}
              className={css({
                color: 'accent',
                textDecoration: 'underline',
                textUnderlineOffset: '2px',
              })}
            >
              {`${hostLabel(href)} ↗`}
            </a>
          </LedgerRow>
        </LedgerBlock>
      ) : null}
    </Worksheet>
  )
}

export function SplitCaseStudy({ project }: { project: Project }) {
  return (
    <SplitPage>
      <CaseBoard project={project} />
      <CaseSheet project={project} />
    </SplitPage>
  )
}

export function PaperHead({ project }: { project: Project }) {
  return (
    <Board pinned>
      <BoardKicker>{`work · ${project.type}`}</BoardKicker>
      <BoardHeroTitle>{project.title}</BoardHeroTitle>
    </Board>
  )
}

export function MissingProject() {
  return (
    <Board pinned>
      <BoardKicker>work · nothing at this address</BoardKicker>
      <BoardHeroTitle>not found</BoardHeroTitle>
    </Board>
  )
}
