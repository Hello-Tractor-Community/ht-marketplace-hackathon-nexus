import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkEmailVerification, setEmailVerified } from '../../../store/slices/authSlice';
import Button from '../../common/button/Button';

const SocialAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();


  useEffect(() => {
    const handleSocialAuth = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          navigate('/login');
          return;
        }

        // Store token
        localStorage.setItem('token', token);
        
        // Use your existing thunk to fetch user data
        const result = await dispatch(checkEmailVerification()).unwrap();
      
        console.log("result in socialauthsuccess..",result);
        // Set email verified with the data from checkEmailVerification
        dispatch(setEmailVerified({
          verifiedAt: result.verifiedAt,
          user: result.user,
         
        }));

        // Redirect to dashboard
        navigate('/');
      } catch (error) {
        console.error('Error completing social auth:', error);
        navigate('/login?error=fetch_failed');
      }
    };

    handleSocialAuth();
  }, [location, navigate, dispatch]);


  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl mb-4">Completing login...</h2>
      </div>
    </div>
  );
};

export default SocialAuthSuccess;