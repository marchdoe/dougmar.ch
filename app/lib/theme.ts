/**
 * The visitor's light or dark choice (#691).
 *
 * THEME_INIT_SCRIPT in __root.tsx puts the class on <html> before first paint,
 * and these helpers read the same `localStorage.theme` it reads. The script
 * stays because it runs before any component does; this file covers what
 * happens after that.
 *
 * Hand-written and outside the engineer's write allowlist, so it survives the
 * nightly redesign.
 */

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

/**
 * The tokens that tell two looks apart. The Art Director's preset sets all of
 * them, and a night with one look gives them the same value in both schemes.
 */
const LOOK_TOKENS = [
  '--colors-bg',
  '--colors-bg-alt',
  '--colors-surface',
  '--colors-text',
  '--colors-accent',
  '--colors-border',
]

/** The saved choice, or the OS setting when there is none. */
export function resolveTheme(): Theme {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(STORAGE_KEY)
  } catch {
    // Blocked storage: the visitor still gets their OS setting.
  }
  if (stored === 'light' || stored === 'dark') return stored
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: Theme) {
  const { classList } = document.documentElement
  classList.remove(theme === 'dark' ? 'light' : 'dark')
  classList.add(theme)
}

/** Apply a choice and remember it. With blocked storage it lasts for this page. */
export function chooseTheme(theme: Theme) {
  applyTheme(theme)
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Nothing to do: the page has already switched.
  }
}

function readLook(): string {
  const style = getComputedStyle(document.body)
  return LOOK_TOKENS.map((token) => style.getPropertyValue(token).trim()).join('|')
}

/**
 * Whether tonight's design differs between the schemes. On some nights it does
 * not (2026-10-19, 10-24 and 10-25), and a toggle there would do nothing.
 *
 * This flips the class and reads the tokens inside one task, so no frame is
 * painted between the flips.
 */
export function hasTwoLooks(): boolean {
  applyTheme('light')
  const light = readLook()
  applyTheme('dark')
  const dark = readLook()
  applyTheme(resolveTheme())
  return light !== dark
}
