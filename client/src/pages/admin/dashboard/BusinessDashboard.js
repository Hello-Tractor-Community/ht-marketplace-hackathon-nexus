// ProtectedRoute.js
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import NavBar from '../../../common/navbar/NavBar';

import { logout } from '../../../store/slices/authSlice';
const BusinessDashboard = () => {
  const location = useLocation();
  const { businessDetails } = location.state || {};
  const { user, isVerified } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Additional verification check
    if (!isVerified || !businessDetails) {
      navigate('/business/login');
    }
  }, [isVerified, businessDetails, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/home');
  };
  return (
    <div>
      <NavBar />
      <button
        onClick={handleLogout}
        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        Logout
      </button>
      <h1>Welcome to the Business Admin Dashboard</h1>
      <p>Manage your business data, programs, and more here.</p>
      {/* Add more dashboard functionalities here */}
    </div>
  );
};

export default BusinessDashboard;
