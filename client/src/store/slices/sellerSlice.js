// src/features/seller/sellerSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSellerProfile = createAsyncThunk(
  'seller/fetchProfile',
  async () => {
    // API call to fetch seller profile
  }
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState: {
    user: null,
    listings: [],
    messages: [],
    companyStatus: null,
    listingStats: null
  },
  extraReducers: (builder) => {
    // Handle async actions
  }
});

export default sellerSlice.reducer;