import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { IconBell, IconClock, IconMapPin, IconTrendingUp, IconCheckCircle, IconWallet, IconBriefcase, IconStar, IconUser, IconCalendarDays } from '../../components/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const container = { animate: { transition: { staggerChildren: 0.07 } } };
const item = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { type: 'spring', damping: 18, stiffness: 200 } } };

export default function WorkerHome() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [todayEarnings, setTodayEarnings] = useState(0);
  const [weekEarnings, setWeekEarnings] = useState(0);
  const [monthEarnings, setMonthEarnings] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [greeting, setGreeting] = useState('');
  const [chartData, setChartData] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening');

    async function load() {
      if (!user) return;
      const allBookings = await db.bookings.where('workerId').equals(user.id).toArray();
      const completed = allBookings.filter((b: any) => ['completed', 'paid', 'reviewed'].includes(b.status));
      const pending = allBookings.filter((b: any) => b.status === 'requested').length;
      setPendingRequests(pending);

      // Mock realistic earnings data
      const mockToday = 1850;
      const mockWeek = 12850;
      const mockMonth = 48600;
      setTodayEarnings(mockToday);
      setWeekEarnings(mockWeek);
      setMonthEarnings(mockMonth);

      // Weekly chart data
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const weekMockData = [
        { name: 'Mon', earnings: 2100 },
        { name: 'Tue', earnings: 1800 },
        { name: 'Wed', earnings: 2400 },
        { name: 'Thu', earnings: 1600 },
        { name: 'Fri', earnings: 2200 },
        { name: 'Sat', earnings: 2750 },
        { name: 'Sun', earnings: mockToday },
      ];
      setChartData(weekMockData);

      const activeJobs = allBookings
        .filter((b: any) => !['requested', 'completed', 'paid', 'reviewed'].includes(b.status))
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="min-h-screen bg-[#FBF9F4] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/95 backdrop-blur-xl px-5 pt-4 pb-3 border-b border-[rgba(23,63,53,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-[#5A6B5E] font-medium">{greeting}, {user?.name?.split(' ')[0]}</p>
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

        {/* Earnings Overview — Today, Week, Month */}
        <motion.div className="grid grid-cols-3 gap-2.5" variants={container} initial="initial" animate="animate">
          <EarningTile label="Today" value={`₹${todayEarnings.toLocaleString()}`} icon={<IconWallet size={14} />} color="#173F35" />
          <EarningTile label="This Week" value={`₹${weekEarnings.toLocaleString()}`} icon={<IconCalendarDays size={14} />} color="#C86F52" />
          <EarningTile label="This Month" value={`₹${monthEarnings.toLocaleString()}`} icon={<IconTrendingUp size={14} />} color="#173F35" />
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

      {/* Weekly Earnings Chart */}
      <div className="mx-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-base font-extrabold text-[#173F35]" style={{ letterSpacing: '-0.02em' }}>Weekly Earnings</p>
          <button onClick={() => navigate('/worker/earnings')} className="text-xs font-semibold text-[#C86F52]">Details →</button>
        </div>
        <motion.div
          variants={item} initial="initial" animate="animate"
          className="bg-white rounded-[20px] p-4 border border-[rgba(23,63,53,0.07)]"
          style={{ boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)' }}
        >
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DB" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#7A8B7E' }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#173F35', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '11px' }}
                formatter={(value: number) => [`₹${value}`, 'Earnings']}
              />
              <Line type="monotone" dataKey="earnings" stroke="#173F35" strokeWidth={2} dot={{ fill: '#173F35', r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <div className="mx-5 mt-5 grid grid-cols-2 gap-3">
        <StatTile icon={<IconCheckCircle size={15} />} label="Total Jobs" value="128" sub="completed" color="#173F35" />
        <StatTile icon={<IconStar size={15} />} label="Rating" value="4.8" sub="/ 5.0" color="#C86F52" />
      </div>

      {/* Today's Schedule */}
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
            <div className="text-center py-8 text-[#A8B9A5] text-sm flex flex-col items-center gap-2">
              <IconBriefcase size={24} className="text-[#D4CFC4]" />
              No jobs scheduled yet
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

function EarningTile({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <motion.div variants={item} className="rounded-[16px] p-3" style={{
      background: 'white',
      border: '1.5px solid rgba(23,63,53,0.07)',
      boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
    }}>
      <div className="w-7 h-7 rounded-[10px] flex items-center justify-center mb-2" style={{ background: color + '14', color }}>
        {icon}
      </div>
      <p className="text-sm font-extrabold text-[#173F35] leading-none" style={{ letterSpacing: '-0.02em' }}>{value}</p>
      <p className="text-[10px] text-[#7A8B7E] font-medium mt-1">{label}</p>
    </motion.div>
  );
}

function StatTile({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub?: string; color: string }) {
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
      <p className="text-[11px] text-[#7A8B7E] font-medium mt-1">{label}</p>
      {sub && <p className="text-[10px] text-[#A8B9A5] mt-0.5">{sub}</p>}
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
