// src/features/admin/adminSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import {  fetchSuperAdminDashboardAnalytics } from './superAdminApi';

export interface ChartSeries {
    name: string;
    data: number[];
  }
  
  export interface ChartData {
    series: ChartSeries[];
    xaxis: {
      type: string;
      categories: string[];
    };
  }
  
  export interface DashboardAnalyticsData {
    totalMedicines: number;
    totalInventory: number;
    totalCustomers: number;
    totalTodaySales: number;
    totalProfitToday: number;
    chart: ChartData;
  }

interface SuperAdminState {
  superAdmindashboardData: DashboardAnalyticsData | null;
  loading: boolean;
  error: boolean;
  message: string | null;
  success: boolean;
}

// Initial State
const initialState: SuperAdminState = {
  superAdmindashboardData: null,
  loading: false,
  error: false,
  message: null,
  success: false,
};

const superAdminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuperAdminDashboardAnalytics.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
        state.message = null;
      })
      .addCase(fetchSuperAdminDashboardAnalytics.fulfilled, (state, action) => {
        console.log(action.payload)
        state.superAdmindashboardData = action.payload;
        state.loading = false;
        state.success = true;
        state.message = 'Dashboard analytics fetched successfully';
      })
      .addCase(fetchSuperAdminDashboardAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.success = false;
        state.message = action.payload as string;
      });
  },
});

export default superAdminSlice.reducer;
