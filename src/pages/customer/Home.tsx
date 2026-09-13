import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../db/store';
import { SERVICES } from '../../db/seed';
import { ServiceCard, BookingCard, StatCard } from '../../components/Cards';
import { IconHome, IconSearch, IconCalendar, IconChat, IconUser, IconBell, IconMapPin, IconTrendingUp, IconCheck, IconClock, IconWallet, IconBriefcase } from '../../components/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../db/database';

const container = { animate: { transition: { staggerChildren: 0.06 } } };
const item = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 18, stiffness: 200 } } };

export default function CustomerHome() {
  const user = useAppStore(s => s.currentUser);
  const unreadCount = useAppStore(s => s.unreadNotifications);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [greeting, setGreeting] = useState('');
  const navigate = useNavigate();

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
        setActiveBooking({ ...active, worker });
      }

      const enriched = await Promise.all(recent.map(async (b: any) => {
        const w = await db.workers.get(b.workerId);
        return { ...b, worker: w };
      }));
      setRecentBookings(enriched);
    }
    load();
  }, [user?.id]);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[var(--va-cream-light)] pb-28"
    >
      {/* ── STICKY HEADER ─────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[var(--va-cream-light)]/92 backdrop-blur-xl px-5 pt-4 pb-3 border-b border-[rgba(23,63,53,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[var(--va-text-muted)] font-medium">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
            <div className="flex items-center gap-1 mt-0.5">
              <IconMapPin size={12} className="text-[var(--va-terracotta)]" />
              <span className="text-xs font-semibold text-[var(--va-text-muted)]">Banjara Hills, Hyderabad</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/notifications')} className="relative p-2.5 rounded-full hover:bg-[var(--va-cream)] transition-colors active:scale-95">
              <IconBell size={20} className="text-[var(--va-green)]" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--va-terracotta)] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg"
                  style={{ boxShadow: '0 2px 8px rgba(200,111,82,0.4)' }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>
            <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1E4D3F] to-[#102F28] flex items-center justify-center text-white font-bold text-sm shadow-md active:scale-95 transition-transform">
              {user?.name?.charAt(0)}
            </button>
          </div>
        </div>

        {/* Search bar — claymorphic */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px]"
          style={{
            background: 'white',
            border: '1.5px solid rgba(23,63,53,0.07)',
            boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
          }}
        >
          <IconSearch size={18} className="text-[var(--va-sage)] shrink-0" />
          <span className="text-sm text-[var(--va-text-faint)] font-medium">What do you need help with?</span>
        </motion.button>
      </div>

      {/* ── ACTIVE BOOKING ────────────────────────────── */}
      <AnimatePresence>
        {activeBooking && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className="mx-5 mt-5"
          >
            <p className="section-label mb-3">Active Booking</p>
            <motion.button
              whileTap={{ scale: 0.98, y: 2 }}
              onClick={() => navigate('/tracking')}
              className="w-full text-left rounded-[22px] p-5"
              style={{
                background: 'linear-gradient(148deg, #FFFFFF 0%, #FAF8F3 100%)',
                border: '1.5px solid rgba(23,63,53,0.08)',
                boxShadow: '0 4px 20px rgba(23,63,53,0.10), inset 0 1px 0 rgba(255,255,255,0.95)',
              }}
            >
              {/* Status strip at top */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      background: activeBooking.status === 'on_the_way' || activeBooking.status === 'nearby'
                        ? '#22c55e' : '#C86F52',
                      boxShadow: activeBooking.status === 'on_the_way' || activeBooking.status === 'nearby'
                        ? '0 0 8px rgba(34,197,94,0.6)' : '0 0 6px rgba(200,111,82,0.5)',
                      animation: 'pulse 2s infinite'
                    }}
                  />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--va-text-muted)]">
                    {activeBooking.status === 'on_the_way' || activeBooking.status === 'nearby' ? '● Live Tracking' : activeBooking.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <span
                  className="text-[10px] font-bold px-3 py-1.5 rounded-full"
                  style={{
                    background: activeBooking.status === 'on_the_way' ? 'rgba(23,63,53,0.10)' : 'rgba(200,111,82,0.10)',
                    color: activeBooking.status === 'on_the_way' ? '#173F35' : '#C86F52',
                  }}
                >
                  {activeBooking.status === 'on_the_way' ? '● LIVE' : activeBooking.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Worker avatar with ring */}
                <div className="relative shrink-0">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{
                      background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)',
                      boxShadow: '0 4px 14px rgba(23,63,53,0.35)',
                    }}
                  >
                    {activeBooking.worker?.name?.charAt(0) || 'W'}
                  </div>
                  {activeBooking.status === 'on_the_way' && (
                    <motion.div
                      className="absolute -inset-1 rounded-full border-2 border-[#173F35]"
                      style={{ opacity: 0.3 }}
                      animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-[#173F35] text-base">{activeBooking.worker?.name || 'Professional'}</p>
                  <p className="text-xs text-[var(--va-text-muted)] mt-0.5 capitalize">{activeBooking.serviceType.replace(/_/g, ' ')} Professional</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= Math.round(activeBooking.worker?.rating || 4.8) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="text-[#C86F52]">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                    <span className="text-xs font-bold text-[#173F35] ml-1">{activeBooking.worker?.rating || 4.8}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {activeBooking.status === 'on_the_way' && (
                    <motion.p
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-lg font-extrabold text-[#173F35]"
                      style={{ letterSpacing: '-0.03em' }}
                    >
                      12<span className="text-xs font-semibold text-[var(--va-text-muted)] ml-0.5">min</span>
                    </motion.p>
                  )}
                  <p className="text-xs text-[var(--va-text-muted)] mt-0.5">₹{activeBooking.estimatedPrice?.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[rgba(23,63,53,0.07)] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[var(--va-text-muted)]">
                  <IconClock size={13} />
                  <span>{activeBooking.date} · {activeBooking.time}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/tracking')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)', boxShadow: '0 3px 10px rgba(23,63,53,0.3)' }}
                >
                  Track Worker →
                </motion.button>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SERVICES SECTION ──────────────────────────── */}
      <motion.div className="mx-5 mt-7" variants={container} initial="initial" animate="animate">
        <motion.div variants={item} className="flex items-center justify-between mb-3">
          <p className="text-base font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.02em' }}>Services</p>
          <button onClick={() => navigate('/search')} className="text-xs font-semibold text-[var(--va-terracotta)]">Browse All</button>
        </motion.div>
        <motion.div variants={item} className="flex gap-4 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
          {SERVICES.map((svc, i) => (
            <motion.div key={svc.id} variants={{
              initial: { opacity: 0, scale: 0.85 },
              animate: { opacity: 1, scale: 1, transition: { delay: i * 0.04, type: 'spring', damping: 15 } }
            }}>
              <ServiceCard service={svc} onPress={() => navigate(`/service/${svc.id}`)} />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── RECENT BOOKINGS ───────────────────────────── */}
      {recentBookings.length > 0 && (
        <motion.div className="mx-5 mt-6" variants={container} initial="initial" animate="animate">
          <motion.div variants={item} className="flex items-center justify-between mb-3">
            <p className="text-base font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.02em' }}>Recent Bookings</p>
            <button onClick={() => navigate('/bookings')} className="text-xs font-semibold text-[var(--va-terracotta)]">View All</button>
          </motion.div>
          <motion.div variants={item} className="space-y-3">
            {recentBookings.map((b, i) => (
              <motion.div key={b.id} variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0, transition: { delay: i * 0.05 } }
              }}>
                <BookingCard booking={b} worker={b.worker} onPress={() => navigate(`/booking/${b.id}`)} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {/* ── SPONSORED AD ─────────────────────────────── */}
      <motion.div className="mx-5 mt-7 mb-4" variants={container} initial="initial" animate="animate">
        <motion.div variants={item} className="rounded-[22px] overflow-hidden" style={{
          background: 'linear-gradient(148deg, #102F28 0%, #173F35 60%, #1E4D3F 100%)',
          boxShadow: '0 8px 28px rgba(23,63,53,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>
          <div className="px-5 pt-5 pb-4">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[var(--va-sage)] uppercase">Sponsored</span>
            <p className="text-white font-extrabold text-lg mt-1.5" style={{ letterSpacing: '-0.02em' }}>Protect Your Home</p>
            <p className="text-[var(--va-sage)] text-sm mt-1 leading-relaxed">Get affordable home insurance from ₹299/month. Fire, theft & natural disaster coverage.</p>
          </div>
          <div className="px-5 pb-5">
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="w-full py-3 rounded-xl font-bold text-sm text-white"
              style={{
                background: 'linear-gradient(145deg, #C86F52 0%, #B55E42 100%)',
                boxShadow: '0 4px 14px rgba(200,111,82,0.35), inset 0 1px 0 rgba(255,255,255,0.2)',
              }}
            >
              Learn More →
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
