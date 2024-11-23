import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const RoleRoute = ({ children, platformRoles }) => {
  const { isAuthenticated, user, authLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  

  // Debugging logs
  console.log("RoleRoute Initial Debugging:");
  console.log({
    isAuthenticated,
    authLoading,
    user,
    requiredRoles: platformRoles,
    currentPath: location.pathname,
  });

  // Wait for auth to load
  if (authLoading) {
    console.log("RoleRoute: Auth still loading...");
    return null;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.warn("RoleRoute: User not authenticated. Redirecting to login...");
    return <Navigate to="/company/login" state={{ from: location }} replace />;
  }

  console.log("RoleRoute platformRoles:", user.platformRoles);

  // Check if user has one of the required roles
  const hasRequiredRole = platformRoles.some((role) => {
    console.log("RoleRoute: Checking role:", role);
    if (role === "seller") {
      const isSeller = user?.platformRoles?.includes("seller");
      return isSeller;
    }
    if (role === "admin") {
      const isAdmin = user?.platformRoles?.includes("admin");
      console.log("RoleRoute: Admin role check:", { isAdmin });
      return isAdmin;
    }
    if (role === "buyer") {
      const isBuyer = user?.platformRoles?.includes("buyer");
      console.log("RoleRoute: Buyer role check:", { isBuyer });
      return isBuyer;
    }
    console.warn(`RoleRoute: Role '${role}' is not explicitly handled.`);
    return false;
  });

  if (!hasRequiredRole) {
    console.warn("RoleRoute: Missing required role. Redirecting to unauthorized.");
    console.log("RoleRoute Debugging Context:", {
      userRoles: user?.platformRoles,
      companyAssociations: user?.companyAssociations,
      platformRoles,
      location,
    });
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("RoleRoute: User passed all checks. Rendering children.");
  return children;
};

export default RoleRoute;
