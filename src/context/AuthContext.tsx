// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onIdTokenChanged,
  signOut
} from 'firebase/auth'
import { firebaseAuth } from '../firebase/firebase'
import { FirebaseError } from 'firebase/app'
import { API, registerAPI, fetchMeAPI } from '../utils/api'
import { AuthContextType, User } from '../types'

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading]     = useState(true)       // ← new

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(firebaseAuth, async fbUser => {
      if (fbUser) {
        const token = await fbUser.getIdToken()
       
        localStorage.setItem('token', token)
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`

        try {
         
          const resp = await fetchMeAPI()
         
          console.log('Fetched profile:', resp)

          setUser({ ...resp.data, email: fbUser.email! })
          // setUser({
          //   id: fbUser.uid,
          //   email: fbUser.email || '',
          //   role: 'Student', // Default role, adjust as needed
          //   firstName: '',
          //   lastName: ''  
          // })
          setIsAuthenticated(true)
        } catch (err) {
          console.error('Failed to fetch profile:', err)
          signOut(firebaseAuth)
        }
      } else {
        delete API.defaults.headers.common['Authorization']
        localStorage.removeItem('token')
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    return unsubscribe
  }, [])

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      debugger
      const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password)
  
      const token = await cred.user.getIdToken()
      localStorage.setItem('token', token)
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`
  
      try {
        // Now tell your backend about firstName/lastName/role
        await registerAPI({ firstName, lastName, role })
        return { success: true }
      } catch (apiError) {
        // If API fails, delete Firebase account
        await cred.user.delete()
        console.error('Backend registration failed, Firebase account deleted:', apiError)
        return { success: false, error: 'Failed to complete registration. Please try again.' }
      }
  
    } catch (err: any) {
      console.error('Registration failed:', err)
      let message = 'Registration failed. Please try again.'
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            message = 'That email is already registered. Please log in instead.'
            break
          case 'auth/weak-password':
            message = 'Password is too weak. Try at least 6 characters.'
            break
        }
      }
      return { success: false, error: message }
    }
  }
  

  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
  }

  const logout = (): void => {
    signOut(firebaseAuth)
  }

  const value: AuthContextType = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
