// RoleRoute.js
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RoleRoute = ({ children, roles }) => {
  const { isAuthenticated, user, authLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log("RoleRoute initial check:", {
    isAuthenticated,
    authLoading,
    user: user,
    requiredRoles: roles,
    pathname: location.pathname
  });

  // Wait for auth to be checked
  if (authLoading) {
    console.log('RoleRoute: Auth loading...');
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    console.log("RoleRoute: Not authenticated, redirecting to login");
    return <Navigate to="/business/login" state={{ from: location }} replace />;
  }

  const hasRequiredRole = roles.some(role => {
    if (role === 'business_admin') {
      const hasRole = user?.businessAssociations?.some(
        assoc => ['owner', 'founder', 'manager'].includes(assoc.role) &&
                 assoc.status === 'active'
      );
      console.log("RoleRoute: Checking business_admin role:", { hasRole, associations: user?.businessAssociations });
      return hasRole;
    }

    if (role === 'platform_admin') {
      const hasRole = user?.platformRoles?.includes('platform_admin');
      console.log("RoleRoute: Checking platform_admin role:", { hasRole, platformRoles: user?.platformRoles });
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