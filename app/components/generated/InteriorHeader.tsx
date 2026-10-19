import { css } from '../../../styled-system/css'
import { BrandLockup } from '../BrandLockup'
import { SentenceNav } from './SentenceNav'

export function InteriorHeader() {
  return (
    <header
      className={css({
        position: 'relative',
        bg: 'bg',
        paddingBlock: { base: '24px', sm: '40px' },
        paddingInline: { base: '24px', sm: '6vw' },
        display: 'flex',
        flexDirection: { base: 'column', md: 'row' },
        alignItems: { base: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        gap: '3',
      })}
    >
      <a
        href="/"
        className={css({
          display: 'inline-flex',
          alignItems: 'center',
          color: 'text',
          _hover: { color: 'text', textDecoration: 'none' },
        })}
      >
        <BrandLockup variant="horizontal-md" mode="original" />
      </a>
      <SentenceNav workHref="/#index" placement="top" />
    </header>
  )
}
