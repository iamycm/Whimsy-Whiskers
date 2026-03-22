import { X, Package, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowAuth: () => void;
}

export function UserModal({ isOpen, onClose, onShowAuth }: UserModalProps) {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setSigningOut(false);
    }
  };

  const handleAuthClick = () => {
    onClose();
    onShowAuth();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-light">Account</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {user ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 p-4 bg-pink-50 rounded-lg">
              <div className="p-3 bg-white rounded-full">
                <UserIcon className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <p className="font-medium">Signed in as</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <a
                href="#orders"
                className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Package className="w-5 h-5 text-gray-600" />
                <span>Order History</span>
              </a>
            </div>

            <button
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <LogOut className="w-5 h-5" />
              <span>{signingOut ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-6">Sign in to view your account and orders</p>
            <button
              onClick={handleAuthClick}
              className="bg-gray-800 text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
