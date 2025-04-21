// inquiryApiThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axiosInstance';

export const fetchInquiries = createAsyncThunk('inquiry/fetchAll', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/inquiries');
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const updateInquiryStatusAPI = createAsyncThunk(
  'inquiry/updateStatus',
  async ({ id, status }: { id: string; status: string }, thunkAPI) => {
    try {
      const response = await axiosInstance.put(`/inquiries/${id}`, { status });
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
