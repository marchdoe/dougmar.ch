// app/types/panel.ts
//
// The owner panel's wire contract, declared once.
//
// These three interfaces were written out twice — in api/_lib/github.ts and
// again in app/components/panel/api.ts — with no link between them. Renaming a
// field on one side compiled cleanly on both and crashed at runtime in
// panel.tsx (`status.unrated` undefined → `unrated.length`). Type-only
// imports, so nothing crosses the api/ ↔ app/ boundary at runtime.

export interface RatingIssue {
  number: number
  date: string
  title: string
  url: string
}

export interface Weights {
  signals: number
  inspiration: number
  ratings: number
  /** null = unset; design-agents.js derives risk 3-10 from the build date. */
  risk: number | null
}

export interface RunInfo {
  status: string
  conclusion: string | null
  url: string
  createdAt: string
}

/** The rating scale the panel offers and /api/panel/rate accepts. */
export type Grade = 'A' | 'B' | 'C' | 'D'

export type StatusSection = 'unrated' | 'weights' | 'latestRun'

export interface PanelStatus {
  unrated: RatingIssue[]
  /** null when the weights read failed; see `errors.weights`. */
  weights: Weights | null
  latestRun: RunInfo | null
  /** One message per section whose GitHub read failed. The rest is real. */
  errors: Partial<Record<StatusSection, string>>
}
