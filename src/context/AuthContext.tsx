import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthContextType } from '../types';
import { getUsers, getCurrentUser, setCurrentUser, saveUsers } from '../utils/storage';
import { registerUser, loginUserFromAPI } from '../utils/api';

import { signOut} from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebase'; // Adjust the import path as necessary

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login logic with API
  const login = async (email: string, password: string): Promise<{ error: boolean; msg: string }> => {
    try {
      const response = await loginUserFromAPI(email, password); // Assuming loginUserFromAPI is an API function
      if (response.status === 200) {
        const user = response.data;
        setUser(user);
        setIsAuthenticated(true);
        setCurrentUser(user);
        return Promise.resolve({ error: false, msg: 'Login successful!' }); // Correct usage of Promise
      } else {
        return Promise.resolve({ error: true, msg: 'Login failed.' }); // Correct usage of Promise
      }
    } catch (err: any) {
      console.error('Error during login:', err);
      const msg = err.response?.data?.error || 'Login failed.';
      return Promise.resolve({ error: true, msg: msg }); // Correct usage of Promise
    }
  };

  // Register logic with API
  const register = async (email: string, password: string, role: string): Promise<{ error: boolean; msg: string }> => {
    try {
      const response = await registerUser(email, password, role);
      if (response.status === 200) {
        return { error: false, msg: 'Registration successful!' };
      } else {
        return { error: true, msg: 'Registration failed.' };
      }
    } catch (err: any) {
      console.error('Error during registration:', err);
      const msg = err.response?.data?.error || 'Registration failed.';
      return { error: true, msg: msg };
    }
  };

  // Logout logic
  const logout = async () => {
    await signOut(firebaseAuth); // Sign out the user using Firebase
    setUser(null);
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
