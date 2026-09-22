// This standalone entry (see app/dev-responsive.html) never went through
// __root.tsx, which is normally what pulls in Panda's generated stylesheet
// (`import '../styles/panda.css'`) — so ResponsiveCard and ResponsiveTrend's
// css() classes rendered with no rules behind them until this import (#554).
import './styles/panda.css'
import { createRoot } from 'react-dom/client'
import { DevResponsivePage } from './dev-responsive-page'

const devResponsiveRoot = document.getElementById('dev-responsive-root')
if (!devResponsiveRoot) throw new Error('missing #dev-responsive-root mount element')

createRoot(devResponsiveRoot).render(<DevResponsivePage />)
