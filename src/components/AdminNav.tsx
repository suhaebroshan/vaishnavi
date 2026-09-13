import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Map, ClipboardList, Users, TrendingUp, Bell, LogOut } from 'lucide-react';
import { useAppStore } from '../db/store';

const adminNav = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/map', icon: Map, label: 'Map' },
  { path: '/admin/bookings', icon: ClipboardList, label: 'Bookings' },
  { path: '/admin/workers', icon: Users, label: 'Workers' },
  { path: '/admin/revenue', icon: TrendingUp, label: 'Revenue' },
];

export default function AdminNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppStore(s => s.currentUser);
  const { setCurrentUser, currentRole } = useAppStore.getState();

  const getTab = (path: string) => {
    if (path.includes('/admin/dashboard')) return 'dashboard';
    if (path.includes('/admin/map')) return 'map';
    if (path.includes('/admin/bookings')) return 'bookings';
    if (path.includes('/admin/workers')) return 'workers';
    if (path.includes('/admin/revenue')) return 'revenue';
    return null;
  };
  const activeTab = getTab(location.pathname);

  return (
    <div className="min-h-screen bg-[#FBF9F4]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-[#173F35] px-5 py-3 flex items-center justify-between">
        <h1 className="text-white font-bold text-lg">Vaishnavi Ops</h1>
        <button onClick={() => { setCurrentUser(null); navigate('/'); }} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
          <LogOut size={18} className="text-white" />
        </button>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-[rgba(23,63,53,0.08)] px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {adminNav.map(item => {
            const tab = getTab(item.path);
            const active = tab === activeTab;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  active ? 'bg-[#173F35] text-white' : 'bg-[#F5F0E7] text-[#7A8B7E] hover:bg-[#EDE8DD]'
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
