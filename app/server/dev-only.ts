// Why these server functions refuse to run in production.
//
// The production deploy is a static SPA: vite.config.ts builds with
// `tanstackStart({ spa: {} })`, vercel.json ships only dist/client with
// `framework: null` and rewrites everything else to _shell.html. There is no
// server runtime on Vercel for a TanStack server function to execute in, so
// in practice these are unreachable there today.
//
// The guard stays anyway, as the thing that keeps that true. The dev tooling
// reads the archive off disk and writes signals/today.yml, which steers the
// next pipeline run; the day this deploy grows an SSR target, every one of
// these becomes reachable at a generated URL with no other gate in front of
// it. Refusing server-side means that day is not also a disclosure.
//
// /dev/responsive is served by app/dev-server/index.ts, not the router, so the
// production bundle carries no route for it (#328).

import { getRequestHeader, getRequestIP } from '@tanstack/react-start/server'
import { isAllowedOrigin, isLocalHost, isLoopbackAddress } from '../dev-server/guards'

/**
 * The single production flag, for server-side code and client routes alike.
 *
 * dev.responsive.tsx used to test `import.meta.env.PROD` in its own
 * `beforeLoad` while this module tested `process.env.NODE_ENV`, so "is this
 * production" had two answers that could disagree under a bundler that only
 * defines one of them. That route is gone (#328); this is the only answer
 * left.
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

export function assertDevOnly(): void {
  if (isProduction()) {
    throw new Error('This endpoint is only available in development')
  }
}

/**
 * What the request looked like, as the dev-server guard wants it.
 *
 * The /api/* endpoints are Connect middlewares with a Node request; these
 * are TanStack server functions reached over /_serverFn/*, where the request
 * is a web Request behind the start-server-core accessors. Same three checks
 * either way: the peer is loopback, the Host names this machine, and
 * Sec-Fetch-Site / Origin say a local page or the address bar sent it.
 */
export type RequestShape = {
  ip: string | undefined
  headers: { host?: string; origin?: string; 'sec-fetch-site'?: string }
}

/**
 * Refuse a request that did not come from this machine's own browser.
 *
 * NODE_ENV was the only gate on these (#323). Under `pnpm dev --host` a LAN
 * peer could GET the server-function URL for any date and read trace.json,
 * the full agent conversation, while /api/dev-data on the same server
 * answered 403. guards.ts claimed to be "the only thing between it and the
 * network"; for this half it was not in front at all.
 */
export function assertLocalRequest(req: RequestShape): void {
  if (!isLoopbackAddress(req.ip)) {
    throw new Error('Forbidden: dev server functions are localhost-only')
  }
  if (!isLocalHost(req)) {
    throw new Error('Forbidden: host is not local')
  }
  if (!isAllowedOrigin(req)) {
    throw new Error('Forbidden: invalid origin')
  }
}

/** The current server-function request, read through the framework accessors. */
function currentRequest(): RequestShape {
  return {
    ip: getRequestIP(),
    headers: {
      host: getRequestHeader('host'),
      origin: getRequestHeader('origin'),
      'sec-fetch-site': getRequestHeader('sec-fetch-site'),
    },
  }
}

/**
 * Wrap a handler so it cannot be registered without the guards.
 *
 * Each server function in archive.ts calls assertDevOnly() by hand, which
 * works until someone adds the fifth one and forgets.
 */
export function devOnly<Args extends unknown[], R>(
  handler: (...args: Args) => R
): (...args: Args) => R {
  return (...args: Args) => {
    assertDevOnly()
    assertLocalRequest(currentRequest())
    return handler(...args)
  }
}
