import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { axiosServerInstance } from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is authenticated
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const res = await axiosServerInstance.get('/api/auth/me'); 
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Failed to load user:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      
      // Specific error handling
      if (err.response?.status === 401) {
        logout();
      }
      throw err;
    }
  };

  const register = async (formData) => {
    try {
      const res = await axiosServerInstance.post('/api/auth/register', formData);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      await loadUser();
      navigate('/team-setup');
    } catch (err) {
      throw err;
    }
  };
  
  const login = async (formData) => {
    try {
      const res = await axiosServerInstance.post('/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      await loadUser();
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err.response?.data);
      localStorage.removeItem('token');
      setToken(null);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
        loadUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;