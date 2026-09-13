import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, Users, ClipboardList, TrendingUp, AlertCircle } from 'lucide-react';
import { db } from '../../db/database';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ bookings: 0, workers: 0, revenue: 0, pending: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const allBookings = await db.bookings.toArray();
      const pending = allBookings.filter((b: any) => b.status === 'requested').length;
      const totalRevenue = allBookings.reduce((sum: number, b: any) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);

      setStats({
        bookings: allBookings.length,
        workers: await db.workers.count(),
        revenue: totalRevenue,
        pending,
      });

      const sorted = [...allBookings].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
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
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-xl font-bold text-[#173F35] mb-1">Operations Dashboard</h1>
        <p className="text-sm text-[#7A8B7E]">Real-time overview of Vaishnavi operations</p>
      </div>

      {/* Stats grid */}
      <div className="px-5 mb-5 grid grid-cols-2 gap-3">
        <StatCard label="Total Bookings" value={String(stats.bookings)} icon={<ClipboardList size={18} />} color="#173F35" />
        <StatCard label="Workers" value={String(stats.workers)} icon={<Users size={18} />} color="#C86F52" />
        <StatCard label="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<TrendingUp size={18} />} color="#173F35" />
        <StatCard label="Pending" value={String(stats.pending)} icon={<AlertCircle size={18} />} color="#C86F52" />
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-5 grid grid-cols-2 gap-3">
        <QuickAction label="Live Map" icon="🗺️" onPress={() => navigate('/admin/map')} />
        <QuickAction label="All Bookings" icon="📋" onPress={() => navigate('/admin/bookings')} />
        <QuickAction label="Workers" icon="👷" onPress={() => navigate('/admin/workers')} />
        <QuickAction label="Revenue" icon="💰" onPress={() => navigate('/admin/revenue')} />
      </div>

      {/* Recent Activity */}
      <div className="mx-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-[#173F35]">Recent Bookings</h2>
          <button onClick={() => navigate('/admin/bookings')} className="text-xs font-semibold text-[#C86F52]">View All</button>
        </div>
        <div className="space-y-2">
          {recentBookings.map((b) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F5F0E7] flex items-center justify-center text-sm shrink-0">
                {['plumbing', 'housekeeping', 'cooking', 'electrical'].find(s => b.serviceType?.includes(s)) ?
                  ['🔧', '🧹', '👩‍🍳', '⚡'][[['plumbing', 'housekeeping', 'cooking', 'electrical']].indexOf([b.serviceType || ''])] : '🏠'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-[#173F35] capitalize">{b.serviceType?.replace(/_/g, ' ')}</p>
                <p className="text-xs text-[#7A8B7E] truncate">{b.customer?.name} → {b.worker?.name}</p>
              </div>
              <span className="text-xs font-medium text-[#7A8B7E]">₹{b.estimatedPrice}</span>
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
      <p className="text-xl font-bold text-[#173F35]">{value}</p>
      <p className="text-xs text-[#7A8B7E]">{label}</p>
    </div>
  );
}

function QuickAction({ label, icon, onPress }: { label: string; icon: string; onPress: () => void }) {
  return (
    <motion.button whileTap={{ scale: 0.96 }} onClick={onPress} className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 text-left">
      <span className="text-2xl">{icon}</span>
      <p className="font-semibold text-sm text-[#173F35] mt-2">{label}</p>
    </motion.button>
  );
}
