// RoleRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RoleRoute = ({ children, platformRoles }) => {
  const { isAuthenticated, user, authLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log("RoleRoute initial check:", {
    isAuthenticated,
    authLoading,
    user: user,
    requiredRoles: platformRoles,
    pathname: location.pathname
  });

  // Wait for auth to be checked
  if (authLoading) {
    console.log('RoleRoute: Auth loading...');
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    console.log("RoleRoute: Not authenticated, redirecting to login");
    return <Navigate to="/company/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = platformRoles.some(role => {
    if (role === 'seller') {
      const hasRole = user?.companyAssociations?.some(
        assoc => ['owner', 'founder', 'manager','agent'].includes(assoc.role) &&
                 assoc.status === 'active'
      );
      console.log("RoleRoute: Checking company_admin role:", { hasRole, associations: user?.companyAssociations });
      return hasRole;
    }
    return false;
  });

  if (!hasRequiredRole) {
    console.log("RoleRoute: Missing required role, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("RoleRoute: All checks passed, rendering children");
  return children;
};

export default RoleRoute;