import { FigureBand } from './generated/FigureBand'

// shell_posture: folded-into-hero — primary nav lives inside each page's hero
// (see FieldHead), so Sidebar carries the persistent footer figure ledger
// that closes every route instead of a conventional side nav.
export function Sidebar() {
  return <FigureBand />
}
