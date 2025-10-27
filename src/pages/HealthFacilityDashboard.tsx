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
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [uploadEndpoint, setUploadEndpoint] = useState('/api/facility/reports/upload');

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    setCsvFile(f || null);
    setUploadMessage(null);
  };

  const downloadTemplate = () => {
    const header = 'facility_id,facility_name,region,disease,confirmed_cases,reported_at,notes\n';
    const example = `${facility.id},${facility.name},${facility.region},cholera,12,${new Date().toISOString()},Example note\n`;
    const blob = new Blob([header + example], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'facility-report-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = async () => {
    setUploadMessage(null);
    if (!csvFile) {
      setUploadMessage('Please choose a CSV file to upload.');
      return;
    }

    // Basic validation
    if (!csvFile.name.toLowerCase().endsWith('.csv')) {
      setUploadMessage('Only CSV files are accepted.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      formData.append('facilityId', facility.id);
      formData.append('facilityName', facility.name);

      const res = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const text = await res.text();
        setUploadMessage(`Upload failed: ${res.status} ${res.statusText} - ${text}`);
      } else {
        const json = await res.json().catch(() => null);
        setUploadMessage('Upload successful.' + (json ? ` Server response: ${JSON.stringify(json)}` : ''));
      }
    } catch (err: any) {
      setUploadMessage(`Upload error: ${err.message || err}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{facility.name} — Dashboard</h1>
        <p className="text-gray-600 mb-6">Submit confirmed case reports for cholera and typhoid. You can upload a CSV file and it will be sent to your backend for processing.</p>

        <div className="border-2 border-black p-6 mb-6">
          <h3 className="font-bold mb-2">Upload CSV of confirmed reports</h3>
          <div className="mb-2 text-sm text-gray-600">CSV should include columns: facility_id,facility_name,region,disease,confirmed_cases,reported_at,notes</div>
          <div className="flex gap-2 mb-3">
            <input type="text" value={uploadEndpoint} onChange={(e) => setUploadEndpoint(e.target.value)} className="flex-1 p-2 border-2 border-black" />
            <button onClick={downloadTemplate} className="px-4 py-2 border-2 border-black">Download Template</button>
          </div>
          <div className="flex gap-2 items-center">
            <input type="file" accept=".csv,text/csv" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading} className="px-4 py-2 bg-black text-white">{uploading ? 'Uploading...' : 'Upload CSV'}</button>
          </div>
          {uploadMessage && <div className="mt-3 text-sm text-gray-700">{uploadMessage}</div>}
        </div>

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
