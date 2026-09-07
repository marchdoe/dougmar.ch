import { styled } from '../../../styled-system/jsx'
import { FieldBand } from './FieldBand'
import { Masthead } from './Masthead'

type Props = { title: string; type: string; year: number }

export function ProjectHero({ title, type, year }: Props) {
  return (
    <FieldBand>
      <Masthead onField />
      <styled.p
        fontFamily="body"
        textStyle="sm"
        fontWeight="600"
        letterSpacing="wide"
        textTransform="uppercase"
        color="fieldInkMuted"
        marginBottom="3"
      >
        {type} · {year}
      </styled.p>
      <styled.h1
        fontFamily="display"
        fontWeight="500"
        color="fieldInk"
        textStyle={{ base: '3xl', lg: 'hero' }}
        lineHeight="1.02"
        letterSpacing="tight"
        maxWidth={{ base: '18ch', lg: '20ch' }}
        margin="0"
      >
        {title}
      </styled.h1>
    </FieldBand>
  )
}
