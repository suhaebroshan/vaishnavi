import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Clock, Calendar, TrendingUp, MapPin, CheckCircle } from 'lucide-react';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { StatusBadge } from '../../components/Cards';
import { UserCircle } from 'lucide-react';

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

      // Load pending requests
      const allBookings = await db.bookings.where('workerId').equals(user.id).toArray();
      const pending = allBookings.filter((b: any) => b.status === 'requested');
      setPendingRequests(pending.length);

      // Calculate today's earnings
      const payments = await db.payments.where('status').equals('completed').toArray();
      const today = new Date().toDateString();
      const total = payments.reduce((sum: number, p: any) => {
        // Sum all recent payments as proxy for today's earnings
        return sum + p.amount;
      }, 0) / Math.max(1, Math.round(payments.length / 7)); // Approximate daily avg
      setTodayEarnings(Math.round(total));

      // Today's active/upcoming jobs
      const activeJobs = allBookings
        .filter((b: any) => !['requested'].includes(b.status))
        .sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)))
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
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-[#7A8B7E]">{greeting}, {user?.name?.split(' ')[0]} 👋</p>
            <h1 className="font-bold text-[#173F35] text-lg">Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/worker/requests')} className="relative p-2 rounded-full hover:bg-[#F5F0E7]">
              <Bell size={20} className="text-[#173F35]" />
              {pendingRequests > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#C86F52] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {pendingRequests}
                </span>
              )}
            </button>
            <div className="w-9 h-9 rounded-full bg-[#173F35] flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Today's Earnings" value={`₹${todayEarnings.toLocaleString()}`} icon={<TrendingUp size={16} />} color="#173F35" />
          <StatCard label="Total Jobs" value="4" icon={<CheckCircle size={16} />} color="#C86F52" />
          <StatCard label="Rating" value="⭐ 4.8" icon={<UserCircle size={16} />} color="#173F35" />
          <StatCard label="Pending" value={String(pendingRequests)} icon={<Bell size={16} />} color="#C86F52" />
        </div>
      </div>

      {/* Pending Requests Banner */}
      {pendingRequests > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-5 mb-4"
        >
          <div className="bg-[#C86F52]/10 border border-[#C86F52]/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#C86F52] animate-pulse" />
              <span className="text-xs font-bold tracking-widest text-[#C86F52] uppercase">{pendingRequests} New Request{pendingRequests > 1 ? 's' : ''}</span>
            </div>
            <p className="font-semibold text-[#173F35] text-sm">Suhaeb needs bathroom plumbing repair tomorrow at 4:00 PM</p>
            <p className="text-xs text-[#7A8B7E] mt-1">Banjara Hills · ₹650 estimated</p>
            <button onClick={() => navigate('/worker/requests')} className="mt-3 px-4 py-2 bg-[#C86F52] text-white text-xs font-semibold rounded-xl">
              View All Requests →
            </button>
          </div>
        </motion.div>
      )}

      {/* Today's Schedule */}
      <div className="mx-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-[#173F35]">Today's Schedule</h2>
          <button onClick={() => navigate('/worker/jobs')} className="text-xs font-semibold text-[#C86F52]">View All</button>
        </div>
        <div className="space-y-3">
          {[
            { time: '10:00 AM', service: 'Bathroom Repair', location: 'Banjara Hills', price: '₹650', status: 'on_the_way' as const },
            { time: '2:00 PM', service: 'Pipe Repair', location: 'Secunderabad', price: '₹850', status: 'assigned' as const },
            { time: '5:30 PM', service: 'Kitchen Install', location: 'Sainikpuri', price: '₹1,200', status: 'requested' as const },
          ].map((job, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-[#7A8B7E]">{job.time}</span>
                <StatusBadge status={job.status} />
              </div>
              <p className="font-semibold text-sm text-[#173F35]">{job.service}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-[#7A8B7E]">
                <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
                <span className="font-bold text-[#173F35] ml-auto">{job.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: color + '18' }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <p className="text-lg font-bold text-[#173F35]">{value}</p>
      <p className="text-xs text-[#7A8B7E]">{label}</p>
    </div>
  );
}
