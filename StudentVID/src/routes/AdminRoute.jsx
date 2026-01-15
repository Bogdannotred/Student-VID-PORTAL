import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

const AdminRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div>Verifying permissions...</div>;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return React.cloneElement(children, { user });
};

export default AdminRoute;