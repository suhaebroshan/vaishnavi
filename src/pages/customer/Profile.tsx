import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IconBell, IconCreditCard, IconMapPin, IconLogOut, IconHelpCircle, IconPhone, IconStar, IconHeartOutline, IconCalendar, IconUsers } from '../../components/icons';
import { useAppStore } from '../../db/store';

export default function Profile() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [demoOpen, setDemoOpen] = useState(false);
  const cust = user as any;

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="bg-[#173F35] px-5 pt-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-lg font-bold">Profile</h1>
          <button onClick={() => navigate('/notifications')} className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <IconBell size={18} className="text-white" />
          </button>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-white text-xl font-bold">{user?.name}</h2>
            <p className="text-[#A8B9A5] text-sm">{user?.phone}</p>
          </div>
        </div>
      </div>

      <div className="mx-5 -mt-6 bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] shadow-sm p-4 flex gap-6">
        <StatItem value={String(cust?.totalBookings || 0)} label="Bookings" />
        <StatItem value={`₹${cust?.totalSpent || 4850}`} label="Spent" />
        <StatItem value="4.8" label="Rating" />
      </div>

      <div className="mx-5 mt-5 space-y-2">
        <MenuItem icon={<IconCalendar size={18} />} label="My Bookings" onPress={() => navigate('/bookings')} />
        <MenuItem icon={<IconMapPin size={18} />} label="Saved Addresses" onPress={() => {}} />
        <MenuItem icon={<IconCreditCard size={18} />} label="Payment Methods" onPress={() => {}} />
        <MenuItem icon={<IconHeartOutline size={18} />} label="Favorites" onPress={() => {}} />
        <MenuItem icon={<IconBell size={18} />} label="Notifications" onPress={() => navigate('/notifications')} />
      </div>

      <div className="mx-5 mt-3 space-y-2">
        <MenuItem icon={<IconHelpCircle size={18} />} label="Help & Support" onPress={() => {}} />
        <MenuItem icon={<IconPhone size={18} />} label="Contact Vaishnavi" onPress={() => window.open('tel:+917569728464')} />
      </div>

      <div className="mx-5 mt-6">
        <button onClick={() => setDemoOpen(!demoOpen)} className="w-full py-2 text-xs font-medium text-[#A8B9A5] hover:text-[#7A8B7E] transition-colors">
          ⚙ Demo Controls
        </button>
        {demoOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 mt-2 space-y-2">
            <p className="text-xs font-semibold text-[#7A8B7E] mb-2">Quick Navigation</p>
            <div className="grid grid-cols-2 gap-2">
              <NavBtn label="Home" action={() => navigate('/')} />
              <NavBtn label="Services" action={() => navigate('/search')} />
              <NavBtn label="Bookings" action={() => navigate('/bookings')} />
              <NavBtn label="Chat" action={() => navigate('/chat')} />
              <NavBtn label="Track" action={() => navigate('/tracking')} />
              <NavBtn label="Call" action={() => navigate('/call')} />
            </div>
          </motion.div>
        )}
      </div>

      <div className="mx-5 mt-6">
        <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors">
          <IconLogOut size={18} />
          <span className="font-medium text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center flex-1">
      <p className="text-lg font-bold text-[#173F35]">{value}</p>
      <p className="text-xs text-[#7A8B7E]">{label}</p>
    </div>
  );
}

function MenuItem({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.98 }} onClick={onPress} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white border border-[rgba(23,63,53,0.08)]">
      <div className="w-9 h-9 rounded-xl bg-[#F5F0E7] flex items-center justify-center text-[#173F35]">{icon}</div>
      <span className="flex-1 text-sm font-medium text-[#173F35] text-left">{label}</span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="#A8B9A5" strokeWidth="1.5" strokeLinecap="round"/></svg>
    </motion.button>
  );
}

function NavBtn({ label, action }: { label: string; action: () => void }) {
  return (
    <button onClick={action} className="px-3 py-2 rounded-xl bg-[#F5F0E7] text-xs font-medium text-[#173F35] hover:bg-[#EDE8DD] transition-colors">
      {label}
    </button>
  );
}
