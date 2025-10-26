// Protected route component for role-based access control

import { Navigate } from 'react-router-dom';
import { User, UserRole } from '../utils/types';
import { getFromStorage, STORAGE_KEYS } from '../utils/storage';

interface ProtectedRouteProps {
  user: User | null;
  requiredRole?: UserRole;
  children: React.ReactNode;
}

export function ProtectedRoute({ user, requiredRole, children }: ProtectedRouteProps) {
  // If no user and route requires authentication
  if (!user && requiredRole) {
    return <Navigate to="/login" replace />;
  }

  // If user doesn't have required role
  if (user && requiredRole && user.role !== requiredRole && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  // Special case: when requiredRole is 'facility', ensure the facility record is active
  if (requiredRole === 'facility' && user && user.role === 'facility') {
    const facilities = getFromStorage<any[]>(STORAGE_KEYS.HEALTH_FACILITIES, []);
    const found = facilities.find(f => f.username === user.username);
    if (!found || found.status !== 'active') {
      // redirect to profile so they see their pending status
      return <Navigate to="/profile" replace />;
    }
  }

  return <>{children}</>;
}
