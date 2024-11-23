import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import Button from '../../common/button/Button';
import { loginUser, setEmailVerified } from '../../../store/slices/authSlice';

import './LoginSimple.scss'
const LoginSimple = ({ authType }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginSimpleRef = useRef(null);
  const [closeLogin, setCloseLogin] = useState(false);

  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const REACT_APP_API_URL =
    process.env.REACT_APP_ENVIRONMENT === 'development'
      ? process.env.REACT_APP_API_URL_DEV
      : process.env.REACT_APP_API_URL_PROD;



  const [formData, setFormData] = useState({
    email: '',
    password: '',
  
  });



  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (loginSimpleRef.current && !loginSimpleRef.current.contains(event.target)) {
        // setShowLoginSimple(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  const handleInputChange = (field, value) => {

    setFormData((prev) => ({ ...prev, [field]: value }));
    
  };

  const handleEmailSubmit = async (e) => {

    e.preventDefault();
  
    try {
     
        const result = await dispatch(loginUser(formData));

        console.log('result', result);

        if (result.payload?.success) {
          const { user, businessDetails } = result.payload;
          console.log("user..",user);

          dispatch(
            setEmailVerified({
              user,
              businessDetails,
              verifiedAt: user?.verifiedAt || new Date().toISOString(),
            })
          );

          if(user.platformRoles[0]==="admin"){
            // navigate('/admin');
            navigate('/admin/portal')
          }
        }
      
      onClose();
    } catch (error) {
      console.error('Auth failed:', error);
      alert(error.message || 'Authentication failed. Please try again.');
    }
  };

  const onClose = () => {
    setCloseLogin(true);
    navigate('/home');
  };

  const handleGoogleAuth = () => {
    window.location.href = `${REACT_APP_API_URL}/api/v1/auth/google`;
  };

  return (
   
    !closeLogin && (
        <div className="login-simple" ref={loginSimpleRef}>
        <div className="login-simple__content">
          <div className="login-simple__header">
            <h2>Login</h2>
            <Button type="button" variant="mini" className="login-simple__close-btn"
              onClick={onClose}>&times;</Button>
        
          </div>

          <form onSubmit={handleEmailSubmit} className="login-simple__body">
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

            <Button type="submit" variant="primary" className="w-full mt-4">
              Login
            </Button>
            <div className="login-simple__divider mt-4">
              <span>or</span>
            </div>

            <Button variant="quaternary" onClick={handleGoogleAuth} className="w-full"
            style={{marginBottom:'24px'}}>
              <FaGoogle />
              <span> Continue with Google</span>
            </Button>
            <div className="login-simple__divider mt-4">
              <span></span>
            </div>

          </form>
          {/* <div className="login-simple__toggle ">
            <p>{isRegisterMode ? 'Already have an account?' : "Don't have an account?"}</p>
            <Button variant="secondary" onClick={() => setIsRegisterMode((prev) => !prev)}>
              {isRegisterMode ? 'Login' : 'Register'}
            </Button>
          </div> */}

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

export default LoginSimple;
