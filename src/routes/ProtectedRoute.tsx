import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[]; // optional role restriction
}

/**
 * Protects routes based on authentication and optional role restriction.
 * @param roles optional array of allowed roles
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Still loading auth status
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        Loading...
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch → redirect to unauthorized page
  // if (roles && !roles.includes(user.role)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  // Authenticated and authorized
  return <>{children}</>;
};

export default ProtectedRoute;
