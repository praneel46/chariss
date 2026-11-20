import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, User as UserIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(
    () => searchParams.get('mode') === 'signup' || location.pathname === '/register'
  );

  // Preserve target route from location state or default to /dashboard
  const targetFrom = (location.state as { from?: { pathname?: string } })?.from?.pathname;
  const destination = targetFrom && targetFrom !== '/login' && targetFrom !== '/register'
    ? targetFrom
    : '/dashboard';

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (isAuthenticated) {
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, navigate, destination]);

  useEffect(() => {
    if (searchParams.get('mode') === 'signup' || location.pathname === '/register') {
      setIsRegisterMode(true);
    } else if (searchParams.get('mode') === 'login' || location.pathname === '/login') {
      setIsRegisterMode(false);
    }
  }, [searchParams, location.pathname]);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegisterMode && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address format.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isRegisterMode) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
      navigate(destination, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFillDemo = () => {
    setError('');
    setEmail('demo.member@charis.com');
    setPassword('CharisMember2026!');
    if (isRegisterMode) {
      setName('Demo Member');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[7.5rem] pb-[5rem] px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-7 sm:p-9 rounded-[2rem] border border-[#141110]/10 shadow-[0_20px_60px_-15px_rgba(20,17,16,0.08)] space-y-6 transition-all">
        
        {/* Brand Accent & Header */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf3e4] border border-[#ef4a23]/15 text-[10px] font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd46e]" fill="#ffd46e" />
            <span>Member Atelier Access</span>
          </div>

          <div>
            <span
              className="font-yellowtail text-[#ef4a23] text-3xl leading-none inline-block mb-1 select-none"
              style={{ transform: 'rotate(-5deg)' }}
            >
              charis.
            </span>
            <h2
              className="font-archivo uppercase text-2xl sm:text-3xl font-bold tracking-tight text-[#141110] leading-none"
              style={{ fontStretch: '75%' }}
            >
              {isRegisterMode ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
            </h2>
          </div>

          <p className="font-playfair text-xs sm:text-sm text-[#141110]/70 max-w-xs mx-auto leading-relaxed italic">
            {isRegisterMode
              ? 'Save your AI consultations, tailored gift lists, and custom wax-sealed cards.'
              : 'Access your saved consultation sessions, chosen gifts, and recommendations.'}
          </p>
        </div>

        {/* Segmented Switcher for Sign In / Sign Up */}
        <div className="flex p-1 bg-[#faf3e4] rounded-full border border-[#141110]/10">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(false);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-archivo uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer ${
              !isRegisterMode
                ? 'bg-[#141110] text-[#faf3e4] shadow-sm'
                : 'text-[#141110]/60 hover:text-[#141110]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(true);
              setError('');
            }}
            className={`flex-1 py-2 text-xs font-archivo uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer ${
              isRegisterMode
                ? 'bg-[#ef4a23] text-white shadow-sm'
                : 'text-[#141110]/60 hover:text-[#141110]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200/80 text-rose-800 text-xs rounded-xl font-medium flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1.5">
                Full Name
              </label>
              <div className="relative group">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141110]/40 group-focus-within:text-[#ef4a23] transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-3 bg-[#faf3e4]/30 hover:bg-[#faf3e4]/50 focus:bg-white rounded-xl border border-[#141110]/15 text-sm font-sans text-[#141110] placeholder-[#141110]/35 focus:outline-none focus:border-[#ef4a23] focus:ring-2 focus:ring-[#ef4a23]/10 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1.5">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141110]/40 group-focus-within:text-[#ef4a23] transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isSubmitting}
                className="w-full pl-10 pr-4 py-3 bg-[#faf3e4]/30 hover:bg-[#faf3e4]/50 focus:bg-white rounded-xl border border-[#141110]/15 text-sm font-sans text-[#141110] placeholder-[#141110]/35 focus:outline-none focus:border-[#ef4a23] focus:ring-2 focus:ring-[#ef4a23]/10 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80">
                Password
              </label>
              <span className="text-[11px] text-[#141110]/50 font-sans">
                Min. 8 characters
              </span>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141110]/40 group-focus-within:text-[#ef4a23] transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isSubmitting}
                className="w-full pl-10 pr-11 py-3 bg-[#faf3e4]/30 hover:bg-[#faf3e4]/50 focus:bg-white rounded-xl border border-[#141110]/15 text-sm font-sans text-[#141110] placeholder-[#141110]/35 focus:outline-none focus:border-[#ef4a23] focus:ring-2 focus:ring-[#ef4a23]/10 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#141110]/40 hover:text-[#141110] focus:outline-none cursor-pointer p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Primary CTA button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo uppercase text-xs tracking-widest font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_8px_20px_-4px_rgba(239,74,35,0.3)] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>
              {isSubmitting
                ? isRegisterMode
                  ? 'Creating Account...'
                  : 'Signing In...'
                : isRegisterMode
                ? 'Create Atelier Account'
                : 'Sign In to Atelier'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Actions */}
        <div className="pt-1 text-center space-y-3.5">
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-2.5 rounded-full border border-[#141110]/15 bg-[#faf3e4]/40 hover:bg-[#faf3e4] text-[11px] font-archivo uppercase tracking-wider text-[#141110]/80 font-bold transition-all cursor-pointer"
            >
              Fill Demo Credentials
            </button>
          )}

          <p className="text-xs text-[#141110]/60 font-sans">
            {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
              }}
              className="text-[#ef4a23] font-bold underline underline-offset-2 cursor-pointer hover:text-[#141110] transition-colors"
            >
              {isRegisterMode ? 'Sign In' : 'Create One'}
            </button>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-sans text-[#141110]/50 pt-2.5 border-t border-[#141110]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>End-to-End Encrypted Consultation Memory</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
