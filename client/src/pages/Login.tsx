import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, User as UserIcon } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isRegisterMode, setIsRegisterMode] = useState(() => searchParams.get('mode') === 'signup');

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsRegisterMode(true);
    } else if (searchParams.get('mode') === 'login') {
      setIsRegisterMode(false);
    }
  }, [searchParams]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please provide a valid email address.');
      return;
    }

    if (isRegisterMode && !name) {
      setError('Please enter your name.');
      return;
    }

    if (isRegisterMode) {
      await register(name, email, password);
    } else {
      await login(email, password);
    }

    navigate('/dashboard');
  };

  const handleDemoLogin = async () => {
    await login('member@charis.com');
    navigate('/dashboard');
  };

  return (
    <div className="w-full min-h-screen bg-[#faf3e4] text-[#141110] pt-[8rem] pb-[6rem] px-4 sm:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#141110]/10 shadow-xl">
        
        {/* Tab Switcher for Sign In / Sign Up */}
        <div className="flex p-1 bg-[#faf3e4] rounded-full border border-[#141110]/10">
          <button
            type="button"
            onClick={() => setIsRegisterMode(false)}
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
            onClick={() => setIsRegisterMode(true)}
            className={`flex-1 py-2 text-xs font-archivo uppercase tracking-wider font-bold rounded-full transition-all cursor-pointer ${
              isRegisterMode
                ? 'bg-[#ef4a23] text-white shadow-sm'
                : 'text-[#141110]/60 hover:text-[#141110]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf3e4] text-[10px] font-archivo uppercase tracking-widest text-[#ef4a23] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Member Atelier Access</span>
          </div>
          <h2
            className="font-archivo uppercase text-3xl sm:text-4xl font-bold tracking-tight text-[#141110] leading-none"
            style={{ fontStretch: '72%' }}
          >
            {isRegisterMode ? 'CREATE ACCOUNT' : 'WELCOME BACK'}
          </h2>
          <p className="font-playfair text-xs sm:text-sm text-[#141110]/70 max-w-xs mx-auto leading-relaxed italic">
            {isRegisterMode
              ? 'Save your AI consultations, tailored gift lists, and custom wax-sealed cards.'
              : 'Access your saved consultation sessions, chosen gifts, and recommendations.'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141110]/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="w-full pl-10 pr-4 py-3 bg-[#faf3e4]/30 rounded-xl border border-[#141110]/15 text-sm font-sans focus:outline-none focus:border-[#ef4a23]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141110]/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-[#faf3e4]/30 rounded-xl border border-[#141110]/15 text-sm font-sans focus:outline-none focus:border-[#ef4a23]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-archivo uppercase tracking-wider font-bold text-[#141110]/80 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141110]/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 bg-[#faf3e4]/30 rounded-xl border border-[#141110]/15 text-sm font-sans focus:outline-none focus:border-[#ef4a23]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-full bg-[#ef4a23] hover:bg-[#141110] text-white font-archivo uppercase text-xs tracking-widest font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <span>{isRegisterMode ? 'Create Atelier Account' : 'Sign In to Atelier'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center space-y-4">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-full border border-[#141110]/20 hover:bg-[#141110]/5 text-xs font-archivo uppercase tracking-wider text-[#141110] font-bold transition-colors cursor-pointer"
          >
            Quick 1-Click Demo Login
          </button>

          <p className="text-xs text-[#141110]/60">
            {isRegisterMode ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-[#ef4a23] font-bold underline cursor-pointer hover:text-[#141110]"
            >
              {isRegisterMode ? 'Sign In' : 'Create One'}
            </button>
          </p>

          <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-[#141110]/50 pt-2 border-t border-[#141110]/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>End-to-End Encrypted Consultation Memory</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
