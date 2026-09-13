import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../db/store';
import { useAuth } from '../context/AuthContext';
import {
  IconHome, IconSearch, IconCalendar, IconChat, IconUser,
  IconBriefcase, IconWallet, IconLayout, IconMap, IconClipboard, IconUsers,
} from './icons';

const customerNav = [
  { path: '/', icon: IconHome, label: 'Home' },
  { path: '/search', icon: IconSearch, label: 'Services' },
  { path: '/bookings', icon: IconCalendar, label: 'Bookings' },
  { path: '/chat', icon: IconChat, label: 'Chat' },
  { path: '/profile', icon: IconUser, label: 'Profile' },
];

const workerNav = [
  { path: '/worker/home', icon: IconHome, label: 'Home' },
  { path: '/worker/requests', icon: IconBriefcase, label: 'Requests' },
  { path: '/worker/jobs', icon: IconCalendar, label: 'Jobs' },
  { path: '/worker/earnings', icon: IconWallet, label: 'Earnings' },
  { path: '/worker/profile', icon: IconUser, label: 'Profile' },
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
      background: 'rgba(250,248,243,0.92)',
      backdropFilter: 'blur(20px) saturate(180%)',
      borderTop: '1px solid rgba(23,63,53,0.07)',
      boxShadow: '0 -4px 20px rgba(23,63,53,0.08)',
    }}>
      <div className="flex items-center justify-around max-w-[430px] mx-auto px-2 py-2 pb-5">
        {nav.map(item => {
          const isActive = location.pathname.startsWith(item.path) || (item.path === '/' && location.pathname === '/');
          const IconComp = item.icon;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.82 }}
              onClick={() => {
                if (item.path === '/profile' || item.label === 'Profile') {
                  setShowAccountSwitcher(true);
                } else {
                  navigate(item.path);
                }
              }}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl relative"
            >
              <div className="relative">
                <IconComp
                  size={22}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={`transition-all duration-200 ${isActive ? 'text-[#173F35]' : 'text-[var(--va-text-faint)]'}`}
                />
                {item.label === 'Chat' && unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1.5 w-4 h-4 bg-[var(--va-terracotta)] text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                    style={{ boxShadow: '0 2px 6px rgba(200,111,82,0.4)' }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </motion.span>
                )}
              </div>
              <span className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? 'text-[#173F35]' : 'text-[var(--va-text-faint)]'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-[#173F35]"
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
