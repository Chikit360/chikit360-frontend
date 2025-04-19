import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SubscriptionI } from "../../helpers/subscriptionInterface";
import { axiosInstance } from "../../utils/axiosInstance";

// Get current subscription for a hospital
export const fetchCurrSubscription = createAsyncThunk(
  "subscription/fetchCurrSubscription",
  async (hospitalId:string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get(`/subscription/curr?hospitalId=${hospitalId}`);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchSubscriptionsPlan = createAsyncThunk(
    "subscription/fetchSubscriptionPlan",
    async (_, { rejectWithValue }) => {
      try {
        const { data } = await axiosInstance.get(`/subscriptions/plans`);
        return data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || error.message);
      }
    }
  );

// Create new subscription
export const createSubscription = createAsyncThunk(
  "subscription/createSubscription",
  async (newData: Partial<SubscriptionI>, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(`/subscription/create`, newData);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cancel subscription
export const cancelSubscription = createAsyncThunk(
  "subscription/cancelSubscription",
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(`/subscription/cancel/${id}`);
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
