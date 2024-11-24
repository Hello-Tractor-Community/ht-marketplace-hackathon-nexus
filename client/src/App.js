import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';

import AppWrapper from './AppWrapper';
import AppProvider from './store/AppContext';
import ScrollToTop from './components/common/navigation/ScrollToTop';

// Import your components
import LandingPage from './components/pages/public/landing/LandingPage';
import ListingPage from './components/pages/shop/ListingPage';
import Home from './components/pages/public/home/Home';
import ListingDetailPage from './components/pages/shop/ListingDetailPage';
import Favourites from './components/pages/shop/Favourites';
import RoleRoute from './components/common/protectedRoute/RoleRoute';

// Auth Components
import LoginPage from './components/features/auth/LoginPage';
// import UserRegister from './components/features/auth/UserRegister';

import EmailVerification from './components/features/emailVerification/EmailVerification';
import EmailConfirmation from './components/features/emailVerification/EmailConfirmation';
import SocialAuthSuccess from './components/features/socialAuth/SocialAuthSuccess';
// Protected Components
import ProtectedRoute from './components/common/protectedRoute/ProtectedRoute';
import ErrorPage from './components/pages/error/ErrorPage';

//Portals
import BuyerPortal from './components/pages/portal/buyer/BuyerPortal';
import SellerPortal from './components/pages/portal/seller/portal/SellerPortal';
import AdminPortal from './components/pages/portal/admin/portal/AdminPortal';
import './App.css';

function RedirectHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('tx_ref') || location.hash.includes('orderConfirmation')) {
      console.log('Redirecting (App.js)...');
      navigate('/orderConfirmation', { replace: true });
    }
  }, [location, navigate]);

  return null;
}

const AppContent = () => {
  return (
    <Router>
     
      <AppProvider>
        <div className="app">
          <ScrollToTop />
          <RedirectHandler />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/listing/*" element={<ListingPage />} />
            <Route path="/listing/:id" element={<ListingDetailPage />} />
            <Route path="/favs" element={<Favourites />} />
            
            <Route path="login" element={<LoginPage />} />
              {/* <Route path="register" element={<UserRegister />} /> */}
            
            {/* Semi-protected onboarding route */}
            <Route
              path="/email-verification"
              element={
                <EmailVerification />
              }
            />
            <Route
              path="/email-confirmation"
              element={
                <EmailConfirmation />
              }
            />

            <Route 
            path="/social-auth-success"
            element={
              <SocialAuthSuccess />   
            }
            />
  
            {/* Protected Business Admin Routes */}
            <Route
              path="/seller/*"
              element={
                <ProtectedRoute>
                  <RoleRoute platformRoles={['seller']}>
                    <Routes>
                      <Route path="portal" element={<SellerPortal />} />
                    </Routes>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

          <Route 
              path="/buyer/*" 
              element={
                <ProtectedRoute>
                  <RoleRoute platformRoles={['buyer']}>
                  <Route path="portal" element={<BuyerPortal />} />
                  
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />

            {/* Protected Super Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <RoleRoute platformRoles={['admin']}>
                    <Routes>
                      <Route path="portal" element={<AdminPortal />} />                     
                    </Routes>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </div>
      </AppProvider>
    </Router>
  );
};

const App = () => {

 
  return (
    <AppWrapper>
      <AppContent />
    </AppWrapper>
  );
};

export default App;