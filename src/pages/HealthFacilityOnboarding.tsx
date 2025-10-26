import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToStorage, getFromStorage, STORAGE_KEYS } from '../utils/storage';
import { register } from '../utils/auth';
import { HealthFacility } from '../utils/types';

export function HealthFacilityOnboarding() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    address: '',
    region: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    // create a user account with role 'facility'
    const user = register(form.username, form.email, form.password, 'facility');
    if (!user) {
      setMessage('Username or email already exists.');
      setSubmitting(false);
      return;
    }

    // Save facility record (pending verification)
    const facilities = getFromStorage<HealthFacility[]>(STORAGE_KEYS.HEALTH_FACILITIES, []);
    const newFacility: HealthFacility = {
      id: `facility_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`,
      name: form.name,
      username: form.username,
      region: (form.region as any) || '',
      address: form.address,
      phone: form.phone,
      email: form.email,
      operatingHours: '',
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    facilities.push(newFacility);
    saveToStorage(STORAGE_KEYS.HEALTH_FACILITIES, facilities);

    setMessage('Registration submitted. Your account is pending verification by an administrator.');
    setSubmitting(false);

    // Redirect to profile/dashboard (they'll see pending message)
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Health Facility Onboarding</h1>
        <p className="text-gray-600 mb-6">Register your facility. An administrator will verify and activate your account.</p>

        <form onSubmit={handleSubmit} className="border-2 border-black p-6 space-y-4">
          <div>
            <label className="block font-bold mb-1">Facility Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border-2 border-black" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Region</label>
              <input name="region" value={form.region} onChange={handleChange} className="w-full p-2 border-2 border-black" />
            </div>

            <div>
              <label className="block font-bold mb-1">Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 border-2 border-black" />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Address</label>
            <input name="address" value={form.address} onChange={handleChange} className="w-full p-2 border-2 border-black" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-1">Contact Email</label>
              <input name="email" value={form.email} onChange={handleChange} type="email" className="w-full p-2 border-2 border-black" required />
            </div>

            <div>
              <label className="block font-bold mb-1">Account Username</label>
              <input name="username" value={form.username} onChange={handleChange} className="w-full p-2 border-2 border-black" required />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-1">Password</label>
            <input name="password" value={form.password} onChange={handleChange} type="password" className="w-full p-2 border-2 border-black" required />
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-4 py-2 bg-black text-white">Submit</button>
            <button type="button" onClick={() => window.history.back()} className="px-4 py-2 border-2 border-black">Cancel</button>
          </div>

          {message && <div className="text-sm text-gray-700 mt-2">{message}</div>}
        </form>

      </div>
    </div>
  );
}
