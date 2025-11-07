import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { realApi, LoginCredentials } from '../services/realApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email' | 'avatarUrl'>>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const USE_MOCK_DATA = false; // Default to real API

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const storedUser = localStorage.getItem('skilllink-user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to parse user from storage', error);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      let loggedInUser: User;
      let token: string;
      
      if (USE_MOCK_DATA) {
        // For mock data, we would need to determine the role from somewhere
        // This is a simplification - in a real app you might need to adjust this
        const result = await realApi.login(credentials);
        loggedInUser = result.user;
        token = result.token;
      } else {
        // Use real API
        const result = await realApi.login(credentials);
        loggedInUser = result.user;
        token = result.token;
        // Store token for real API usage
        localStorage.setItem('skilllink_token', token);
      }
      
      setUser(loggedInUser);
      localStorage.setItem('skilllink-user', JSON.stringify(loggedInUser));
      navigate('/app/dashboard', { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string; role: UserRole }) => {
    setLoading(true);
    try {
      let registeredUser: User;
      let token: string;
      
      if (USE_MOCK_DATA) {
        // For mock data, we would need to determine the role from somewhere
        // This is a simplification - in a real app you might need to adjust this
        const result = await realApi.register(userData);
        registeredUser = result.user;
        token = result.token;
      } else {
        // Use real API
        const result = await realApi.register(userData);
        registeredUser = result.user;
        token = result.token;
        // Store token for real API usage
        localStorage.setItem('skilllink_token', token);
      }
      
      setUser(registeredUser);
      localStorage.setItem('skilllink-user', JSON.stringify(registeredUser));
      navigate('/app/dashboard', { replace: true });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('skilllink-user');
    localStorage.removeItem('skilllink_token');
    navigate('/login', { replace: true });
  };
  
  const updateUser = async (updates: Partial<Pick<User, 'name' | 'email' | 'avatarUrl'>>) => {
    if (!user) throw new Error("No user to update");

    try {
      let updatedUser: User;
      const token = localStorage.getItem('skilllink_token');
      
      if (USE_MOCK_DATA || !token) {
        // Fallback to local update if no token or using mock data
        updatedUser = { ...user, ...updates };
      } else {
        // Use real API to update user profile
        updatedUser = await realApi.updateUserProfile(user, updates, token);
      }
      
      setUser(updatedUser);
      localStorage.setItem('skilllink-user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error; // Re-throw to be caught in the component
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};