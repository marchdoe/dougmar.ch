// This standalone entry (see app/dev-panel.html) never goes through
// __root.tsx, which is what normally pulls in Panda's generated stylesheet;
// without this import the panel's css() classes would have no rules behind
// them, the trap app/dev-responsive-entry.tsx fell into (#554).
import './styles/panda.css'
import { createRoot } from 'react-dom/client'
import { DevPanel } from './dev/DevPanel'

const devRoot = document.getElementById('dev-root')
if (!devRoot) throw new Error('missing #dev-root mount element')

createRoot(devRoot).render(<DevPanel />)
