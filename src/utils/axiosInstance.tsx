// utils/axiosInstance.ts
import axios from 'axios';
import Cookies from 'js-cookie';

// Create a default Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // or any base URL you'd like
});

// Add a request interceptor to attach the token to the default instance
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // config.headers["subscription-token"] =import.meta.env.VITE_SUBSCRIPTION_TOKEN;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Create another Axios instance for handling multipart/form-data
const axiosFormDataInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Same base URL
  headers: {
    'Content-Type': 'multipart/form-data', // Set default content-type for form-data
  },
});

// Add request interceptor to handle token for multipart/form-data instance as well
axiosFormDataInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { axiosInstance, axiosFormDataInstance };
