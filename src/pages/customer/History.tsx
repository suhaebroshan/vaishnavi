import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ServiceIcon, StarRating } from '../../components/icons';
import { IconCalendar, IconMapPin, IconClock } from '../../components/icons';

// Mock data for customer history
const MOCK_HISTORY = [
  { id: 'h1', serviceType: 'plumbing', date: '2026-09-10', time: '10:00 AM', price: 750, rating: 5, worker: 'Mahesh Rao', status: 'completed', address: 'Banjara Hills, H no 8-2-345' },
  { id: 'h2', serviceType: 'housekeeping', date: '2026-09-08', time: '02:00 PM', price: 1200, rating: 4, worker: 'Priya Sharma', status: 'completed', address: 'Banjara Hills, H no 8-2-345' },
  { id: 'h3', serviceType: 'cooking', date: '2026-09-05', time: '06:00 PM', price: 600, rating: 5, worker: 'Anjali Devi', status: 'completed', address: 'Banjara Hills, H no 8-2-345' },
  { id: 'h4', serviceType: 'electrical', date: '2026-09-02', time: '11:00 AM', price: 950, rating: 4, worker: 'Ravi Kumar', status: 'completed', address: 'Banjara Hills, H no 8-2-345' },
  { id: 'h5', serviceType: 'elder_care', date: '2026-08-28', time: '09:00 AM', price: 1500, rating: 5, worker: 'Sunita Reddy', status: 'completed', address: 'Banjara Hills, H no 8-2-345' },
  { id: 'h6', serviceType: 'security', date: '2026-08-20', time: '06:00 PM', price: 2000, rating: 5, worker: 'Venkat Rao', status: 'completed', address: 'Banjara Hills, H no 8-2-345' },
];

type Tab = 'all' | 'completed' | 'cancelled';

export default function CustomerHistory() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('all');

  const filtered = MOCK_HISTORY.filter(h => {
    if (tab === 'completed') return h.status === 'completed';
    if (tab === 'cancelled') return false;
    return true;
  });

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
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-1 rounded-full hover:bg-[#F5F0E7] active:scale-95 transition-transform">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <div>
            <h1 className="font-extrabold text-[#173F35] text-lg" style={{ letterSpacing: '-0.02em' }}>Work History</h1>
            <p className="text-xs text-[#7A8B7E] mt-0.5">{MOCK_HISTORY.filter(h => h.status === 'completed').length} services completed</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['all', 'completed'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tab === t ? 'bg-[#173F35] text-white' : 'bg-white text-[#7A8B7E] hover:bg-[#F5F0E7]'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stats */}
      <div className="mx-5 mt-4 grid grid-cols-3 gap-3">
        <HistoryStat label="Total Spent" value="₹24,750" />
        <HistoryStat label="Services" value="24" sub="completed" />
        <HistoryStat label="Avg Rating" value="4.8" sub="/ 5.0" accent />
      </div>

      {/* History list */}
      <div className="mx-5 mt-5 space-y-3">
        {filtered.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[20px] p-4 border border-[rgba(23,63,53,0.07)]"
            style={{ boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)' }}
          >
            <div className="flex items-center gap-3">
              {/* Service icon */}
              <div
                className="w-12 h-12 rounded-[16px] flex items-center justify-center shrink-0"
                style={{ background: entry.serviceType === 'plumbing' ? 'rgba(23,63,53,0.08)' : entry.serviceType === 'cooking' ? 'rgba(200,111,82,0.10)' : entry.serviceType === 'housekeeping' ? 'rgba(23,63,53,0.08)' : 'rgba(168,185,165,0.15)' }}
              >
                <ServiceIcon serviceId={entry.serviceType} size={22} color="#173F35" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-[#173F35] capitalize">{entry.serviceType.replace(/_/g, ' ')}</p>
                  <span className="text-xs font-bold text-[#C86F52]">₹{entry.price.toLocaleString()}</span>
                </div>
                <p className="text-xs text-[#7A8B7E] mt-0.5">{entry.worker}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-[#7A8B7E]">
                  <span className="flex items-center gap-1"><IconCalendar size={11} /> {entry.date}</span>
                  <span className="flex items-center gap-1"><IconClock size={11} /> {entry.time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(23,63,53,0.06)]">
              <div className="flex items-center gap-1.5">
                <IconMapPin size={11} className="text-[#A8B9A5]" />
                <span className="text-[10px] text-[#A8B9A5]">{entry.address}</span>
              </div>
              <div className="flex items-center gap-1">
                <StarRating rating={entry.rating} size={12} />
                <span className="text-[10px] font-semibold text-[#173F35] ml-1">{entry.rating}.0</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom spacer for nav */}
      <div className="h-8" />
    </motion.div>
  );
}

function HistoryStat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) {
  return (
    <div className={`rounded-[18px] p-3.5 text-center ${accent ? '' : ''}`} style={{
      background: accent ? 'linear-gradient(145deg, #173F35 0%, #102F28 100%)' : 'white',
      border: accent ? 'none' : '1.5px solid rgba(23,63,53,0.07)',
      boxShadow: accent ? '0 4px 14px rgba(23,63,53,0.20)' : '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
    }}>
      <p className={`text-xs font-medium ${accent ? 'text-[#A8B9A5]' : 'text-[#7A8B7E]'}`}>{label}</p>
      <p className={`text-lg font-extrabold mt-0.5 ${accent ? 'text-white' : 'text-[#173F35]'}`} style={{ letterSpacing: '-0.02em' }}>{value}</p>
      {sub && <p className={`text-[10px] ${accent ? 'text-[#A8B9A5]' : 'text-[#A8B9A5]'}`}>{sub}</p>}
    </div>
  );
}
