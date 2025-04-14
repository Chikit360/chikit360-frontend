import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IHospital } from '../../helpers/hospitalInterface';
import { axiosFormDataInstance, axiosInstance } from '../../utils/axiosInstance';

// Utility function for appending form data
const appendFormData = (formData:any, data:any, parentKey = '') => {
  for (const key in data) {
    if (!data.hasOwnProperty(key)) continue;

    const value = data[key];
    const formKey = parentKey ? `${parentKey}.${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object') {
          appendFormData(formData, item, `${formKey}[${index}]`);
        } else {
          formData.append(formKey, item);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      appendFormData(formData, value, formKey);
    } else {
      formData.append(formKey, value);
    }
  }
};

// Create Hospital
export const createHospital = createAsyncThunk(
  'hospital/createHospital',
  async (hospitalData:Partial<IHospital>, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      appendFormData(formData, hospitalData);

      const response = await axiosFormDataInstance.post('/hospitals', formData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Get All Hospitals
export const getAllHospitals = createAsyncThunk(
  'hospital/getAllHospitals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/hospitals');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data || 'An error occurred');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Get Hospital By ID
export const getHospitalById = createAsyncThunk(
  'hospital/getHospitalById',
  async (id:string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/hospitals/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Update Hospital By ID
export const updateHospitalById = createAsyncThunk(
  'hospital/updateHospitalById',
  async ({ id, hospitalData }:{id:string,hospitalData:Partial<IHospital>}, { rejectWithValue }) => {
    try {
      console.log(hospitalData)
      const response = await axiosInstance.patch(`/hospitals/${id}`, hospitalData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Delete Hospital By ID
export const deleteHospitalById = createAsyncThunk(
  'hospital/deleteHospitalById',
  async (id:string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/hospitals/${id}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Get Active Hospitals (example endpoint for active hospitals)
export const activeHospitals = createAsyncThunk(
  'hospital/activeHospitals',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/hospitals/active');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'An error occurred');
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

// Search Hospitals
export const searchHospital = createAsyncThunk(
  'hospital/search',
  async (data:{q:string}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/hospitals/search', {
        params: { q: data.q },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);
