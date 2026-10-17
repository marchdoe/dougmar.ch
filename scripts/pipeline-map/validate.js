/**
 * The schema checks for docs/pipeline-map/map.json, shared by the vitest suite
 * (tests/scripts/pipeline-map.test.js) and `pnpm pipeline-map:refresh`, which
 * must not write a map the tests would reject.
 *
 * Each check returns a list of problems; an empty list passes.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
export const MAP_PATH = path.join(ROOT, 'docs/pipeline-map/map.json')
export const KINDS = ['agent', 'gate', 'workflow', 'state', 'script']

/** Local (repo-relative) entries of a node's `source`, leading slashes dropped. */
export const localSources = (node) =>
  (node.source ?? []).filter((p) => !p.startsWith('http')).map((p) => p.replace(/^\/+/, ''))

function duplicates(list) {
  const seen = new Set()
  return list.filter((id) => seen.has(id) || !seen.add(id))
}

export function checkUniqueIds(map) {
  return [
    ...duplicates(map.nodes.map((n) => n.id)).map((id) => `duplicate node id ${id}`),
    ...duplicates(map.edges.map((e) => e.id)).map((id) => `duplicate edge id ${id}`),
    ...duplicates(map.views.map((v) => v.id)).map((id) => `duplicate view id ${id}`),
  ]
}

export function checkKinds(map) {
  return map.nodes.filter((n) => !KINDS.includes(n.kind)).map((n) => `${n.id}: kind ${n.kind}`)
}

export function checkEdges(map) {
  const nodeIds = new Set(map.nodes.map((n) => n.id))
  return map.edges.flatMap((e) => [
    ...(nodeIds.has(e.from) ? [] : [`${e.id} from ${e.from}`]),
    ...(nodeIds.has(e.to) ? [] : [`${e.id} to ${e.to}`]),
  ])
}

export function checkViews(map) {
  const nodeIds = new Set(map.nodes.map((n) => n.id))
  const edgeIds = new Set(map.edges.map((e) => e.id))
  const viewIds = new Set(map.views.map((v) => v.id))
  return map.views.flatMap((v) => [
    ...(v.nodeIds ?? []).filter((id) => !nodeIds.has(id)).map((id) => `${v.id} node ${id}`),
    ...(v.edges ?? []).filter((id) => !edgeIds.has(id)).map((id) => `${v.id} edge ${id}`),
    ...(v.parent && !viewIds.has(v.parent) ? [`${v.id} parent ${v.parent}`] : []),
  ])
}

/** `exists` is injectable so the refresh can check against a commit, not the disk. */
export function checkSources(map, exists = (p) => existsSync(path.join(ROOT, p))) {
  return map.nodes.flatMap((n) =>
    localSources(n)
      .filter((p) => !exists(p))
      .map((p) => `${n.id}: ${p}`)
  )
}

export function checkBasis(map) {
  return /^[0-9a-f]{40}$/.test(map.basis ?? '')
    ? []
    : [`basis must be a full commit sha, got ${JSON.stringify(map.basis)}`]
}

/** Every check at once, as one list. */
export function validateMap(map, { exists } = {}) {
  return [
    ...checkUniqueIds(map),
    ...checkKinds(map),
    ...checkEdges(map),
    ...checkViews(map),
    ...checkSources(map, exists),
    ...checkBasis(map),
  ]
}

export const readMap = (file = MAP_PATH) => JSON.parse(readFileSync(file, 'utf8'))

/**
 * The committed layout: one-space indent, with number arrays (view layouts) kept on one
 * line. Matches the file as it is, so a refresh diff shows only what changed.
 */
export function serializeMap(map) {
  const text = JSON.stringify(map, null, 1).replace(
    /\[\s*(-?[\d.e+-]+(?:,\s*-?[\d.e+-]+)*)\s*\]/g,
    (_m, list) => `[${list.split(/,\s*/).join(', ')}]`
  )
  return `${text}\n`
}

export const writeMap = (map, file = MAP_PATH) => writeFileSync(file, serializeMap(map), 'utf8')
