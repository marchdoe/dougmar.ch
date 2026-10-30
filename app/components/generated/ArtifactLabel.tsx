import { css } from '../../../styled-system/css'
import { Label } from './Label'

export function ArtifactLabel({ left, right }: { left: string; right: string }) {
  return (
    <div
      className={css({
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        rowGap: '4px',
        columnGap: '16px',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: 'borderStrong',
        paddingBottom: '8px',
        marginBottom: '12px',
      })}
    >
      <Label>{left}</Label>
      {right ? <Label>{right}</Label> : null}
    </div>
  )
}
