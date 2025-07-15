import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [] }) => {
  const { isAuthenticated, loading } = useAuth();

  // if (loading) {
  //   // still waiting for Firebase → show spinner or null
  //   return null
  // }

  // if (!loading) {
  //   return null
  // }

  return <>{children}</>
};

export default ProtectedRoute;
