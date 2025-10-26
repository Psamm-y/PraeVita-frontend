// Authentication hook

import { useState, useEffect } from 'react';
import { User, HealthFacility } from '../utils/types';
import { getCurrentUser, login as authLogin, logout as authLogout, register as authRegister } from '../utils/auth';
import { getFromStorage, STORAGE_KEYS } from '../utils/storage';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [facility, setFacility] = useState<HealthFacility | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    // If facility user, load facility record from storage
    if (currentUser && currentUser.role === 'facility') {
      const allFacilities = getFromStorage<HealthFacility[]>(STORAGE_KEYS.HEALTH_FACILITIES, []);
      const found = allFacilities.find(f => f.username === currentUser.username) || null;
      setFacility(found);
    } else {
      setFacility(null);
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): User | null => {
    const loggedInUser = authLogin(username, password);
    setUser(loggedInUser);
    if (loggedInUser && loggedInUser.role === 'facility') {
      const allFacilities = getFromStorage<HealthFacility[]>(STORAGE_KEYS.HEALTH_FACILITIES, []);
      const found = allFacilities.find(f => f.username === loggedInUser.username) || null;
      setFacility(found);
    } else {
      setFacility(null);
    }

    return loggedInUser;
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setFacility(null);
  };

  const register = (username: string, email: string, password: string): User | null => {
    const newUser = authRegister(username, email, password);
    setUser(newUser);
    // If registered as facility, load facility record
    if (newUser && newUser.role === 'facility') {
      const allFacilities = getFromStorage<HealthFacility[]>(STORAGE_KEYS.HEALTH_FACILITIES, []);
      const found = allFacilities.find(f => f.username === newUser.username) || null;
      setFacility(found);
    }
    return newUser;
  };

  return {
    user,
    loading,
    facility,
    login,
    logout,
    register,
    isAuthenticated: !!user
  };
}
