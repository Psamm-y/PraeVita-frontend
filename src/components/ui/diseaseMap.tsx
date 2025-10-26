import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import React from 'react';

export interface DiseaseData {
  lat: number;
  lng: number;
  severity: number;
  name: string;
}

export interface DiseaseMapProps {
  /** Array of disease points to render on the map */
  diseaseData: DiseaseData[];
  /** Optional center coordinate for the map (lat, lng) */
  center?: [number, number];
  /** Optional initial zoom level */
  zoom?: number;
  /** CSS height (or number) for the map container */
  height?: string | number;
}

export default function DiseaseMap({
  diseaseData,
  center = [7.9465, -1.0232],
  zoom = 7,
  height = '500px',
}: DiseaseMapProps) {
  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {diseaseData.map((point, i) => (
        <CircleMarker
          key={i}
          center={[point.lat, point.lng]}
          radius={5}
          pathOptions={{
            color: point.severity > 6 ? 'red' : point.severity > 3 ? 'orange' : 'green',
            fillOpacity: 1,
          }}
        >
          <Tooltip>{`${point.name}: Severity ${point.severity}`}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
