import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaUserCircle } from 'react-icons/fa';
import { MdBusinessCenter } from 'react-icons/md';
import Button from './Button';
import { checkEmailVerification, setEmailVerified } from '../../../store/slices/authSlice';
import { registerUser, loginUser, loginBusiness,logout } from '../../../store/slices/authSlice';


// AuthButton Component - Replaces your current Login button
const AuthButton = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authType, setAuthType] = useState(null); // 'customer' or 'business'
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  

  const handleDropdownClick = () => setShowDropdown(!showDropdown);
  
  const handleAuthTypeSelect = (type) => {
    setAuthType(type);
    setShowLoginModal(true);
    setShowDropdown(false);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setAuthType(null);
  };

  return (
    <div className="relative">
      {isAuthenticated ? (
        <ProfileButton user={user} />
      ) : (
        <>
          <Button 
            variant="secondary" 
            onClick={handleDropdownClick}
            className="flex items-center gap-2"
          >
            <FaUserCircle />
            Login
          </Button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                <button
                  onClick={() => handleAuthTypeSelect('customer')}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                >
                  <FaUserCircle />
                  Customer Login
                </button>
                <button
                  onClick={() => handleAuthTypeSelect('business')}
                  className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100"
                >
                  <MdBusinessCenter />
                  Business Login
                </button>
              </div>
            </div>
          )}

          {showLoginModal && (
            <EnhancedLoginModal 
              authType={authType}
              onClose={handleCloseModal}
            />
          )}
        </>
      )}
    </div>
  );
};

// Enhanced Login Modal Component
const EnhancedLoginModal = ({ authType, onClose }) => {
  
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isRegisterMode) {
        await dispatch(registerUser({
          ...formData,
          userType: authType
        }));
      } else {
        const loginAction = authType === 'business' 
          ? loginUser
          : loginUser;
        
        const result = await dispatch(loginAction(formData));
        console.log("result in login request..",result);
        if(result.payload.success){

          const { user, businessDetails } = result.payload;

          dispatch(setEmailVerified({
            user,
            businessDetails,
            verifiedAt: user?.verifiedAt || new Date().toISOString()
          }));
          
        }
      }
      onClose();
    } catch (error) {
      console.error('Auth failed:', error);
      alert(error.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="login-modal__overlay">
      <div className="login-modal__content">
        <div className="login-modal__header">
          <h2>
            {isRegisterMode ? 'Register' : 'Login'} as {authType === 'business' ? 'Business' : 'Customer'}
          </h2>
          <button className="login-modal__close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-modal__body">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            className="w-full px-3 py-2 border rounded mt-2"
          />

          <Button 
            type="submit" 
            variant="primary"
            className="w-full mt-4"
          >
            {isRegisterMode ? 'Register' : 'Login'}
          </Button>

          {!isRegisterMode && (
            <>
              <div className="login-modal__divider">
                <span>or</span>
              </div>
              
              <div className="login-modal__social">
                <Button variant="quaternary" onClick={() => {}}>
                  <FaGoogle />
                  <span>Continue with Google</span>
                </Button>
                <Button variant="tertiary" onClick={() => {}}>
                  <FaFacebookF />
                  <span>Continue with Facebook</span>
                </Button>
              </div>
            </>
          )}

          <div className="login-modal__toggle mt-4 text-center">
            <p>
              {isRegisterMode 
                ? 'Already have an account?' 
                : "Don't have an account?"}
            </p>
            <Button
              variant="link"
              onClick={() => setIsRegisterMode(!isRegisterMode)}
            >
              {isRegisterMode ? 'Login' : 'Register'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Profile Button Component (shown when user is logged in)
const ProfileButton = ({ user }) => {
  // Select values from the Redux store
  const currentUser = useSelector((state) => state.auth.user);
  const businessDetails = useSelector((state) => state.auth.businessDetails);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
  };

  const getProfileLink = () => {
    if (businessDetails) {
      navigate('/admin/dashboard', {
        state: {
          businessDetails,
          verificationStatus: 'completed',
          user
        },
        replace: true
      });
    } else {
      navigate('/business/login', {
        state: {
          businessDetails,
          verificationStatus: 'completed',
          user
        },
        replace: true
      });
    }
  };
  

  return (
    <div className="relative">
      <Button
        variant="secondary"
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2"
      >
        <FaUserCircle />
        {businessDetails ? 'Business Portal' : 'My Account'}
      </Button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <a
              href={getProfileLink()}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Profile
            </a>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthButton;