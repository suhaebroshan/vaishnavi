import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../../db/seed';
import { motion } from 'framer-motion';
import { IconArrowLeft as IconBack, IconSearch } from '../../components/icons';
import { useState } from 'react';

export default function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const filtered = SERVICES.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <IconBack size={20} className="text-[#173F35]" />
        </button>
        <div className="flex-1 relative">
          <IconSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A8B9A5]" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search services..."
            autoFocus
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white border border-[rgba(23,63,53,0.1)] text-sm text-[#173F35] placeholder:text-[#A8B9A5] focus:outline-none focus:ring-2 focus:ring-[#173F35]/30"
          />
        </div>
      </div>

      <div className="px-5">
        <p className="text-xs font-semibold text-[#7A8B7E] uppercase tracking-wider mb-3">All Services</p>
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((svc, i) => (
            <motion.button
              key={svc.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/service/${svc.id}`)}
              className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 text-left hover:border-[#173F35]/30 transition-colors"
            >
              <div className="text-3xl mb-2">{svc.icon}</div>
              <p className="font-semibold text-sm text-[#173F35]">{svc.name}</p>
              <p className="text-xs text-[#7A8B7E] mt-1 line-clamp-2">{svc.description}</p>
              <p className="text-xs text-[#C86F52] font-medium mt-2">From ₹{svc.options[0]?.priceRange[0]}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
