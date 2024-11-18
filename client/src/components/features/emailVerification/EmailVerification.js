import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkEmailVerification, setEmailVerified } from '../../store/slices/authSlice';
import Button from '../../common/button/Button';
import { authService } from '../../services/api/auth';
import NavBar from '../../common/navbar/NavBar';
import './EmailVerification.scss';
import { setupListeners } from '@reduxjs/toolkit/query';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [businessDetails, setBusinessDetails] = useState(null);
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

  // Effect for token checking
  useEffect(() => {
    let tokenCheckInterval;

    if (verificationStatus === 'pending') {
      tokenCheckInterval = setInterval(() => {
        setTokenCheckAttempts(prev => {
          // If we've exceeded max attempts, clear interval and set error
          if (prev >= MAX_TOKEN_CHECK_ATTEMPTS) {
            clearInterval(tokenCheckInterval);
            setVerificationStatus('error');
            return prev;
          }

          // Check if we have a token
          if (checkForToken()) {
            clearInterval(tokenCheckInterval);
            // Trigger verification check once we have a token
            setCheckingVerification(false); // Reset this to allow verification check
            return prev;
          }

          return prev + 1;
        });
      }, 2000); // Check every 2 seconds
    }

    return () => {
      if (tokenCheckInterval) {
        clearInterval(tokenCheckInterval);
      }
    };
  }, [verificationStatus]);

  // Effect for verification status checking
  useEffect(() => {
    const checkVerificationStatus = async () => {
      if (checkingVerification || verificationStatus === 'error') return;

      // Only proceed if we have a token
      if (!checkForToken()) return;

      setCheckingVerification(true);

      try {
        const result = await dispatch(checkEmailVerification()).unwrap();
        console.log("EmailVerification result verified..", result.isVerified);
        console.log("EmailVerification result..", result);
        if (result.isVerified) {
          setVerificationStatus('success');
          setBusinessDetails(result.businessDetails);
          // setUser(result.user);
          // Update the auth state to mark the user as authenticated and verified
          console.log("email to be verified..");
          dispatch(setEmailVerified({
            verifiedAt: result.verifiedAt,
            user: result.user,
            businessDetails: result.businessDetails
          }));
          console.log("Email verified, updated state:", {
            verifiedAt: result.verifiedAt,
            user: result.user,
            businessDetails: result.businessDetails
          });
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


  
  const handleContinue = async () => {
    const isBusinessAdmin = user?.businessAssociations?.some(
      assoc => ['owner', 'founder', 'manager'].includes(assoc.role) &&
        assoc.status === 'active'
    );

    console.log("Email verification..");
    console.log('isBusinessAdmin..', isBusinessAdmin);
    console.log('user..', user);
    console.log('businessDetails..', businessDetails);

    // Wait for any pending state updates
    await Promise.resolve();

    if (businessDetails && isBusinessAdmin) {
      console.log("should now navigate!");

      navigate('/admin/dashboard', {
        state: {
          businessDetails,
          verificationStatus: 'completed',
          user
        },
        replace: true
      });
    } else if (businessDetails) {
      // If they have business details but aren't admin level
      navigate('/home', {
        state: {
          businessDetails,
          verificationStatus: 'completed',
          user
        },
        replace: true
      });
    } else {
      // Fallback route if no business details are available
      navigate('/home', { replace: true });
    }
  };

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

  const renderContent = () => {
    // Add a new state for waiting for token
    if (verificationStatus === 'pending' && !checkForToken()) {
      return (
        <div className="verification-waiting">
          <h2>Waiting for Email Verification</h2>
          <p>Please complete the verification in the email we sent you.</p>
          <p>This page will automatically update once verification is complete.</p>
          {tokenCheckAttempts > 0 && (
            <p className="attempt-counter">
              Waiting for verification... ({Math.floor((MAX_TOKEN_CHECK_ATTEMPTS - tokenCheckAttempts) * 2)} seconds remaining)
            </p>
          )}
          <Button onClick={handleResendVerification} disabled={resendCount >= 3}>
            Resend Verification Email
          </Button>
          {resendStatus && <p className="status-message">{resendStatus}</p>}
          <h2>isAuthenticated is.. </h2>
          {isAuthenticated && <p>true</p>}
          <h2>authLoading is.. </h2>
          {authLoading && <p>true</p>}
        </div>
      );
    }

    switch (verificationStatus) {
      case 'success':
        return (
          <div className="verification-success">
            <h2>Email Verified Successfully!</h2>
            <p>Your email has been verified and your account is now active.</p>
            {businessDetails && (
              <div className="business-details">
                <p>Business Name: {businessDetails.businessName}</p>
                <p>Your Role: {businessDetails.role}</p>
              </div>
            )}
            <Button onClick={handleContinue}>Continue to Onboarding</Button>
            <h2>isAuthenticated is.. </h2>
            {isAuthenticated && <p>true</p>}
            <h2>authLoading is.. </h2>
            {authLoading && <p>true</p>}
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
            <h2>isAuthenticated is.. </h2>
            {isAuthenticated && <p>true</p>}
            <h2>authLoading is.. </h2>
            {authLoading && <p>true</p>}
          </div>
        );

      default:
        return (
          <div className="verification-waiting">
            <h2>Waiting for Email Verification</h2>
            <p>Please complete the verification in the email we sent you.</p>
            <p>This page will automatically update once verification is complete.</p>
            {tokenCheckAttempts > 0 && (
              <p className="attempt-counter">
                Waiting for verification... ({Math.floor((MAX_TOKEN_CHECK_ATTEMPTS - tokenCheckAttempts) * 2)} seconds remaining)
              </p>
            )}
            <Button onClick={handleResendVerification} disabled={resendCount >= 3}>
              Resend Verification Email
            </Button>
            {resendStatus && <p className="status-message">{resendStatus}</p>}

            <h2>isAuthenticated is.. </h2>
            {isAuthenticated && <p>true</p>}
            <h2>authLoading is.. </h2>
            {authLoading && <p>true</p>}

          </div>
        );
    }
  };

  return (
    <div className="email-verification-page">
      <NavBar />
      {renderContent()}
    </div>
  );
};

export default EmailVerification;