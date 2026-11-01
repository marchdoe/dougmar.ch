import { css } from '../../../styled-system/css'
import { HeroField } from './HeroField'
import { Topbar } from './Topbar'

type Props = { statement: string; name: string; role: string }

export function AboutHero({ statement, name, role }: Props) {
  return (
    <HeroField>
      <Topbar />
      <div
        className={css({
          marginTop: { base: '6', lg: '7' },
          alignSelf: 'start',
          justifySelf: 'start',
          display: 'flex',
          flexDirection: 'column',
          gap: '5',
          bg: 'bg',
          color: 'text',
          paddingBlock: { base: '5', lg: '6' },
          paddingInline: { base: '4', lg: '6' },
          borderRadius: 'md',
          minWidth: '0',
          maxWidth: '100%',
        })}
      >
        <h1
          className={css({
            fontFamily: 'display',
            fontWeight: 'normal',
            fontSize: { base: '22px', lg: '30px' },
            lineHeight: 'snug',
            color: 'text',
            maxWidth: '46ch',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '0ms',
          })}
        >
          {statement}
        </h1>
        <p
          className={css({
            fontSize: 'base',
            letterSpacing: 'wider',
            textTransform: 'uppercase',
            color: 'textMuted',
            display: 'flex',
            alignItems: 'center',
            gap: '3',
            animation: 'wipe 500ms cubic-bezier(0.16, 1, 0.3, 1) both',
            animationDelay: '80ms',
            _before: {
              content: '""',
              width: '34px',
              height: '1px',
              bg: 'borderStrong',
              flexShrink: 0,
            },
          })}
        >
          {name}, {role}
        </p>
      </div>
    </HeroField>
  )
}
