import { styled } from '../../../styled-system/jsx'
import { FieldBand } from './FieldBand'
import { personal } from '../../content/about'

export function AboutField() {
  return (
    <FieldBand>
      <styled.p
        fontFamily="display"
        fontWeight="500"
        color="fieldInk"
        textStyle={{ base: '2xl', lg: '4xl' }}
        lineHeight="1.1"
        letterSpacing="tight"
        maxWidth={{ base: '20ch', lg: '28ch' }}
        margin="0"
      >
        One thought, rebuilt each day into form.
      </styled.p>
      <styled.p
        fontFamily="body"
        textStyle="sm"
        fontWeight="500"
        letterSpacing="wide"
        color="fieldInkMuted"
        textTransform="uppercase"
        marginTop={{ base: '5', lg: '6' }}
      >
        Currently — {personal.currentFocus}
      </styled.p>
    </FieldBand>
  )
}
