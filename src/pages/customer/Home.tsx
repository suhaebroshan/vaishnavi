import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../db/store';
import { SERVICES, ACTIVE_OFFERS } from '../../db/seed';
import { ServiceCard, BookingCard } from '../../components/Cards';
import { IconSearch, IconMapPin, IconClock, IconBell, IconSwap } from '../../components/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../../db/database';
import { useAuth } from '../../context/AuthContext';

const container = { animate: { transition: { staggerChildren: 0.06 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 18, stiffness: 200 } } };

function OfferCard({ offer, index }: { offer: any; index: number }) {
  const navigate = useNavigate();
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/search')}
      className="w-full text-left rounded-[18px] p-4 flex items-center gap-3"
      style={{
        background: 'white',
        border: '1.5px solid rgba(200,111,82,0.15)',
        boxShadow: '0 2px 10px rgba(200,111,82,0.08), inset 0 1px 0 rgba(255,255,255,0.95)',
      }}
    >
      <div className="w-10 h-10 rounded-[14px] flex items-center justify-center shrink-0"
        style={{ background: 'rgba(200,111,82,0.10)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#C86F52]">
          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.8" fill="none"/>
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-[#173F35]">{offer.title}</p>
        <p className="text-[11px] text-[#7A8B7E] mt-0.5 leading-snug line-clamp-1">{offer.subtitle}</p>
      </div>
      <span className="text-[10px] font-extrabold px-2.5 py-1.5 rounded-full shrink-0"
        style={{ background: 'rgba(200,111,82,0.10)', color: '#C86F52' }}>
        {offer.ctaText}
      </span>
    </motion.button>
  );
}

export default function CustomerHome() {
  const user = useAppStore(s => s.currentUser);
  const unreadCount = useAppStore(s => s.unreadNotifications);
  const [activeBooking, setActiveBooking] = useState<any>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const navigate = useNavigate();
  const { setShowAccountSwitcher } = useAuth();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || '';

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
      transition={{ duration: 0.25 }}
      className="min-h-screen bg-[#FBF9F4] pb-28"
    >
      {/* ── HEADER BAR ─────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/95 backdrop-blur-xl px-5 pt-4 pb-3 border-b border-[rgba(23,63,53,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[#5A6B5E] font-medium">{greeting}, {firstName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <IconMapPin size={12} className="text-[#C86F52]" />
              <span className="text-xs font-semibold text-[#8A9B8E]">Banjara Hills, Hyderabad</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Switch Profile Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowAccountSwitcher(true)}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-full active:scale-95 transition-transform"
              style={{ background: 'rgba(23,63,53,0.07)' }}
              data-testid="switch-profile-btn"
            >
              <motion.span
                animate={{ rotate: [0, 180, 180] }}
                transition={{ duration: 0.4, times: [0, 0.6, 1] }}
              >
                <IconSwap size={14} className="text-[#173F35]" />
              </motion.span>
              <span className="text-[11px] font-bold text-[#173F35]">Switch</span>
            </motion.button>
            <button
              onClick={() => navigate('/notifications')}
              className="relative p-2.5 rounded-full hover:bg-[#F5F0E7] transition-colors active:scale-95"
            >
              <IconBell size={20} className="text-[#173F35]" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#C86F52] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ boxShadow: '0 2px 8px rgba(200,111,82,0.4)' }}
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)' }}
              onClick={() => navigate('/profile')}
            >
              {user?.name?.charAt(0) || 'S'}
            </div>
          </div>
        </div>

        {/* Search bar */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px]"
          style={{
            background: 'white',
            border: '1.5px solid rgba(23,63,53,0.07)',
            boxShadow: '0 2px 12px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
          }}
        >
          <IconSearch size={18} className="text-[#A8B9A5] shrink-0" />
          <span className="text-sm text-[#8A9B8E] font-medium">Search for a service</span>
        </motion.button>
      </div>

      {/* ── ACTIVE BOOKING CARD ────────────────────── */}
      <AnimatePresence>
        {activeBooking && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 250 }}
            className="mx-5 mt-5"
          >
            <p className="section-label mb-3">Active Service</p>
            <motion.button
              whileTap={{ scale: 0.985, y: 2 }}
              onClick={() => navigate('/tracking')}
              className="w-full text-left rounded-[22px] p-5"
              style={{
                background: 'linear-gradient(148deg, #FFFFFF 0%, #FAF8F3 100%)',
                border: '1.5px solid rgba(23,63,53,0.08)',
                boxShadow: '0 4px 24px rgba(23,63,53,0.10), inset 0 1px 0 rgba(255,255,255,0.95)',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: activeBooking.status === 'on_the_way' || activeBooking.status === 'nearby' ? '#22c55e' : '#C86F52',
                      boxShadow: activeBooking.status === 'on_the_way' || activeBooking.status === 'nearby'
                        ? '0 0 8px rgba(34,197,94,0.6)' : '0 0 6px rgba(200,111,82,0.5)',
                      animation: 'pulse 2s infinite',
                    }}
                  />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#8A9B8E]">
                    {activeBooking.status === 'on_the_way' || activeBooking.status === 'nearby' ? '● LIVE TRACKING' : activeBooking.status.replace(/_/g, ' ').toUpperCase()}
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
                <div className="relative shrink-0">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                    style={{
                      background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)',
                      boxShadow: '0 4px 16px rgba(23,63,53,0.35)',
                    }}
                  >
                    {activeBooking.worker?.name?.charAt(0) || 'W'}
                  </div>
                  {(activeBooking.status === 'on_the_way' || activeBooking.status === 'nearby') && (
                    <>
                      <motion.div
                        className="absolute -inset-1.5 rounded-full border-2 border-[#173F35]"
                        style={{ opacity: 0.25 }}
                        animate={{ scale: [1, 1.5], opacity: [0.25, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute -inset-3 rounded-full border border-[#173F35]"
                        style={{ opacity: 0.12 }}
                        animate={{ scale: [1, 1.6], opacity: [0.12, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                      />
                    </>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-[#173F35] text-base">{activeBooking.worker?.name || 'Professional'}</p>
                  <p className="text-xs text-[#7A8B7E] mt-0.5 capitalize">{activeBooking.serviceType?.replace(/_/g, ' ')} Professional</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill={star <= Math.round(activeBooking.worker?.rating || 4.8) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="text-[#C86F52]">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                    <span className="text-xs font-bold text-[#173F35] ml-1">{activeBooking.worker?.rating || 4.8}</span>
                    <span className="text-[10px] text-[#A8B9A5]">· {activeBooking.worker?.totalJobs || 120} jobs</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {(activeBooking.status === 'on_the_way' || activeBooking.status === 'nearby') && (
                    <motion.p
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-lg font-extrabold text-[#173F35]"
                      style={{ letterSpacing: '-0.03em' }}
                    >
                      12<span className="text-xs font-semibold text-[#7A8B7E] ml-0.5">min</span>
                    </motion.p>
                  )}
                  <p className="text-xs text-[#7A8B7E] mt-0.5">₹{activeBooking.estimatedPrice?.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[rgba(23,63,53,0.07)] flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-[#7A8B7E]">
                  <IconClock size={13} />
                  <span>{activeBooking.date} · {activeBooking.time}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/tracking')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{
                    background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)',
                    boxShadow: '0 3px 10px rgba(23,63,53,0.30)',
                  }}
                >
                  Track →
                </motion.button>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── OFFERS RUNNING ───────────────────────── */}
      <motion.div className="mx-5 mt-6" variants={container} initial="initial" animate="animate">
        <motion.div variants={item} className="flex items-center justify-between mb-3">
          <p className="text-base font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.02em' }}>Offers Running</p>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(200,111,82,0.12)', color: '#C86F52' }}>
            Live
          </span>
        </motion.div>
        <motion.div variants={item} className="space-y-3">
          {ACTIVE_OFFERS.map((offer, i) => (
            <OfferCard key={offer.id} offer={offer} index={i} />
          ))}
        </motion.div>
      </motion.div>

      {/* ── SERVICES SECTION ───────────────────────── */}
      <motion.div className="mx-5 mt-7" variants={container} initial="initial" animate="animate">
        <motion.div variants={item} className="flex items-center justify-between mb-3">
          <p className="text-base font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.02em' }}>Services</p>
          <button onClick={() => navigate('/search')} className="text-xs font-semibold text-[#C86F52]">Browse All</button>
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

      {/* ── RECENT BOOKINGS ────────────────────────── */}
      {recentBookings.length > 0 && (
        <motion.div className="mx-5 mt-6" variants={container} initial="initial" animate="animate">
          <motion.div variants={item} className="flex items-center justify-between mb-3">
            <p className="text-base font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.02em' }}>Recent Bookings</p>
            <button onClick={() => navigate('/history')} className="text-xs font-semibold text-[#C86F52]">View All</button>
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

      {/* ── PROMO BANNER ───────────────────────────── */}
      <motion.div className="mx-5 mt-7 mb-4" variants={container} initial="initial" animate="animate">
        <motion.div variants={item} className="rounded-[22px] overflow-hidden" style={{
          background: 'linear-gradient(148deg, #102F28 0%, #173F35 60%, #1E4D3F 100%)',
          boxShadow: '0 8px 28px rgba(23,63,53,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}>
          <div className="px-5 pt-5 pb-4">
            <span className="text-[10px] font-extrabold tracking-[0.2em] text-[#A8B9A5] uppercase">Promoted</span>
            <p className="text-white font-extrabold text-lg mt-1.5" style={{ letterSpacing: '-0.02em' }}>Protect Your Home</p>
            <p className="text-[#A8B9A5] text-sm mt-1 leading-relaxed">Get affordable home insurance from ₹299/month. Fire, theft & natural disaster coverage.</p>
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
