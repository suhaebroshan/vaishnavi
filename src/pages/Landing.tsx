import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../db/store';

const LOADER_DURATION = 2000;

export default function Landing() {
  const navigate = useNavigate();
  const setCurrentUser = useAppStore(s => s.setCurrentUser);
  const switchToRole = useAppStore(s => s.switchToRole);
  const [phase, setPhase] = useState<'brand' | 'loading' | 'transition'>('brand');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function init() {
      // Load existing user or pick default customer
      const stored = localStorage.getItem('vaishnavi-current-user');
      if (stored) {
        try {
          const user = JSON.parse(stored) as any;
          setCurrentUser(user);
          setPhase('loading');
          await new Promise(r => setTimeout(r, 400));
          navigate('/');
          return;
        } catch {}
      }

      setPhase('loading');
      await switchToRole('customer');
      const fresh = await import('../db/database').then(m => m.db.customers.get('c1'));
      if (fresh) {
        setCurrentUser(fresh);
        localStorage.setItem('vaishnavi-current-user', JSON.stringify(fresh));
      }
      await new Promise(r => setTimeout(r, 400));
      navigate('/');
    }
    init();

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        const next = p + (100 - p) * 0.12;
        return Math.min(next, 99);
      });
    }, 80);

    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(100);
        setPhase('transition');
        setTimeout(() => navigate('/'), 300);
      }
    }, LOADER_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden" style={{ background: '#FBF9F4' }}>
      {/* Decorative leaf pattern background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 5 C20 15, 10 25, 15 40 C20 50, 30 55, 30 55 C30 55, 40 50, 45 40 C50 25, 40 15, 30 5Z' fill='%23173F35'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-8 relative">
        {/* ── BRAND LOGO ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={phase === 'transition' ? { opacity: 0, y: -40 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          {/* Leaf SVG Logo */}
          <motion.div
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={phase === 'transition' ? { scale: 0.8, opacity: 0 } : { scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-5"
          >
            <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
              <defs>
                <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D6A4F" />
                  <stop offset="100%" stopColor="#173F35" />
                </linearGradient>
              </defs>
              {/* Main leaf */}
              <path
                d="M40 8C28 18 12 32 15 52C18 68 32 80 40 92C48 80 62 68 65 52C68 32 52 18 40 8Z"
                fill="url(#leafGrad)"
              />
              {/* Center vein */}
              <path
                d="M40 18V82"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Side veins */}
              <path d="M40 35C34 32 28 33 24 38" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M40 50C46 47 52 48 56 53" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M40 65C35 62 30 63 26 68" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              {/* Small leaf accent */}
              <path
                d="M40 60C32 65 26 72 28 80C30 86 38 90 40 92"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </motion.div>

          {/* Brand name */}
          <motion.p
            className="text-[28px] font-black tracking-[0.12em] uppercase mb-1.5"
            style={{ color: '#173F35', fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '0.15em' }}
          >
            Vaishnavi
          </motion.p>

          <motion.p
            className="text-sm font-medium tracking-wide mb-8"
            style={{ color: '#7A8B7E', letterSpacing: '0.06em' }}
          >
            Help for Everyday Life
          </motion.p>

          {/* Tagline */}
          <motion.p
            className="text-base font-semibold italic"
            style={{ color: '#5A6B5E' }}
          >
            Your home. Our people. A better everyday.
          </motion.p>
        </motion.div>
      </div>

      {/* ── BOTTOM LOADING BAR ─────────────────────── */}
      <div className="pb-12 px-10">
        <div className="w-full h-1 bg-[#E8E4DB] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #173F35, #1E4D3F)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'easeInOut' }}
          />
        </div>
        <motion.p
          className="text-center mt-3 text-xs font-medium tracking-wider"
          style={{ color: '#A8B9A5' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: phase !== 'brand' ? 1 : 0 }}
          transition={{ delay: 0.3 }}
        >
          Loading your experience...
        </motion.p>
      </div>
    </div>
  );
}
