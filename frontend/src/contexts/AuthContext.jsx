import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // This effect runs once on app load to fetch the CSRF cookie and check for an existing session.
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Step 1: Get the CSRF cookie. This is essential for all subsequent POST requests.
        await axiosInstance.get('http://localhost:8000/sanctum/csrf-cookie');
        
        // Step 2: Check if a user session already exists.
        const response = await axiosInstance.get('/auth/user');
        setUser(response.data);
      } catch (err) {
        // A 401 error here is normal if the user is not logged in. We only log other errors.
        if (err.response?.status !== 401) {
          console.error('Initialization error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // After getting the CSRF cookie on load, we can now log in.
      // Laravel will handle the session cookie automatically.
      const response = await axiosInstance.post('/auth/login', credentials);
      setUser(response.data);
      return response.data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      // This will invalidate the session on the backend.
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear the user state on the frontend.
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);