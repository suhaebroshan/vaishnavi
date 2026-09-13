import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { DEMAND_ZONES } from '../../db/seed';
import { IconBell, IconClock, IconMapPin, IconTrendingUp, IconCheckCircle, IconWallet, IconBriefcase, IconStar, IconUser } from '../../components/icons';
import { AnimatePresence } from 'framer-motion';

const container = { animate: { transition: { staggerChildren: 0.07 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 18, stiffness: 200 } } };

export default function WorkerHome() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');

    async function load() {
      if (!user) return;
      const allBookings = await db.bookings.where('workerId').equals(user.id).toArray();
      const pending = allBookings.filter((b: any) => b.status === 'requested').length;
      setPendingRequests(pending);

      const payments = await db.payments.where('status').equals('completed').toArray();
      const workerBookings = allBookings;
      const todayPayments = payments.filter((p: any) =>
        workerBookings.some((b: any) => b.id === p.bookingId)
      );
      const total = todayPayments.reduce((s: number, p: any) => s + (p.amount || 0), 0);
      setTodayEarnings(total || (user as any).todayEarnings || 2450);

      const activeJobs = allBookings
        .filter((b: any) => !['requested'].includes(b.status))
        .sort((a: any, b: any) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
        .slice(0, 5);

      const enriched = await Promise.all(activeJobs.map(async (b: any) => {
        const c = await db.customers.get(b.customerId);
        return { ...b, customer: c };
      }));
      setJobs(enriched);
    }
    load();
  }, [user?.id]);

  // Get demand zones for this worker's service type
  const svcType = (user as any)?.serviceType;
  const demandZones: { area: string; level: 'high' | 'medium' | 'low'; demandScore: number }[] = svcType ? (DEMAND_ZONES[svcType] || []) : [];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="min-h-screen bg-[#FBF9F4] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/95 backdrop-blur-xl px-5 pt-4 pb-3 border-b border-[rgba(23,63,53,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[#5A6B5E] font-medium">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
            <h1 className="font-extrabold text-[#173F35] text-lg" style={{ letterSpacing: '-0.02em' }}>Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/worker/requests')}
              className="relative p-2.5 rounded-full hover:bg-[#F5F0E7] transition-colors active:scale-95"
            >
              <IconBell size={20} className="text-[#173F35]" />
              {pendingRequests > 0 && (
                <motion.span
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#C86F52] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ boxShadow: '0 2px 8px rgba(200,111,82,0.4)' }}
                >
                  {pendingRequests}
                </motion.span>
              )}
            </button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer active:scale-95 transition-transform"
              style={{ background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)' }}
              onClick={() => navigate('/worker/profile')}
            >
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>

        {/* Stats — 2×2 grid */}
        <motion.div className="grid grid-cols-2 gap-3" variants={container} initial="initial" animate="animate">
          <StatTile icon={<IconTrendingUp size={15} />} label="Today's Earnings" value={`₹${todayEarnings.toLocaleString()}`} color="#173F35" />
          <StatTile icon={<IconCheckCircle size={15} />} label="Total Jobs" value={String((user as any)?.totalJobs || 0)} color="#C86F52" sub={`/ ${(user as any)?.totalJobs || 0} jobs`} />
          <StatTile icon={<IconStar size={15} />} label="Rating" value={`⭐ ${(user as any)?.rating || '4.8'}`} color="#173F35" />
          <StatTile icon={<IconBriefcase size={15} />} label="Pending" value={String(pendingRequests)} color="#C86F52" />
        </motion.div>
      </div>

      {/* Pending requests banner */}
      <AnimatePresence>
        {pendingRequests > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 250 }}
            className="mx-5 mt-4"
          >
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/worker/requests')}
              className="w-full text-left rounded-[20px] p-4"
              style={{
                background: 'linear-gradient(145deg, rgba(200,111,82,0.08) 0%, rgba(200,111,82,0.03) 100%)',
                border: '1.5px solid rgba(200,111,82,0.20)',
                boxShadow: '0 4px 16px rgba(200,111,82,0.10)',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#C86F52]" style={{ boxShadow: '0 0 6px rgba(200,111,82,0.6)' }} />
                <span className="text-xs font-extrabold tracking-widest text-[#C86F52] uppercase">
                  {pendingRequests} New Request{pendingRequests > 1 ? 's' : ''}
                </span>
              </div>
              <p className="font-bold text-[#173F35] text-sm">Suhaeb needs your service tomorrow at 10:00 AM</p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-[#7A8B7E]">
                <span className="flex items-center gap-1"><IconMapPin size={11} /> Banjara Hills</span>
                <span className="font-bold text-[#173F35] ml-auto">₹650 est.</span>
              </div>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DEMAND BY AREA ─────────────────────────── */}
      {demandZones.length > 0 && (
        <div className="mx-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-base font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.02em' }}>Demand by Area</p>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(23,63,53,0.08)', color: '#173F35' }}>
              Live
            </span>
          </div>
          <motion.div variants={container} initial="initial" animate="animate" className="space-y-2">
            {demandZones.map((zone, i) => (
              <DemandTile key={zone.area} zone={zone} index={i} />
            ))}
          </motion.div>
        </div>
      )}

      {/* Today's schedule */}
      <div className="mx-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.02em' }}>Today's Schedule</p>
          <button onClick={() => navigate('/worker/jobs')} className="text-xs font-semibold text-[#C86F52]">View All →</button>
        </div>
        <motion.div variants={container} initial="initial" animate="animate" className="space-y-3">
          {jobs.length > 0 ? (
            jobs.map((job, i) => (
              <JobTile key={job.id} job={job} index={i} />
            ))
          ) : (
            <div className="text-center py-8 text-[#A8B9A5] text-sm">No jobs scheduled yet</div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatTile({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string; color: string; sub?: string }) {
  return (
    <motion.div variants={item} className="rounded-[20px] p-4" style={{
      background: 'white',
      border: '1.5px solid rgba(23,63,53,0.07)',
      boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
    }}>
      <div className="w-9 h-9 rounded-[12px] flex items-center justify-center mb-3" style={{ background: color + '14', color }}>
        {icon}
      </div>
      <p className="text-[20px] font-extrabold text-[#173F35] leading-none" style={{ letterSpacing: '-0.03em' }}>{value}</p>
      <p className="text-[11px] text-[#7A8B7E] font-medium mt-1">{label}{sub && <span className="text-[10px] text-[#A8B9A5] ml-1">{sub}</span>}</p>
    </motion.div>
  );
}

function DemandTile({ zone, index }: { zone: { area: string; level: 'high' | 'medium' | 'low'; demandScore: number }; index: number }) {
  const levelColors: Record<string, { bg: string; text: string; bar: string }> = {
    high:   { bg: 'rgba(200,111,82,0.12)', text: '#B55E42', bar: '#C86F52' },
    medium: { bg: 'rgba(23,63,53,0.08)',   text: '#173F35', bar: '#173F35' },
    low:    { bg: 'rgba(168,185,165,0.15)', text: '#5A6B5E', bar: '#A8B9A5' },
  };
  const lc = levelColors[zone.level];
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="w-full text-left rounded-[16px] p-3.5"
      style={{
        background: 'white',
        border: '1.5px solid rgba(23,63,53,0.07)',
        boxShadow: '0 2px 8px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <IconMapPin size={14} className="text-[#7A8B7E]" />
          <span className="text-sm font-bold text-[#173F35]">{zone.area}</span>
        </div>
        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full" style={{ background: lc.bg, color: lc.text }}>
          {zone.level.toUpperCase()}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(23,63,53,0.06)' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${zone.demandScore}%` }}
            transition={{ delay: index * 0.05 + 0.2, duration: 0.8, ease: 'easeOut' }}
            className="h-2 rounded-full"
            style={{ background: lc.bar, minWidth: zone.demandScore > 0 ? '4px' : '0' }}
          />
        </div>
        <span className="text-xs font-extrabold text-[#173F35] tabular-nums">{zone.demandScore}%</span>
      </div>
    </motion.div>
  );
}

function JobTile({ job, index }: { job: any; index: number }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    on_the_way:   { bg: 'rgba(23,63,53,0.10)', text: '#173F35' },
    assigned:     { bg: 'rgba(23,63,53,0.10)', text: '#173F35' },
    requested:    { bg: 'rgba(200,111,82,0.12)', text: '#B55E42' },
    in_progress:  { bg: 'rgba(200,111,82,0.12)', text: '#C86F52' },
    completed:    { bg: 'rgba(168,185,165,0.20)', text: '#4A6A42' },
  };
  const sc = statusColors[job.status] || statusColors.requested;
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/worker/jobs')}
      className="w-full text-left rounded-[20px] p-4 cursor-pointer"
      style={{
        background: 'white',
        border: '1.5px solid rgba(23,63,53,0.07)',
        boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: '#F5F0E7', color: '#173F35' }}>
            <IconClock size={13} />
          </div>
          <span className="text-xs font-mono text-[#7A8B7E] font-medium">{job.time}</span>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.text }}>
          {job.status.replace(/_/g, ' ')}
        </span>
      </div>
      <p className="font-bold text-sm text-[#173F35] capitalize">{job.serviceType?.replace(/_/g, ' ')}</p>
      <div className="flex items-center gap-3 mt-2 text-xs text-[#7A8B7E]">
        <span className="flex items-center gap-1"><IconMapPin size={11} /> {job.addressId === 'a1' ? 'Banjara Hills' : job.addressId === 'a2' ? 'HITEC City' : 'Jubilee Hills'}</span>
        <span className="font-extrabold text-[#173F35] ml-auto text-sm">₹{job.estimatedPrice?.toLocaleString()}</span>
      </div>
    </motion.div>
  );
}
