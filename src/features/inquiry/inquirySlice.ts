import { createSlice } from '@reduxjs/toolkit';
import { fetchInquiries, updateInquiryStatusAPI } from './inquiryApiThunk';
import { InquiryI } from '../../helpers/inquiryInterface';

// For slice state
export interface InquiryState {
    inquiries: InquiryI[];
    loading: boolean;
    error: string | null;
  }

const initialState: InquiryState = {
  inquiries: [],
  loading: false,
  error: null,
};

const inquirySlice = createSlice({
  name: 'inquiry',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.inquiries = action.payload;
      })
      .addCase(fetchInquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateInquiryStatusAPI.fulfilled, (state, action) => {
        const index = state.inquiries.findIndex((item) => item._id === action.payload._id);
        if (index !== -1) {
          state.inquiries[index] = action.payload;
        }
      });
  },
});

export default inquirySlice.reducer;
