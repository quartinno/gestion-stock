import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext();



export const AuthProvider = ({ children }) => {
    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                await axiosInstance.get('http://localhost:8000/sanctum/csrf-cookie');
                console.log('CSRF cookie set');
            } catch (error) {
                console.error('Failed to fetch CSRF token:', error);
            }
        };
        getCsrfToken();
    }, []);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        const response = await axiosInstance.get('/auth/user');
        setUser(response.data);
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        delete axiosInstance.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    setLoading(true);
    try {


      const response = await axiosInstance.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setUser(user);
      return user;
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
      await axiosInstance.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      delete axiosInstance.defaults.headers.common['Authorization'];
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