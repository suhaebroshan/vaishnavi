import { motion } from 'framer-motion';
import { MapPin, Search, Bell, UserCircle } from 'lucide-react';
import { useAppStore } from '../../db/store';
import { SERVICES } from '../../db/seed';
import { ServiceCard } from '../../components/Cards';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../db/database';

export default function CustomerHome() {
  const user = useAppStore(s => s.currentUser);
  const unreadCount = useAppStore(s => s.unreadNotifications);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const bookings = await db.bookings.where('customerId').equals(user.id).toArray();
      const active = bookings.find((b: any) =>
        ['requested', 'assigned', 'on_the_way', 'nearby', 'arrived', 'in_progress'].includes(b.status)
      );
      const recent = bookings
        .filter((b: any) => ['completed', 'paid', 'reviewed'].includes(b.status))
        .sort((a: any, b: any) => b.createdAt - a.createdAt)
        .slice(0, 3);

      if (active) {
        const worker = await db.workers.get(active.workerId);
        const address = await db.addresses.get(active.addressId);
        setActiveBooking({ ...active, worker, address });
      }

      const enrichedRecent = await Promise.all(recent.map(async (b: any) => {
        const w = await db.workers.get(b.workerId);
        return { ...b, worker: w };
      }));
      setRecentBookings(enrichedRecent);
    }
    load();
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-[#7A8B7E]">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={13} className="text-[#C86F52]" />
              <span className="text-xs font-medium text-[#7A8B7E]">Banjara Hills, Hyderabad</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/notifications')} className="relative p-2 rounded-full hover:bg-[#F5F0E7] transition-colors">
              <Bell size={20} className="text-[#173F35]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#C86F52] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full bg-[#173F35] flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)}
            </button>
          </div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8B9A5]" />
          <input
            type="text"
            placeholder="What do you need help with?"
            onClick={() => navigate('/search')}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border border-[rgba(23,63,53,0.1)] text-sm text-[#173F35] placeholder:text-[#A8B9A5] focus:outline-none focus:ring-2 focus:ring-[#173F35]/30 cursor-pointer"
          />
        </motion.div>
      </div>

      {/* Active Booking Card */}
      {activeBooking && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="mx-5 mb-4"
        >
          <button onClick={() => navigate('/tracking')} className="w-full text-left">
            <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold tracking-widest text-[#C86F52] uppercase">Active Booking</span>
                <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                  activeBooking.status === 'on_the_way' ? 'bg-green-100 text-green-700 animate-pulse' :
                  activeBooking.status === 'requested' ? 'bg-orange-100 text-orange-700' :
                  'bg-[#173F35]/10 text-[#173F35]'
                }`}>
                  {activeBooking.status === 'on_the_way' ? '● LIVE' : activeBooking.status.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#173F35] flex items-center justify-center text-white text-lg">
                  {activeBooking.worker?.name?.charAt(0) || 'W'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#173F35] text-sm">{activeBooking.worker?.name}</p>
                  <p className="text-xs text-[#7A8B7E] capitalize">{activeBooking.serviceType}</p>
                </div>
                <div className="text-right">
                  {activeBooking.status === 'on_the_way' && (
                    <p className="text-sm font-bold text-[#173F35]">12 min</p>
                  )}
                  <p className="text-xs text-[#7A8B7E]">₹{activeBooking.estimatedPrice}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-[rgba(23,63,53,0.08)] flex items-center justify-between">
                <span className="text-xs text-[#7A8B7E]">{activeBooking.date} · {activeBooking.time}</span>
                <span className="text-xs font-semibold text-[#173F35]">Track →</span>
              </div>
            </div>
          </button>
        </motion.div>
      )}

      {/* Services Grid */}
      <div className="mx-5 mb-6">
        <h2 className="text-lg font-bold text-[#173F35] mb-3">Services</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
          {SERVICES.map((svc) => (
            <ServiceCard
              key={svc.id}
              service={svc}
              onPress={() => navigate(`/service/${svc.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      {recentBookings.length > 0 && (
        <div className="mx-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#173F35]">Recent Bookings</h2>
            <button onClick={() => navigate('/bookings')} className="text-xs font-semibold text-[#C86F52]">View All</button>
          </div>
          <div className="space-y-3">
            {recentBookings.map((b, i) => (
              <motion.button
                key={b.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate(`/booking/${b.id}`)}
                className="w-full text-left bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F0E7] flex items-center justify-center text-lg">
                    {SERVICES.find(s => s.id === b.serviceType)?.icon || '🏠'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[#173F35] capitalize">{b.serviceType.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-[#7A8B7E]">{b.worker?.name}</p>
                  </div>
                  <span className="font-bold text-sm text-[#173F35]">₹{b.estimatedPrice}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Sponsored Ad */}
      <div className="mx-5 mt-6 mb-4">
        <div className="rounded-2xl overflow-hidden border border-[rgba(23,63,53,0.08)]">
          <div className="bg-[#173F35] p-4">
            <span className="text-[10px] font-bold tracking-widest text-[#A8B9A5] uppercase">Sponsored</span>
            <p className="text-white font-bold text-base mt-1">Protect Your Home</p>
            <p className="text-[#A8B9A5] text-sm mt-0.5">Get affordable home insurance from ₹299/month</p>
          </div>
          <button className="w-full py-3 bg-[#F5F0E7] text-[#C86F52] text-sm font-semibold hover:bg-[#EDE8DD] transition-colors rounded-b-2xl">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}
