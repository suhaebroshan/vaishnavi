import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { Star, Wifi, WifiOff, Briefcase } from 'lucide-react';
import { StatusBadge } from '../../components/Cards';

export default function AdminWorkers() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const data = await db.workers.toArray();
      setWorkers(data);
    }
    load();
  }, []);

  const filtered = workers.filter(w => w.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h1 className="font-bold text-[#173F35] text-lg">Workers</h1>
        <span className="ml-auto text-xs text-[#7A8B7E]">{filtered.length} registered</span>
      </div>

      <div className="px-5 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-2xl bg-white border border-[rgba(23,63,53,0.1)] text-sm text-[#173F35] placeholder:text-[#A8B9A5] focus:outline-none focus:ring-2 focus:ring-[#173F35]/30"
        />
      </div>

      <div className="px-5 space-y-3">
        {filtered.map((worker, i) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#173F35] flex items-center justify-center text-white font-bold text-lg">
                {worker.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-[#173F35]">{worker.name}</p>
                  {worker.status === 'online' ? (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><Wifi size={12} /> Online</span>
                  ) : worker.status === 'busy' ? (
                    <span className="text-xs text-[#C86F52] font-medium">Busy</span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-[#A8B9A5]"><WifiOff size={12} /> Offline</span>
                  )}
                </div>
                <p className="text-xs text-[#7A8B7E] capitalize">{worker.serviceType.replace('_', ' ')} Professional</p>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-[#C86F52] fill-[#C86F52]" />
                <span className="text-sm font-bold text-[#173F35]">{worker.rating}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#F5F0E7] rounded-xl py-2">
                <p className="font-bold text-[#173F35]">{worker.totalJobs}</p>
                <p className="text-[#7A8B7E]">Jobs</p>
              </div>
              <div className="bg-[#F5F0E7] rounded-xl py-2">
                <p className="font-bold text-[#173F35]">{worker.completionRate}%</p>
                <p className="text-[#7A8B7E]">Completion</p>
              </div>
              <div className="bg-[#F5F0E7] rounded-xl py-2">
                <p className="font-bold text-[#173F35]">₹{worker.todayEarnings}</p>
                <p className="text-[#7A8B7E]">Today</p>
              </div>
            </div>
            <p className="text-xs text-[#7A8B7E] mt-2">📍 {worker.location}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
