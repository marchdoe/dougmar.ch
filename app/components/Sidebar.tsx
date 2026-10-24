import { css } from '../../styled-system/css'
import { identity } from '../content/about'
import { BoxScore } from './generated/BoxScore'
import { FootNav } from './generated/FootNav'

export function Sidebar() {
  return (
    <footer
      className={css({
        bg: 'field',
        color: 'fieldInk',
        paddingTop: '52px',
        paddingBottom: '64px',
        paddingInline: '5vw',
      })}
    >
      <div
        className={css({
          maxWidth: '1180px',
          marginInline: 'auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '40px',
        })}
      >
        <FootNav />
        <BoxScore />
        <blockquote
          className={css({
            borderLeft: '3px solid',
            borderLeftColor: 'accent',
            paddingLeft: '18px',
            maxWidth: '48ch',
            minWidth: '0',
          })}
        >
          <p className={css({ textStyle: 'lede', fontStyle: 'italic', color: 'fieldInk' })}>
            “Opportunity often comes disguised in the form of misfortune or temporary defeat.”
          </p>
          <cite
            className={css({
              display: 'block',
              marginTop: '10px',
              fontStyle: 'normal',
              textStyle: '2xs',
              fontWeight: 'bold',
              letterSpacing: 'widest',
              textTransform: 'uppercase',
              color: 'fieldInkMuted',
            })}
          >
            Napoleon Hill
          </cite>
        </blockquote>
        <div
          className={css({
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            rowGap: '2',
            columnGap: '28px',
            borderTop: '1px solid',
            borderTopColor: 'fieldBorder',
            paddingTop: '5',
            textStyle: 'xs',
            color: 'fieldInkMuted',
          })}
        >
          <span>
            <strong className={css({ color: 'fieldInk', fontWeight: 'bold', marginRight: '2' })}>
              In rotation
            </strong>
            The War on Drugs · Guided by Voices
          </span>
          <span>
            <strong className={css({ color: 'fieldInk', fontWeight: 'bold', marginRight: '2' })}>
              Upcoming
            </strong>
            Halloween in 7 days
          </span>
          <span>
            <strong className={css({ color: 'fieldInk', fontWeight: 'bold', marginRight: '2' })}>
              {identity.name}
            </strong>
            {identity.role}
          </span>
          <span>Aldie, VA</span>
          <a
            href={`mailto:${identity.email}`}
            className={css({
              display: 'inline-flex',
              alignItems: 'center',
              minHeight: '44px',
              color: 'fieldInk',
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            })}
          >
            {identity.email}
          </a>
        </div>
      </div>
    </footer>
  )
}
