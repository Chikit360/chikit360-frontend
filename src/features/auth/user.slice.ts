import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from './authApi';

import Cookies from 'js-cookie';

interface UserData {
  _id:string;
  username: string;
  email: string;
  role:string;
  token: string | null;
  hospital:string;
  hospitalDetail?:{_id:string;name:string,address:{
    city:string,
    state:string,
    zipCode:string,
    landmark:string
  }};
}

interface User {
  data: UserData;
  message:string;
  error:string;
  success:boolean;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  success: boolean;
  loading: boolean;
  error: boolean;
  message: string | null;
}

const token = Cookies.get('token');
const storedUser = token ? JSON.parse(localStorage.getItem('user') || 'null') : null;

const initialState: AuthState = {
  user: storedUser,
  isAuthenticated: !!token,
  success: false,
  loading: false,
  error: false,
  message:null
};



const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload.data;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload.data));
      if (action.payload.data.token) {
        Cookies.set('token', action.payload.data.token, { expires: 7 });
      }
    },
    // logout: (state) => {
    //   state.user = null;
    //   state.isAuthenticated = false;
    //   state.success = true;
    //   state.message = 'Logout successful';
    //   Cookies.remove('token');
    //   localStorage.removeItem('user');
    // },
    clean: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.success = false;
      state.message = null;
      Cookies.remove('token');
      localStorage.removeItem('user');
    },
    cleanMessege: (state) => {
      
      state.message = null;
      
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        Cookies.set('token', action.payload.data.token!, { expires: 7 });
        localStorage.setItem('user', JSON.stringify(action.payload.data));
        state.message = action.payload.message;
        state.success = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = (action.payload as { message?: string })?.message || 'An error occurred';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.success = true;
        state.message = 'Logged out successfully';
        Cookies.remove('token');
        localStorage.removeItem('user');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = true;
        state.success=false;
        state.message = (action.payload as { message?: string })?.message || 'Logout failed';
      });
  },
});


export const {  setUser,clean,cleanMessege } = authSlice.actions;
export const getUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export default authSlice.reducer;
