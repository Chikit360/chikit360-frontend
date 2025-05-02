import { createSlice } from "@reduxjs/toolkit";
import {
    fetchCurrSubscription,
  createSubscription,
  cancelSubscription,
  allSubscriptionByHospitalId,
} from "./subscriptionApiThunk";
import { SubscriptionI } from "../../helpers/subscriptionInterface";

interface SubscriptionState {
  data: SubscriptionI | null;
  subscriptions: SubscriptionI[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  data: null,
  subscriptions:[],
  loading: false,
  error: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    clearSubscription(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCurrSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(allSubscriptionByHospitalId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(allSubscriptionByHospitalId.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(allSubscriptionByHospitalId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(cancelSubscription.fulfilled, (state, action) => {
        state.data = action.payload;
      });
  },
});

export const { clearSubscription } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
