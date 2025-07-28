import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  withCredentials: true, // Required for cookies, authorization headers with HTTPS
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  config => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    
    // If the token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers.Accept = 'application/json';
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    
    // Always include credentials for cross-origin requests
    config.withCredentials = true;
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      console.error('Unauthorized - redirect to login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
