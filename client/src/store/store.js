// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import businessReducer from './slices/companySlice';
import authReducer from './slices/authSlice';
import onboardingReducer from './slices/OnboardingSlice'; // New onboarding slice

const store = configureStore({
  reducer: {
    institutes: businessReducer,
    auth: authReducer,
    onboarding: onboardingReducer // Add onboarding slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/checkEmailVerification/rejected'],
        // Ignore these field paths in the state
        ignoredPaths: ['error']
      }
    })
});

export default store;
