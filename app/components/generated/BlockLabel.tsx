import { styled } from '../../../styled-system/jsx'

// Dark scheme: fieldInkMuted reads 4.1:1 on the gold field, so labels take fieldInk there.
export const BlockLabel = styled('div', {
  base: {
    textStyle: '2xs',
    letterSpacing: 'widest',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: { base: 'fieldInk', _light: 'fieldInkMuted' },
    marginBottom: '14px',
  },
})
