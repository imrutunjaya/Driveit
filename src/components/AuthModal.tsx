import React from 'react';
import { motion } from 'framer-motion';
import { X, LogIn, LogOut, User, Shield, Cloud } from 'lucide-react';
import { useDrive } from '../contexts/DriveContext';

interface AuthModalProps {
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose }) => {
  const { user, isAuthenticated, signIn, signOut } = useDrive();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="floating-panel"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-macos-border">
          <h2 className="text-xl font-semibold text-macos-text">
            {isAuthenticated ? 'Account' : 'Sign In'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isAuthenticated ? (
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <img
                  src={user?.picture || '/default-avatar.png'}
                  alt={user?.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-macos-text">{user?.name}</h3>
                  <p className="text-sm text-macos-secondary">{user?.email}</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Cloud className="text-macos-green" size={20} />
                  <div>
                    <p className="text-sm font-medium text-macos-text">
                      Google Drive Sync
                    </p>
                    <p className="text-xs text-macos-secondary">
                      Your notes are automatically synced to Google Drive
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="text-macos-blue" size={20} />
                  <div>
                    <p className="text-sm font-medium text-macos-text">
                      Secure Access
                    </p>
                    <p className="text-xs text-macos-secondary">
                      Your data is protected with Google's security
                    </p>
                  </div>
                </div>
              </div>

              {/* Sign Out */}
              <button
                onClick={signOut}
                className="w-full macos-button macos-button-secondary flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sign In Info */}
              <div className="text-center">
                <div className="w-16 h-16 bg-macos-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-macos-blue" />
                </div>
                <h3 className="text-lg font-semibold text-macos-text mb-2">
                  Connect to Google Drive
                </h3>
                <p className="text-sm text-macos-secondary">
                  Sign in to sync your notes across all your devices and access them anywhere.
                </p>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Cloud className="text-macos-blue" size={20} />
                  <span className="text-sm text-macos-text">
                    Automatic cloud backup
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="text-macos-green" size={20} />
                  <span className="text-sm text-macos-text">
                    Secure and private
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <User className="text-macos-purple" size={20} />
                  <span className="text-sm text-macos-text">
                    Access from any device
                  </span>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                onClick={signIn}
                className="w-full macos-button macos-button-primary flex items-center justify-center gap-2"
              >
                <LogIn size={16} />
                Sign in with Google
              </button>

              <p className="text-xs text-macos-secondary text-center">
                By signing in, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AuthModal;