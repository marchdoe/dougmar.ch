import { projects } from '../../content/projects'
import { Board, BoardCaption, BoardKicker, BoardStandfirst, BoardTitle } from './Board'
import { BoardClients } from './ClientPanel'
import { homeFeature } from './homeFeature'
import { BoardMeta } from './ProjectMeta'

type Project = (typeof projects)[number]

function FeaturedBody({ project }: { project: Project }) {
  return (
    <>
      {project.problem ? <BoardStandfirst>{project.problem}</BoardStandfirst> : null}
      <BoardMeta
        cells={[
          { k: 'year', v: project.year },
          { k: 'type', v: project.type },
          { k: 'role', v: project.role },
        ]}
        links={[{ k: 'visit', href: project.liveUrl ?? project.externalUrl }]}
      />
    </>
  )
}

export function HomeBoard() {
  const clients = projects.find((project) => project.clients?.length)?.clients ?? []

  return (
    <Board>
      <BoardKicker>featured · a thing i built</BoardKicker>
      {homeFeature ? <BoardTitle>{homeFeature.title}</BoardTitle> : null}
      <BoardCaption>The week's spelling words in. A week of practice out.</BoardCaption>
      {homeFeature ? <FeaturedBody project={homeFeature} /> : null}
      <BoardClients clients={clients} label="a decade of client work, elsewhere" />
    </Board>
  )
}
