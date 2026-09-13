import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../db/store';
import { useAuth } from '../context/AuthContext';
import { IconSwap, IconHome, IconClipboard, IconCalendar, IconUser, IconWallet } from './icons';

const container = { animate: { transition: { staggerChildren: 0.06 } } };
const navItemAnim = {
  initial: { opacity: 0, y: 12, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 18, stiffness: 220 } },
};
const activeIndicator = {
  initial: { scale: 0 },
  animate: { scale: 1 },
  exit: { scale: 0 },
};

const customerNav = [
  { path: '/', icon: IconHome, label: 'Home' },
  { path: '/history', icon: IconClipboard, label: 'History' },
  { path: '/bookings', icon: IconCalendar, label: 'Bookings' },
  { path: '/profile', icon: IconUser, label: 'Profile' },
];

const workerNav = [
  { path: '/worker/home', icon: IconHome, label: 'Home' },
  { path: '/worker/requests', icon: IconClipboard, label: 'Requests' },
  { path: '/worker/jobs', icon: IconCalendar, label: 'Jobs' },
  { path: '/worker/earnings', icon: IconWallet, label: 'Earnings' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAppStore(s => s.currentRole);
  const { setShowAccountSwitcher } = useAuth();
  const unreadCount = useAppStore(s => s.unreadNotifications);

  const nav = role === 'customer' ? customerNav : role === 'worker' ? workerNav : [];

  return (
    <motion.nav
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.1 }}
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: 'rgba(251,249,244,0.97)',
        backdropFilter: 'blur(24px) saturate(180%)',
        borderTop: '1px solid rgba(23,63,53,0.07)',
        boxShadow: '0 -4px 24px rgba(23,63,53,0.06)',
      }}
    >
      <div className="flex items-center justify-around max-w-[430px] mx-auto px-2 py-2 pb-5">

        {/* ── Switch Profile ──────────────────────── */}
        <motion.div variants={container} initial="initial" animate="animate">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setShowAccountSwitcher(true)}
            className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl relative group"
            data-testid="nav-switch"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ type: 'spring', damping: 14, stiffness: 200 }}
              className="relative"
            >
              <IconSwap size={20} strokeWidth={2} className="text-[var(--va-text-faint)] group-hover:text-[#173F35] transition-colors duration-200" />
              <motion.span
                className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-[#C86F52]"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 1.5, duration: 0.4 }}
              />
            </motion.div>
            <span className="text-[9px] font-semibold text-[var(--va-text-faint)] group-hover:text-[#173F35] transition-colors duration-200">Switch</span>
          </motion.button>
        </motion.div>

        {/* ── Nav Items ───────────────────────────── */}
        {nav.map((navItemCfg) => {
          const isActive = navItemCfg.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(navItemCfg.path);
          const IconComp = navItemCfg.icon;
          return (
            <motion.div key={navItemCfg.path} variants={container} initial="initial" animate="animate">
              <motion.div variants={navItemAnim}>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => navigate(navItemCfg.path)}
                  className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-2xl relative"
                  data-testid={`nav-${navItemCfg.label.toLowerCase()}`}
                >
                  <motion.div
                    animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                    transition={{ duration: 0.3, delay: 0.05 }}
                  >
                    <IconComp
                      size={22}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      className={`transition-all duration-200 ${isActive ? 'text-[#173F35]' : 'text-[var(--va-text-faint)]'}`}
                    />
                  </motion.div>
                  <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-[#173F35]' : 'text-[var(--va-text-faint)]'}`}>
                    {navItemCfg.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navDot"
                      className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#173F35]"
                      transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                    />
                  )}
                  {navItemCfg.label === 'Requests' && unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-[#C86F52] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                      style={{ minWidth: 18, minHeight: 18, padding: '0 4px' }}
                    >
                      {unreadCount}
                    </motion.span>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </motion.nav>
  );
}
