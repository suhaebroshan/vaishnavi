import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { IconArrowLeft, IconPhone, IconChat, IconMapPin } from '../../components/icons';

type TripPhase = 'on_the_way' | 'nearby' | 'arrived' | 'in_progress';

/* ── Realistic Hyderabad street grid for the map ── */
const MAP_W = 400;
const MAP_H = 600;

// Main roads
const MAIN_ROADS = [
  { x1: 0, y1: 180, x2: 400, y2: 180 },   // Necklace Road area
  { x1: 0, y1: 340, x2: 400, y2: 340 },   // Central Hyderabad
  { x1: 0, y1: 500, x2: 400, y2: 500 },   // South
  { x1: 100, y1: 0, x2: 100, y2: 600 },   // Road 1
  { x1: 200, y1: 0, x2: 200, y2: 600 },   // Road 2 (central)
  { x1: 300, y1: 0, x2: 300, y2: 600 },   // Road 3
];

// Secondary roads
const SEC_ROADS = [
  { x1: 50, y1: 0, x2: 50, y2: 600 },
  { x1: 150, y1: 0, x2: 150, y2: 600 },
  { x1: 250, y1: 0, x2: 250, y2: 600 },
  { x1: 350, y1: 0, x2: 350, y2: 600 },
  { x1: 0, y1: 80, x2: 400, y2: 80 },
  { x1: 0, y1: 260, x2: 400, y2: 260 },
  { x1: 0, y1: 420, x2: 400, y2: 420 },
  { x1: 0, y1: 560, x2: 400, y2: 560 },
];

// Buildings (rectangles representing blocks)
const BUILDINGS = [
  { x: 10, y: 10, w: 35, h: 65, label: 'Banjara Hills' },
  { x: 60, y: 10, w: 35, h: 65 },
  { x: 110, y: 10, w: 35, h: 65 },
  { x: 160, y: 10, w: 35, h: 65 },
  { x: 210, y: 10, w: 35, h: 65 },
  { x: 260, y: 10, w: 35, h: 65 },
  { x: 310, y: 10, w: 35, h: 65 },
  { x: 360, y: 10, w: 35, h: 65 },
  { x: 10, y: 90, w: 35, h: 85 },
  { x: 60, y: 90, w: 35, h: 85 },
  { x: 210, y: 90, w: 35, h: 85 },
  { x: 260, y: 90, w: 35, h: 85 },
  { x: 310, y: 90, w: 35, h: 85 },
  { x: 10, y: 190, w: 35, h: 65 },
  { x: 60, y: 190, w: 35, h: 65 },
  { x: 110, y: 190, w: 35, h: 65 },
  { x: 160, y: 190, w: 35, h: 65 },
  { x: 260, y: 190, w: 35, h: 65 },
  { x: 310, y: 190, w: 35, h: 65 },
  { x: 360, y: 190, w: 35, h: 65 },
  { x: 10, y: 270, w: 35, h: 85 },
  { x: 60, y: 270, w: 35, h: 85 },
  { x: 110, y: 270, w: 35, h: 85 },
  { x: 210, y: 270, w: 35, h: 85 },
  { x: 260, y: 270, w: 35, h: 85 },
  { x: 360, y: 270, w: 35, h: 85 },
  { x: 10, y: 360, w: 35, h: 55 },
  { x: 60, y: 360, w: 35, h: 55 },
  { x: 110, y: 360, w: 35, h: 55 },
  { x: 210, y: 360, w: 35, h: 55 },
  { x: 310, y: 360, w: 35, h: 55 },
  { x: 360, y: 360, w: 35, h: 55 },
  { x: 10, y: 430, w: 35, h: 65 },
  { x: 60, y: 430, w: 35, h: 65 },
  { x: 160, y: 430, w: 35, h: 65 },
  { x: 210, y: 430, w: 35, h: 65 },
  { x: 260, y: 430, w: 35, h: 65 },
  { x: 310, y: 430, w: 35, h: 65 },
  { x: 360, y: 430, w: 35, h: 65 },
  { x: 10, y: 510, w: 35, h: 85 },
  { x: 110, y: 510, w: 35, h: 85 },
  { x: 160, y: 510, w: 35, h: 85 },
  { x: 260, y: 510, w: 35, h: 85 },
  { x: 310, y: 510, w: 35, h: 85 },
  { x: 360, y: 510, w: 35, h: 85 },
];

