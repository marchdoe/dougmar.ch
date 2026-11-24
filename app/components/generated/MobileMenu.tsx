import { css } from '../../../styled-system/css'
import { navItems } from './NavIndex'

export function MobileMenu() {
  return (
    <details className={css({ position: 'relative', display: { base: 'block', lg: 'none' } })}>
      <summary
        className={css({
          listStyle: 'none',
          cursor: 'pointer',
          minHeight: '44px',
          minWidth: '44px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2',
          paddingInline: '6px',
          fontFamily: 'body',
          fontWeight: 'bold',
          textStyle: 'xs',
          textTransform: 'uppercase',
          letterSpacing: 'wider',
          color: 'text',
          '&::-webkit-details-marker': { display: 'none' },
          _after: { content: '"+"', color: 'accent', fontWeight: 'bold' },
        })}
      >
        Menu
      </summary>
      <ol
        className={css({
          display: 'none',
          'details[open] > &': { display: 'block' },
          position: 'absolute',
          right: '0',
          top: '100%',
          zIndex: '10',
          bg: 'surface',
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'borderStrong',
          listStyle: 'none',
          margin: '0',
          paddingBlock: '2',
          paddingInline: '4',
          minWidth: '180px',
        })}
      >
        {navItems.map((item) => (
          <li key={item.num}>
            <a
              href={item.href}
              className={css({
                display: 'flex',
                alignItems: 'center',
                gap: '2',
                minHeight: '44px',
                color: 'text',
                fontFamily: 'body',
                fontWeight: 'bold',
                textStyle: 'sm',
                _hover: { color: 'accent', textDecoration: 'none' },
              })}
            >
              <span
                className={css({
                  color: 'accent',
                  textStyle: 'xs',
                  fontVariantNumeric: 'tabular-nums',
                })}
              >
                {item.num}
              </span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </details>
  )
}
