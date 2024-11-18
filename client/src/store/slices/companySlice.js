// src/store/slices/businessSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { businessService } from '../../services/api/company';

export const registerBusiness = createAsyncThunk(
  'business/registerBusiness',
  async (businessData, { getState }) => {
    const { user } = getState().auth;
    console.log("business slice user:", user);
   
    try {
      // Register the new business
      console.log("registerBusiness Thunk");
      console.log("Business data:", businessData);
      console.log("User:", user);
      const businessResponse = await businessService.registerBusiness({
        ...businessData,
        owner: businessData.owner,
        role: businessData.role
      });

      console.log("business slice response:", businessResponse);

      return businessResponse.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

export const searchBusiness = createAsyncThunk(
  'business/search',
  async (searchTerm) => {
    const response = await businessService.searchBusiness(searchTerm);
    return response.data;
  }
);

export const onboardBusiness = createAsyncThunk(
  'business/onboard',
  async (businessData) => {
    const response = await businessService.registerBusiness(businessData);
    return response.data;
  }
);

export const uploadDocuments = createAsyncThunk(
  'business/uploadDocuments',
  async ({ documents, businessId }) => {
    const response = await businessService.uploadDocuments(documents, businessId);
    return response.data;
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState: {
    items: [],
    loading: false,
    error: null,
    onboardingStatus: {
      loading: false,
      error: null,
      completed: false
    },
    documents: {
      loading: false,
      error: null,
      uploadedDocs: [],
      verificationStatus: 'pending' // 'pending' | 'verified' | 'rejected'
    }
  },
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.onboardingStatus.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Search cases
      .addCase(registerBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(registerBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Onboarding cases
      .addCase(onboardBusiness.pending, (state) => {
        state.onboardingStatus.loading = true;
        state.onboardingStatus.error = null;
      })
      .addCase(onboardBusiness.fulfilled, (state, action) => {
        state.onboardingStatus.loading = false;
        state.onboardingStatus.completed = true;
        // Optionally add the new business to items array
        state.items.push(action.payload);
      })
      .addCase(onboardBusiness.rejected, (state, action) => {
        state.onboardingStatus.loading = false;
        state.onboardingStatus.error = action.error.message;
      })
      // Upload documents cases
      .addCase(uploadDocuments.pending, (state) => {
        state.documents.loading = true;
        state.documents.error = null;
      })
      .addCase(uploadDocuments.fulfilled, (state, action) => {
        state.documents.loading = false;
        state.documents.uploadedDocs = action.payload.documents;
        state.documents.verificationStatus = action.payload.verificationStatus;
      })
      .addCase(uploadDocuments.rejected, (state, action) => {
        state.documents.loading = false;
        state.documents.error = action.error.message;
      });
  }
});

export const { clearErrors } = businessSlice.actions;
export default businessSlice.reducer;