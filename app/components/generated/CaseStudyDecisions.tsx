import { Box } from '../../../styled-system/jsx'
import { css } from '../../../styled-system/css'

type Props = {
  project: {
    decisions?: { decision: string; why: string }[]
    references?: { title: string; url: string; note?: string }[]
  }
}

export function CaseStudyDecisions({ project }: Props) {
  return (
    <Box
      as="section"
      className={css({
        paddingInline: { base: '5', md: '6', lg: '8' },
        paddingBlock: { base: '7', lg: '9' },
        display: 'flex',
        flexDirection: 'column',
        gap: '6',
      })}
    >
      {project.decisions && (
        <Box>
          <span
            className={css({
              fontFamily: 'display',
              textStyle: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            decisions
          </span>
          <dl
            className={css({ display: 'flex', flexDirection: 'column', gap: '4', marginTop: '4' })}
          >
            {project.decisions.map((d) => (
              <Box
                key={d.decision}
                className={css({ borderTop: '1px solid', borderColor: 'border', paddingTop: '3' })}
              >
                <dt
                  className={css({
                    fontFamily: 'display',
                    fontWeight: 'bold',
                    textStyle: 'sm',
                    color: 'text',
                  })}
                >
                  {d.decision}
                </dt>
                <dd
                  className={css({
                    fontFamily: 'body',
                    textStyle: 'sm',
                    color: 'textMuted',
                    marginTop: '1',
                  })}
                >
                  {d.why}
                </dd>
              </Box>
            ))}
          </dl>
        </Box>
      )}
      {project.references && (
        <Box>
          <span
            className={css({
              fontFamily: 'display',
              textStyle: '2xs',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'textFaint',
            })}
          >
            references
          </span>
          <ul
            className={css({
              display: 'flex',
              flexDirection: 'column',
              gap: '2',
              marginTop: '3',
              paddingLeft: '0',
              listStyle: 'none',
            })}
          >
            {project.references.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener"
                  className={css({
                    fontFamily: 'display',
                    textStyle: 'sm',
                    fontWeight: 'bold',
                    color: 'accentAlt',
                  })}
                >
                  {r.title}
                </a>
                {r.note && (
                  <span
                    className={css({ fontFamily: 'body', textStyle: 'sm', color: 'textFaint' })}
                  >
                    {' '}
                    — {r.note}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Box>
  )
}
