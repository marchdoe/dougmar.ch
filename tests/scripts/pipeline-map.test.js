import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { renderPipelineMap } from '../../scripts/pipeline-map/build.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const read = (p) => readFileSync(path.join(ROOT, p), 'utf8')

const map = JSON.parse(read('docs/pipeline-map/map.json'))
const template = read('scripts/pipeline-map/template.html')
const KINDS = ['agent', 'gate', 'workflow', 'state', 'script']

const nodeIds = new Set(map.nodes.map((n) => n.id))
const edgeIds = new Set(map.edges.map((e) => e.id))
const viewIds = new Set(map.views.map((v) => v.id))

describe('pipeline map data', () => {
  it('has unique node, edge and view ids', () => {
    expect(nodeIds.size).toBe(map.nodes.length)
    expect(edgeIds.size).toBe(map.edges.length)
    expect(viewIds.size).toBe(map.views.length)
  })

  it('uses only known node kinds', () => {
    for (const n of map.nodes) expect(KINDS, `${n.id}: ${n.kind}`).toContain(n.kind)
  })

  it('points every edge at real nodes', () => {
    for (const e of map.edges) {
      expect(nodeIds.has(e.from), `${e.id} from ${e.from}`).toBe(true)
      expect(nodeIds.has(e.to), `${e.id} to ${e.to}`).toBe(true)
    }
  })

  it('resolves every view node, edge and parent', () => {
    for (const v of map.views) {
      for (const id of v.nodeIds ?? []) expect(nodeIds.has(id), `${v.id} node ${id}`).toBe(true)
      for (const id of v.edges ?? []) expect(edgeIds.has(id), `${v.id} edge ${id}`).toBe(true)
      if (v.parent) expect(viewIds.has(v.parent), `${v.id} parent ${v.parent}`).toBe(true)
    }
  })

  it('names a source path that exists for every local source', () => {
    for (const n of map.nodes) {
      for (const p of n.source ?? []) {
        if (p.startsWith('http')) continue
        expect(existsSync(path.join(ROOT, p.replace(/^\/+/, ''))), `${n.id}: ${p}`).toBe(true)
      }
    }
  })
})

describe('pipeline map build', () => {
  it('commits exactly what build.js renders from the committed inputs', () => {
    expect(read('public/pipeline-map/index.html')).toBe(renderPipelineMap(template, map))
  })

  it('rejects a kind the viewer has no mapping for', () => {
    const bad = { ...map, nodes: [{ ...map.nodes[0], kind: 'nope' }] }
    expect(() => renderPipelineMap(template, bad)).toThrow(/unknown kinds/)
  })

  it('rejects a template whose swap anchors have moved', () => {
    expect(() => renderPipelineMap(template.replace('super-board skill map', 'x'), map)).toThrow(
      /anchor not found/
    )
  })

  it('keeps the data block inert: no closing tag can end the script early', () => {
    const block = renderPipelineMap(template, map).match(
      /<script id="visual-data" type="application\/json">([\s\S]*?)<\/script>/
    )
    expect(block?.[1]).not.toContain('</')
  })
})
