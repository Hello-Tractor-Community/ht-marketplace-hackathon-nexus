import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/api/auth';
import {setEmailVerified } from '../../store/slices/OnboardingSlice';
import NavBar from '../../common/navbar/NavBar';
import './EmailConfirmation.scss';

const EmailConfirmation = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      authService.setToken(token);
      console.log('Token set in localStorage:', authService.getToken());
    }
  }, [location]);



  return (
    <div className="email-confirmation-page">
      <NavBar />
      <h2>Email Verified!</h2>
      <p>Your email has been successfully verified.</p>
      <p>Please return to the previous tab and click "Continue" to proceed with the onboarding process.</p>
      <p>You can now close this tab.</p>
    </div>
  );
};

export default EmailConfirmation;
