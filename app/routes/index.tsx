import { createFileRoute } from '@tanstack/react-router'
import { Hero } from '../components/generated/Hero'
import { Colophon } from '../components/generated/Colophon'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <>
      <Hero />
      <Colophon
        quote={{ text: '“Express yourself as though everyone is listening.”', who: 'Mandela' }}
        signals={[
          { label: 'New moon', value: '3.3% lit' },
          { label: 'Overcast', value: '69°F · Aldie VA' },
          { label: 'SPY', value: '765.96 (−0.55%)', live: true },
          { label: 'AQI', value: 'Good · UV 0' },
          { label: 'Tigers', value: '2–3' },
          { label: 'Biltmore Championship', value: 'scheduled' },
        ]}
        rotation="Radiohead · Guided by Voices · My Morning Jacket"
      />
    </>
  )
}
