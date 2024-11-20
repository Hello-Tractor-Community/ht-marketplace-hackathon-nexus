import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkEmailVerification, setEmailVerified } from '../../../store/slices/authSlice';
import Button from '../../common/button/Button';

const SocialAuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [verified, setVerified] = useState(false);
  const { isAuthenticated, user, authLoading } = useSelector((state) => state.auth);
const [companyDetails, setCompanyDetails] = useState(null);

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
        if (result.isVerified) {
          setCompanyDetails(result.companyDetails);
        }
        // Set email verified with the data from checkEmailVerification
        dispatch(setEmailVerified({
          verifiedAt: result.verifiedAt,
          user: result.user,
          companyDetails: result.companyDetails
        }));

        // Redirect to dashboard
        navigate('/home');
      } catch (error) {
        console.error('Error completing social auth:', error);
        navigate('/login?error=fetch_failed');
      }
    };

    handleSocialAuth();
  }, [location, navigate, dispatch]);

  const handleContinue = async () => {
    const isCompanyAdmin = user?.companyAssociations?.some(
      assoc => ['owner', 'founder', 'manager'].includes(assoc.role) &&
        assoc.status === 'active'
    );

    console.log("Email verification..");
    console.log('isCompanyAdmin..', isCompanyAdmin);
    console.log('user..', user);
    console.log('companyDetails..', companyDetails);

    setVerified('completed');

    // Wait for any pending state updates
    await Promise.resolve();

    if (companyDetails && isCompanyAdmin) {
      console.log("should now navigate!");

      navigate('/seller/portal', {
        state: {
          companyDetails,
          verificationStatus: 'completed',
          user
        },
        replace: true
      });
    } else if (companyDetails) {
      // If they have company details but aren't admin level
      navigate('/home', {
        state: {
          companyDetails,
          verificationStatus: 'completed',
          user
        },
        replace: true
      });
    } else {
      // Fallback route if no company details are available
      navigate('/home', { replace: true });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl mb-4">Completing login...</h2>
      {verified && (
         <Button onClick={handleContinue}>Continue to Onboarding</Button>
      ) }
       
      </div>
    </div>
  );
};

export default SocialAuthSuccess;