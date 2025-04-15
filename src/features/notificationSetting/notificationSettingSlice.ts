import { createSlice } from '@reduxjs/toolkit';

import { NotificationSettingI } from '../../helpers/notificationInterface';
import { fetchNotificationSettings, updateNotificationSettings } from './notificationSettingApi';


interface NotificationSettingState {
  settings: NotificationSettingI | null;
  loading: boolean;
  error: string | null;
}

const initialState:NotificationSettingState = {
  settings: null,
  loading: false,
  error: null
};

const notificationSettingSlice = createSlice({
  name: 'notificationSetting',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotificationSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchNotificationSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = String(action.payload) || 'Failed to fetch notificationSetting settings';
      })
      // Update
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.settings = action.payload;
      });
  }
});

export default notificationSettingSlice.reducer;
