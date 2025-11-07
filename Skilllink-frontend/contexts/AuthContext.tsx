import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { api, LoginCredentials } from '../services/api';
import { realApi } from '../services/realApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials, role: UserRole) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<Pick<User, 'name' | 'email' | 'avatarUrl'>>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Use real API if not in development mode with mock data flag
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

  const login = async (credentials: LoginCredentials, role: UserRole) => {
    setLoading(true);
    try {
      let loggedInUser: User;
      
      if (USE_MOCK_DATA) {
        loggedInUser = await api.login(credentials, role);
      } else {
        // Use real API
        const realCredentials = {
          email: credentials.email,
          password: credentials.password || 'defaultPassword123',
        };
        const result = await realApi.login(realCredentials);
        loggedInUser = result.user;
        // Store token for real API usage
        localStorage.setItem('skilllink_token', result.token);
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
      
      if (USE_MOCK_DATA) {
        updatedUser = await api.updateUserProfile(user, updates);
      } else {
        // For real API, we would need to pass the token
        // For now, we'll just update the local user
        updatedUser = { ...user, ...updates };
      }
      
      setUser(updatedUser);
      localStorage.setItem('skilllink-user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error; // Re-throw to be caught in the component
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};