// Parks / green areas
const PARKS = [
  { x: 160, y: 270, w: 45, h: 35, label: 'Park' },
  { x: 310, y: 190, w: 45, h: 35, label: 'Garden' },
  { x: 60, y: 430, w: 40, h: 30, label: '' },
];

// Route waypoints for worker movement (from top-left area to customer at bottom)
const ROUTE = [
  { x: 70, y: 60 },   // Start (worker position top-left)
  { x: 70, y: 130 },
  { x: 70, y: 180 },  // Cross main road
  { x: 130, y: 180 },
  { x: 130, y: 260 },
  { x: 200, y: 260 },
  { x: 200, y: 340 }, // Cross central road
  { x: 200, y: 420 },
  { x: 200, y: 500 }, // Cross south road
  { x: 200, y: 540 }, // Near destination
  { x: 200, y: 560 }, // Final: customer location
];

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function getRoutePosition(phase: TripPhase, progress: number): { x: number; y: number } {
  const totalSegments = ROUTE.length - 1;
  const segFloat = (totalSegments * progress);
  const segIdx = Math.min(Math.floor(segFloat), totalSegments - 1);
  const t = segFloat - segIdx;
  const from = ROUTE[segIdx];
  const to = ROUTE[segIdx + 1];
  return { x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t) };
}

