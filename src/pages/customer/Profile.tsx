import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IconBell, IconCreditCard, IconMapPin, IconLogOut, IconHelpCircle, IconPhone, IconCalendar, IconUsers } from '../../components/icons';
import { useAppStore } from '../../db/store';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [demoOpen, setDemoOpen] = useState(false);
  const { setShowAccountSwitcher } = useAuth();
  const cust = user as any;

  const stats = [
    { value: String(cust?.totalBookings || 12), label: 'Bookings' },
    { value: `₹${cust?.totalSpent || 4850}`, label: 'Spent' },
    { value: '4.8', label: 'Rating' },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-28">
      {/* ── HEADER ─────────────────────────────────── */}
      <div style={{ background: 'linear-gradient(148deg, #102F28 0%, #173F35 60%, #1E4D3F 100%)' }} className="px-5 pt-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-lg font-bold">Profile</h1>
          <button
            onClick={() => navigate('/notifications')}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <IconBell size={18} className="text-white" />
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.25)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)',
            }}
            onClick={() => setShowAccountSwitcher(true)}
          >
            {user?.name?.charAt(0) || '?'}
          </motion.div>
          <div>
            <h2 className="text-white text-xl font-bold">{user?.name}</h2>
            <p className="text-[#A8B9A5] text-sm">{user?.phone}</p>
            <div className="flex items-center gap-1 mt-1">
              <IconMapPin size={12} className="text-[#C86F52]" />
              <span className="text-xs text-[#A8B9A5]">Banjara Hills, Hyderabad</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS OVERLAY ──────────────────────────── */}
      <div className="mx-5 -mt-5 rounded-2xl overflow-hidden" style={{
        background: 'white',
        border: '1.5px solid rgba(23,63,53,0.08)',
        boxShadow: '0 8px 32px rgba(23,63,53,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
      }}>
        <div className="flex divide-x divide-[rgba(23,63,53,0.07)]">
          {stats.map((stat, i) => (
            <div key={i} className="flex-1 text-center py-4">
              <p className="text-xl font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.03em' }}>{stat.value}</p>
              <p className="text-xs text-[#7A8B7E] font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MENU ITEMS ─────────────────────────────── */}
      <div className="mx-5 mt-5 space-y-2">
        <MenuItem icon={<IconCalendar size={17} />} label="My Bookings" onPress={() => navigate('/bookings')} />
        <MenuItem icon={<IconMapPin size={17} />} label="Saved Addresses" onPress={() => {}} />
        <MenuItem icon={<IconCreditCard size={17} />} label="Payment Methods" onPress={() => {}} />
        <MenuItem icon={<IconUsers size={17} />} label="Switch Account" onPress={() => setShowAccountSwitcher(true)} accent />
        <MenuItem icon={<IconBell size={17} />} label="Notifications" onPress={() => navigate('/notifications')} />
      </div>

      <div className="mx-5 mt-3 space-y-2">
        <MenuItem icon={<IconHelpCircle size={17} />} label="Help & Support" onPress={() => {}} />
        <MenuItem icon={<IconPhone size={17} />} label="Contact Vaishnavi" onPress={() => window.open('tel:+917569728464')} />
      </div>

      {/* Demo controls */}
      <div className="mx-5 mt-6">
        <button
          onClick={() => setDemoOpen(!demoOpen)}
          className="w-full py-2 text-xs font-medium text-[#A8B9A5] hover:text-[#7A8B7E] transition-colors"
        >
          ⚙ Demo Controls
        </button>
        <AnimatePresence>
          {demoOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 mt-2 space-y-2">
                <p className="text-xs font-semibold text-[#7A8B7E] mb-2">Quick Navigation</p>
                <div className="grid grid-cols-2 gap-2">
                  <NavBtn label="Home" action={() => navigate('/')} />
                  <NavBtn label="Services" action={() => navigate('/search')} />
                  <NavBtn label="Bookings" action={() => navigate('/bookings')} />
                  <NavBtn label="Track" action={() => navigate('/tracking')} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sign out */}
      <div className="mx-5 mt-6">
        <button
          onClick={() => {
            localStorage.removeItem('vaishnavi-current-user');
            navigate('/landing');
          }}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl hover:bg-red-50 transition-colors"
          style={{ border: '1.5px solid rgba(239,68,68,0.15)' }}
        >
          <IconLogOut size={18} className="text-[#C86F52]" />
          <span className="font-medium text-sm text-[#C86F52]">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onPress, accent }: { icon: React.ReactNode; label: string; onPress: () => void; accent?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98, x: 3 }}
      onClick={onPress}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl"
      style={{
        background: 'white',
        border: '1.5px solid rgba(23,63,53,0.07)',
        boxShadow: '0 2px 8px rgba(23,63,53,0.05), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: accent ? 'rgba(200,111,82,0.10)' : 'rgba(23,63,53,0.07)',
          color: accent ? '#C86F52' : '#173F35',
        }}
      >
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium text-[#173F35] text-left">{label}</span>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#A8B9A5] shrink-0">
        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </motion.button>
  );
}

function NavBtn({ label, action }: { label: string; action: () => void }) {
  return (
    <button
      onClick={action}
      className="px-3 py-2.5 rounded-xl text-xs font-medium text-[#173F35] hover:bg-[#F5F0E7] transition-colors"
      style={{ background: '#F5F0E7', border: '1px solid rgba(23,63,53,0.07)' }}
    >
      {label}
    </button>
  );
}
