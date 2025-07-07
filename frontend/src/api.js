import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000'; 
let token = localStorage.getItem('token') || null;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const setAuthToken = (newToken) => {
  token = newToken;
  localStorage.setItem('token', newToken);
};

export const clearAuthToken = () => {
  token = null;
  localStorage.removeItem('token');
};

export default api;