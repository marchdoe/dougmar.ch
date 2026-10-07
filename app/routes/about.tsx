import { createFileRoute } from '@tanstack/react-router'
import { css } from '../../styled-system/css'
import { AboutFacts } from '../components/generated/AboutFacts'
import { AboutIntro } from '../components/generated/AboutIntro'
import { Capabilities } from '../components/generated/Capabilities'
import { Field } from '../components/generated/Field'
import { Timeline } from '../components/generated/Timeline'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  return (
    <Field>
      <div
        className={css({
          width: '100%',
          maxWidth: '1040px',
          display: 'flex',
          flexDirection: 'column',
          gap: '7',
          textAlign: 'left',
        })}
      >
        <AboutIntro />
        <Timeline />
        <Capabilities />
        <AboutFacts />
      </div>
    </Field>
  )
}
