// src/store/slices/OnboardingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { onboardingService } from '../../services/api/onboarding';
import { companyService } from '../../services/api/company';

export const startOnboarding = createAsyncThunk(
  'onboarding/start',
  async (onboardingData) => {
    const response = await onboardingService.startOnboarding(onboardingData);
    return response;
  }
);

export const uploadDocuments = createAsyncThunk(
  'onboarding/uploadDocuments',
  async (documents) => {
    const response = await onboardingService.uploadDocuments(documents);
    return response;
  }
);

export const reviewOnboarding = createAsyncThunk(
  'onboarding/review',
  async ({ id, reviewData }) => {
    const response = await onboardingService.reviewOnboarding(id, reviewData);
    return response;
  }
);


export const completeOnboarding = createAsyncThunk(
  'onboarding/complete',
  async (companyId) => {
    const response = await companyService.completeOnboarding(companyId);
    return response;
  }
);

export const updateCompany = createAsyncThunk(
  'onboarding/updateCompany',
  async ({ companyId, updates }) => {
    const response = await companyService.updateCompany(companyId, updates);
    return response;
  }
);

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    status: 'idle',
    error: null,
    onboardingCompleted: false,
    onboardingStarted: false,
    documents: [],
    verificationStatus: 'pending',
    primaryCraftSkill: '',
    secondaryCraftSkills: [],
    preferredCommunicationMethod: '',
    availabilityForSupport: ''
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },

    setPrimaryCraftSkill: (state, action) => {
      state.primaryCraftSkill = action.payload;
    },
    setSecondaryCraftSkills: (state, action) => {
      state.secondaryCraftSkills = action.payload;
    },
    setPreferredCommunicationMethod: (state, action) => {
      state.preferredCommunicationMethod = action.payload;
    },
    setAvailabilityForSupport: (state, action) => {
      state.availabilityForSupport = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(startOnboarding.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(startOnboarding.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.onboardingStarted = true;
        state.email = action.payload.email;
      })
      .addCase(startOnboarding.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(uploadDocuments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.documents = action.payload.documents;
        state.verificationStatus = action.payload.verificationStatus;
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(reviewOnboarding.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(reviewOnboarding.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(reviewOnboarding.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(completeOnboarding.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.onboardingCompleted = true;
      })
      .addCase(completeOnboarding.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateCompany.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Update any relevant company details in the onboarding state
        state.primaryCraftSkill = action.payload.primaryCraftSkill;
        state.secondaryCraftSkills = action.payload.secondaryCraftSkills;
        state.preferredCommunicationMethod = action.payload.preferredCommunicationMethod;
        state.availabilityForSupport = action.payload.availabilityForSupport;
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const {
  clearErrors,
  setPrimaryCraftSkill,
  setSecondaryCraftSkills,
  setPreferredCommunicationMethod,
  setAvailabilityForSupport
} = onboardingSlice.actions;

export default onboardingSlice.reducer;