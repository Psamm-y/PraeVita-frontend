import { GhanaRegion } from './regions';

// Approximate center coordinates (lat, lng) for each Ghana region.
// These are used to place markers on the map for regional predictions.
export const REGION_COORDINATES: Record<GhanaRegion, { lat: number; lng: number }> = {
  'Greater Accra': { lat: 5.6037, lng: -0.1870 }, // Accra
  'Ashanti': { lat: 6.6666, lng: -1.6163 }, // Kumasi
  'Central': { lat: 5.1053, lng: -1.2466 }, // Cape Coast
  'Eastern': { lat: 6.0913, lng: -0.2596 }, // Koforidua
  'Western': { lat: 4.8931, lng: -1.7554 }, // Sekondi-Takoradi
  'Volta': { lat: 6.6000, lng: 0.4700 }, // Ho (approx)
  'Northern': { lat: 9.4008, lng: -0.8393 }, // Tamale
  'Upper East': { lat: 10.7853, lng: -0.8500 }, // Bolgatanga
  'Upper West': { lat: 10.0645, lng: -2.5013 }, // Wa
  'Bono': { lat: 7.3367, lng: -2.3266 }, // Sunyani
  'Bono East': { lat: 7.5833, lng: -1.9333 }, // Techiman
  'Ahafo': { lat: 7.2833, lng: -2.4167 }, // Goaso (approx)
  'Savannah': { lat: 9.0790, lng: -1.8263 }, // Damongo
  'North East': { lat: 9.4500, lng: -0.8000 }, // Nalerigu (approx)
  'Oti': { lat: 7.3890, lng: -0.2112 }, // Dambai (approx)
  'Western North': { lat: 6.8517, lng: -2.3296 } // Sefwi Wiawso
};

export default REGION_COORDINATES;
