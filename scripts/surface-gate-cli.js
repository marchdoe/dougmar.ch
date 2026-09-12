#!/usr/bin/env node
/**
 * Run the surface gate from a shell (#503).
 *
 * The gate only ever ran inside `design-agents.js`, against a preview server
 * the orchestrator had already started. Checking a finding by hand meant
 * either a whole pipeline run or a scratch script. This is the scratch
 * script, kept.
 *
 *   node scripts/surface-gate-cli.js --port 5173 --route / --route /about
 *
 * `--port` reuses a server that is already listening (`pnpm dev`, or a
 * `vite preview`); without it the gate spawns `vite preview` itself, which
 * needs a `dist/`. `--route` narrows the walk and may repeat; without it every
 * generated route is measured. Output is the gate's JSON, and the exit code
 * is 1 when any finding is an error.
 */

import { parseArgs } from 'node:util'
import { runSurfaceGate } from './utils/surface-gate.js'

const { values } = parseArgs({
  options: {
    port: { type: 'string' },
    route: { type: 'string', multiple: true },
  },
})

const port = values.port ? Number(values.port) : undefined
const routes = values.route?.length
  ? values.route.map((route) => ({ id: route, route }))
  : undefined

const gate = await runSurfaceGate({ port, routes })
console.log(JSON.stringify(gate, null, 2))
process.exitCode = gate.errorCount > 0 ? 1 : 0
