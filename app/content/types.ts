export type Client = {
  name: string
  logo?: string // local path e.g. '/clients/intuit.svg'; omit for name-only display
  url?: string
  description?: string
}

export type ProjectType = 'SaaS' | 'Design' | 'Product' | 'Founder' | 'AI' | 'OSS' | 'Experiment'

export type Project = {
  slug: string
  title: string
  type: ProjectType
  year: number
  depth: 'full' | 'lightweight'
  featured?: boolean
  externalUrl?: string
  // Full case study fields
  role?: string
  timeline?: string
  status?: string
  problem?: string
  approach?: string
  outcome?: string
  stack?: string[]
  liveUrl?: string
  githubUrl?: string
  // White-paper fields. Optional in the type, expected of every depth:'full'
  // project — see #190. Content here is durable: `app/content/` is refused at
  // the write layer (file-manager.js FORBIDDEN_PREFIXES), so the nightly agent
  // renders these in the day's design without being able to rewrite them.
  /** The situation before the project existed, and why it did. */
  context?: string
  /** What bounded the solution. One clause each. */
  constraints?: string[]
  /** The workflow, in the order it runs. */
  process?: { phase: string; does: string; produces: string }[]
  /** A pointer from the process section to a page that draws it. */
  processMap?: { text: string; linkLabel: string; href: string }
  /** The forks that were live, and what settled them. */
  decisions?: { decision: string; why: string }[]
  /** External lineage worth reading. */
  references?: { title: string; url: string; note?: string }[]
  // Lightweight fields
  description?: string
  // Client list (e.g. Spaceman)
  clients?: Client[]
}
