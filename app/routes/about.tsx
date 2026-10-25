import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import {
  CapabilitiesSection,
  EducationSection,
  PersonalSection,
} from '../components/generated/AboutDetails'
import { InteriorHead } from '../components/generated/InteriorHead'
import { KeyValueGrid } from '../components/generated/KeyValueGrid'
import { TimelineSection } from '../components/generated/TimelineSection'

export const Route = createFileRoute('/about')({ component: AboutPage })

const statementShort = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'light',
  textStyle: '4xl',
  color: 'text',
  maxWidth: '22ch',
})

const statementLong = css({
  fontFamily: 'display',
  fontStyle: 'italic',
  fontWeight: 'light',
  textStyle: 'xl',
  color: 'text',
  maxWidth: '34ch',
})

function AboutPage() {
  const long = identity.statement.length > 120
  return (
    <>
      <InteriorHead
        eyebrow="About"
        title={identity.statement}
        titleClassName={long ? statementLong : statementShort}
        meta={
          <KeyValueGrid
            items={[
              { k: 'Name', v: identity.name },
              { k: 'Role', v: identity.role },
            ]}
          />
        }
      />
      <TimelineSection />
      <CapabilitiesSection />
      <EducationSection />
      <PersonalSection />
    </>
  )
}
