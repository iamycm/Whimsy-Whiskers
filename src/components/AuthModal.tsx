import { X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = 'signin' | 'signup' | 'forgot';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [view, setView] = useState<AuthView>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleClose = () => {
    onClose();
    // Reset state after close animation
    setTimeout(() => {
      setView('signin');
      setEmail('');
      setPassword('');
      setError('');
      setSuccessMsg('');
    }, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (view === 'signup') {
        await signUp(email, password);
        // Supabase by default requires email confirmation.
        // If you have it disabled in your project, the user is signed in immediately.
        setSuccessMsg('Account created! You can now sign in.');
        setView('signin');
        setPassword('');
      } else {
        await signIn(email, password);
        handleClose();
      }
    } catch (err: any) {
      // Map common Supabase error messages to friendlier ones
      const msg: string = err.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError('Network error — please check your connection and try again.');
      } else if (msg.includes('Invalid login credentials')) {
        setError('Incorrect email or password.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Please confirm your email address before signing in.');
      } else if (msg.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in.');
      } else {
        setError(msg || 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      });
      if (error) throw error;
      setSuccessMsg('Password reset email sent! Please check your inbox.');
    } catch (err: any) {
      const msg: string = err.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
        setError('Network error — please check your connection and try again.');
      } else {
        setError(msg || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const titles: Record<AuthView, string> = {
    signin: 'Sign In',
    signup: 'Create Account',
    forgot: 'Reset Password',
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light">{titles[view]}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Forgot Password View */}
        {view === 'forgot' ? (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Enter your email and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label htmlFor="reset-email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setView('signin'); setError(''); setSuccessMsg(''); }}
                className="text-sm text-gray-600 hover:text-rose-400 transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          </>
        ) : (
          /* Sign In / Sign Up View */
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                />
              </div>

              {/* Forgot password link — only on sign in */}
              {view === 'signin' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => { setView('forgot'); setError(''); setSuccessMsg(''); }}
                    className="text-sm text-gray-500 hover:text-rose-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : view === 'signup' ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => { setView(view === 'signup' ? 'signin' : 'signup'); setError(''); setSuccessMsg(''); }}
                className="text-sm text-gray-600 hover:text-rose-400 transition-colors"
              >
                {view === 'signup'
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
