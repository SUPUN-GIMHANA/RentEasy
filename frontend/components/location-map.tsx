"use client"

import { useEffect } from "react"
import L from "leaflet"
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet"

interface LocationMapProps {
  center: [number, number]
  marker: [number, number] | null
  onSelect: (lat: number, lng: number) => void
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng)
    },
  })

  return null
}

export default function LocationMap({ center, marker, onSelect }: LocationMapProps) {
  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    })
  }, [])

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler onSelect={onSelect} />
      {marker && <Marker position={marker} />}
    </MapContainer>
  )
}
