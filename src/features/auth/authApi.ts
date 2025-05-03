import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import {axiosInstance} from '../../utils/axiosInstance'

interface LoginCredentials {
  username: string
  password: string
}

export const loginUser = createAsyncThunk(
  'users/loginUser',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/users/login`, credentials,{ headers: {
        'Content-Type': 'application/json',
        'scanner':'false'
      },})
      console.log(response.data)
      return response.data
    } catch (error: any) {
      console.log(error.response?.data)
      return rejectWithValue(error.response?.data)
    }
  }
)
export const logoutUser = createAsyncThunk(
  'users/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/users/logout`)
      console.log(response.data)
      return response.data
    } catch (error: any) {
      console.log(error.response?.data)
      return rejectWithValue(error.response?.data)
    }
  }
)

