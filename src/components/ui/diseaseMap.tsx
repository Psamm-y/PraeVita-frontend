import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const diseaseData = [
  { lat: 5.6037, lng: -0.1870, severity: 8, name: "Accra" },
  { lat: 6.6921, lng: -1.6164, severity: 4, name: "Kumasi" },
  { lat: 9.4008, lng: -0.8393, severity: 2, name: "Tamale" },
];

export default function DiseaseMap() {
  return (
    <MapContainer center={[7.9465, -1.0232]} zoom={7} style={{ height: "500px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {diseaseData.map((point, i) => (
        <CircleMarker
          key={i}
          center={[point.lat, point.lng]}
          radius={5}
          pathOptions={{
            color: point.severity > 6 ? 'red' : point.severity > 3 ? 'orange' : 'green',
            fillOpacity: 1
          }}
        >
          <Tooltip>{`${point.name}: Severity ${point.severity}`}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
