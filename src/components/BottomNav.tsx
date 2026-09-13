import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../db/store';
import { useAuth } from '../context/AuthContext';
import {
  IconHome, IconClipboard, IconCalendar, IconUser, IconWallet,
} from './icons';

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
    <nav className="fixed bottom-0 left-0 right-0 z-40" style={{
      background: 'rgba(251,249,244,0.97)',
      backdropFilter: 'blur(24px) saturate(180%)',
      borderTop: '1px solid rgba(23,63,53,0.07)',
      boxShadow: '0 -4px 24px rgba(23,63,53,0.06)',
    }}>
      <div className="flex items-center justify-around max-w-[430px] mx-auto px-2 py-2 pb-5">
        {nav.map(item => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
          const IconComp = item.icon;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                if (item.path === '/profile') {
                  setShowAccountSwitcher(true);
                } else {
                  navigate(item.path);
                }
              }}
              className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-2xl relative"
              data-testid={`nav-${item.label.toLowerCase()}`}
            >
              <IconComp
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={`transition-all duration-200 ${isActive ? 'text-[#173F35]' : 'text-[var(--va-text-faint)]'}`}
              />
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-[#173F35]' : 'text-[var(--va-text-faint)]'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="navDot"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#173F35]"
                  transition={{ type: 'spring', damping: 18, stiffness: 300 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
