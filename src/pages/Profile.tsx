import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // If not authenticated, redirect to login
  if (!user) {
    navigate('/login', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600 mb-6">Manage your account and quick actions.</p>

        <div className="border-2 border-black p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Username</div>
              <div className="font-bold">{user.username}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-bold">{user.email}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Role</div>
              <div className="font-bold">{user.role}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Member Since</div>
              <div className="font-bold">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3 items-center">
            {/* <Link to="/symptoms" className="px-4 py-2 bg-black text-white">Report Symptoms</Link> */}
            <Link to="/find-health-facility" className="px-4 py-2  bg-black text-white cursor-pointer">Find Health Facility</Link>

            <div className="ml-auto flex gap-2">
              <button
                onClick={() => navigate('/profile/edit')}
                className="px-4 py-2 border-2 border-black"
              >
                Edit Profile
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2 bg-red-600 text-white"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Recent activity</h2>
          <p className="text-gray-600">No recent activity to show. Use the "Report Symptoms" button to submit a symptom report.</p>
        </div>
      </div>
    </div>
  );
}
