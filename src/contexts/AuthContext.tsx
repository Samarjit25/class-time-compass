
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'student' | 'professor', userData: Partial<User>) => Promise<void>;
  register: (email: string, password: string, role: 'student' | 'professor', userData: Partial<User>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isProfessor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  isLoading: true,
  isProfessor: false,
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
  const login = async (email: string, password: string, role: 'student' | 'professor', userData: Partial<User>) => {
    try {
      // In a real app, validate with backend
      if (password.length < 6) {
        throw new Error("Invalid credentials");
      }
      
      // Mock user
      const newUser: User = {
        id: Math.random().toString(36).slice(2),
        email,
        name: userData.name || email.split('@')[0],
        role,
        ...userData
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error("Login failed. Please check your credentials.");
    }
  };

  // Mock register function
  const register = async (email: string, password: string, role: 'student' | 'professor', userData: Partial<User>) => {
    try {
      // In a real app, would send to backend
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }
      
      // Mock user creation
      const newUser: User = {
        id: Math.random().toString(36).slice(2),
        email,
        name: userData.name || '',
        role,
        ...userData
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      throw new Error("Registration failed. Please try again.");
    }
  };

  // Mock Google sign-in
  const loginWithGoogle = async () => {
    try {
      // In a real app, this would redirect to Google OAuth
      // For mock purposes, we'll create a dummy Google user
      const mockGoogleUser: User = {
        id: Math.random().toString(36).slice(2),
        email: "user" + Math.floor(Math.random() * 1000) + "@gmail.com",
        name: "Google User",
        role: 'student', // Default role, would need UI to select role after Google auth
      };
      
      localStorage.setItem('user', JSON.stringify(mockGoogleUser));
      setUser(mockGoogleUser);
    } catch (error) {
      throw new Error("Google sign in failed. Please try again.");
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
        loginWithGoogle,
        logout,
        isLoading,
        isProfessor: user?.role === 'professor' || false
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
