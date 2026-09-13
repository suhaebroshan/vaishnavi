import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, Calendar, MessageSquare, UserCircle } from 'lucide-react';
import { useAppStore } from '../db/store';
import { useAuth } from '../context/AuthContext';

const customerNav = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/services', icon: Search, label: 'Services' },
  { path: '/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/chat', icon: MessageSquare, label: 'Chat' },
  { path: '/profile', icon: UserCircle, label: 'Profile' },
];

const workerNav = [
  { path: '/worker/home', icon: Home, label: 'Home' },
  { path: '/worker/jobs', icon: Calendar, label: 'Jobs' },
  { path: '/worker/earnings', icon: MessageSquare, label: 'Earnings' },
  { path: '/worker/profile', icon: UserCircle, label: 'Profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = useAppStore(s => s.currentRole);
  const { setShowAccountSwitcher } = useAuth();
  const unreadCount = useAppStore(s => s.unreadNotifications);

  const nav = role === 'customer' ? customerNav : role === 'worker' ? workerNav : [];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[rgba(23,63,53,0.08)] px-2 py-2 pb-4">
      <div className="flex items-center justify-around max-w-[500px] mx-auto">
        {nav.map(item => {
          const active = location.pathname.startsWith(item.path) || (item.path === '/' && location.pathname === '/');
          const Icon = item.icon;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.85 }}
              onClick={() => item.path === '/profile' ? setShowAccountSwitcher(true) : navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${active ? 'text-[#173F35]' : 'text-[#A8B9A5]'}`}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={active ? 2.5 : 2} />
                {item.label === 'Chat' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#C86F52] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-[#173F35]" />}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
