import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceIcon } from '../../components/icons';
import { IconCalendar, IconClock, IconPlus, IconX } from '../../components/icons';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { StatusBadge } from '../../components/Cards';

type Tab = 'upcoming' | 'past';

export default function CustomerBookings() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [bookings, setBookings] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>('upcoming');
  const [showBookModal, setShowBookModal] = useState(false);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const all = await db.bookings.where('customerId').equals(user.id).toArray();
      const enriched = await Promise.all(all.map(async (b: any) => {
        const w = await db.workers.get(b.workerId);
        return { ...b, workerName: w?.name || 'Professional' };
      }));
      enriched.sort((a: any, b: any) => b.createdAt - a.createdAt);
      setBookings(enriched);
    }
    load();
  }, [user?.id]);

  const upcoming = bookings.filter(b => !['completed', 'paid', 'reviewed'].includes(b.status));
  const past = bookings.filter(b => ['completed', 'paid', 'reviewed'].includes(b.status));

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-[#FBF9F4] pb-28"
    >
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/95 backdrop-blur-xl px-5 pt-4 pb-3 border-b border-[rgba(23,63,53,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-extrabold text-[#173F35] text-lg" style={{ letterSpacing: '-0.02em' }}>Bookings</h1>
            <p className="text-xs text-[#7A8B7E] mt-0.5">Manage your services</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => setShowBookModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-white text-sm font-bold"
            style={{
              background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)',
              boxShadow: '0 4px 14px rgba(23,63,53,0.30)',
            }}
          >
            <IconPlus size={15} /> Book Now
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['upcoming', 'past'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t ? 'bg-[#173F35] text-white' : 'bg-white text-[#7A8B7E] hover:bg-[#F5F0E7]'
              }`}
            >
              {t === 'upcoming' ? `Active (${upcoming.length})` : `Past (${past.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Booking list */}
      <div className="mx-5 mt-5 space-y-3">
        {(tab === 'upcoming' ? upcoming : past).map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            onClick={() => navigate(`/booking/${b.id}`)}
            className="bg-white rounded-[20px] p-4 border border-[rgba(23,63,53,0.07)] cursor-pointer active:scale-[0.99] transition-transform"
            style={{ boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0" style={{ background: 'rgba(23,63,53,0.07)' }}>
                <ServiceIcon serviceId={b.serviceType} size={22} color="#173F35" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-[#173F35] capitalize">{b.serviceType.replace(/_/g, ' ')}</p>
                  <StatusBadge status={b.status} small />
                </div>
                <p className="text-xs text-[#7A8B7E] mt-0.5">{b.workerName}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[#7A8B7E]">
                  <span className="flex items-center gap-1"><IconClock size={11} /> {b.date} · {b.time}</span>
                </div>
              </div>
              <span className="font-extrabold text-[#173F35] text-sm">₹{b.finalPrice || b.estimatedPrice?.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}

        {/* Empty state */}
        {(tab === 'upcoming' ? upcoming : past).length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(23,63,53,0.07)' }}>
              <IconCalendar size={28} className="text-[#173F35]" />
            </div>
            <p className="text-[#7A8B7E] font-medium">{tab === 'upcoming' ? 'No active bookings' : 'No past bookings yet'}</p>
            <p className="text-xs text-[#A8B9A5] mt-1">{tab === 'upcoming' ? 'Book your next service today' : 'Completed bookings will appear here'}</p>
          </motion.div>
        )}
      </div>

      {/* Book Now Modal */}
      <AnimatePresence>
        {showBookModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowBookModal(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-[430px] mx-auto bg-[#FBF9F4] rounded-t-[28px] p-6 pb-10"
            >
              <div className="w-10 h-1 rounded-full bg-[#D4CFC4] mx-auto mb-5" />
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-extrabold text-[#173F35] text-lg">Book a Service</h2>
                <button onClick={() => setShowBookModal(false)} className="p-2 rounded-full hover:bg-[#F5F0E7]">
                  <IconX size={20} className="text-[#7A8B7E]" />
                </button>
              </div>

              <p className="text-sm text-[#7A8B7E] mb-4">Select a service to get started</p>
              <div className="grid grid-cols-2 gap-3">
                {['plumbing', 'housekeeping', 'cooking', 'electrical', 'elder_care', 'security'].map(svc => (
                  <motion.button
                    key={svc}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setShowBookModal(false); navigate(`/service/${svc}`); }}
                    className="flex flex-col items-center gap-2 p-4 rounded-[18px] bg-white border border-[rgba(23,63,53,0.08)]"
                  >
                    <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ background: 'rgba(23,63,53,0.07)' }}>
                      <ServiceIcon serviceId={svc} size={20} color="#173F35" />
                    </div>
                    <span className="text-xs font-semibold text-[#173F35] capitalize">{svc.replace(/_/g, ' ')}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
