// ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, user, authLoading } = useSelector((state) => state.auth);
  
  console.log('ProtectedRoute initial render:', {
    isAuthenticated,
    authLoading,
    user,
    pathname: location.pathname
  });

  // Wait for auth to be checked
  if (authLoading) {
    console.log('ProtectedRoute: Auth loading...');
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/business/login" state={{ from: location }} replace />;
  }

  if (!user?.security?.emailVerified) { // Changed from security.emailVerified to match your authSlice
    console.log("ProtectedRoute: Email not verified, redirecting to verification");
    return <Navigate to="/email-verification" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute: All checks passed, rendering children");
  return children;
};

export default ProtectedRoute;