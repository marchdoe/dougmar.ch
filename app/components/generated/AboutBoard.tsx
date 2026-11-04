import { identity } from '../../content/about'
import { Board, BoardCaption, BoardKicker, BoardStandfirst, BoardTitle } from './Board'

/* The statement's source text carries a U+2014 dash, which the copy gate fails
   on the rendered page. The content file is read only, so it is set as a comma here. */
const statement = identity.statement.replace(/\s*\u2014\s*/g, ', ')

export function AboutBoard() {
  return (
    <Board pinned>
      <BoardKicker>about · the person</BoardKicker>
      <BoardTitle>{identity.name}</BoardTitle>
      <BoardCaption>{statement}</BoardCaption>
      <BoardStandfirst>{identity.role}</BoardStandfirst>
    </Board>
  )
}
