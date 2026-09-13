import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { UserRole } from '../types';
import { useAppStore } from '../db/store';
import AccountSwitcher from '../components/AccountSwitcher';

const AuthContext = createContext<{
  showAccountSwitcher: boolean;
  setShowAccountSwitcher: (v: boolean) => void;
  transitionState: 'idle' | 'switching' | 'done';
  setTransitionState: (v: 'idle' | 'switching' | 'done') => void;
}>({
  showAccountSwitcher: false,
  setShowAccountSwitcher: () => {},
  transitionState: 'idle',
  setTransitionState: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);
  const [transitionState, setTransitionState] = useState<'idle' | 'switching' | 'done'>('idle');
  const setCurrentUser = useAppStore(s => s.setCurrentUser);

  const handleSwitch = useCallback(async (role: UserRole) => {
    setTransitionState('switching');
    setShowAccountSwitcher(false);
    await useAppStore.getState().switchToRole(role);
    setTimeout(() => setTransitionState('done'), 400);
    setTimeout(() => setTransitionState('idle'), 600);
  }, []);

  return (
    <AuthContext.Provider value={{ showAccountSwitcher, setShowAccountSwitcher, transitionState, setTransitionState }}>
      <AnimatePresence mode="wait">
        {transitionState === 'switching' ? (
          <motion.div
            key="switch-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#F5F0E7] flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#173F35] flex items-center justify-center">
                <span className="text-white text-2xl font-bold">V</span>
              </div>
              <p className="text-[#173F35] font-semibold text-lg">Switching account...</p>
            </motion.div>
          </motion.div>
        ) : (
          children
        )}
      </AnimatePresence>
      <AccountSwitcher open={showAccountSwitcher} onOpenChange={setShowAccountSwitcher} onSwitch={handleSwitch} />
    </AuthContext.Provider>
  );
}
