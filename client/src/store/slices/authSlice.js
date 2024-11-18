// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/api/auth';
import { businessService } from '../../services/api/business';

const initializeAuthState = () => {
  try {
    const hasToken = localStorage.getItem('token');
    if (!hasToken) {
      return {
        user: null,
        isAuthenticated: false,
        isVerified: false,
        verifiedAt: null,
        businessDetails: null,
        error: null,
        loading: false,
        authLoading: false  // Added initial state
      };
    }

    const currentUser = authService.getCurrentUser();
    return {
      user: currentUser,
      isAuthenticated: !!hasToken && !!currentUser, // More strict check
      isVerified: currentUser?.isVerified ?? false,
      verifiedAt: currentUser?.verifiedAt ?? null,
      businessDetails: currentUser?.businessDetails ?? null,
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
      businessDetails: null,
      loading: false,
      authLoading: false,
      error: null
    };
  }
};

export const loginBusiness = createAsyncThunk(
  'auth/loginBusiness',
  async (credentials) => {
    const response = await businessService.loginBusiness(credentials);
    return response;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials) => {
    const response = await authService.loginUser(credentials);
    console.log("Login thunk response..",response)
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

export const addBusinessAssociation = createAsyncThunk(
  'auth/addBusinessAssociation',
  async (associationData) => {
    console.log("Inside registerUser..");
    // console.log(UserData);
    const response = await authService.addBusinessAssociation(associationData);

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
        businessDetails: response.data.businessDetails || null,
        user: {
          _id: response.data.user._id,
          businessAssociations: response.data.user.businessAssociations,
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
      
      // Update the entire user object
      if (action.payload.user) {
        state.user = {
          ...state.user,
          ...action.payload.user,
                  
        };
      }

      // Set businessDetails separately
      state.businessDetails = action.payload.businessDetails || null;
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
      // Business login cases
      .addCase(loginBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.authLoading = true;
      })
      .addCase(loginBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.authLoading = false;
      })
      .addCase(loginBusiness.rejected, (state, action) => {
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
        state.isAuthenticated = true;
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
        
        // Set businessDetails separately
        state.businessDetails = action.payload.businessDetails || null;
      
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