export default function Tracking() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [booking, setBooking] = useState<any>(null);
  const [worker, setWorker] = useState<any>(null);
  const [phase, setPhase] = useState<TripPhase>('on_the_way');
  const [etaMinutes, setEtaMinutes] = useState(12);
  const [loading, setLoading] = useState(true);
  const [routeProgress, setRouteProgress] = useState(0);
  const animRef = useRef<number>(0);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    loadBooking();
    return () => cancelAnimationFrame(animRef.current);
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
    const initialPhase = active.status as TripPhase;
    setPhase(initialPhase);
    phaseRef.current = initialPhase;

    // Set route progress based on phase
    const progressMap: Record<TripPhase, number> = {
      on_the_way: 0.3, nearby: 0.7, arrived: 0.95, in_progress: 1.0,
    };
    setRouteProgress(progressMap[initialPhase] ?? 0);

    // ETA based on phase
    const etaMap: Record<TripPhase, number> = {
      on_the_way: 12, nearby: 3, arrived: 0, in_progress: 0,
    };
    setEtaMinutes(etaMap[initialPhase] ?? 12);

    // Poll for DB changes
    const interval = setInterval(async () => {
      const fresh = await db.bookings.get(active.id);
      if (fresh && fresh.status !== active.status) {
        setBooking(fresh);
        const np = fresh.status as TripPhase;
        setPhase(np);
        phaseRef.current = np;
        const pm: Record<TripPhase, number> = { on_the_way: 0.3, nearby: 0.7, arrived: 0.95, in_progress: 1.0 };
        setRouteProgress(pm[np] ?? 0);
        const em: Record<TripPhase, number> = { on_the_way: 12, nearby: 3, arrived: 0, in_progress: 0 };
        setEtaMinutes(em[np] ?? 0);
      }
    }, 3000);

    setLoading(false);
    return () => clearInterval(interval);
  }

  // Animate worker along route
  useEffect(() => {
    if (phase === 'in_progress' || phase === 'arrived') return;

    let start: number | null = null;
    const duration = 2000; // ms per step

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const segmentProgress = Math.min(elapsed / duration, 1);

      // Move from current progress toward next phase target
      const targets: Record<TripPhase, number> = {
        on_the_way: 0.3, nearby: 0.7, arrived: 0.95, in_progress: 1.0,
      };
      const target = targets[phaseRef.current] ?? 0.3;
      const current = routeProgress;
      const newProgress = current + (target - current) * 0.04; // smooth approach

      setRouteProgress(Math.min(newProgress, target));

      if (segmentProgress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    }
    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [phase]);

  function advancePhase(e: React.MouseEvent) {
    e.stopPropagation();
    const order: TripPhase[] = ['on_the_way', 'nearby', 'arrived', 'in_progress'];
    const idx = order.indexOf(phase);
    if (idx < order.length - 1) {
      const next = order[idx + 1];
      setPhase(next);
      phaseRef.current = next;
      const pm: Record<TripPhase, number> = { on_the_way: 0.3, nearby: 0.7, arrived: 0.95, in_progress: 1.0 };
      setRouteProgress(pm[next] ?? 0);
      const em: Record<TripPhase, number> = { on_the_way: 12, nearby: 3, arrived: 0, in_progress: 0 };
      setEtaMinutes(em[next] ?? 0);
      if (booking) db.bookings.update(booking.id, { status: next }).catch(console.error);
    } else {
      navigate('/booking/' + booking!.id);
    }
  }

  if (loading) return (
    <div className="h-screen bg-[#F5F0E7] flex flex-col items-center justify-center gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 border-3 border-[#173F35]/20 border-t-[#173F35] rounded-full"
        style={{ borderWidth: 3 }}
      />
      <p className="text-[#7A8B7E] text-sm font-medium">Loading tracking…</p>
    </div>
  );

  if (!booking) return (
    <div className="min-h-screen bg-[var(--va-cream-light)] flex flex-col items-center justify-center px-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--va-green-pale)] flex items-center justify-center">
          <IconMapPin size={32} className="text-[var(--va-green)]" />
        </div>
        <p className="text-[#7A8B7E] mb-4 text-sm">No active booking found</p>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => navigate('/')} className="btn-primary">Go Home</motion.button>
      </motion.div>
    </div>
  );

  const workerPos = getRoutePosition(phase, routeProgress);

  return (
    <div className="relative h-screen bg-[#E8E4DB] overflow-hidden">
      {/* Map */}
      <SimulatedCityMap
        route={ROUTE}
        workerPos={workerPos}
        destination={ROUTE[ROUTE.length - 1]}
        phase={phase}
        eta={etaMinutes}
        routeProgress={routeProgress}
      />

      {/* Top controls */}
      <div className="absolute top-0 left-0 right-0 z-10 pt-4 px-4 flex items-center justify-between">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate(-1)}
          className="w-10 h-10 glass rounded-full flex items-center justify-center"
        >
          <IconArrowLeft size={20} className="text-[#173F35]" />
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={advancePhase}
          className="px-4 py-2 glass-dark rounded-full text-xs font-bold"
        >
          {phase === 'in_progress' ? 'Complete Job ✓' : phase === 'arrived' ? 'Start Service →' : 'Simulate ▸'}
        </motion.button>
      </div>

      {/* Bottom sheet */}
      <AnimatePresence>
        <motion.div
          key={phase}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 22, stiffness: 200 }}
          className="absolute bottom-0 left-0 right-0 z-10"
        >
          <div
            className="rounded-t-[28px] px-6 pt-4 pb-8"
            style={{
              background: 'linear-gradient(180deg, rgba(250,248,243,0.97) 0%, rgba(250,248,243,0.99) 100%)',
              backdropFilter: 'blur(20px)',
              borderTop: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 -4px 30px rgba(23,63,53,0.12)',
            }}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-[var(--va-border-str)] rounded-full mx-auto mb-4" />

            {/* Worker info */}
            <div className="flex items-center gap-3.5 mb-4">
              <div className="relative shrink-0">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  style={{ background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)', boxShadow: '0 4px 14px rgba(23,63,53,0.35)' }}
                >
                  {worker?.name?.charAt(0) || 'W'}
                </div>
                {(phase === 'on_the_way' || phase === 'nearby') && (
                  <motion.div
                    className="absolute -inset-2 rounded-full border-2 border-[#173F35]"
                    style={{ opacity: 0.2 }}
                    animate={{ scale: [1, 1.5], opacity: [0.2, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-extrabold text-[#173F35] text-base">{worker?.name || 'Vikram Singh'}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--va-text-muted)] capitalize">{worker?.serviceType?.replace(/_/g, ' ') || 'Plumbing'} Pro</span>
                  <span className="text-xs text-[var(--va-text-muted)]">·</span>
                  <span className="text-xs text-[var(--va-text-muted)]">{worker?.rating || 4.8} ⭐</span>
                </div>
              </div>
              <div className="text-right">
                <motion.p
                  key={etaMinutes}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-extrabold text-[#173F35]"
                  style={{ letterSpacing: '-0.03em' }}
                >
                  {phase === 'arrived' ? 'Here' : phase === 'in_progress' ? 'Working' : `${etaMinutes}`}
                  {phase !== 'arrived' && phase !== 'in_progress' && <span className="text-xs font-semibold text-[var(--va-text-muted)] ml-0.5">min</span>}
                </motion.p>
                <p className="text-[10px] text-[var(--va-text-muted)] mt-0.5">
                  {phase === 'arrived' ? 'at your door' : phase === 'in_progress' ? 'in progress' : 'away'}
                </p>
              </div>
            </div>

            {/* Booking details card */}
            <div
              className="rounded-2xl p-4 mb-4"
              style={{ background: 'var(--va-cream)', border: '1px solid rgba(23,63,53,0.06)' }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[var(--va-text-muted)] capitalize">{booking.serviceType?.replace(/_/g, ' ')}</span>
                <span className="font-extrabold text-[#173F35]">₹{booking.estimatedPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-[var(--va-text-muted)]">
                <span>{booking.date} · {booking.time}</span>
                <span>Banjara Hills, Hyd</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/chat')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm"
                style={{
                  background: 'white',
                  border: '1.5px solid rgba(23,63,53,0.10)',
                  boxShadow: '0 2px 8px rgba(23,63,53,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                  color: '#173F35',
                }}
              >
                <IconChat size={16} /> Message
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/call')}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white"
                style={{
                  background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)',
                  boxShadow: '0 4px 14px rgba(23,63,53,0.30)',
                }}
              >
                <IconPhone size={16} /> Call
              </motion.button>
            </div>

            {/* Sponsored ad */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, rgba(23,63,53,0.06) 0%, rgba(23,63,53,0.02) 100%)', border: '1px solid rgba(23,63,53,0.06)' }}
            >
              <div className="px-4 py-3 flex items-center gap-3">
                <span className="text-[9px] font-extrabold tracking-[0.15em] text-[var(--va-text-faint)] uppercase shrink-0">Ad</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#173F35]">Home Insurance from ₹299/mo</p>
                  <p className="text-[10px] text-[var(--va-text-muted)]">Protect your home today</p>
                </div>
                <motion.button whileTap={{ scale: 0.93 }} className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(145deg, #C86F52 0%, #B55E42 100%)', boxShadow: '0 2px 8px rgba(200,111,82,0.3)' }}
                >
                  Learn
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SimulatedCityMap({
  route, workerPos, destination, phase, eta, routeProgress
}: {
  route: { x: number; y: number }[];
  workerPos: { x: number; y: number };
  destination: { x: number; y: number };
  phase: TripPhase;
  eta: number;
  routeProgress: number;
}) {
  // Build dashed route path
  const routePath = route.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  // Final approach line (shown when arrived)
  void workerPos; // suppress unused warning

  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="markerShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#173F35" floodOpacity="0.35"/>
        </filter>
        <filter id="softGlow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DDD8CE"/>
          <stop offset="100%" stopColor="#D0CAA0"/>
        </linearGradient>
        <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(23,63,53,0.03)" strokeWidth="0.5"/>
        </pattern>
      </defs>

      {/* Background */}
      <rect width={MAP_W} height={MAP_H} fill="#EDE8DD"/>
      <rect width={MAP_W} height={MAP_H} fill="url(#gridPattern)"/>

      {/* Parks */}
      {PARKS.map((p, i) => (
        <g key={`park-${i}`}>
          <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="4" fill="#C5D4C0" opacity="0.5"/>
          {p.label && <text x={p.x + p.w/2} y={p.y + p.h/2 + 3} textAnchor="middle" fill="#4A6A42" fontSize="6" fontWeight="600" fontFamily="system-ui">{p.label}</text>}
        </g>
      ))}

      {/* Secondary roads */}
      {SEC_ROADS.map((r, i) => (
        <line key={`sr-${i}`} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#D8D2C6" strokeWidth="6" strokeLinecap="round"/>
      ))}

      {/* Main roads */}
      {MAIN_ROADS.map((r, i) => (
        <g key={`mr-${i}`}>
          <line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#E8E2D4" strokeWidth="18" strokeLinecap="round"/>
          <line x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} stroke="#DDD5C5" strokeWidth="1" strokeLinecap="round" strokeDasharray="8 6"/>
        </g>
      ))}

      {/* Building blocks */}
      {BUILDINGS.map((b, i) => (
        <g key={`b-${i}`}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="#E2DCD0" stroke="#D5CF C3" strokeWidth="0.5"/>
          {/* Window lines */}
          <line x1={b.x + 4} y1={b.y + 4} x2={b.x + b.w - 4} y2={b.y + 4} stroke="#D5CFC3" strokeWidth="0.5"/>
          <line x1={b.x + 4} y1={b.y + b.h - 4} x2={b.x + b.w - 4} y2={b.y + b.h - 4} stroke="#D5CFC3" strokeWidth="0.5"/>
          {b.label && (
            <text x={b.x + b.w/2} y={b.y + b.h/2 + 2} textAnchor="middle" fill="#B0A898" fontSize="5" fontWeight="600" fontFamily="system-ui">{b.label}</text>
          )}
        </g>
      ))}

      {/* Route path (dashed) */}
      <path d={routePath} stroke="#173F35" strokeWidth="3" strokeDasharray="6 4" fill="none" opacity="0.35" strokeLinecap="round"/>
      {/* Partially filled route showing progress */}
      {phase !== 'on_the_way' && (
        <path d={routePath} stroke="#173F35" strokeWidth="3" fill="none" opacity="0.15" strokeLinecap="round"
          strokeDasharray={`${Math.floor(routeProgress * 400)} 9999`}
        />
      )}

      {/* Destination marker */}
      <g>
        <circle cx={destination.x} cy={destination.y} r="8" fill="#C86F52" opacity="0.2"/>
        <circle cx={destination.x} cy={destination.y} r="5" fill="#C86F52"/>
        <text x={destination.x} y={destination.y + 16} textAnchor="middle" fill="#173F35" fontSize="8" fontWeight="700" fontFamily="system-ui">Your Home</text>
      </g>

      {/* Worker marker with pulse */}
      <motion.g>
        {(phase === 'on_the_way' || phase === 'nearby') && (
          <>
            <motion.circle
              cx={workerPos.x} cy={workerPos.y} r="20"
              fill="none" stroke="#173F35" strokeWidth="1.5"
              animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.circle
              cx={workerPos.x} cy={workerPos.y} r="14"
              fill="none" stroke="#173F35" strokeWidth="1"
              animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
            />
          </>
        )}
        <motion.circle
          cx={workerPos.x} cy={workerPos.y} r="16"
          fill="#173F35" filter="url(#markerShadow)"
          animate={{
            scale: phase === 'on_the_way' || phase === 'nearby' ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <text
          x={workerPos.x} y={workerPos.y + 5}
          textAnchor="middle" fill="white" fontSize="14"
        >
          {phase === 'on_the_way' || phase === 'nearby' ? '🚐' : phase === 'arrived' ? '✓' : '⚡'}
        </text>
        {(phase === 'on_the_way' || phase === 'nearby') && (
          <motion.text
            x={workerPos.x} y={workerPos.y - 24}
            textAnchor="middle" fill="#173F35" fontSize="9" fontWeight="700" fontFamily="system-ui"
          >
            Vikram · {eta} min
          </motion.text>
        )}
      </motion.g>

      {/* Street labels */}
      <text x="10" y="175" fill="#B0A898" fontSize="7" fontFamily="system-ui" fontWeight="600">Road No. 12</text>
      <text x="10" y="335" fill="#B0A898" fontSize="7" fontFamily="system-ui" fontWeight="600">Banjara Hills Rd</text>
      <text x="10" y="495" fill="#B0A898" fontSize="7" fontFamily="system-ui" fontWeight="600">MG Road</text>
      <text x="205" y="30" fill="#B0A898" fontSize="7" fontFamily="system-ui" fontWeight="600" writingMode="tb">Jubilee Hills</text>
    </svg>
  );
}
