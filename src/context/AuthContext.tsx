import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onIdTokenChanged,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { firebaseAuth } from '../firebase/firebase';
import { API } from '../utils/api/axios';
import { registerAPI, fetchMeAPI } from '../utils/api/auth';
import { AuthContextType, User } from '../types';

type Role = 'Student' | 'Professor';

export const AuthContext = createContext<AuthContextType | null>(null);

// Helper: Save token to localStorage + Axios header
const saveAuthToken = async (fbUser: FirebaseUser) => {
  const token = await fbUser.getIdToken();
  localStorage.setItem('token', token);
  API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Helper: Clear token and reset auth state
const clearAuthState = () => {
  delete API.defaults.headers.common['Authorization'];
  localStorage.removeItem('token');
};

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen for login/logout events from Firebase
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async fbUser => {
      if (fbUser) {
        try {
          await saveAuthToken(fbUser);
          const resp = await fetchMeAPI();

          setUser({ ...resp.data, email: fbUser.email! });
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          await signOut(firebaseAuth);
          clearAuthState();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        clearAuthState();
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register new user (Firebase + backend)
  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: Role
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await saveAuthToken(cred.user);

      // Optional: await cred.user.sendEmailVerification();

      try {
        await registerAPI({ firstName, lastName, role });
        return { success: true };
      } catch (apiError) {
        // Rollback Firebase user if backend registration fails
        await cred.user.delete();
        clearAuthState();
        console.error('Backend registration failed:', apiError);
        return {
          success: false,
          error: 'Failed to complete registration. Please try again.',
        };
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      let message = 'Registration failed. Please try again.';

      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            message = 'That email is already registered. Please log in instead.';
            break;
          case 'auth/weak-password':
            message = 'Password is too weak. Try at least 6 characters.';
            break;
        }
      }

      return { success: false, error: message };
    }
  };

  // Login existing user
  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(firebaseAuth, email, password);

    // Optional: block if email not verified
    // if (!firebaseAuth.currentUser?.emailVerified) {
    //   await signOut(firebaseAuth);
    //   throw new Error('Please verify your email before logging in.');
    // }
  };

  // Logout user
  const logout = async () => {
    await signOut(firebaseAuth);
    clearAuthState();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for easier us

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
