import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../../features/component/signup-login/models/User';
import { AuthResponse } from '../../features/component/signup-login/models/AuthResponse';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://localhost:7290/api';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (credentials: User) => Promise<AuthResponse>;
  register: (userData: User) => Promise<AuthResponse>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }, [token]);

  const login = useCallback(async (credentials: User): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/Auth/Login`, credentials);
    setToken(response.data.token);
    return response.data;
  }, []);

  const register = useCallback(async (userData: User): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_URL}/Auth/Register`, userData);
    setToken(response.data.token);
    return response.data;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    navigate('/login');
  }, [navigate]);

  const authContextValue = useMemo(() => ({
    isAuthenticated: !!token,
    login,
    register,
    logout,
  }), [token, login, register, logout]);

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};