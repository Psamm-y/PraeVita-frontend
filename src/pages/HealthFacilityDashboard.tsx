import React, { useState } from 'react';
import { getFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { FacilityReport, HealthFacility } from '../utils/types';
import { getCurrentUser } from '../utils/auth';

export function HealthFacilityDashboard() {
  const currentUser = getCurrentUser();
  const [facility, setFacility] = useState<HealthFacility | null>(() => {
    if (!currentUser) return null;
    const all = getFromStorage<HealthFacility[]>(STORAGE_KEYS.HEALTH_FACILITIES, []);
    return all.find(f => f.username === currentUser.username) || null;
  });

  const [form, setForm] = useState({ disease: 'cholera', confirmedCases: 0, notes: '' });
  const [message, setMessage] = useState<string | null>(null);

  if (!currentUser) {
    return <div className="p-8">Please log in to access this page.</div>;
  }

  if (!facility) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">Facility Dashboard</h1>
        <p className="text-gray-600">No facility record found for your account. If you just registered, your account may be pending verification.</p>
      </div>
    );
  }

  if (facility.status !== 'active') {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-2">Facility Dashboard</h1>
        <p className="text-yellow-600">Your facility account is currently "{facility.status}". An administrator must verify and activate your account before reporting confirmed cases.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'confirmedCases' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allReports = getFromStorage<FacilityReport[]>(STORAGE_KEYS.FACILITY_REPORTS, []);
    const newReport: FacilityReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      facilityId: facility.id,
      facilityName: facility.name,
      region: facility.region,
      disease: form.disease as 'cholera' | 'typhoid',
      confirmedCases: Number(form.confirmedCases),
      reportedAt: new Date().toISOString(),
      notes: form.notes || undefined
    };

    allReports.push(newReport);
    saveToStorage(STORAGE_KEYS.FACILITY_REPORTS, allReports);
    setMessage('Report submitted successfully.');
    setForm({ disease: 'cholera', confirmedCases: 0, notes: '' });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{facility.name} — Dashboard</h1>
        <p className="text-gray-600 mb-6">Submit confirmed case reports for cholera and typhoid.</p>

        <div className="border-2 border-black p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold mb-1">Disease</label>
              <select name="disease" value={form.disease} onChange={handleChange} className="w-full p-2 border-2 border-black">
                <option value="cholera">Cholera</option>
                <option value="typhoid">Typhoid</option>
              </select>
            </div>

            <div>
              <label className="block font-bold mb-1">Confirmed Cases</label>
              <input name="confirmedCases" value={form.confirmedCases} onChange={handleChange} type="number" min={0} className="w-full p-2 border-2 border-black" />
            </div>

            <div>
              <label className="block font-bold mb-1">Notes (optional)</label>
              <input name="notes" value={form.notes} onChange={handleChange} className="w-full p-2 border-2 border-black" />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 bg-black text-white">Submit Report</button>
            </div>

            {message && <div className="text-sm text-green-700">{message}</div>}
          </form>
        </div>

      </div>
    </div>
  );
}
