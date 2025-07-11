import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Import Link
import { Toaster, toast } from 'react-hot-toast';


const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState(''); // New state for password confirmation
    const [role, setRole] = useState<'Student' | 'Professor'>('Student'); // Explicitly type role as 'Student' | 'Professor'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
    
        // Check if passwords match
        if (password !== passwordConfirm) {
            toast.error('Passwords do not match'); // Show error using toast
            return;
        }
    
        setLoading(true);
    
        try {
            let result: { error?: boolean; msg?: string } = await register(email, password, role); // Define the type of result
            if (result.error) {  // Check if there's an error in the result
                toast.error(result?.msg || 'Registration failed'); // Show error using toast
            } else {
                toast.success('Successfully registered!'); // Show success message
                alert('Successfully registered!');
                navigate('/login'); // Navigate to login page after successful registration
            }
        } catch (err) {
            toast.error('An error occurred during registration'); // Show error using toast
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
            <Toaster position="top-center" />
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-4000"></div>
            </div>
    
            <div className="max-w-md w-full space-y-8 relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-700 bg-clip-text text-transparent mb-2">
                        Sign up to DentalCare
                    </h1>
                </div>
    
                {/* Registration form */}
                <form className="space-y-6 bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center animate-shake">
                            {error}
                        </div>
                    )}
    
                    <div className="space-y-6">
                        {/* Email input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none relative block w-full pl-12 pr-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:z-10 transition-all duration-200 bg-gray-50 focus:bg-white shadow-inner"
                                    placeholder="Enter your email address"
                                />
                            </div>
                        </div>
    
                        {/* Password input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none relative block w-full pl-12 pr-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:z-10 transition-all duration-200 bg-gray-50 focus:bg-white shadow-inner"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>
    
                        {/* Confirm Password input */}
                        <div>
                            <label htmlFor="passwordConfirm" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                                </div>
                                <input
                                    id="passwordConfirm"
                                    name="passwordConfirm"
                                    type="password"
                                    required
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    className="appearance-none relative block w-full pl-12 pr-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:z-10 transition-all duration-200 bg-gray-50 focus:bg-white shadow-inner"
                                    placeholder="Confirm your password"
                                />
                            </div>
                        </div>
    
                        {/* Role selection */}
                        <div>
                            <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                                Select your role
                            </label>
                            <select
                                id="role"
                                name="role"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value as 'Student' | 'Professor')} // Cast value to 'Student' | 'Professor'
                                className="block w-full pl-4 pr-4 py-4 border border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:z-10 transition-all duration-200 bg-gray-50 focus:bg-white shadow-inner"
                            >
                                <option value="Student">Student</option>
                                <option value="Professor">Professor</option>
                            </select>
                        </div>
                    </div>
    
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Signing up...
                                </div>
                            ) : (
                                <span className="flex items-center">
                                    <Heart size={20} className="mr-2 group-hover:animate-pulse" />
                                    Sign up for DentalCare
                                </span>
                            )}
                        </button>
                    </div>
                </form>
    
                {/* Link to Login */}
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
