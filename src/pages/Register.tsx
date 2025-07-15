// src/pages/Register.tsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Heart, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast, { Toaster } from 'react-hot-toast'

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [passwordConfirm, setPasswordConfirm] = useState<string>('')
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [showPasswordConfirm, setShowPasswordConfirm] = useState<boolean>(false)
    const [role, setRole] = useState<'Student' | 'Professor'>('Student')
    const [loading, setLoading] = useState<boolean>(false)

    const { register } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== passwordConfirm) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)
        const { success, error } = await register(
            firstName.trim(),
            lastName.trim(),
            email.trim(),
            password,
            role
        )
        setLoading(false)

        if (success) {
            toast.success('Successfully registered!')
            navigate('/login')
        } else {
            toast.error(error || 'Registration failed')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
            <Toaster position="top-center" />
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-4000" />
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10 flex flex-col items-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-700 bg-clip-text text-transparent mb-2">
                    Sign up to DentalCare
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full"
                >
                    {/* First Name */}
                    <div className="relative group">
                        <label htmlFor="firstName" className="sr-only">First Name</label>
                        <input
                            id="firstName"
                            type="text"
                            required
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            placeholder="First name"
                            className="block w-full px-4 py-4 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="relative group">
                        <label htmlFor="lastName" className="sr-only">Last Name</label>
                        <input
                            id="lastName"
                            type="text"
                            required
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            placeholder="Last name"
                            className="block w-full px-4 py-4 border border-gray-300 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative group">
                        <label htmlFor="email" className="sr-only">Email</label>
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
                            className="block w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        />
                    </div>

                    {/* Password */}
                    <div className="relative group">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(v => !v)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative group">
                        <label htmlFor="passwordConfirm" className="sr-only">Confirm Password</label>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Lock className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                        </div>
                        <input
                            id="passwordConfirm"
                            type={showPasswordConfirm ? 'text' : 'password'}
                            required
                            value={passwordConfirm}
                            onChange={e => setPasswordConfirm(e.target.value)}
                            placeholder="Confirm your password"
                            className="block w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl bg-gray-50 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirm(v => !v)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500"
                        >
                            {showPasswordConfirm ? <EyeOff /> : <Eye />}
                        </button>
                    </div>

                    {/* Role */}
                    <div className="relative group">
                        <label htmlFor="role" className="sr-only">Role</label>
                        <select
                            id="role"
                            required
                            value={role}
                            onChange={e => setRole(e.target.value as 'Student' | 'Professor')}
                            className="block w-full px-4 py-4 border border-gray-300 rounded-xl bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                        >
                            <option value="Student">Student</option>
                            <option value="Professor">Professor</option>
                        </select>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                Signing up...
                            </div>
                        ) : (
                            <span className="flex items-center">
                                <Heart className="mr-2 group-hover:animate-pulse" />
                                Sign up for DentalCare
                            </span>
                        )}
                    </button>
                </form>

                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
