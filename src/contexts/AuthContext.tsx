
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for stored user in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app would call an API
  const login = async (email: string, password: string) => {
    try {
      // In a real app, validate with backend
      if (password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
      // Mock user
      const newUser: User = {
        id: Math.random().toString(36).slice(2),
        email,
        name: email.split('@')[0],
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error("Login failed. Please check your credentials.");
    }
  };

  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    try {
      // In a real app, would send to backend
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Mock user creation
      const newUser: User = {
        id: Math.random().toString(36).slice(2),
        email,
        name,
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error("Registration failed. Please try again.");
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
