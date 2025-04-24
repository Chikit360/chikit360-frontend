import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { OfferPlanI } from "../../helpers/offerPlanInterface";
import { axiosInstance } from "../../utils/axiosInstance";

// Fetch All Offer Plans
export const fetchAllOfferPlans = createAsyncThunk<OfferPlanI[]>(
  "offerPlans/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/offers-plan`);
      return response.data.data as OfferPlanI[];
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch plans");
    }
  }
);

// Create Offer Plan
export const createOfferPlan = createAsyncThunk<OfferPlanI, Partial<OfferPlanI>>(
  "offerPlans/create",
  async (planData:any, thunkAPI) => {
    try {
      const response = await axiosInstance.post(`/offers-plan`, planData);
      return response.data.data as OfferPlanI;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to create plan");
    }
  }
);

// Update Offer Plan
export const updateOfferPlan = createAsyncThunk<OfferPlanI, { id: string; data: Partial<OfferPlanI> }>(
  "offerPlans/update",
  async ({ id, data }:{id:string,data:Partial<OfferPlanI>}, thunkAPI) => {
    try {
      console.log(data)
      const response = await axiosInstance.put(`/offers-plan/${id}`, data);
      return response.data.data as OfferPlanI;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update plan");
    }
  }
);
