import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { StatusBadge } from '../../components/Cards';
import { IconMapPin, IconClock, IconUser, IconWrench } from '../../components/icons';

export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function load() {
      const data = await db.bookings.toArray();
      const enriched = await Promise.all(data.map(async (b: any) => {
        const c = await db.customers.get(b.customerId);
        const w = await db.workers.get(b.workerId);
        return { ...b, customer: c, worker: w };
      }));
      setBookings(enriched);
    }
    load();
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter((b: any) => b.status === filter);

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h1 className="font-bold text-[#173F35] text-lg">All Bookings</h1>
        <span className="ml-auto text-xs text-[#7A8B7E]">{filtered.length} records</span>
      </div>

      {/* Filters */}
      <div className="px-5 mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['all', 'requested', 'assigned', 'on_the_way', 'in_progress', 'completed', 'paid', 'reviewed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${filter === f ? 'bg-[#173F35] text-white' : 'bg-white text-[#7A8B7E]'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-2">
        {filtered.map((b, i) => (
          <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <AdminBookingCard booking={b} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function AdminBookingCard({ booking }: { booking: any }) {
  return (
    <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="font-mono text-xs text-[#7A8B7E]">{booking.id}</span>
          <p className="font-semibold text-sm text-[#173F35] capitalize mt-0.5">{booking.serviceType.replace(/_/g, ' ')}</p>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1 text-[#7A8B7E]"><IconUser size={12} /> {booking.customer?.name || '—'}</div>
        <div className="flex items-center gap-1 text-[#7A8B7E]"><IconWrench size={12} /> {booking.worker?.name || 'Unassigned'}</div>
        <div className="flex items-center gap-1 text-[#7A8B7E]"><IconMapPin size={12} /> {booking.addressId}</div>
        <div className="flex items-center gap-1 text-[#7A8B7E]"><IconClock size={12} /> {booking.date} {booking.time}</div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(23,63,53,0.06)]">
        <span className="font-bold text-sm text-[#173F35]">₹{booking.estimatedPrice}</span>
        <span className="text-[10px] text-[#A8B9A5]">{new Date(booking.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
