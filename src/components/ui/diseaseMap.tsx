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
  /** Legacy single array of disease points (kept for backward compatibility) */
  diseaseData?: DiseaseData[];
  /** Separate arrays for typhoid and cholera points. These take precedence if provided. */
  typhoidData?: DiseaseData[];
  choleraData?: DiseaseData[];
  /** Optional center coordinate for the map (lat, lng) */
  center?: [number, number];
  /** Optional initial zoom level */
  zoom?: number;
  /** CSS height (or number) for the map container */
  height?: string | number;
}

// small offset to slightly separate overlapping markers (degrees)
function offsetCoord(index: number) {
  const step = 0.02 * (1 / (Math.floor(index / 2) + 1));
  return (index % 2 === 0 ? 1 : -1) * step;
}

export default function DiseaseMap({
  diseaseData,
  typhoidData,
  choleraData,
  center = [7.9465, -1.0232],
  zoom = 7,
  height = '500px',
}: DiseaseMapProps) {
  // If separate disease arrays aren't provided, fall back to legacy single array
  const tData = typhoidData ?? (diseaseData ?? []).map(d => ({ ...d }));
  const cData = choleraData ?? (diseaseData ?? []).map(d => ({ ...d }));

  return (
    <MapContainer center={center} zoom={zoom} style={{ height, width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Typhoid markers - green */}
      {tData.map((point, i) => (
        <CircleMarker
          key={`t-${i}-${point.name}`}
          center={[point.lat + offsetCoord(i) * 0.0, point.lng + offsetCoord(i) * 0.0]}
          radius={10}
          pathOptions={{
            color: '#FFFF00',
            fillColor: '#10B981',
            fillOpacity: 1,
          }}
        >
          <Tooltip>{`Typhoid — ${point.name}: Severity ${point.severity}`}</Tooltip>
        </CircleMarker>
      ))}

      {/* Cholera markers - blue (slightly offset so both are visible) */}
      {cData.map((point, i) => (
        <CircleMarker
          key={`c-${i}-${point.name}`}
          center={[point.lat + offsetCoord(i) * 0.1, point.lng - offsetCoord(i) * 0.5]}
          radius={6}
          pathOptions={{
            color: '#06B6D4',
            fillColor: '#06B6D4',
            fillOpacity: 1,
          }}
        >
          <Tooltip>{`Cholera — ${point.name}: Severity ${point.severity}`}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
