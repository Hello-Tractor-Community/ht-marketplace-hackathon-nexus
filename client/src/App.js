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
import ProductPage from './components/pages/shop/ProductPage';
import Home from './components/pages/public/home/Home';
import ProductDetailPage from './components/pages/shop/ProductDetailPage';
import RoleRoute from './components/common/protectedRoute/RoleRoute';

// Auth Components
import UserLogin from './components/features/auth/UserLogin';
// import UserRegister from './components/features/auth/UserRegister';
import UserRegister from './components/features/auth/BuyerRegister';
import EmailVerification from './components/features/emailVerification/EmailVerification';
import EmailConfirmation from './components/features/emailVerification/EmailConfirmation';
// Protected Components
import ProtectedRoute from './components/common/protectedRoute/ProtectedRoute';

import ErrorPage from './components/pages/error/ErrorPage';
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
            <Route path="/product/*" element={<ProductPage />} />
            <Route path="/productDetail/*" element={<ProductDetailPage />} />
            <Route path="/favs" element={<Favourites />} />
            <Route path="/user">
              <Route path="login" element={<UserLogin />} />
              <Route path="register" element={<UserRegister />} />
            </Route>
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
  
            {/* Protected Business Admin Routes */}
            <Route
              path="/seller/*"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={['seller']}>
                    <Routes>
                      <Route path="portal" element={<SellerPortal />} />
                      {/* <Route path="seller" element={<SellerPortal />} /> */}
                  </Routes>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

          <Route 
              path="/buyer-portal/*" 
              element={
                <ProtectedRoute>
                  <RoleRoute roles={['buyer']}>
                  <BuyerPortal />
                  </RoleRoute>
                </ProtectedRoute>
              } 
            />

            {/* Protected Super Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={['admin']}>
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