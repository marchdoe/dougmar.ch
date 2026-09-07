import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'
import { AlmanacGrid, type AlmanacRow } from './AlmanacGrid'
import { identity } from '../../content/about'

export function ColophonFooter({ heading, rows }: { heading: string; rows: AlmanacRow[] }) {
  return (
    <Box
      as="footer"
      bg="bg"
      borderTop="1px solid"
      borderColor="borderStrong"
      paddingInline="clamp(24px, 8vw, 160px)"
      paddingTop="clamp(48px, 7vh, 88px)"
      paddingBottom="clamp(56px, 8vh, 96px)"
    >
      <Box
        as="p"
        fontFamily="body"
        textStyle="xs"
        fontWeight="600"
        textTransform="uppercase"
        letterSpacing="wide"
        color="textFaint"
        marginBottom={{ base: '7', lg: '8' }}
      >
        {heading}
      </Box>
      <AlmanacGrid rows={rows} />
      <Box
        marginTop={{ base: '8', lg: '9' }}
        paddingTop="5"
        borderTop="1px solid"
        borderColor="border"
        display="flex"
        flexWrap="wrap"
        gap="2"
        alignItems="baseline"
      >
        <Box
          as="span"
          fontFamily="display"
          fontWeight="600"
          letterSpacing="tight"
          textStyle="sm"
          color="text"
        >
          {identity.name}
        </Box>
        <a
          href={`mailto:${identity.email}`}
          className={css({ fontFamily: 'body', textStyle: 'xs', color: 'textFaint' })}
        >
          {identity.role} · rebuilt each day into form
        </a>
      </Box>
    </Box>
  )
}
