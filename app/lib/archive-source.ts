import { createIsomorphicFn } from '@tanstack/react-start'
import { fetchArchiveFile } from './archive-data'

/**
 * The archive source a route loader uses.
 *
 * A loader runs twice over: in the prerender, where `fetch('/archive-data/…')`
 * has no origin to resolve against, and in the browser, on a page the
 * prerender did not cover. The server half reads the file the build wrote
 * before it started (`generate-archive-json.js`), and is compiled out of the
 * client bundle, along with its `node:` imports.
 */
export const readArchiveFile = createIsomorphicFn()
  .server(async (file: string): Promise<unknown> => {
    const { readFile } = await import('node:fs/promises')
    const { join } = await import('node:path')
    return JSON.parse(await readFile(join(process.cwd(), 'public', 'archive-data', file), 'utf8'))
  })
  .client(fetchArchiveFile)
