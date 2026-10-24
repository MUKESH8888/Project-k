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
      showToast(`Welcome, ${loggedInUser.name}!`);
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



  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest text-on-surface rounded-2xl max-w-md w-full p-6 shadow-2xl relative flex flex-col gap-4 border border-secondary-fixed/40 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            setError('');
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary mb-1">
            <span className="material-symbols-outlined text-[26px]">lock_open</span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
            కళ్యాణం వివాహ ఖాతా • SACRED PORTAL
          </span>
          <h2 className="font-headline-sm text-headline-sm font-bold text-primary mt-0.5">
            {authModalMode === 'login' ? 'Sign In to Your Account' : 'Create Matrimonial Account'}
          </h2>
        </div>

        {/* Mode Tabs */}
        <div className="flex bg-surface-container rounded-lg p-1 text-label-md font-label-md">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setError('');
            }}
            className={`flex-1 py-2 rounded-md transition-all cursor-pointer text-center ${
              authModalMode === 'login'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setError('');
            }}
            className={`flex-1 py-2 rounded-md transition-all cursor-pointer text-center ${
              authModalMode === 'register'
                ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-error-container text-on-error-container text-body-sm font-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}



        {/* LOGIN FORM */}
        {authModalMode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sunitha@kalyanammall.com"
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-label-sm text-label-sm text-on-surface font-semibold">
                  Password
                </label>
                <span className="text-[11px] text-secondary hover:underline cursor-pointer">
                  Forgot?
                </span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 rounded-lg bg-primary-container text-on-primary font-title-md text-title-md font-semibold hover:bg-surface-tint shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">login</span>
              <span>{submitting ? 'Authenticating...' : 'Sign In to Kalyanam'}</span>
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sravanthi Reddy"
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sravanthi@example.com"
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                WhatsApp Mobile Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98491 XXXXX"
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
              />
            </div>

            <div>
              <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
                Create Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 rounded-lg bg-primary-container text-on-primary font-title-md text-title-md font-semibold hover:bg-surface-tint shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>{submitting ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>
        )}

        <p className="text-center text-label-sm text-on-surface-variant">
          {authModalMode === 'login' ? (
            <>
              New to Kalyanam?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Create Account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-primary font-bold hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
