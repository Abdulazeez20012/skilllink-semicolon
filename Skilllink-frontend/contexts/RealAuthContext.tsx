import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { realApi } from '../services/realApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const RealAuthContext = createContext<AuthContextType | undefined>(undefined);

interface RealAuthProviderProps {
  children: ReactNode;
}

export const RealAuthProvider: React.FC<RealAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for existing token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('skilllink_token');
    const storedUser = localStorage.getItem('skilllink_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await realApi.login({ email, password }, role);
      setUser(result.user);
      setToken(result.token);
      
      // Save to localStorage
      localStorage.setItem('skilllink_token', result.token);
      localStorage.setItem('skilllink_user', JSON.stringify(result.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during login');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await realApi.register({ name, email, password, role });
      setUser(result.user);
      setToken(result.token);
      
      // Save to localStorage
      localStorage.setItem('skilllink_token', result.token);
      localStorage.setItem('skilllink_user', JSON.stringify(result.user));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('skilllink_token');
    localStorage.removeItem('skilllink_user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return (
    <RealAuthContext.Provider value={value}>
      {children}
    </RealAuthContext.Provider>
  );
};