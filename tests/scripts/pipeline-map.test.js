import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { renderPipelineMap } from '../../scripts/pipeline-map/build.js'
import {
  checkBasis,
  checkEdges,
  checkKinds,
  checkSources,
  checkUniqueIds,
  checkViews,
  serializeMap,
} from '../../scripts/pipeline-map/validate.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const read = (p) => readFileSync(path.join(ROOT, p), 'utf8')

const map = JSON.parse(read('docs/pipeline-map/map.json'))
const template = read('scripts/pipeline-map/template.html')

describe('pipeline map data', () => {
  it('has unique node, edge and view ids', () => {
    expect(checkUniqueIds(map)).toEqual([])
  })

  it('uses only known node kinds', () => {
    expect(checkKinds(map)).toEqual([])
  })

  it('points every edge at real nodes', () => {
    expect(checkEdges(map)).toEqual([])
  })

  it('resolves every view node, edge and parent', () => {
    expect(checkViews(map)).toEqual([])
  })

  it('names a source path that exists for every local source', () => {
    expect(checkSources(map)).toEqual([])
  })

  it('records the full commit sha it was last checked against', () => {
    expect(checkBasis(map)).toEqual([])
  })

  it('is stored in the layout the refresh writes, so a refresh diff is only its edits', () => {
    expect(serializeMap(map)).toBe(read('docs/pipeline-map/map.json'))
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

  it('leaves the basis commit out of the page', () => {
    expect(renderPipelineMap(template, map)).not.toContain(map.basis)
  })

  it('keeps the data block inert: no closing tag can end the script early', () => {
    const block = renderPipelineMap(template, map).match(
      /<script id="visual-data" type="application\/json">([\s\S]*?)<\/script>/
    )
    expect(block?.[1]).not.toContain('</')
  })
})
