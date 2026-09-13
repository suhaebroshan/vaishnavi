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
  const [switchingUser, setSwitchingUser] = useState<any>(null);

  const handleSwitch = useCallback(async (role: UserRole, userId?: string) => {
    setTransitionState('switching');
    setShowAccountSwitcher(false);

    let target: any;
    if (role === 'customer') target = await import('../db/database').then(m => m.db.customers.get(userId || 'c1'));
    else if (role === 'worker') target = await import('../db/database').then(m => m.db.workers.get(userId || 'w1'));
    else if (role === 'admin') target = await import('../db/database').then(m => m.db.admins.get(userId || 'admin1'));

    if (target) {
      setSwitchingUser(target);
      const unread = await import('../db/database').then(m =>
        m.db.notifications.where('userId').equals(target.id).filter((n: any) => !n.reading).count()
      );
      setCurrentUser(target);
      localStorage.setItem('vaishnavi-current-user', JSON.stringify(target));
      setTimeout(() => setTransitionState('done'), 200);
      setTimeout(() => setTransitionState('idle'), 450);
    }
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: '#FBF9F4' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ type: 'spring', damping: 22, stiffness: 300 }}
              className="text-center"
            >
              {/* Leaf Logo */}
              <div className="w-16 h-16 mx-auto mb-4">
                <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <defs>
                    <linearGradient id="switchLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#2D6A4F" />
                      <stop offset="100%" stopColor="#173F35" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M40 8C28 18 12 32 15 52C18 68 32 80 40 92C48 80 62 68 65 52C68 32 52 18 40 8Z"
                    fill="url(#switchLeafGrad)"
                  />
                  <path d="M40 18V82" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M40 35C34 32 28 33 24 38" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                  <path d="M40 50C46 47 52 48 56 53" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              </div>
              <p className="font-bold text-[#173F35] text-base">
                {switchingUser?.name || 'Loading...'}
              </p>
              <p className="text-xs text-[#7A8B7E] mt-1 capitalize">{switchingUser?.role || 'loading...'}</p>
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
