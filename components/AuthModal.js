'use client';

import { useState } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, login, register } =
    useAuth();
  const { showToast } = useCart();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      showToast(`Welcome back, ${loggedInUser.name}!`);
      setEmail('');
      setPassword('');
      if (loggedInUser.role === 'admin') {
        window.location.href = '/admin';
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const newUser = await register({ name, email, phone, password });
      showToast(`Auspicious welcome, ${newUser.name}! Account created.`);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCustomer = () => {
    setEmail('sunitha@kalyanammall.com');
    setPassword('sunitha123');
    setError('');
  };

  const fillDemoAdmin = () => {
    setEmail('admin@kalyanammall.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative border border-[#DFC587]/60 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-[#7A1426] to-[#550B18] text-white p-6 relative">
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setError('');
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-gold font-bold text-xs uppercase tracking-widest">
              కళ్యాణం ప్రివిలేజ్ • VIP CLUB
            </span>
          </div>

          <h2 className="font-heading text-2xl font-bold">
            {authModalMode === 'login' ? 'Sign In to Your Account' : 'Create Sacred Account'}
          </h2>
          <p className="text-xs text-white/80 mt-1 font-light">
            Access order tracking, wedding wishlists, and priority bridal drops.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex bg-black/25 rounded-full p-1 mt-4 border border-white/10">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                authModalMode === 'login'
                  ? 'bg-gold text-charcoal shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthModalMode('register');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                authModalMode === 'register'
                  ? 'bg-gold text-charcoal shadow'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 md:p-8 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-red-600">error</span>
              <span>{error}</span>
            </div>
          )}

          {authModalMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3.5 text-xs uppercase tracking-widest font-bold shadow-lg mt-2"
              >
                {submitting ? 'Verifying Credentials...' : 'Sign In'}
              </button>

              {/* Demo Logins for Quick Review */}
              <div className="pt-4 border-t border-[#EAE5DC] text-center">
                <span className="text-[11px] text-[#777] block mb-2 font-medium">
                  Quick Demo Access:
                </span>
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={fillDemoCustomer}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FAF7F2] text-burgundy border border-[#EAE5DC] hover:border-burgundy transition-colors"
                  >
                    Customer Demo
                  </button>
                  <button
                    type="button"
                    onClick={fillDemoAdmin}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FAF7F2] text-gold-dark border border-[#EAE5DC] hover:border-gold transition-colors"
                  >
                    Admin Demo
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Smt. Sunitha Rao"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98491 23456"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1.5">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-secondary w-full py-3.5 text-xs uppercase tracking-widest font-bold shadow-lg mt-2"
              >
                {submitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
