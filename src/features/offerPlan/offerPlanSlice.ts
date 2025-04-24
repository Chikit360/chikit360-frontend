import { createSlice } from "@reduxjs/toolkit";
import { OfferPlanI } from "../../helpers/offerPlanInterface";
import {
  fetchAllOfferPlans,
  createOfferPlan,
  updateOfferPlan,
} from "./offerPlanApiThunk";

interface OfferPlanState {
  plans: OfferPlanI[];
  loading: boolean;
  error: boolean;
  success: boolean;
  message:string|null;
}

const initialState: OfferPlanState = {
  plans: [],
  loading: false,
  error: false,
  message:null,
  success:false
};

const offerPlanSlice = createSlice({
  name: "offerPlans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Fetch All Plans
      .addCase(fetchAllOfferPlans.pending, (state) => {
        state.loading = true;
        state.error = false;
        state.success=false;
      })
      .addCase(fetchAllOfferPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.loading = false;
        state.success=true;
      })
      .addCase(fetchAllOfferPlans.rejected, (state, action) => {
        state.loading = false;
        state.error=true;
        state.success=false;
        state.message = action.payload as string;
      })

      // Create Plan
      .addCase(createOfferPlan.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.success=false;
      })
      .addCase(createOfferPlan.fulfilled, (state, action) => {
        state.plans.push(action.payload);
        state.loading = false;
        state.success=true;
        state.error=false;
      })
      .addCase(createOfferPlan.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload as string;
        state.success=false;
        state.error=true;
      })

      // Update Plan
      .addCase(updateOfferPlan.pending, (state) => {
        state.loading = true;
        state.message = null;
        state.success=false;
        state.error=false;
      })
      .addCase(updateOfferPlan.fulfilled, (state, action) => {
        const index = state.plans.findIndex(plan => plan._id === action.payload._id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        state.loading = false;
        state.success=true;
        state.message="Updated succefully";
        state.error=false;
      })
      .addCase(updateOfferPlan.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload as string;
        state.success=false;
        state.success=true;
      });
  },
});

export default offerPlanSlice.reducer;
