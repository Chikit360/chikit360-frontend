import { createSlice } from '@reduxjs/toolkit';
import {
  createHospital,
  getAllHospitals,
  deleteHospitalById,
  getHospitalById,
  updateHospitalById,
  searchHospital
} from './hospitalApi';

import { GlobalErrorPayload } from '../../helpers/interfaces';
import { IHospital } from '../../helpers/hospitalInterface';

interface HospitalState {
  hospitals: IHospital[];
  searchResult: IHospital[];
  recentCreatedHospitalId: string | null;
  selectedHospital: IHospital | null;
  success: boolean;
  loading: boolean;
  error: boolean;
  message: string | null;
}

const initialState: HospitalState = {
  hospitals: [],
  searchResult: [],
  recentCreatedHospitalId: null,
  selectedHospital: null,
  success: false,
  loading: false,
  error: false,
  message: null,
};

const hospitalSlice = createSlice({
  name: 'hospitals',
  initialState,
  reducers: {
    clearHospitalMessage: (state) => {
      state.success = false;
      state.error = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchHospital.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(searchHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.searchResult = action.payload.data;
      })
      .addCase(searchHospital.rejected, (state) => {
        state.loading = false;
        state.success = false;
        state.error = true;
      })
      .addCase(getAllHospitals.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success = false;
      })
      .addCase(getAllHospitals.fulfilled, (state, action) => {
        state.loading = false;
        state.hospitals = action.payload.data;
        state.success = true;
      })
      .addCase(getAllHospitals.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = true;
        const { message } = action.payload as GlobalErrorPayload;
        state.message = message;
      })
      .addCase(createHospital.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = false;
      })
      .addCase(createHospital.fulfilled, (state, action) => {
        state.hospitals.push(action.payload.data);
        state.recentCreatedHospitalId = action.payload.data._id;
        state.success = true;
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(deleteHospitalById.fulfilled, (state, action) => {
        state.hospitals = state.hospitals.filter((hospital) => hospital._id !== action.payload);
      })
      .addCase(getHospitalById.fulfilled, (state, action) => {
        state.selectedHospital = action.payload.data as IHospital;
      })
      .addCase(updateHospitalById.fulfilled, (state, action) => {
        const index = state.hospitals.findIndex((hospital) => hospital._id === action.payload.data._id);
        if (index !== -1) {
          state.hospitals[index] = { ...action.payload.data };
          state.message = action.payload.message;
          state.success = true;
          state.loading = false;
        }
      });
  },
});

export const { clearHospitalMessage } = hospitalSlice.actions;
export default hospitalSlice.reducer;
