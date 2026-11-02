import { css } from '../../../styled-system/css'

type FigureProps = {
  fig: string
  figAccent?: string | undefined
  figNote?: string | undefined
}

function SignalFigure({ fig, figAccent, figNote }: FigureProps) {
  return (
    <div
      className={css({
        fontFamily: 'display',
        fontWeight: 'bold',
        fontSize: 'clamp(30px, 2.6vw, 40px)',
        lineHeight: '1',
        color: 'text',
        display: 'flex',
        alignItems: 'baseline',
        columnGap: '10px',
        rowGap: '4px',
        flexWrap: 'wrap',
      })}
    >
      <span>{fig}</span>
      {figAccent ? <span className={css({ color: 'accent' })}>{figAccent}</span> : null}
      {figNote ? (
        <span
          className={css({
            fontFamily: 'body',
            fontWeight: 'bold',
            fontSize: 'sm',
            color: 'textMuted',
          })}
        >
          {figNote}
        </span>
      ) : null}
    </div>
  )
}

type RowProps = Omit<FigureProps, 'fig'> & {
  fig?: string | undefined
  label: string
  sub?: string | undefined
  micro?: string | undefined
}

export function SignalRow({ label, fig, figAccent, figNote, sub, micro }: RowProps) {
  return (
    <div
      className={css({
        paddingBlock: '16px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        '&:last-child': { borderBottomWidth: '0' },
      })}
    >
      <div
        className={css({
          fontFamily: 'display',
          fontWeight: 'bold',
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'widest',
          color: 'textMuted',
          marginBottom: '4px',
        })}
      >
        {label}
      </div>
      {fig ? <SignalFigure fig={fig} figAccent={figAccent} figNote={figNote} /> : null}
      {sub ? (
        <div className={css({ fontSize: 'sm', color: 'textMuted', marginTop: '6px' })}>{sub}</div>
      ) : null}
      {micro ? (
        <div
          className={css({
            fontSize: 'xs',
            color: 'textMuted',
            marginTop: '4px',
            letterSpacing: 'wide',
          })}
        >
          {micro}
        </div>
      ) : null}
    </div>
  )
}
