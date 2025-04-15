// src/features/users/userApiThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';

import { axiosInstance } from '../../utils/axiosInstance';

export const createUser = createAsyncThunk('users/create', async (userData:{email:string,password:string,role:string}, thunkAPI) => {
  try {
    const response = await axiosInstance.post('/users/create', userData);
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }:{id:string,data:any}, thunkAPI) => {
  try {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const deleteUser = createAsyncThunk('users/delete', async (id:string, thunkAPI) => {
  try {
    await axiosInstance.delete(`/users/${id}`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const fetchUsers = createAsyncThunk('users/fetch', async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get('/users');
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const getUserById = createAsyncThunk('users/getById', async (id:string, thunkAPI) => {
  try {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});
