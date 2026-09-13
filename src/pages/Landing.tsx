import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../db/store';

export default function Landing() {
  const navigate = useNavigate();
  const currentUser = useAppStore(s => s.currentUser);
  const setCurrentUser = useAppStore(s => s.setCurrentUser);
  const switchToRole = useAppStore(s => s.switchToRole);

  useEffect(() => {
    async function init() {
      // Load existing user or pick default customer
      const stored = localStorage.getItem('vaishnavi-current-user');
      if (stored) {
        try {
          const user = JSON.parse(stored) as any;
          setCurrentUser(user);
          navigate('/');
          return;
        } catch {}
      }

      // Default: start as customer Suhaeb
      await switchToRole('customer');
      const fresh = await import('../db/database').then(m => m.db.customers.get('c1'));
      if (fresh) {
        setCurrentUser(fresh);
        localStorage.setItem('vaishnavi-current-user', JSON.stringify(fresh));
      }
      navigate('/');
    }
    init();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="text-center"
      >
        {/* Logo */}
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#173F35] flex items-center justify-center shadow-xl">
          <span className="text-white text-4xl font-bold">V</span>
        </div>
        <h1 className="text-3xl font-bold text-[#173F35] mb-2">Vaishnavi</h1>
        <p className="text-[#7A8B7E] text-sm max-w-xs mx-auto mb-2">
          Premium home services at your fingertips
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-[#A8B9A5] mt-1">
          <span>Hyderabad · Bangalore · Mumbai</span>
        </div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <div className="w-32 h-1 bg-[#E8E4DB] rounded-full mx-auto overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full h-full bg-[#173F35] rounded-full"
            />
          </div>
          <p className="text-xs text-[#A8B9A5] mt-4">Loading your account...</p>
        </motion.div>

        {/* Demo hint */}
        <p className="text-[10px] text-[#A8B9A5] mt-8 uppercase tracking-widest">
          Press Alt+1 / Alt+2 / Alt+3 to switch roles
        </p>
      </motion.div>
    </div>
  );
}
