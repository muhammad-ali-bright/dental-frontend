// src/pages/Login.tsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Redirect once signed in
  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(false)
      toast.success('Login Successfully');
      setTimeout(() => {
        const redirectPath =
          user.role === 'Student' ? '/dashboard' : '/patient-dashboard'
        navigate(redirectPath, { replace: true })
      }, 1500);
    }
  }, [isAuthenticated, user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
    } catch {
      toast.error('Invalid email or password')
    } finally {
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-4000" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex p-4 bg-gradient-to-r from-primary-600 to-blue-700 rounded-full shadow-lg hover:scale-110 transition-transform">
            <Heart size={40} className="text-white animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-700 bg-clip-text text-transparent mt-4">
            DentalCare
          </h1>
          <p className="text-gray-600 mt-1">Sign in to your account</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full"
        >
          {/* Email */}
          <div className="relative group">
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="block w-full pl-12 pr-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-12 pr-12 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Signing in...
              </div>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <p className="text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600 cursor-pointer hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
