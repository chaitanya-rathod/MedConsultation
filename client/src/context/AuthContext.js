import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/auth/me');
        setUser(res.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Error loading user:', err.response?.data?.message || err.message);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setError(err.response?.data?.message || 'Failed to authenticate');
      }
      
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put('http://localhost:5000/api/users/profile', profileData);
      
      setUser({ ...user, ...res.data });
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 