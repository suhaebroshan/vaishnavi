import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';

type TripPhase = 'on_the_way' | 'nearby' | 'arrived' | 'in_progress';

export default function Tracking() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [booking, setBooking] = useState<any>(null);
  const [worker, setWorker] = useState<any>(null);
  const [phase, setPhase] = useState<TripPhase>('on_the_way');
  const [etaMinutes, setEtaMinutes] = useState(12);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, []);

  async function loadBooking() {
    if (!user) return;
    const bookings = await db.bookings.where('customerId').equals(user.id).toArray();
    const active = bookings.find((b: any) =>
      ['requested', 'assigned', 'on_the_way', 'nearby', 'arrived', 'in_progress'].includes(b.status)
    );
    if (!active) { setLoading(false); return; }
    const w = await db.workers.get(active.workerId);
    setBooking(active);
    setWorker(w);
    setPhase(active.status as TripPhase);
    const timer = setInterval(async () => {
      const fresh = await db.bookings.get(active.id);
      if (fresh && fresh.status !== active.status) {
        setBooking(fresh);
        setPhase(fresh.status as TripPhase);
        setEtaMinutes(prev => Math.max(0, prev - 2));
      }
    }, 5000);
    setLoading(false);
    return () => clearInterval(timer);
  }

  function advancePhase(e: React.MouseEvent) {
    e.stopPropagation();
    const nextPhases: TripPhase[] = ['on_the_way', 'nearby', 'arrived', 'in_progress'];
    const idx = nextPhases.indexOf(phase);
    if (idx < nextPhases.length - 1) {
      const next = nextPhases[idx + 1];
      setPhase(next);
      setEtaMinutes(prev => next === 'nearby' ? 3 : next === 'arrived' ? 0 : prev - 2);
      db.bookings.update(booking!.id, { status: next }).catch(console.error);
    } else {
      navigate('/booking/' + booking!.id);
    }
  }

  if (loading) return <div className="h-screen bg-[#E8E4DB] flex items-center justify-center"><p className="text-[#7A8B7E]">Loading...</p></div>;
  if (!booking) return (
    <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center px-6">
      <div className="text-center"><p className="text-4xl mb-3">📍</p><p className="text-[#7A8B7E] mb-4">No active booking found.</p><button onClick={() => navigate('/')} className="vaishnavi-btn vaishnavi-btn-primary">Go Home</button></div>
    </div>
  );

  return (
    <div className="relative h-screen bg-[#E8E4DB] overflow-hidden">
      <SimulatedMap phase={phase} eta={etaMinutes} />
      <button onClick={() => navigate(-1)} className="absolute top-4 left-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center"><ArrowLeft size={18} className="text-[#173F35]" /></button>
      <button onClick={advancePhase} className="absolute top-4 right-4 z-10 px-3 py-1.5 bg-[#C86F52]/90 backdrop-blur text-white text-xs font-semibold rounded-full shadow-lg">Next Phase ▸</button>
      <motion.div initial={{ y: '60%' }} animate={{ y: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-10">
        <div className="w-12 h-1 bg-[#D4CFC4] rounded-full mx-auto mt-3" />
        <div className="px-6 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-14 h-14 rounded-full bg-[#173F35] flex items-center justify-center text-white text-xl font-bold">{worker?.name?.charAt(0) || 'W'}</div>
            <div className="flex-1">
              <h2 className="font-bold text-[#173F35]">{worker?.name || 'Vikram Singh'}</h2>
              <div className="flex items-center gap-1 text-sm text-[#7A8B7E]"><span>{worker?.rating || 4.8} ⭐</span><span>·</span><span className="capitalize">{worker?.serviceType?.replace('_', ' ') || 'Plumbing'} Pro</span></div>
            </div>
            <div className="text-right"><p className="text-2xl font-bold text-[#173F35]">{phase === 'arrived' ? 'Arrived' : phase === 'in_progress' ? 'Working' : `${etaMinutes} min`}</p><p className="text-xs text-[#7A8B7E]">{phase === 'arrived' ? 'at your location' : phase === 'in_progress' ? 'working now' : 'away'}</p></div>
          </div>
          <div className="bg-[#F5F0E7] rounded-2xl p-3 mb-3">
            <div className="flex justify-between text-sm"><span className="text-[#7A8B7E] capitalize">{booking.serviceType?.replace(/_/g, ' ')}</span><span className="font-semibold text-[#173F35]">₹{booking.estimatedPrice}</span></div>
            <div className="flex justify-between text-xs mt-1"><span className="text-[#7A8B7E]">{booking.date} · {booking.time}</span><span className="text-[#7A8B7E]">Banjara Hills</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/chat')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#F5F0E7] text-[#173F35] font-semibold text-sm hover:bg-[#EDE8DD] transition-colors"><MessageSquare size={16} /> Message</button>
            <button onClick={() => navigate('/call')} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#173F35] text-white font-semibold text-sm"><Phone size={16} /> Call</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SimulatedMap({ phase, eta }: { phase: TripPhase; eta: number }) {
  const positions: Record<TripPhase, { x: number; y: number }> = {
    on_the_way: { x: 80, y: 520 }, nearby: { x: 140, y: 490 }, arrived: { x: 200, y: 460 }, in_progress: { x: 200, y: 460 },
  };
  const pos = positions[phase];
  return (
    <svg viewBox="0 0 400 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs><filter id="shadow"><feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/></filter></defs>
      <rect width="400" height="600" fill="#E8E4DB" />
      {[200, 400].map(y => <line key={`h${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#D4CFC4" strokeWidth="20" />)}
      {[150, 280].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="600" stroke="#D4CFC4" strokeWidth="18" />)}
      {[100, 300, 500].map(y => <line key={`lh${y}`} x1="0" y1={y} x2="400" y2={y} stroke="#DDD8CE" strokeWidth="10" />)}
      {[80, 350].map(x => <line key={`lv${x}`} x1={x} y1="0" x2={x} y2="600" stroke="#DDD8CE" strokeWidth="8" />)}
      {[20, 20, 110, 75, 170, 20, 100, 75, 200, 20, 170, 75, 20, 220, 120, 75, 170, 220, 100, 75, 200, 220, 170, 75, 20, 420, 120, 75, 170, 420, 100, 75, 200, 420, 170, 75].reduce((acc: any[], _, i, arr) => { if (i % 4 === 0) acc.push([arr[i], arr[i+1], arr[i+2], arr[i+3]]); return acc; }, [])
        .map(([x, y, w, h]: any[], i: number) => <rect key={i} x={x} y={y} width={w} height={h} rx="4" fill="#DDD8CE" opacity="0.7" />)}
      <rect x="290" y="220" width="100" height="80" rx="6" fill="#A8B9A5" opacity="0.3" />
      <rect x="160" y="430" width="80" height="60" rx="6" fill="#173F35" opacity="0.2" />
      <circle cx="200" cy="460" r="6" fill="#C86F52" />
      <circle cx="200" cy="460" r="12" fill="none" stroke="#C86F52" strokeWidth="1.5" opacity="0.5" />
      <text x="200" y="478" textAnchor="middle" fill="#173F35" fontSize="8" fontWeight="bold" fontFamily="system-ui">Your Home</text>
      <path d="M80,520 L80,460 L200,460" stroke="#173F35" strokeWidth="3" strokeDasharray="8 4" fill="none" opacity="0.5" />
      <motion.g animate={{ x: pos.x, y: pos.y }}>
        {(phase === 'on_the_way' || phase === 'nearby') && (
          <motion.circle cx={pos.x} cy={pos.y} r="24" fill="none" stroke="#173F35" strokeWidth="2"
            initial={{ scale: 0.5, opacity: 0.8 }} animate={{ scale: [0.8, 1.6], opacity: [0.6, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
        )}
        <circle cx={pos.x} cy={pos.y} r="18" fill="#173F35" filter="url(#shadow)" />
        <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="white" fontSize="14">{phase === 'on_the_way' || phase === 'nearby' ? '🚐' : '✓'}</text>
        {(phase === 'on_the_way' || phase === 'nearby') && (
          <motion.text x={pos.x} y={pos.y - 26} textAnchor="middle" fill="#173F35" fontSize="9" fontWeight="bold" fontFamily="system-ui">Vikram · {eta} min</motion.text>
        )}
      </motion.g>
    </svg>
  );
}
