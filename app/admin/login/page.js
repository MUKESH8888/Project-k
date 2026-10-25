'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../../components/AuthContext';
import { useCart } from '../../../components/CartContext';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useCart();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        setError('Access denied. This account does not possess administrative privileges.');
        return;
      }
      showToast('Admin authorized. Welcome, Sri Ramalingam!');
      router.push('/admin');
    } catch (err) {
      setError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-inverse-surface text-inverse-on-surface flex flex-col justify-between p-6">
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <img
            alt="Kalyanam Shopping Mall"
            className="h-10 w-auto object-contain"
            src="/images/logo.png"
          />
        </Link>

        <Link
          href="/"
          className="text-label-sm font-label-sm text-secondary-fixed hover:underline flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">store</span>
          <span>Return to Storefront</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-auto bg-surface-container-lowest text-on-surface rounded-2xl p-8 shadow-2xl border border-secondary-fixed/40">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-on-primary mb-2 shadow-md">
            <span className="material-symbols-outlined text-[30px]">shield_person</span>
          </div>
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-bold">
            కళ్యాణం అడ్మిన్ పోర్టల్
          </span>
          <h1 className="font-headline-sm text-headline-sm font-bold text-primary mt-1">
            Chief Administrator Portal
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Access restricted to verified store managers, inventory controllers, and master curators.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container text-body-sm font-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
          <div>
            <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
              Admin Official Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
              placeholder="admin@kalyanammall.com"
            />
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-on-surface font-semibold mb-1">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-surface-container-low rounded-lg text-body-sm font-body-sm focus:outline-none focus:bg-surface-container border border-surface-dim/40"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@kalyanammall.com');
                setPassword('admin123');
              }}
              className="text-gold font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">key</span>
              <span>Fill Admin Demo Credentials</span>
            </button>
          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-lg bg-primary text-on-primary font-title-md text-title-md font-bold hover:bg-primary-container shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">verified_user</span>
            <span>{loading ? 'Verifying Authorization...' : 'Authenticate & Enter Dashboard'}</span>
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-surface-container text-center">
          <p className="text-[11px] text-on-surface-variant flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-tertiary">lock</span>
            <span>Protected by 256-Bit SSL Encrypted Admin Gate</span>
          </p>
        </div>
      </div>

      <div className="text-center text-label-sm text-surface-dim py-4">
        © 2025 Kalyanam Shopping Mall Private Limited. Internal Enterprise Network.
      </div>
    </div>
  );
}
