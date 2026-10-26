import { cva } from '../../../styled-system/css'

// Mockup tone hexes mapped to the nearest semantic tokens:
// dark2 #2d2615 -> field; brass #cda235 -> accentAlt (accent in light fails 4.5:1 under small ink);
// brass2 #ddb954 -> fieldInkMuted; paper #ffffff -> surface; paper2 #f0e9d8 -> bgAlt;
// year #74501b -> accentAlt.
export const tile = cva({
  base: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '14px',
    paddingBlock: 'clamp(20px, 2.6vw, 34px)',
    paddingInline: { base: 'clamp(20px, 6vw, 96px)', lg: 'clamp(22px, 2.2vw, 40px)' },
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderRightWidth: '1px',
    borderRightStyle: 'solid',
    minHeight: '150px',
    minWidth: '0',
    transition: 'background-color 0.2s ease',
  },
  variants: {
    tone: {
      dark: {
        bg: 'field',
        color: 'fieldInk',
        borderColor: 'fieldBorder',
        '& [data-part=title]': { color: 'fieldInk' },
        '& [data-part=meta]': { borderTopColor: 'fieldBorder' },
        '& [data-part=role]': { color: 'fieldInkMuted' },
        '& [data-part=yr]': { color: 'fieldInkMuted' },
        '&:hover [data-part=title]': { color: 'fieldInkMuted' },
      },
      brass: {
        bg: 'accentAlt',
        color: 'accentText',
        borderColor: 'accent',
        '& [data-part=title]': { color: 'accentText' },
        '& [data-part=meta]': { borderTopColor: 'accent' },
        '& [data-part=role]': { color: 'accentText' },
        '& [data-part=yr]': { color: 'accentText' },
        '&:hover [data-part=title]': { opacity: 0.82 },
      },
      brass2: {
        bg: 'fieldInkMuted',
        color: 'field',
        borderColor: 'accent',
        '& [data-part=title]': { color: 'field' },
        '& [data-part=meta]': { borderTopColor: 'accent' },
        '& [data-part=role]': { color: 'field' },
        '& [data-part=yr]': { color: 'field' },
        '&:hover [data-part=title]': { color: 'accentAlt' },
      },
      paper: {
        bg: 'surface',
        color: 'text',
        borderColor: 'border',
        '& [data-part=title]': { color: 'text' },
        '& [data-part=meta]': { borderTopColor: 'border' },
        '& [data-part=role]': { color: 'textMuted' },
        '& [data-part=yr]': { color: 'accentAlt' },
        '&:hover [data-part=title]': { color: 'accent' },
      },
      paper2: {
        bg: 'bgAlt',
        color: 'text',
        borderColor: 'border',
        '& [data-part=title]': { color: 'text' },
        '& [data-part=meta]': { borderTopColor: 'border' },
        '& [data-part=role]': { color: 'textMuted' },
        '& [data-part=yr]': { color: 'accentAlt' },
        '&:hover [data-part=title]': { color: 'accent' },
      },
    },
    span: {
      one: {},
      two: { gridRow: { lg: 'span 2' } },
      three: { gridRow: { lg: 'span 3' } },
    },
  },
  defaultVariants: { tone: 'paper', span: 'one' },
})
