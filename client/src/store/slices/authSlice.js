// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api/auth';
import { companyService } from '../../services/api/company';

const initializeAuthState = () => {
  try {
    const hasToken = localStorage.getItem('token');
    if (!hasToken) {
      return {
        user: null,
        isAuthenticated: false,
        isVerified: false,
        verifiedAt: null,
        companyDetails: null,
        error: null,
        loading: false,
        authLoading: false  // Added initial state
      };
    }

    const currentUser = authService.getCurrentUser();
    console.log("currenuser..",currentUser);
    return {
      user: currentUser,
      isAuthenticated: currentUser?.isVerified ?? false,
      isVerified: currentUser?.isVerified ?? false,
      verifiedAt: currentUser?.verifiedAt ?? null,
      companyDetails: currentUser?.companyDetails ?? null,
      loading: false,
      authLoading: false,
      error: null
    };
  } catch (error) {
    localStorage.removeItem('token');
    return {
      user: null,
      isAuthenticated: false,
      isVerified: false,
      verifiedAt: null,
      companyDetails: null,
      loading: false,
      authLoading: false,
      error: null
    };
  }
};

export const loginCompany = createAsyncThunk(
  'auth/loginCompany',
  async (credentials) => {
    const response = await companyService.loginCompany(credentials);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials) => {
    const response = await authService.loginUser(credentials);
    console.log("Login thunk response..",response);
    return response;
  }
);


export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData) => {
    const { success, data } = await authService.registerUser(userData);

    console.log("thun..success..data..", { success, data })

    return { success, data };
  }
);

export const addCompanyAssociation = createAsyncThunk(
  'auth/addCompanyAssociation',
  async (associationData) => {
    console.log("Inside registerUser..");
    // console.log(UserData);
    const response = await authService.addCompanyAssociation(associationData);

    return response;
  }
);

export const verifyEmail = createAsyncThunk(
  'onboarding/verifyEmail',
  async () => {
    const response = await authService.verifyEmail();
    console.log('Verification response:', response);
    return response;
  }
);

export const checkEmailVerification = createAsyncThunk(
  'auth/checkEmailVerification',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.checkEmailVerification();
      
      if (!response.data) {
        throw new Error('No data received from verification check');
      }
      
      // Match the backend structure exactly
      return {
        isVerified: response.data.isVerified,
        verifiedAt: response.data.verifiedAt,
        companyDetails: response.data.companyDetails || null,
        user: {
          _id: response.data.user._id,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          email: response.data.user.email,
          companyAssociations: response.data.user.companyAssociations,
          security: response.data.user.security,
          platformRoles: response.data.user.platformRoles
        }
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Verification check failed');
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: initializeAuthState(),
  reducers: {
    logout: (state) => {
      authService.logout();
      return {
        ...initializeAuthState(),
        authLoading: false
      };
    },
    clearError: (state) => {
      state.error = null;
    },
    setEmailVerified: (state, action) => {
      state.isVerified = true;
      state.isAuthenticated = true;
      state.verifiedAt = action.payload.verifiedAt || new Date().toISOString();
      state.authLoading = false;
      clearError(state); 
      
      // Update the entire user object
      if (action.payload.user) {
        state.user = {
          ...state.user,
          ...action.payload.user,
                  
        };
      }

      // Set companyDetails separately
      state.companyDetails = action.payload.companyDetails || null;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // User login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.authLoading = false;
      })
      // Company login cases
      .addCase(loginCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authLoading = true;
      })
      .addCase(loginCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authLoading = false;
      })
      .addCase(loginCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.authLoading = false;
      })
      // User registration cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.authLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.authLoading = false;
      })
      .addCase(checkEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authLoading = true;
      })
      .addCase(checkEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.authLoading = false;
        state.isVerified = action.payload.isVerified;
        state.verifiedAt = action.payload.verifiedAt;      
      
        // Update user data
        if (action.payload.user) {
          state.user = {
            ...state.user,
            ...action.payload.user
          };
        }
        
        // Set companyDetails separately
        state.companyDetails = action.payload.companyDetails || null;
      
      })
      .addCase(checkEmailVerification.rejected, (state, action) => {
        state.loading = false;
        // Only store the error message string
        state.error = action.payload || 'Verification failed';
        state.authLoading = false;
      });

  }
});

export const {
  logout,
  clearError,
  setEmailVerified,  
  setEmail } = authSlice.actions;
export default authSlice.reducer;