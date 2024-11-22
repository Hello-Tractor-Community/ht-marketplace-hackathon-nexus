import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import Button from '../../common/button/Button';
import { registerUser, loginUser, setEmailVerified } from '../../../store/slices/authSlice';

import './LoginModal.scss'
const LoginModal = ({ authType, onClose, handleAuthTypeSelect, showLoginModal, setShowLoginModal }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginModalRef = useRef(null);

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const REACT_APP_API_URL =
    process.env.REACT_APP_ENVIRONMENT === 'development'
      ? process.env.REACT_APP_API_URL_DEV
      : process.env.REACT_APP_API_URL_PROD;



  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    confirmPassword: '',
    platformRoles: 'buyer',
  });
  const [isRegisterMode, setIsRegisterMode] = useState(false);


  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginModalRef.current && !loginModalRef.current.contains(event.target)) {
        setShowLoginModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const handleInputChange = (field, value) => {

    setFormData((prev) => ({ ...prev, [field]: value }));
    setPasswordMismatch(false);
  };

  const handleEmailSubmit = async (e) => {

    e.preventDefault();
    console.log("platform roles..", formData.platformRoles);
    try {
      if (isRegisterMode) {
        if (formData.password !== formData.confirmPassword) {

          setPasswordMismatch(true);

          return;
        }

        const response = await dispatch(
          registerUser({
            ...formData,
            platformRoles: [formData.platformRoles] // Ensure it's an array
          })
        );

        if (!response.payload?.success || !response.payload.data?.user?._id) {
          throw new Error(response.payload?.data?.error || 'User registration failed');
        }

        navigate('/email-verification', {
          state: { email: formData.email, userId: response.payload.data?.user?._id },
        });
      } else {
        const result = await dispatch(loginUser(formData));

        if (result.payload?.success) {
          const { user, businessDetails } = result.payload;

          dispatch(
            setEmailVerified({
              user,
              businessDetails,
              verifiedAt: user?.verifiedAt || new Date().toISOString(),
            })
          );
        }
      }
      onClose();
    } catch (error) {
      console.error('Auth failed:', error);
      alert(error.message || 'Authentication failed. Please try again.');
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${REACT_APP_API_URL}/api/v1/auth/google`;
  };

  return (
    showLoginModal && (
      <div className="login-modal" ref={loginModalRef}>
        <div className="login-modal__content">
          <div className="login-modal__header">
            <h2>{isRegisterMode ? 'Register' : 'Login'}</h2>
            <Button type="button" variant="mini" className="login-modal__close-btn"
              onClick={onClose}>&times;</Button>
            {/* <button className="login-modal__close-btn" onClick={onClose}>
              &times;
            </button> */}
          </div>

          <form onSubmit={handleEmailSubmit} className="login-modal__body">
            {isRegisterMode && (
              <>
                {['firstName', 'lastName', 'phone'].map((field) => (
                  <input
                    key={field}
                    type="text"
                    placeholder={field.replace(/^\w/, (c) => c.toUpperCase())}
                    value={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                  />
                ))}
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            {isRegisterMode && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              />
            )}
            {isRegisterMode && (
              <div className="role-selection">
                {['buyer', 'seller'].map((role) => (
                  <Button
                    key={role}
                    onClick={() => {
                      handleInputChange('platformRoles', role);
                      handleAuthTypeSelect(role);
                    }}
                    className={`${formData.platformRoles === role ? 'active' : ''}`}
                    variant='tertiary'
                  >
                    I'm a {role}
                  </Button>
                ))}
              </div>
            )}
            <Button type="submit" variant="primary" className="w-full mt-4">
              {isRegisterMode ? 'Register' : 'Login'}
            </Button>
            <div className="login-modal__divider mt-4">
              <span>or</span>
            </div>

            <Button variant="quaternary" onClick={handleGoogleAuth} className="w-full"
            style={{marginBottom:'24px'}}>
              <FaGoogle />
              <span>{isRegisterMode ? '    Register with Google' : '    Continue with Google'}</span>
            </Button>
            <div className="login-modal__divider mt-4">
              <span></span>
            </div>

          </form>
          <div className="login-modal__toggle ">
            <p>{isRegisterMode ? 'Already have an account?' : "Don't have an account?"}</p>
            <Button variant="secondary" onClick={() => setIsRegisterMode((prev) => !prev)}>
              {isRegisterMode ? 'Login' : 'Register'}
            </Button>
          </div>

          {passwordMismatch && (
            <div className="errorMessage">
              <p>Password mismatch! Please make sure your passwords are the same.</p>
            </div>
          )}
        </div>
      </div>
    )
  );

};

export default LoginModal;
