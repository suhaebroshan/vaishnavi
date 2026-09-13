import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { StatusBadge } from '../../components/Cards';

type Tab = 'upcoming' | 'active' | 'completed';

export default function Bookings() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>('active');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const data = await db.bookings.where('customerId').equals(user.id).toArray();
      const enriched = await Promise.all(data.map(async (b: any) => {
        const w = await db.workers.get(b.workerId);
        return { ...b, worker: w };
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
        <h1 className="font-bold text-[#173F35] text-lg">My Bookings</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4 flex gap-2">
        {(['upcoming', 'active', 'completed'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              tab === t ? 'bg-[#173F35] text-white' : 'bg-white text-[#7A8B7E] hover:bg-[#F5F0E7]'
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-5 space-y-3">
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white rounded-2xl animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-[#7A8B7E]">No {tab} bookings yet.</p>
          </div>
        ) : (
          filtered.map((b, i) => (
            <motion.button
              key={b.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/booking/${b.id}`)}
              className="w-full text-left bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#F5F0E7] flex items-center justify-center text-xl">
                  {['plumbing', 'housekeeping', 'cooking', 'electrical', 'security', 'elder_care'].find(s => b.serviceType.includes(s)) ?
                    ['🔧', '🧹', '👩‍🍳', '⚡', '🛡️', '❤️'][['plumbing', 'housekeeping', 'cooking', 'electrical', 'security', 'elder_care'].indexOf(['plumbing', 'housekeeping', 'cooking', 'electrical', 'security', 'elder_care'].find(s => b.serviceType.includes(s)) || '')] : '🏠'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#173F35] capitalize">{b.serviceType.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-[#7A8B7E]">{b.worker?.name}</p>
                </div>
                <StatusBadge status={b.status} />
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(23,63,53,0.06)]">
                <span className="text-xs text-[#7A8B7E]">{b.date} · {b.time}</span>
                <span className="font-bold text-sm text-[#173F35]">₹{b.estimatedPrice}</span>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
