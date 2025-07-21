// src/pages/Login.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Mail } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

import TextInput from '../components/form/TextInput';
import PasswordInput from '../components/form/PasswordInput';
import LoadingButton from '../components/ui/LoadingButton';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const hasShownSuccessToast = useRef(false);

  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      toast.error('Invalid email or password');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      hasShownSuccessToast.current = true;
      const redirectPath = '/dashboard';
      setTimeout(() => navigate(redirectPath, { replace: true }), 1000);
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Blurred background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full blur-xl opacity-70 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full blur-xl opacity-70 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary-50 rounded-full blur-2xl opacity-50 animate-pulse animation-delay-4000" />
      </div>

      {/* Login card */}
      <div className="max-w-md w-full space-y-8 relative z-10 flex flex-col items-center">
        {/* Logo and heading */}
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
          onSubmit={handleLoginSubmit}
          className="space-y-6 bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 w-full"
        >
          <TextInput
            id="email"
            label="Email"
            icon={<Mail className="text-gray-400" />}
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <PasswordInput
            id="password"
            label="Password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <LoadingButton loading={loading} text="Sign in" />
        </form>

        <p className="text-sm text-gray-600">
          Don’t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
