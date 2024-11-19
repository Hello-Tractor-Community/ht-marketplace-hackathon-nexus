// src/store/slices/companySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyService } from '../../services/api/company';

export const registerCompany = createAsyncThunk(
  'company/registerCompany',
  async (companyData, { getState }) => {
    const { user } = getState().auth;
    console.log("company slice user:", user);
   
    try {
      // Register the new company
      console.log("registerCompany Thunk");
      console.log("Company data:", companyData);
      console.log("User:", user);
      const companyResponse = await companyService.registerCompany({
        ...companyData,
        owner: companyData.owner,
        role: companyData.role
      });

      console.log("company slice response:", companyResponse);

      return companyResponse.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
);

export const searchCompany = createAsyncThunk(
  'company/search',
  async (searchTerm) => {
    const response = await companyService.searchCompany(searchTerm);
    return response.data;
  }
);

export const onboardCompany = createAsyncThunk(
  'company/onboard',
  async (companyData) => {
    const response = await companyService.registerCompany(companyData);
    return response.data;
  }
);

export const uploadDocuments = createAsyncThunk(
  'company/uploadDocuments',
  async ({ documents, companyId }) => {
    const response = await companyService.uploadDocuments(documents, companyId);
    return response.data;
  }
);

const companySlice = createSlice({
  name: 'company',
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
      .addCase(registerCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(registerCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Onboarding cases
      .addCase(onboardCompany.pending, (state) => {
        state.onboardingStatus.loading = true;
        state.onboardingStatus.error = null;
      })
      .addCase(onboardCompany.fulfilled, (state, action) => {
        state.onboardingStatus.loading = false;
        state.onboardingStatus.completed = true;
        // Optionally add the new company to items array
        state.items.push(action.payload);
      })
      .addCase(onboardCompany.rejected, (state, action) => {
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

export const { clearErrors } = companySlice.actions;
export default companySlice.reducer;