// src/components/common/onboardingRoute/OnboardingRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OnboardingRoute = ({ children }) => {
  const { onboardingStarted, emailVerified } = useSelector((state) => state.onboarding);

  if (!onboardingStarted) {
    // If onboarding hasn't started, redirect to the onboarding form
    return <Navigate to="/admin/onboarding" replace />;
  }

  if (emailVerified) {
    // If email is already verified, redirect to the document upload page
    return <Navigate to="/admin/documents" replace />;
  }

  // If onboarding has started but email is not verified, render the children (EmailVerificationPage)
  return children;
};

export default OnboardingRoute;