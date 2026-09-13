import { DataGrid, type DataGridItem } from './DataGrid'

const items: DataGridItem[] = [
  { k: 'Market · SPY', v: '764.29', accentUp: true, sub: '0.85%' },
  { k: 'Weather', v: '71.7°F', sub: 'Fog · 97%' },
  { k: 'Moon', v: '5.9%', sub: 'Waxing crescent' },
  { k: 'Golf', v: 'Biltmore', sub: 'Asheville · scheduled' },
  { k: 'Air · AQI', v: 'Good', sub: 'UV 0' },
  { k: 'On rotation', v: 'War on Drugs', sub: '/ My Morning Jacket' },
]

export function BoxScoreStrip() {
  return <DataGrid heading="The box score · Sun Sep 13, Aldie VA" items={items} />
}
