import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  IconLayout, IconClipboard, IconUsers, IconWallet, IconMoreHorizontal,
} from './icons';

const adminNav = [
  { path: '/admin/dashboard', icon: IconLayout, label: 'Dashboard' },
  { path: '/admin/bookings', icon: IconClipboard, label: 'Bookings' },
  { path: '/admin/workers', icon: IconUsers, label: 'Workers' },
  { path: '/admin/revenue', icon: IconWallet, label: 'Revenue' },
  { path: '/admin/more', icon: IconMoreHorizontal, label: 'More' },
];

export default function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40" style={{
      background: 'rgba(250,248,243,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(23,63,53,0.08)',
      boxShadow: '0 -4px 20px rgba(23,63,53,0.08)',
    }}>
      <div className="flex items-center justify-around max-w-[430px] mx-auto px-2 py-2 pb-5">
        {adminNav.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          const IconComp = item.icon;
          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.85 }}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl"
            >
              <IconComp
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={`transition-all duration-200 ${isActive ? 'text-[#173F35]' : 'text-[var(--va-text-faint)]'}`}
              />
              <span className={`text-[10px] font-semibold ${isActive ? 'text-[#173F35]' : 'text-[var(--va-text-faint)]'}`}>
                {item.label}
              </span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#173F35] mt-0.5" />}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
