import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaFacebookF, FaGoogle, FaUserCircle } from 'react-icons/fa';
import Button from './Button';
import { MdBusinessCenter } from 'react-icons/md';
import { checkEmailVerification, setEmailVerified } from '../../../store/slices/authSlice';
import { registerUser, loginUser, loginBusiness,logout } from '../../../store/slices/authSlice';

import './AuthButton.scss';

// AuthButton Component - Replaces your current Login button
const AuthButton = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authType, setAuthType] = useState(null); // 'customer' or 'business'
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  

  const handleAuthTypeSelect = (type) => {
    setAuthType(type);
    console.log("authType..", authType);
    setShowDropdown(false);
  };
  // const handleDropdownClick = () => setShowDropdown(!showDropdown);

  const handleLogin = () => setShowLoginModal(true);
  

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
            onClick={handleLogin}
            className="flex items-center gap-2"
          >
            <FaUserCircle />
            Login
          </Button>

          {/* {showDropdown && (
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
          )} */}

          {showLoginModal && (
            <EnhancedLoginModal 
              authType={authType}
              onClose={handleCloseModal}
              handleAuthTypeSelect={handleAuthTypeSelect}
            />
          )}
        </>
      )}
    </div>
  );
};

// Enhanced Login Modal Component
const EnhancedLoginModal = ({ authType, onClose, handleAuthTypeSelect }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    confirmPassword: '',
    platformRoles: ''
  });
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isRegisterMode) {
        if (formData.password !== formData.confirmPassword) {
          alert('Passwords do not match');
          return;
        }
        // await dispatch(registerUser({
        //   ...formData,
        //   userType: authType
        // }));
        try {
          // 1. Register the user first
          const response = await dispatch(registerUser({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            platformRoles: formData.platformRoles
          }));
    
          const { success, data } = response.payload;
    
          console.log("Inside AuthButton..");
          
    
          console.log("sucess..", success);
          console.log("data..", data);
    
          // Check if we have a successful response with user data
          if (!success || !data?.user?._id) {
            throw new Error(data.error || 'User registration failed');
          }
          console.log('User registration successful:', data);
          const { user, token } = data;
          // console.log("user id.. and type of", user._id, typeof user._id);
        
          // // Introduce a delay before registering the business
          // await new Promise(resolve => setTimeout(resolve, 1000)); // 2000 ms delay (2 seconds)
          // // 2. Register the business
          // const businessResult = await dispatch(registerBusiness({
          //   owner: user._id, // Use the user ID from the response
          //   role: formData.businessRole,
          //   businessName: formData.businessName,
          //   businessType: formData.businessType,
          //   registrationDetails: {
          //     taxId: formData.taxId,
          //     businessRegistrationNumber: formData.registrationNumber
          //   },
          //   location: {
          //     country: formData.country,
          //     state: formData.state,
          //     city: formData.city,
          //     address: formData.address,
          //     postalCode: formData.postalCode
          //   }
          // })).unwrap();
    
          // console.log("Business Result..", businessResult);
    
          // if (!businessResult.success || !businessResult.data?.business?._id) {
          //   throw new Error(businessResult.error || 'Business registration failed');
          // }
          // console.log("Business registration successful:", businessResult.data);
        
          //  authService.removeToken();
          // 4. Navigate to email verification
          navigate('/email-verification', {
            state: {
              email: formData.email,
              userId: data?.user?._id
            }
          });
    
        } catch (error) {
          console.error('Registration failed:', error);
          alert(error.message || 'Registration failed. Please try again.');
        }
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
            {isRegisterMode ? 'Register' : 'Login'}
          </h2>
          <button className="login-modal__close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-modal__body">
  {isRegisterMode && (
    <>
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        className="w-full px-3 py-2 border rounded"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        className="w-full px-3 py-2 border rounded mt-2"
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full px-3 py-2 border rounded mt-2"
      />
    </>
  )}
  <input
    type="email"
    placeholder="Email"
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    className="w-full px-3 py-2 border rounded"
  />
  <input
    type="password"
    placeholder="Password"
    value={formData.password}
    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
    className="w-full px-3 py-2 border rounded mt-2"
  />

{isRegisterMode && (
  <>
      <input
      type="password"
      placeholder="Confirm Password"
      value={formData.confirmPassword}
      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
      className="w-full px-3 py-2 border rounded mt-2"
    />
    <div className="flex space-x-1 my-1">
      <Button
         onClick={() => {
          setFormData({ ...formData, platformRoles: 'buyer' });
          handleAuthTypeSelect('buyer');
        }}
        className={`px-4 py-2 rounded ${formData.platformRoles === 'buyer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
      >
        I'm a buyer
      </Button>
      <Button
           onClick={() => {
            setFormData({ ...formData, platformRoles: 'seller' });
            handleAuthTypeSelect('seller');
          }}
        className={`px-4 py-2 rounded ${formData.platformRoles === 'seller' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
      >
        I'm a seller
      </Button>
    </div>

  </>
)}


  <Button type="submit" variant="primary" className="w-full mt-4">
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

  {isRegisterMode && (
    <>
      <div className="login-modal__divider">
        <span>or</span>
      </div>

      <div className="login-modal__social">
        <Button variant="quaternary" onClick={() => {}}>
          <FaGoogle />
          <span>Register with Google</span>
        </Button>
        <Button variant="tertiary" onClick={() => {}}>
          <FaFacebookF />
          <span>Register with Facebook</span>
        </Button>
      </div>
    </>
  )}

  <div className="login-modal__toggle mt-4 text-center">
    <p>
      {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
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