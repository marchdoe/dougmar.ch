import { css, cva } from '../../../styled-system/css'

// The panel's permanent mini design system. Colors come from the `panel.*`
// tokens in panda.config.ts, not the site's own theme — that is redesigned
// daily by the pipeline and must never leak in here. See the token's comment
// there for why this group exists as its own thing rather than reusing `colors.*`.

const focusRing = {
  outlineWidth: '2px',
  outlineStyle: 'solid',
  outlineColor: 'panel.ink',
  outlineOffset: '2px',
} as const

export const page = css({
  minHeight: '100vh',
  backgroundColor: 'panel.bg',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  fontSize: '16px',
  lineHeight: '1.5',
  color: 'panel.ink',
  padding: '24px 16px',
})

export const sheet = css({
  maxWidth: '640px',
  margin: '0 auto',
  backgroundColor: 'panel.surface',
  border: '1px solid',
  borderColor: 'panel.border',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: 'panel.sm',
})

export const pageTitle = css({
  fontSize: '17px',
  fontWeight: '650',
  marginBottom: '16px',
})

export const sectionTitle = css({
  fontSize: '14px',
  fontWeight: '600',
  marginBottom: '12px',
})

export const segTabs = css({
  display: 'flex',
  gap: '4px',
  backgroundColor: 'panel.bgMuted',
  borderRadius: '8px',
  padding: '3px',
  marginBottom: '20px',
})

export const segTab = css({
  flex: '1',
  minHeight: '44px',
  border: 'none',
  backgroundColor: 'transparent',
  borderRadius: '6px',
  fontSize: '13px',
  fontFamily: 'inherit',
  color: 'panel.muted',
  cursor: 'pointer',
  '&[data-active]': {
    backgroundColor: 'panel.surface',
    color: 'panel.ink',
    fontWeight: '600',
    boxShadow: 'panel.md',
  },
  '&:focus-visible': focusRing,
})

export const fieldLabel = css({
  display: 'block',
  fontSize: '11px',
  fontWeight: '600',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: 'panel.muted',
  marginBottom: '5px',
})

export const field = css({ marginBottom: '14px' })

export const textArea = css({
  display: 'block',
  width: '100%',
  border: '1px solid',
  borderColor: 'panel.borderStrong',
  borderRadius: '8px',
  padding: '10px',
  fontSize: '14px',
  fontFamily: 'inherit',
  lineHeight: '1.5',
  color: 'panel.ink',
  backgroundColor: 'panel.surface',
  resize: 'vertical',
  '&:focus-visible': focusRing,
})

export const button = cva({
  base: {
    minHeight: '44px',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    fontFamily: 'inherit',
    border: '1px solid transparent',
    cursor: 'pointer',
    '&:disabled': { opacity: '0.5', cursor: 'default' },
    '&:focus-visible': focusRing,
  },
  variants: {
    kind: {
      primary: { backgroundColor: 'panel.ink', color: 'panel.surface' },
      secondary: {
        backgroundColor: 'panel.surface',
        color: 'panel.subtle',
        borderColor: 'panel.borderStrong',
      },
    },
  },
  defaultVariants: { kind: 'primary' },
})

// The grade picker (RateTab) is a Base UI RadioGroup of Radio.Root buttons —
// a radio, not a ToggleGroup, because a grade cannot be deselected by
// re-clicking it, and a RadioGroup's `data-checked` matches that exactly. See
// the base-ui skill on data-attribute state hooks.
export const gradeButton = css({
  width: '44px',
  height: '44px',
  fontSize: '16px',
  fontWeight: '600',
  fontFamily: 'inherit',
  lineHeight: '1',
  border: '1px solid',
  borderColor: 'panel.borderStrong',
  borderRadius: '8px',
  backgroundColor: 'panel.surface',
  color: 'panel.subtle',
  cursor: 'pointer',
  '&[data-checked]': {
    backgroundColor: 'panel.ink',
    borderColor: 'panel.ink',
    color: 'panel.surface',
  },
  '&:focus-visible': focusRing,
})

export const badge = cva({
  base: {
    fontSize: '11px',
    fontWeight: '700',
    borderRadius: '5px',
    padding: '1px 6px',
    border: '1px solid',
  },
  variants: {
    kind: {
      graded: {
        backgroundColor: 'panel.successBg',
        color: 'panel.success',
        borderColor: 'panel.successBorder',
      },
      none: {
        backgroundColor: 'panel.bgMuted',
        color: 'panel.muted',
        borderColor: 'panel.border',
      },
    },
  },
})

export const statusDot = cva({
  base: {
    width: '8px',
    height: '8px',
    borderRadius: '9999px',
    display: 'inline-block',
    flexShrink: '0',
  },
  variants: {
    tone: {
      success: { backgroundColor: 'panel.success' },
      failure: { backgroundColor: 'panel.danger' },
      pending: { backgroundColor: 'panel.warning' },
    },
  },
})

export const mutedText = css({ fontSize: '12px', color: 'panel.muted' })

export const dateMuted = css({ fontWeight: '400', color: 'panel.muted' })

export const errorText = css({ fontSize: '13px', color: 'panel.danger' })

export const successText = css({ fontSize: '13px', color: 'panel.success' })

export const inlineLink = css({
  color: 'panel.ink',
  fontWeight: '600',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  '&:focus-visible': focusRing,
})

export const runBox = css({
  border: '1px solid',
  borderColor: 'panel.border',
  borderRadius: '8px',
  padding: '12px',
  marginBottom: '14px',
})

export const checkboxRow = css({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
  minHeight: '44px',
  fontSize: '13px',
  color: 'panel.subtle',
  marginBottom: '14px',
  cursor: 'pointer',
})

// RunTab and WeightsTab compose this with Base UI's Checkbox.Root (a span,
// not a native input), so it styles the box itself rather than `accentColor`.
export const checkboxBox = css({
  width: '16px',
  height: '16px',
  flexShrink: '0',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid',
  borderColor: 'panel.borderStrong',
  borderRadius: '4px',
  backgroundColor: 'panel.surface',
  color: 'panel.surface',
  '&[data-checked]': {
    backgroundColor: 'panel.ink',
    borderColor: 'panel.ink',
  },
  '&:focus-visible': focusRing,
})

export const checkboxIndicator = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
})

export const sliderRow = css({ marginBottom: '18px' })

export const sliderLabelRow = css({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '13px',
  fontWeight: '600',
  color: 'panel.ink',
  marginBottom: '2px',
  '& span': { fontVariantNumeric: 'tabular-nums', color: 'panel.subtle' },
})

export const sliderControl = css({
  display: 'flex',
  alignItems: 'center',
  height: '44px',
  width: '100%',
  cursor: 'pointer',
})

export const sliderTrack = css({
  height: '4px',
  width: '100%',
  backgroundColor: 'panel.border',
  borderRadius: '9999px',
  position: 'relative',
})

export const sliderIndicator = css({
  backgroundColor: 'panel.ink',
  borderRadius: '9999px',
})

export const sliderThumb = css({
  width: '16px',
  height: '16px',
  borderRadius: '9999px',
  backgroundColor: 'panel.surface',
  border: '1px solid',
  borderColor: 'panel.borderStrong',
  boxShadow: 'panel.lg',
  '&:has(input:focus-visible)': focusRing,
})

export const archiveLink = css({
  fontSize: '13px',
  color: 'panel.ink',
  fontWeight: '600',
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
  '&:focus-visible': focusRing,
})

export const ratingNotes = css({ fontSize: '12px', color: 'panel.subtle', marginTop: '2px' })

export const archiveRow = css({
  padding: '10px 0',
  borderBottom: '1px solid',
  borderColor: 'panel.bgMuted',
})

export const runStatusLine = css({
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  fontSize: '13px',
  fontWeight: '600',
  color: 'panel.ink',
})

export const subtleLink = css({
  color: 'panel.ink',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
  '&:focus-visible': focusRing,
})
