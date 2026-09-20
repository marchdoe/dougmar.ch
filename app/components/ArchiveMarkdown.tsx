import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { css } from '../../styled-system/css'

/**
 * Markdown for the archive surfaces.
 *
 * The Art Director writes its brief in markdown, and until now `/how/<date>`
 * printed it verbatim: `### 2. Typography`, `- **Hero phrase**`, backticked hex
 * codes, roughly 5KB of it on each of 25 pages. See #212.
 *
 * Measured across all 122 archived dates, the brief uses headings (81 dates),
 * bullets (107), nested bullets (54), numbered lists (81), bold (107), inline
 * code (93) and fenced blocks (29). Italics, links and h4+ never appear, and
 * tables show up twice. GFM was initially left out for those two, but without it
 * a table collapses into one run-on line of pipes and dashes, which is worse
 * than the raw markdown was. Enabled after looking at 2026-07-04.
 *
 * react-markdown escapes raw HTML and sanitises URLs by default, and renders to
 * React elements rather than through innerHTML. That matters: this is agent
 * output, and PR #129 already had to close a prompt-injection hole in the
 * ratings path. Nothing here trusts the string.
 *
 * Every element is mapped onto the archive's own tokens. The archive owns its
 * colour, font and type scale precisely so it does not wear the nightly
 * design's face, and unstyled browser defaults would break that as surely as
 * inheriting the day's preset would.
 */

const heading = css({
  fontSize: 'archive.label',
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  color: 'archive.dim',
  marginTop: '26px',
  marginBottom: '10px',
  fontWeight: 'normal',
})

const para = css({
  fontFamily: 'archive.sans',
  fontSize: 'archive.body',
  lineHeight: '1.75',
  color: 'archive.text',
  maxWidth: '52ch',
  marginBottom: '12px',
  overflowWrap: 'anywhere',
})

const list = css({
  fontFamily: 'archive.sans',
  fontSize: 'archive.body',
  lineHeight: '1.75',
  color: 'archive.text',
  maxWidth: '52ch',
  paddingLeft: '18px',
  marginBottom: '12px',
  overflowWrap: 'anywhere',
  '& ul, & ol': { marginTop: '6px', marginBottom: 0 },
})

const item = css({ marginBottom: '4px' })

// Inside a 12px table head or a 13px cell, 0.92em came to 11.4 to 11.96px, under
// the 12px floor.
const code = css({
  fontFamily: 'archive.mono',
  fontSize: 'max(0.95em, 12px)',
  color: 'archive.text',
  background: 'archive.lineSoft',
  padding: '1px 5px',
  borderRadius: '2px',
})

const pre = css({
  fontFamily: 'archive.mono',
  fontSize: 'archive.small',
  lineHeight: '1.6',
  color: 'archive.text',
  background: 'archive.lineSoft',
  padding: '12px 14px',
  borderRadius: '3px',
  overflowX: 'auto',
  maxWidth: '68ch',
  marginBottom: '12px',
  '& code': { background: 'none', padding: 0, fontSize: 'inherit' },
})

const strong = css({ color: 'archive.text', fontWeight: '600' })

const table = css({
  fontFamily: 'archive.sans',
  fontSize: 'archive.small',
  borderCollapse: 'collapse',
  width: '100%',
  maxWidth: '68ch',
  marginBottom: '12px',
  display: 'block',
  overflowX: 'auto',
})

const th = css({
  textAlign: 'left',
  fontSize: 'archive.label',
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: 'archive.dim',
  fontWeight: 'normal',
  padding: '6px 12px 6px 0',
  borderBottom: '1px solid',
  borderColor: 'archive.line',
  whiteSpace: 'nowrap',
})

const td = css({
  color: 'archive.text',
  padding: '6px 12px 6px 0',
  borderBottom: '1px solid',
  borderColor: 'archive.lineSoft',
  verticalAlign: 'top',
})

const quote = css({
  borderLeft: '2px solid',
  borderColor: 'archive.line',
  paddingLeft: '14px',
  color: 'archive.dim',
  marginBottom: '12px',
})

export function ArchiveMarkdown({ children }: { children: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        // The brief's own `###` are section labels inside a page that already
        // has an h1 and h2s. Rendering them as headings would fight the page's
        // outline, so they take the same visual role as `subhead`.
        h1: (p) => <p className={heading}>{p.children}</p>,
        h2: (p) => <p className={heading}>{p.children}</p>,
        h3: (p) => <p className={heading}>{p.children}</p>,
        h4: (p) => <p className={heading}>{p.children}</p>,
        p: (p) => <p className={para}>{p.children}</p>,
        ul: (p) => <ul className={list}>{p.children}</ul>,
        ol: (p) => <ol className={list}>{p.children}</ol>,
        li: (p) => <li className={item}>{p.children}</li>,
        strong: (p) => <strong className={strong}>{p.children}</strong>,
        em: (p) => <em>{p.children}</em>,
        code: (p) => <code className={code}>{p.children}</code>,
        pre: (p) => <pre className={pre}>{p.children}</pre>,
        blockquote: (p) => <blockquote className={quote}>{p.children}</blockquote>,
        hr: () => null,
        table: (p) => <table className={table}>{p.children}</table>,
        th: (p) => <th className={th}>{p.children}</th>,
        td: (p) => <td className={td}>{p.children}</td>,
      }}
    >
      {children}
    </Markdown>
  )
}
