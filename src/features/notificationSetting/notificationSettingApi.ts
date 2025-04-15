import { createAsyncThunk } from '@reduxjs/toolkit';

import {axiosInstance} from '../../utils/axiosInstance';
import { AxiosError } from 'axios';

export const fetchNotificationSettings = createAsyncThunk(
  'notification/fetchSettings',
  async (_, thunkAPI) => {
    try {
      const response = await axiosInstance.get('/notification-settings');
      return response.data.data;
    } catch (error) {
      if(error instanceof AxiosError){
        // Handle error appropriately
        console.error('Error fetching notification settings:', error);
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
      return thunkAPI.rejectWithValue('Failed to fetch notification settings');
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notification/updateSettings',
  async (settings:Partial<{emailNotifications:boolean,inAppNotifications:boolean}>, thunkAPI) => {
    try {
      const response = await axiosInstance.put('/notification-settings', settings);
      return response.data.data;
    } catch (error) {
      // Handle error appropriately
      console.error('Error updating notification settings:', error);
      if(error instanceof AxiosError){

        return thunkAPI.rejectWithValue(error.response?.data || error.message || 'Failed to update notification settings');
      }
      return thunkAPI.rejectWithValue('Failed to update notification settings');
    }
  }
);
