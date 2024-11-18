import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  useNavigate
} from 'react-router-dom';

import AppWrapper from './AppWrapper';
import AppProvider from './pages/features/AppContext';
import ScrollToTop from './components/ScrollToTop';

// Import your components
import LandingPage from './pages/public/landing/LandingPage';
import ProductPage from './pages/shop/ProductPage';
import Home from './pages/public/home/Home';
import ProductDetailPage from './pages/shop/ProductDetailPage';
import CartPage from './pages/shop/CartPage';
import UpsellPage from './pages/shop/UpsellPage';
import ShippingPage from './pages/shop/ShippingPage';
import PaymentPage from './pages/shop/PaymentPage';
import OrderConfirmationPage from './pages/shop/OrderConfirmationPage';
import CreatePage from './pages/public/create/CreatePage';
import BusinessRegister from './pages/public/business/BusinessRegister';
import RoleRoute from './common/protectedRoute/RoleRoute';

// Auth Components
import UserLogin from './features/auth/UserLogin';
import UserRegister from './features/auth/UserRegister';
import BusinessLogin from './features/auth/BusinessLogin';


import OnboardingForm from './features/onboardingForm/OnboardingForm';

import EmailVerification from './features/emailVerification/EmailVerification';
import EmailConfirmation from './features/emailVerification/EmailConfirmation';
// Protected Components
import ProtectedRoute from './common/protectedRoute/ProtectedRoute';

import OnboardingRoute from './common/onboardingRoute/OnboardingRoute';

// User Dashboard
// import UserDashboard from './pages/user/dashboard/UserDashboard';

// Business Admin Pages
import BusinessDashboard from './pages/admin/dashboard/BusinessDashboard';
import DocumentUpload from './pages/admin/documentUpload/DocumentUpload';
import PlaceHolder from './components/PlaceHolder';

import ErrorPage from './pages/error/ErrorPage';
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
            <Route path="/cart" element={<CartPage />} />
            <Route path="/upsell" element={<UpsellPage />} />
            <Route path="/shipping" element={<ShippingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/orderConfirmation" element={<OrderConfirmationPage />} />
            <Route path='/create' element={<CreatePage />} />

            <Route path="/business">
              <Route path="login" element={<BusinessLogin />} />
              <Route path="register" element={<BusinessRegister />} />
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

            <Route
              path = "/place-holder"
              element = {
                <PlaceHolder />
              }
              />
            {/* Protected user route */}
            {/* <Route
              path="/business/dashboard"
              element={
                <ProtectedRoute>
                  <BusinessDashboard />
                </ProtectedRoute>
              }
            /> */}

            {/* Protected Business Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={['business_admin']}>
                    <Routes>
                      <Route path="dashboard" element={<BusinessDashboard />} />
                      <Route path="onboarding" element={<OnboardingForm />} />
                      <Route path="documents" element={<DocumentUpload />} />
                    </Routes>
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

{/* <Route 
    path="/customer-portal/*" 
    element={
      <ProtectedRoute>
         <RoleRoute roles={['customer']}>
        <CustomerPortal />
        </RoleRoute>
      </ProtectedRoute>
    } 
  /> */}

            {/* Protected Super Admin Routes */}
            {/* <Route
              path="/superadmin/*"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={['super_admin']}>
                    <Routes>
                      <Route path="dashboard" element={<SuperAdminDashboard />} />
                      <Route path="verifications" element={<BusinessVerification />} />
                    </Routes>
                  </RoleRoute>
                </ProtectedRoute>
              }
            /> */}

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