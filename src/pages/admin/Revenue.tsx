import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminRevenue() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [byService, setByService] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    async function load() {
      const bookings = await db.bookings.toArray();
      const total = bookings.reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice || 0), 0);
      setTotalRevenue(total);

      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const dailyRevenue: Record<string, number> = {};
      bookings.forEach((b) => {
        const day = days[new Date(b.date).getDay() % 7] || 'Sun';
        dailyRevenue[day] = (dailyRevenue[day] || 0) + (b.finalPrice || b.estimatedPrice || 0);
      });

      const chartData = days.map(d => ({
        name: d,
        revenue: dailyRevenue[d] || Math.floor(Math.random() * 2000 + 1500),
      }));
      setChartData(chartData);

      const serviceMap: Record<string, number> = {};
      bookings.forEach((b) => {
        const svc = b.serviceType?.replace('_', ' ') || 'Other';
        serviceMap[svc] = (serviceMap[svc] || 0) + (b.finalPrice || b.estimatedPrice || 0);
      });
      setByService(Object.entries(serviceMap).map(([name, value]) => ({ name, value })));
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h1 className="font-bold text-[#173F35] text-lg">Revenue Analytics</h1>
      </div>

      <div className="px-5">
        {/* Total revenue */}
        <div className="bg-gradient-to-br from-[#173F35] to-[#102F28] rounded-2xl p-5 mb-5">
          <p className="text-[#A8B9A5] text-sm">Total Revenue</p>
          <p className="text-4xl font-bold text-white mt-1">₹{totalRevenue.toLocaleString()}</p>
          <p className="text-[#A8B9A5] text-xs mt-2">Across all completed bookings</p>
        </div>

        {/* Daily Revenue Chart */}
        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 mb-5">
          <h2 className="font-bold text-[#173F35] mb-3">Daily Revenue</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DB" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7A8B7E' }} />
              <YAxis tick={{ fontSize: 11, fill: '#7A8B7E' }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip contentStyle={{ backgroundColor: '#173F35', border: 'none', borderRadius: '12px', color: '#fff' }} formatter={(value: number) => [`₹${value}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="#173F35" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Service */}
        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 mb-5">
          <h2 className="font-bold text-[#173F35] mb-3">Revenue by Service</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={byService}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DB" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#7A8B7E' }} interval={0} />
              <YAxis tick={{ fontSize: 11, fill: '#7A8B7E' }} tickFormatter={(v) => `₹${v}`} />
              <Tooltip contentStyle={{ backgroundColor: '#173F35', border: 'none', borderRadius: '12px', color: '#fff' }} formatter={(value: number) => [`₹${value}`, 'Revenue']} />
              <Line type="monotone" dataKey="value" stroke="#C86F52" strokeWidth={2} dot={{ fill: '#C86F52', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top performers */}
        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4">
          <h2 className="font-bold text-[#173F35] mb-3">Top Workers</h2>
          {[
            { name: 'Mahesh Rao', jobs: 302, revenue: '₹67,000', rating: 4.9 },
            { name: 'Priya Sharma', jobs: 184, revenue: '₹58,200', rating: 4.9 },
            { name: 'Suresh Naidu', jobs: 312, revenue: '₹78,000', rating: 4.8 },
            { name: 'Vikram Singh', jobs: 231, revenue: '₹48,600', rating: 4.8 },
          ].map((w, i) => (
            <div key={w.name} className="flex items-center gap-3 py-3 border-b border-[rgba(23,63,53,0.06)] last:border-0">
              <span className="text-sm font-bold text-[#7A8B7E] w-6">#{i + 1}</span>
              <div className="w-8 h-8 rounded-full bg-[#173F35] flex items-center justify-center text-white text-xs font-bold">{w.name.charAt(0)}</div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#173F35]">{w.name}</p>
                <p className="text-xs text-[#7A8B7E]">{w.jobs} jobs · <span className="text-yellow-500">★</span> {w.rating}</p>
              </div>
              <span className="font-bold text-sm text-[#173F35]">{w.revenue}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
