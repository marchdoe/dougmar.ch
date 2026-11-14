import { css } from '../../../styled-system/css'

type Client = { name: string; logo?: string }

// Mockup chip #f1f6f4 has no exact token. A light chip in both schemes: text (dark scheme), surface (light scheme).
const chipCls = css({
  bg: { base: 'text', _light: 'surface' },
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: { base: 'text', _light: 'border' },
  borderRadius: 'sm',
  paddingBlock: '2',
  paddingInline: '3',
  display: 'flex',
  alignItems: 'center',
  minHeight: '44px',
})

const imgCls = css({ height: '28px', width: 'auto', maxWidth: '120px', display: 'block' })

const nameCls = css({
  fontFamily: 'body',
  fontWeight: 'bold',
  fontSize: 'xs',
  letterSpacing: 'tight',
  color: { base: 'bg', _light: 'text' },
})

export function ClientChip({ client, lazy }: { client: Client; lazy: boolean }) {
  return (
    <span className={chipCls}>
      {client.logo ? (
        <img
          src={client.logo}
          alt={client.name}
          loading={lazy ? 'lazy' : undefined}
          className={imgCls}
        />
      ) : (
        <span className={nameCls}>{client.name}</span>
      )}
    </span>
  )
}
