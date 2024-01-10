import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, redirectPath, children }) => {
  if (!isLoggedIn) {
    return children;
  } else {
    return <Navigate to={redirectPath} />;
  }
};

export default ProtectedRoute;
