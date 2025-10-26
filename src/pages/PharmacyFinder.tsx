// Pharmacy finder page

import { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Package } from 'lucide-react';
import { getFromStorage, STORAGE_KEYS } from '../utils/storage';
import { Pharmacy } from '../utils/types';
import { GHANA_REGIONS } from '../data/regions';

export function PharmacyFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [results, setResults] = useState<Array<{
    facility: Pharmacy;
    distance: number;
  }>>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const pharmacies = getFromStorage<Pharmacy[]>(STORAGE_KEYS.PHARMACIES, []);
    const allResults: typeof results = [];

    pharmacies.forEach(pharmacy => {
      // Skip inactive facilities
      if (pharmacy.status !== 'active') return;

      // Filter by region if selected
      if (selectedRegion && pharmacy.region !== selectedRegion) return;

      // Search by facility name, address or region
      const matchesSearch =
        !searchTerm ||
        pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pharmacy.region.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return;

      // Generate random distance for MVP
      const distance = Math.floor(Math.random() * 50) + 1;

      allResults.push({
        facility: pharmacy,
        distance
      });
    });

    // Sort by distance
    allResults.sort((a, b) => a.distance - b.distance);

    setResults(allResults);
    setSearched(true);
  };

  // Note: this page now shows health facilities for testing rather than pharmacies for self-medication.

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">Find A Health Facility Near You</h1>
        <p className="text-gray-600 mb-8">
          If you have symptoms, find nearby health facilities where you can be tested and receive care. Do not self-medicate—seek testing first.
        </p>

        {/* Search Form */}
        <div className="border-2 border-black p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block font-bold mb-2">Search Health Facility</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="e.g., Komfo Anokye, regional testing center, District Hospital"
                  className="flex-1 p-3 border-2 border-black"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-vita text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <Search className="h-5 w-5 " />
                  {/* <span className='hidden '>Search</span> */}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold mb-2">Region</label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-3 border-2 border-black"
              >
                <option value="">All Regions</option>
                {GHANA_REGIONS.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
          {results.length} {results.length!==1? "Health Facilities" : 'Health Facility'} Found
            </h2>

            {results.length === 0 ? (
              <div className="text-center py-12 border-2 border-gray-300">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">
                  No pharmacies found matching your criteria
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result, idx) => {
                    return (
                      <div key={idx} className="border-2 border-black p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">{result.facility.name}</h3>

                            <div className="flex items-start gap-2 text-sm mb-2">
                              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                              <span>{result.facility.address}, {result.facility.region}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm mb-2">
                              <Phone className="h-4 w-4" />
                              <span>{result.facility.phone}</span>
                            </div>

                            <div className="text-sm text-gray-600">
                              Distance: ~{result.distance}km
                            </div>

                            {result.facility.operatingHours && (
                              <div className="text-sm text-gray-600 mt-2">Hours: {result.facility.operatingHours}</div>
                            )}

                            <div className="mt-4 text-sm font-bold text-red-600">
                              If you're experiencing symptoms, visit this facility for testing rather than self-medicating.
                            </div>
                          </div>

                          <div className="border-l-0 md:border-l-2 border-t-2 md:border-t-0 border-black pt-4 md:pt-0 md:pl-6">
                            <button
                              onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(result.facility.address)}`, '_blank')}
                              className="w-full py-2 px-2 bg-black text-white hover:bg-gray-800 transition-colors"
                            >
                              Get Directions
                            </button>

                            <a
                              href={`tel:${result.facility.phone}`}
                              className="block mt-3 text-center underline text-sm text-blue-600"
                            >Call Facility</a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
