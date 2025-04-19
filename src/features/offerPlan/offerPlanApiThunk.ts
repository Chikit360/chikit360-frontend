import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { OfferPlanI } from "../../helpers/offerPlanInterface";

export const fetchAllOfferPlans = createAsyncThunk<OfferPlanI[]>(
  "offerPlans/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/offers-plan`); // Adjust endpoint
      console.log(response)
      return response.data.data as OfferPlanI[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch plans");
    }
  }
);
