// Navigation component

import { Link, useNavigate } from 'react-router-dom';
import { User } from '../utils/types';
import { Menu, X, Activity } from 'lucide-react';
import { useState } from 'react';
import { capitalise, backend_url } from '../utils/helper';

interface NavigationProps {
  user: User | null;
  facility?: import('../utils/types').HealthFacility | null;
  onLogout: () => void;
}

export function Navigation({ user, facility, onLogout }: NavigationProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const publicLinks = [
    { to: '/', label: 'Dashboard' },
    // { to: '/symptoms', label: 'Report Symptoms' },
    { to: '/find-health-facility', label: 'Find Health Facility' },
    { to: '/blog', label: 'Health Blog' },
    { to: '/report', label: 'Latest Report' }
  ];

  const userLinks = [
    ...publicLinks,
    { to: '/profile', label: 'Profile' }
  ];

  const pharmacyLinks = [
    { to: '/pharmacy/dashboard', label: 'Dashboard' },
    { to: '/pharmacy/inventory', label: 'Inventory' }
  ];

  const facilityLinks = [
    { to: '/facility/dashboard', label: 'Dashboard' },
    { to: '/facility/onboard', label: 'Onboarding' }
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/data', label: 'Data Management' },
    { to: '/admin/import', label: 'Import Data' },
    { to: '/admin/blog', label: 'Manage Blog' },
    { to: '/admin/pharmacies', label: 'Manage Pharmacies' }
  ];

  let links = publicLinks;
  if (user) {
    if (user.role === 'admin') {
      links = adminLinks;
    } else if (user.role === 'pharmacy') {
      links = pharmacyLinks;
    } else if (user.role === 'facility') {
      // Only show facility dashboard link for active facilities; otherwise show onboarding/profile links
      if (facility && facility.status === 'active') {
        links = facilityLinks;
      } else {
        // facility logged in but not active yet
        links = [...userLinks, { to: '/facility/onboard', label: 'Facility Onboarding' }];
      }
    } else {
      links = userLinks;
    }
  }

  return (
    <nav className="bg-black text-white border-b-2 border-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center ">
            {/* <Activity className="h-6 w-6" /> */}
            <div className='w-10 h-10'>
              <img src="praevita-notext.png" className='w-full h-full object-contain' />
            </div>
            <span className=" text-white font-boldonse text-xl font-bold">Prae<span className='text-vita'>Vita</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-gray-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white">
                <div className='flex gap-2 items-center'>
                  <span className="text-sm">
                    {capitalise(user.username)} <br /> ({user.role})
                  </span>
                  <div className=' bg-blue-200 text-black h-8 w-8 flex justify-center items-center rounded-full font-bold cursor-pointer'>{capitalise(user.username[0])}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      // If there's no backend URL configured, fall back to the local /report page
                      if (!backend_url) {
                        navigate('/report');
                        return;
                      }

                      try {
                        setGenerating(true);
                        const res = await fetch(`${backend_url}/generate-comprehensive-report`, {
                          method: 'POST',
                          headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                          }
                        });
                        if (!res.ok) throw new Error(`Status ${res.status}`);
                        const data = await res.json().catch(() => null);
                        // If backend returns a download URL, open it. Otherwise notify success.
                        if (data && (data.url || data.report_url)) {
                          const url = data.url || data.report_url;
                          window.open(url, '_blank');
                        } else {
                          alert('Report generation request submitted successfully.');
                        }
                      } catch (err) {
                        console.error('Generate report failed', err);
                        // On failure, fall back to opening the client-side report page so the user still gets something useful
                        navigate('/report');
                      } finally {
                        setGenerating(false);
                      }
                    }}
                    className="px-3 py-2 bg-vita text-black hover:brightness-90 transition-colors cursor-pointer"
                    disabled={generating}
                  >
                    {generating ? 'Generating...' : 'Generate Report'}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="block py-2 hover:text-gray-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="py-2 text-sm border-t border-white mt-2 pt-2">
                  {user.username} ({user.role})
                </div>
                <button
                  onClick={async () => {
                    // If no backend is configured, open the client-side report page instead
                    if (!backend_url) {
                      setMobileMenuOpen(false);
                      navigate('/report');
                      return;
                    }

                    try {
                      setGenerating(true);
                      const res = await fetch(`${backend_url}/generate-comprehensive-report`, {
                        method: 'POST',
                        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
                      });
                      if (!res.ok) throw new Error(`Status ${res.status}`);
                      const data = await res.json().catch(() => null);
                      if (data && (data.url || data.report_url)) window.open(data.url || data.report_url, '_blank');
                      else alert('Report generation request submitted successfully.');
                    } catch (err) {
                      console.error('Generate report failed', err);
                      // Fallback to client-side report page so users still get the report
                      setMobileMenuOpen(false);
                      navigate('/report');
                    } finally {
                      setGenerating(false);
                    }
                  }}
                  className="w-full mt-2 px-4 py-2 bg-[#7cbd49] text-black hover:brightness-90 transition-colors"
                >
                  {generating ? 'Generating...' : 'Generate Report'}
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full mt-2 px-4 py-2 bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block mt-2 px-4 py-2 bg-white text-black text-center hover:bg-gray-200 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
