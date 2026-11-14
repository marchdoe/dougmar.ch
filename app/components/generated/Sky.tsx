import type { ReactNode } from 'react'
import { css, cx } from '../../../styled-system/css'

// Mockup sky-glow (#FBEBC0) and sky-horizon (#F7DD8E) have no semantic token;
// they are mixed from accent into bg, the nearest semantic pair.
export function Sky({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        css({
          position: 'relative',
          bg: 'bg',
          backgroundImage:
            'linear-gradient(to bottom, {colors.bg} 0%, {colors.bgAlt} 42%, color-mix(in srgb, {colors.accent} 22%, {colors.bg}) 76%, color-mix(in srgb, {colors.accent} 45%, {colors.bg}) 100%)',
          paddingBlock: 'clamp(28px, 4vw, 56px)',
          paddingInline: 'clamp(24px, 6vw, 112px)',
          display: 'flex',
          flexDirection: 'column',
        }),
        className
      )}
    >
      {children}
    </div>
  )
}
