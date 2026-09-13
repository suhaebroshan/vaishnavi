import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { StatusBadge } from '../../components/Cards';
import { MapPin, Clock, Navigation } from 'lucide-react';

type Tab = 'upcoming' | 'active' | 'completed';

export default function WorkerJobs() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const data = await db.bookings.where('workerId').equals(user.id).toArray();
      const enriched = await Promise.all(data.map(async (b: any) => {
        const c = await db.customers.get(b.customerId);
        return { ...b, customer: c };
      }));
      setBookings(enriched);
      setLoading(false);
    }
    load();
  }, [user?.id]);

  const filtered = bookings.filter(b => {
    if (tab === 'upcoming') return ['requested', 'assigned'].includes(b.status);
    if (tab === 'active') return ['on_the_way', 'nearby', 'arrived', 'in_progress'].includes(b.status);
    return ['completed', 'paid', 'reviewed'].includes(b.status);
  });

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h1 className="font-bold text-[#173F35] text-lg">Jobs</h1>
      </div>

      <div className="px-5 mb-4 flex gap-2">
        {(['active', 'upcoming', 'completed'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${tab === t ? 'bg-[#173F35] text-white' : 'bg-white text-[#7A8B7E]'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="px-5 space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />)
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-[#7A8B7E]">No {tab} jobs</p>
          </div>
        ) : (
          filtered.map((b, i) => (
            <JobCard key={b.id} booking={b} onAction={() => {
              if (b.status === 'assigned') {
                // Start trip
                db.bookings.update(b.id, { status: 'on_the_way' }).then(() => {
                  navigate('/tracking');
                });
              } else if (b.status === 'on_the_way' || b.status === 'nearby' || b.status === 'arrived') {
                navigate('/tracking');
              } else if (b.status === 'in_progress') {
                // Mark complete
                db.bookings.update(b.id, { status: 'completed' }).then(() => {
                  navigate('/jobs');
                });
              } else {
                navigate(`/booking/${b.id}`);
              }
            }} />
          ))
        )}
      </div>
    </div>
  );
}

function JobCard({ booking, onAction }: { booking: any; onAction: () => void }) {
  const statusActions: Record<string, string> = {
    assigned: 'Start Trip',
    on_the_way: 'Track',
    nearby: 'Track',
    arrived: 'Start Service',
    in_progress: 'Complete Service',
    requested: 'View Details',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onAction}
      className="w-full text-left bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold tracking-widest text-[#7A8B7E] uppercase">{booking.serviceType.replace(/_/g, ' ')}</span>
        <StatusBadge status={booking.status} />
      </div>
      <p className="font-semibold text-[#173F35]">{booking.customer?.name || 'Customer'}</p>
      <div className="flex items-center gap-4 mt-2 text-xs text-[#7A8B7E]">
        <span className="flex items-center gap-1"><MapPin size={12} /> Banjara Hills</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {booking.time}</span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(23,63,53,0.06)]">
        <span className="font-bold text-[#173F35]">₹{booking.estimatedPrice}</span>
        <span className="text-xs font-semibold text-[#C86F52] flex items-center gap-1">
          {statusActions[booking.status] || 'View'} →
        </span>
      </div>
    </motion.button>
  );
}
