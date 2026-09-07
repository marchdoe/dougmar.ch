import { Box, styled } from '../../../styled-system/jsx'
import { FieldBand } from './FieldBand'

export function HomeFieldPayoff() {
  return (
    <FieldBand>
      <styled.p
        fontFamily="display"
        fontWeight="500"
        color="fieldInk"
        textStyle={{ base: '3xl', lg: 'hero' }}
        lineHeight="1.02"
        letterSpacing="tight"
        maxWidth={{ base: '16ch', lg: '18ch' }}
        margin="0"
      >
        a tangible outward form.
      </styled.p>
      <styled.p
        fontFamily="body"
        fontWeight="500"
        letterSpacing="wide"
        color="fieldInkMuted"
        textTransform="uppercase"
        textStyle="sm"
        marginTop={{ base: '6', lg: '7' }}
      >
        Paramahansa Yogananda
      </styled.p>
      <Box
        marginTop={{ base: '9', lg: '9' }}
        borderTop="1px solid"
        borderColor="fieldBorder"
        paddingTop="6"
        maxWidth="60ch"
      >
        <styled.span
          display="block"
          fontFamily="body"
          textStyle="xs"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing="wide"
          color="fieldInkMuted"
          marginBottom="2"
        >
          The holiday · September 7
        </styled.span>
        <styled.p
          fontFamily="display"
          fontWeight="500"
          color="fieldInk"
          textStyle="lg"
          lineHeight="1.2"
          margin="0"
        >
          Labor Day — the work, made tangible.
        </styled.p>
      </Box>
    </FieldBand>
  )
}
