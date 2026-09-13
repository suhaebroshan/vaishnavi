import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { IconClipboard as IconClipboardList, IconUsers, IconTrendingUp, IconHelpCircle as IconAlertCircle, IconMap, IconClipboard, IconWallet, IconLayout } from '../../components/icons';

const container = { animate: { transition: { staggerChildren: 0.07 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 18, stiffness: 200 } } };

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ bookings: 0, workers: 0, revenue: 0, pending: 0, onlineWorkers: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const allBookings = await db.bookings.toArray();
      const workers = await db.workers.toArray();
      const pending = allBookings.filter((b: any) => b.status === 'requested').length;
      const onlineWorkers = workers.filter((w: any) => w.status === 'online').length;
      const totalRevenue = allBookings.reduce((sum: number, b: any) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);

      setStats({
        bookings: allBookings.length,
        workers: workers.length,
        revenue: totalRevenue,
        pending,
        onlineWorkers,
      });

      const sorted = [...allBookings].sort((a: any, b: any) => b.createdAt - a.createdAt).slice(0, 6);
      const enriched = await Promise.all(sorted.map(async (b: any) => {
        const w = await db.workers.get(b.workerId);
        const c = await db.customers.get(b.customerId);
        return { ...b, worker: w, customer: c };
      }));
      setRecentBookings(enriched);
    }
    load();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[var(--va-cream-light)] pb-28">
      {/* Header */}
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(23,63,53,0.06)' }}>
        <motion.p variants={item} initial="initial" animate="animate" className="text-xs font-bold tracking-widest text-[var(--va-text-faint)] uppercase mb-1">Operations Center</motion.p>
        <motion.h1 variants={item} initial="initial" animate="animate" className="text-xl font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.03em' }}>Good morning, Santosh 👋</motion.h1>
        <motion.p variants={item} initial="initial" animate="animate" className="text-sm text-[var(--va-text-muted)] mt-0.5">Real-time overview of Vaishnavi operations</motion.p>
      </div>

      {/* Stats grid */}
      <motion.div className="px-5 mt-5 grid grid-cols-2 gap-3" variants={container} initial="initial" animate="animate">
        <StatCard label="Active Bookings" value={String(stats.bookings)} sub="across all roles" icon={<IconClipboardList size={18} />} color="#173F35" />
        <StatCard label="Workers Online" value={String(stats.onlineWorkers)} sub={`of ${stats.workers} total`} icon={<IconUsers size={18} />} color="#C86F52" />
        <StatCard label="Today's Revenue" value={`₹${stats.revenue.toLocaleString()}`} sub="cumulative" icon={<IconTrendingUp size={18} />} color="#173F35" />
        <StatCard label="Pending" value={String(stats.pending)} sub="awaiting assignment" icon={<IconAlertCircle size={18} />} color="#C86F52" />
      </motion.div>

      {/* Quick actions */}
      <motion.div className="px-5 mt-5 grid grid-cols-2 gap-3" variants={container} initial="initial" animate="animate">
        <QuickAction label="Live Map" icon={<IconMap size={20} />} onPress={() => navigate('/admin/map')} />
        <QuickAction label="All Bookings" icon={<IconClipboard size={20} />} onPress={() => navigate('/admin/bookings')} />
        <QuickAction label="Workers" icon={<IconUsers size={20} />} onPress={() => navigate('/admin/workers')} />
        <QuickAction label="Revenue" icon={<IconWallet size={20} />} onPress={() => navigate('/admin/revenue')} />
      </motion.div>

      {/* Recent activity */}
      <div className="mx-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.02em' }}>Live Bookings</p>
          <button onClick={() => navigate('/admin/bookings')} className="text-xs font-semibold text-[var(--va-terracotta)]">View All →</button>
        </div>
        <motion.div variants={container} initial="initial" animate="animate" className="space-y-2">
          {recentBookings.map((b, i) => (
            <BookingRow key={b.id} booking={b} index={i} />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, sub, icon, color }: { label: string; value: string; sub?: string; icon: React.ReactNode; color: string }) {
  return (
    <motion.div variants={item} className="rounded-[20px] p-4" style={{
      background: 'white',
      border: '1.5px solid rgba(23,63,53,0.07)',
      boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
    }}>
      <div className="w-9 h-9 rounded-[12px] flex items-center justify-center mb-3" style={{ background: color + '14', color }}>
        {icon}
      </div>
      <p className="text-[22px] font-extrabold text-[#173F35] leading-none" style={{ letterSpacing: '-0.03em' }}>{value}</p>
      <p className="text-[11px] text-[var(--va-text-muted)] font-medium mt-1">{label}</p>
      {sub && <p className="text-[10px] text-[var(--va-text-faint)] mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function QuickAction({ label, icon, onPress }: { label: string; icon: React.ReactNode; onPress: () => void }) {
  return (
    <motion.button
      variants={item}
      whileTap={{ scale: 0.96, y: 2 }}
      onClick={onPress}
      className="rounded-[20px] p-4 text-left"
      style={{
        background: 'white',
        border: '1.5px solid rgba(23,63,53,0.07)',
        boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="w-10 h-10 rounded-[14px] flex items-center justify-center mb-3" style={{ background: 'rgba(23,63,53,0.07)', color: '#173F35' }}>
        {icon}
      </div>
      <p className="font-bold text-sm text-[#173F35]">{label}</p>
    </motion.button>
  );
}

function BookingRow({ booking, index }: { booking: any; index: number }) {
  const navigate = useNavigate();
  const statusColors: Record<string, { bg: string; text: string }> = {
    requested:     { bg: 'rgba(200,111,82,0.12)', text: '#B55E42' },
    assigned:      { bg: 'rgba(23,63,53,0.10)', text: '#173F35' },
    on_the_way:    { bg: 'rgba(23,63,53,0.10)', text: '#173F35' },
    in_progress:   { bg: 'rgba(200,111,82,0.12)', text: '#C86F52' },
    completed:     { bg: 'rgba(168,185,165,0.20)', text: '#4A6A42' },
    paid:          { bg: 'rgba(23,63,53,0.10)', text: '#173F35' },
  };
  const sc = statusColors[booking.status] || statusColors.completed;
  const serviceIcons: Record<string, string> = {
    plumbing: '🔧', housekeeping: '🧹', cooking: '👩🍳', electrical: '⚡',
    security: '🛡️', elder_care: '❤️', caretaker: '🏠', home_support: '✨',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -1 }}
      onClick={() => navigate('/admin/bookings')}
      className="w-full text-left rounded-[16px] p-3.5 cursor-pointer"
      style={{
        background: 'white',
        border: '1.5px solid rgba(23,63,53,0.07)',
        boxShadow: '0 2px 8px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-[12px] flex items-center justify-center text-lg shrink-0" style={{ background: 'var(--va-cream)' }}>
          {serviceIcons[booking.serviceType] || '🏠'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-[#173F35] capitalize">{booking.serviceType?.replace(/_/g, ' ')}</p>
          <p className="text-[11px] text-[var(--va-text-muted)] truncate">{booking.customer?.name} → {booking.worker?.name}</p>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0" style={{ background: sc.bg, color: sc.text }}>
          {booking.status.replace(/_/g, ' ')}
        </span>
        <span className="font-bold text-sm text-[#173F35] shrink-0">₹{booking.estimatedPrice}</span>
      </div>
    </motion.div>
  );
}
