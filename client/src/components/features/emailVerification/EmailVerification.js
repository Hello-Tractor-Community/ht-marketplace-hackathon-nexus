import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkEmailVerification, setEmailVerified } from '../../../store/slices/authSlice';
import Button from '../../common/button/Button';
import { authService } from '../../../services/api/auth';
import NavBar from '../../common/navigation/NavBar';
import './EmailVerification.scss';
import { setupListeners } from '@reduxjs/toolkit/query';

const EmailVerification = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [verificationStatus, setVerificationStatus] = useState('pending');

  // const [user, setUser] = useState(null);
  const { isAuthenticated, user, authLoading } = useSelector((state) => state.auth);

  const [checkingVerification, setCheckingVerification] = useState(false);


  const [resendStatus, setResendStatus] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [tokenCheckAttempts, setTokenCheckAttempts] = useState(0);
  const MAX_TOKEN_CHECK_ATTEMPTS = 30; // 30 attempts * 2 seconds = 60 seconds maximum wait

  // Function to check for token
  const checkForToken = () => {
    const token = authService.getToken();
    return token !== null;
  };

 // First effect
useEffect(() => {
  let tokenCheckInterval;

  if (verificationStatus === 'pending') {
    tokenCheckInterval = setInterval(() => {
      setTokenCheckAttempts(prev => {
        if (prev >= MAX_TOKEN_CHECK_ATTEMPTS) {
          clearInterval(tokenCheckInterval);
          setVerificationStatus('error');
          return prev;
        }

        if (checkForToken()) {
          clearInterval(tokenCheckInterval);
          setCheckingVerification(false);
          return prev;
        }

        return prev + 1;
      });
    }, 2000);
  }

  return () => {
    if (tokenCheckInterval) {
      clearInterval(tokenCheckInterval);
    }
  };
}, [verificationStatus]); // Only run when verificationStatus changes

// Second effect
useEffect(() => {
  const checkVerificationStatus = async () => {
    // Add check to stop if already successful
    if (verificationStatus === 'success' || 
        checkingVerification || 
        verificationStatus === 'error') return;

    if (!checkForToken()) return;
    setCheckingVerification(true);

    try {
      const result = await dispatch(checkEmailVerification()).unwrap();
      
      if (result.isVerified) {
        setVerificationStatus('success');
        dispatch(setEmailVerified({
          verifiedAt: result.verifiedAt,
          user: result.user,
          companyDetails: result.companyDetails
        }));
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      if (tokenCheckAttempts >= MAX_TOKEN_CHECK_ATTEMPTS) {
        setVerificationStatus('error');
      }
    } finally {
      setCheckingVerification(false);
    }
  };

  // Only poll if we're pending and have a token
  if (verificationStatus === 'pending') {
    const interval = setInterval(checkVerificationStatus, 5000);
    return () => clearInterval(interval);
  }
}, [dispatch, checkingVerification, verificationStatus, tokenCheckAttempts]);


  const handleResendVerification = async () => {
    if (resendCount >= 3) {
      setResendStatus('Maximum resend limit reached. Please contact support.');
      return;
    }

    try {
      const response = await authService.resendVerificationEmail();
      if (response.success) {
        setResendStatus('Verification email resent successfully. Please check your inbox.');
        setResendCount(prev => prev + 1);
      }
    } catch (error) {
      setResendStatus('Failed to resend verification email. Please try again later.');
      console.error('Error resending verification email:', error);
    }
  };

  const handleContinue = async () => {
    navigate('/', { replace: true });
  }



  const renderContent = () => {
    switch (verificationStatus) {
      case 'pending':
        return (
          <div className="verification-waiting">
            <h2>Waiting for Email Verification</h2>
            <p>Please complete the verification in the email we sent you.</p>
            <p>This page will automatically update once verification is complete.</p>
            {tokenCheckAttempts > 0 && (
              <p className="attempt-counter">
                Waiting for verification... (
                {Math.floor((MAX_TOKEN_CHECK_ATTEMPTS - tokenCheckAttempts) * 2)} seconds remaining)
              </p>
            )}
            <Button onClick={handleResendVerification} disabled={resendCount >= 3}>
              Resend Verification Email
            </Button>
            {resendStatus && <p className="status-message">{resendStatus}</p>}
          </div>
        );

      case 'success':
        return (
                 <div className="verification-success">
              <h2>Email Verified Successfully!</h2>
              <p>
                Hello {user?.firstName}, your email has been verified and your account is now active.
              </p>
              <Button onClick={handleContinue}>Continue to store</Button>
            </div>
       
        );

      case 'error':
        return (
          <div className="verification-error">
            <h2>Verification Failed</h2>
            <p>There was an error verifying your email. The link may have expired.</p>
            <Button onClick={handleResendVerification} disabled={resendCount >= 3}>
              Resend Verification Email
            </Button>
            {resendStatus && <p className="status-message">{resendStatus}</p>}
          </div>
        );

      default:
        return null; // Handles undefined or unexpected statuses
    }
  };


  return (
    <div className="email-verification">
      <NavBar />
      {renderContent()}
    </div>
  );
};

export default EmailVerification;