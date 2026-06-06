import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker, Tooltip  } from 'react-leaflet'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'



const invisibleIcon = L.divIcon({
  html: '',
  className: '',
  iconSize: [0, 0],
})
const villages = [
  {
    tehsil: 'Indore',
    villages: 120,
    lat: 22.7196,
    lng: 75.8577,
  },
  {
    tehsil: 'Sanwer',
    villages: 85,
    lat: 22.9747,
    lng: 75.8275,
  },
  {
    tehsil: 'Depalpur',
    villages: 65,
    lat: 22.8500,
    lng: 75.5500,
  },
  {
    tehsil: 'Ujjain',
    villages: 110,
    lat: 23.1765,
    lng: 75.7885,
  },
  {
    tehsil: 'Badnagar',
    villages: 55,
    lat: 23.0200,
    lng: 75.2000,
  },
  {
    tehsil: 'Dewas',
    villages: 90,
    lat: 22.9676,
    lng: 76.0534,
  },
  {
    tehsil: 'Sonkatch',
    villages: 40,
    lat: 22.9500,
    lng: 76.6500,
  },
]

const getColor = (count) => {
  if (count > 100) return '#E31E24'
  if (count > 70) return '#ff6b6b'
  return '#ffb3b3'
}

export default function MadhyaPradeshMap() {
  return (
    <MapContainer
      center={[22.95, 76.20]}
      zoom={9}
      scrollWheelZoom={true}
      style={{
        height: '300px',
        width: '100%',
        borderRadius: '0',
      }}
    >
      
<TileLayer
  attribution='&copy; OpenStreetMap contributors & CARTO'
  url='https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
/>

{villages.map((v) => (
  <Marker
    key={v.tehsil}
    position={[v.lat, v.lng]}
    icon={invisibleIcon}
  >

    <Tooltip permanent direction="top" opacity={1}>
  <div
    style={{
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }}
  >
    <span
      style={{
        color: '#E31E24',
        fontSize: '10px',
      }}
    >
      📍
    </span>

    <span
      style={{
        color: '#1E3A8A', // Dark Blue
        fontSize: '10px',
        fontWeight: 700,
      }}
    >
      {v.tehsil}
    </span>

    <span
      style={{
        color: '#000000', // Black
        fontSize: '10px',
        fontWeight: 700,
      }}
    >
      ({v.villages})
    </span>
  </div>
</Tooltip>
  </Marker>
))}

      
    </MapContainer>
  )
}
function FitBounds() {
  const map = useMap()

  useEffect(() => {
    map.fitBounds([
      [22.55, 75.20], // SW
      [23.35, 76.80], // NE
    ],
    {
        padding: [20, 20],
        maxZoom: 10,
      }
  
  )
  }, [map])

  return null
}