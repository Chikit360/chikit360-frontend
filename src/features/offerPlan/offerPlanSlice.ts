import { createSlice } from "@reduxjs/toolkit";
import { OfferPlanI } from "../../helpers/offerPlanInterface";
import { fetchAllOfferPlans } from "./offerPlanApiThunk";

interface OfferPlanState {
  plans: OfferPlanI[];
  loading: boolean;
  error: string | null;
}

const initialState: OfferPlanState = {
  plans: [],
  loading: false,
  error: null,
};

const offerPlanSlice = createSlice({
  name: "offerPlans",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOfferPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOfferPlans.fulfilled, (state, action) => {
        state.plans = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllOfferPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default offerPlanSlice.reducer;
