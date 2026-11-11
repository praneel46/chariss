import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Lock, Mail, User as UserIcon } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegisterMode, setIsRegisterMode] = useState(false);

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
    <div className="bg-[#FAF9F6] py-16 px-4 sm:px-6 lg:px-8 min-h-[78vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#292820]/10 shadow-lg">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDE5DA]/60 text-[10px] font-mono uppercase tracking-widest text-[#B69A78] font-bold mb-3">
            <Sparkles className="w-3 h-3 text-[#D4A359]" />
            <span>Member Sanctuary</span>
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#292820]">
            {isRegisterMode ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-xs text-[#292820]/70 max-w-xs mx-auto leading-relaxed">
            {isRegisterMode
              ? 'Join CHARIS to save your AI consultations, tailored gift lists, and custom letterpress cards.'
              : 'Access your saved consultation sessions, gift bookmarks, and tailored recommendations.'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-lg bg-[#FAF9F6] p-1 border border-[#292820]/10">
          <button
            type="button"
            onClick={() => { setIsRegisterMode(false); setError(''); }}
            className={`w-1/2 py-2 text-xs font-mono uppercase tracking-wider rounded-md font-bold transition-all cursor-pointer ${
              !isRegisterMode ? 'bg-[#151419] text-[#FAF9F6] shadow-xs' : 'text-[#292820]/70 hover:text-[#292820]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsRegisterMode(true); setError(''); }}
            className={`w-1/2 py-2 text-xs font-mono uppercase tracking-wider rounded-md font-bold transition-all cursor-pointer ${
              isRegisterMode ? 'bg-[#151419] text-[#FAF9F6] shadow-xs' : 'text-[#292820]/70 hover:text-[#292820]'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegisterMode && (
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[#292820]/80 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Eleanor Vance"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF9F6] border border-[#292820]/15 text-xs text-[#292820] focus:outline-none focus:border-[#B69A78]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#292820]/80 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF9F6] border border-[#292820]/15 text-xs text-[#292820] focus:outline-none focus:border-[#B69A78]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-[#292820]/80 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#FAF9F6] border border-[#292820]/15 text-xs text-[#292820] focus:outline-none focus:border-[#B69A78]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-md bg-[#151419] text-[#FAF9F6] text-xs font-bold uppercase tracking-wider shadow-brutal hover:bg-[#292820] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>{isRegisterMode ? 'Create Free Account' : 'Sign In to Dashboard'}</span>
            <ArrowRight className="w-4 h-4 text-[#D4A359]" />
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#292820]/10" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white text-stone-400 font-mono text-[10px] uppercase">
              Or 1-Click Evaluation
            </span>
          </div>
        </div>

        {/* Demo Fast Login */}
        <button
          type="button"
          onClick={handleDemoLogin}
          className="w-full py-2.5 rounded-md bg-[#EDE5DA]/60 hover:bg-[#EDE5DA] text-xs font-mono uppercase tracking-wider text-[#292820] font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B69A78]" />
          <span>Demo Instant Login as Member</span>
        </button>

        <div className="pt-2 text-center flex items-center justify-center gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Zero third-party trackers. 100% private session.</span>
        </div>

      </div>
    </div>
  );
};
