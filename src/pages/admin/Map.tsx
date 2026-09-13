import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../../db/database';
import { IconPhone, IconChat } from '../../components/icons';

export default function AdminMap() {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<any[]>([]);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const w = await db.workers.toArray();
      const active = await db.bookings.where('status').notEqual('requested').toArray();
      setWorkers(w.filter((w: any) => w.status !== 'offline'));
      setActiveBookings(active.slice(0, 8));
    }
    load();
  }, []);

  return (
    <div className="relative h-screen bg-[#E8E4DB] overflow-hidden">
      <SimulatedMapScreen workers={workers} activeBookings={activeBookings} selectedWorker={selectedWorker} onSelectWorker={setSelectedWorker} />

      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-[#173F35] text-base">Live Map</h1>
            <p className="text-xs text-[#7A8B7E]">{workers.length} professionals online · {activeBookings.length} active jobs</p>
          </div>
          <button onClick={() => navigate('/admin/dashboard')} className="px-4 py-2 rounded-full bg-[#173F35] text-white text-xs font-semibold">
            Back
          </button>
        </div>
      </div>

      {selectedWorker && (
        <WorkerDetailPanel
          worker={workers.find(w => w.id === selectedWorker)}
          onClose={() => setSelectedWorker(null)}
        />
      )}

      <div className="absolute bottom-6 left-4 z-10 flex gap-3">
        <LegendItem color="#173F35" label="Online" />
        <LegendItem color="#C86F52" label="Active Job" />
        <LegendItem color="#A8B9A5" label="Offline" />
      </div>
    </div>
  );
}

function SimulatedMapScreen({
  workers,
  activeBookings,
  selectedWorker,
  onSelectWorker,
}: {
  workers: any[];
  activeBookings: any[];
  selectedWorker: string | null;
  onSelectWorker: (id: string) => void;
}) {
  return (
    <svg viewBox="0 0 400 844" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="844" fill="#E8E4DB" />

      {/* Roads */}
      {[150, 300, 450, 600, 750].map(y => (
        <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#D4CFC4" strokeWidth="16" />
      ))}
      {[100, 200, 300].map(x => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="844" stroke="#D4CFC4" strokeWidth="12" />
      ))}

      {/* Buildings */}
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={`b${i}`}
          x={20 + (i % 5) * 80}
          y={30 + Math.floor(i / 5) * 160}
          width="60" height="120" rx="4"
          fill="#DDD8CE" opacity="0.7"
        />
      ))}

      {/* Parks */}
      {[120, 420, 700].map(y => (
        <rect key={`p${y}`} x="50" y={y} width="100" height="80" rx="8" fill="#A8B9A5" opacity="0.3" />
      ))}

      {/* Active job markers */}
      {activeBookings.map((b, i) => (
        <circle key={`aj${i}`} cx={120 + i * 40} cy={200 + i * 60} r="5" fill="#C86F52">
          <animate attributeName="r" values="5;8;5" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </circle>
      ))}

      {/* Worker markers */}
      {workers.map((worker, i) => {
        const x = 60 + ((i * 47) % 300);
        const y = 100 + ((i * 73) % 650);
        return (
          <motion.g key={worker.id} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
            <circle cx={x} cy={y} r="16" fill={worker.status === 'busy' ? '#C86F52' : '#173F35'} />
            <circle cx={x} cy={y} r="24" fill="none" stroke={worker.status === 'busy' ? '#C86F52' : '#173F35'} strokeWidth="1.5" opacity="0.4">
              <animate attributeName="r" values="16;28;16" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" repeatCount="indefinite" />
            </circle>
            <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">
              {worker.name.charAt(0)}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}

function WorkerDetailPanel({ worker, onClose }: { worker: any; onClose: () => void }) {
  if (!worker) return null;
  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-20 max-h-[40vh] overflow-y-auto">
      <div className="w-12 h-1 bg-[#D4CFC4] rounded-full mx-auto mt-3" />
      <div className="px-6 py-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#173F35] flex items-center justify-center text-white font-bold text-lg">{worker.name.charAt(0)}</div>
          <div className="flex-1">
            <h3 className="font-bold text-[#173F35]">{worker.name}</h3>
            <p className="text-sm text-[#7A8B7E] capitalize">{worker.serviceType.replace('_', ' ')} · {worker.location}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#F5F0E7]">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="#7A8B7E" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-4">
          <div className="bg-[#F5F0E7] rounded-xl py-2"><div className="flex items-center justify-center gap-1"><p className="font-bold text-[#173F35] text-base">{worker.rating}</p><svg width="12" height="12" viewBox="0 0 24 24" fill="#C86F52" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg><p className="text-[#7A8B7E]">Rating</p></div></div>
          <div className="bg-[#F5F0E7] rounded-xl py-2"><p className="font-bold text-[#173F35] text-base">{worker.totalJobs}</p><p className="text-[#7A8B7E]">Jobs</p></div>
          <div className="bg-[#F5F0E7] rounded-xl py-2"><p className="font-bold text-[#173F35] text-base">{worker.completionRate}%</p><p className="text-[#7A8B7E]">Complete</p></div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#F5F0E7] text-[#173F35] text-sm font-semibold"><IconPhone size={16} /> Call</button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#173F35] text-white text-sm font-semibold"><IconChat size={16} /> Message</button>
        </div>
      </div>
    </motion.div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 shadow">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-xs font-medium text-[#173F35]">{label}</span>
    </div>
  );
}
