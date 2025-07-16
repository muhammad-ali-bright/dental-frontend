// src/pages/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Heart, Mail } from 'lucide-react';

import TextInput from '../components/form/TextInput';
import PasswordInput from '../components/form/PasswordInput';
import LoadingButton from '../components/ui/LoadingButton';
import { useAuth } from '../context/AuthContext';

const validatePassword = (pw: string): boolean => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;
    return re.test(pw);
};

const Register: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'Student' | 'Professor'>('Student');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePassword(password)) {
            toast.error('Password must be 8+ chars, include upper/lowercase, number & symbol.');
            return;
        }

        if (password !== passwordConfirm) {
            toast.error('Passwords do not match.');
            return;
        }

        setLoading(true);
        const { success, error } = await register(
            firstName.trim(),
            lastName.trim(),
            email.trim(),
            password,
            role
        );
        setLoading(false);

        if (success) {
            toast.success('Registration successful!');
            navigate('/login');
        } else {
            toast.error(error || 'Registration failed.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
            <Toaster position="top-center" />

            {/* Background visuals */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-xl opacity-70 animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full blur-xl opacity-70 animate-pulse animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-50 rounded-full blur-2xl opacity-50 animate-pulse animation-delay-4000" />
            </div>

            <div className="max-w-md w-full space-y-8 relative z-10 flex flex-col items-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-700 bg-clip-text text-transparent mb-2">
                    Sign up to DentalCare
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full"
                >
                    <TextInput
                        id="firstName"
                        label="First Name"
                        placeholder="First name"
                        required
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                    />

                    <TextInput
                        id="lastName"
                        label="Last Name"
                        placeholder="Last name"
                        required
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                    />

                    <TextInput
                        id="email"
                        label="Email"
                        icon={<Mail className="text-gray-400" />}
                        placeholder="you@example.com"
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />

                    <PasswordInput
                        id="password"
                        label="Password"
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />

                    <PasswordInput
                        id="passwordConfirm"
                        label="Confirm Password"
                        required
                        placeholder="Confirm your password"
                        value={passwordConfirm}
                        onChange={e => setPasswordConfirm(e.target.value)}
                    />

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

                    <LoadingButton
                        loading={loading}
                        text="Sign up for DentalCare"
                        icon={<Heart className="group-hover:animate-pulse" />}
                    />
                </form>

                <p className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
