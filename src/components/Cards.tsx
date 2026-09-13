import { motion } from 'framer-motion';
import { ServiceIcon, StarRating, IconCalendar } from './icons';

const SPRING = { type: 'spring', damping: 18, stiffness: 300 };
const FADE_UP = { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: SPRING };

/* ═══════════════════════════════════════════════════════════
   SERVICE CARD — Small circular icon card (horizontal scroll)
   ═══════════════════════════════════════════════════════════ */
export function ServiceCard({ service, onPress, large = false }: { service: any; onPress?: () => void; large?: boolean }) {
  return (
    <motion.button
      whileTap={{ scale: 0.88, rotate: large ? undefined : '-4deg' }}
      whileHover={{ y: -4, scale: 1.04 }}
      onClick={onPress}
      className={`flex flex-col items-center gap-2 min-w-[82px] ${large ? 'min-w-[105px]' : ''}`}
      {...FADE_UP}
    >
      <div
        className="relative w-16 h-16 rounded-[22px] flex items-center justify-center overflow-hidden shadow-md"
        style={{
          background: `linear-gradient(145deg, ${service.color}20 0%, ${service.color}08 100%)`,
          border: `1.5px solid ${service.color}28`,
          boxShadow: `0 4px 16px ${service.color}28, 0 2px 4px ${service.color}16, inset 0 1px 0 rgba(255,255,255,0.5)`,
        }}
      >
        {/* Top highlight */}
        <div className="absolute top-0 left-0 right-0 h-[45%] rounded-t-[20px]" style={{ background: 'rgba(255,255,255,0.20)' }} />
        <div className="relative z-10" style={{ color: service.color }}>
          <ServiceIcon serviceId={service.id} size={28} />
        </div>
      </div>
      <span className="text-[11px] font-bold text-[#173F35] text-center leading-tight px-1" style={{ letterSpacing: '-0.01em' }}>
        {service.name}
      </span>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════
   SERVICE CARD — Large featured horizontal card
   ═══════════════════════════════════════════════════════════ */
export function ServiceCardLarge({ service, onPress, gradient }: { service: any; onPress?: () => void; gradient?: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97, y: 2 }}
      whileHover={{ y: -3, boxShadow: '0 10px 32px rgba(23,63,53,0.18)' }}
      onClick={onPress}
      className="w-full flex items-center gap-4 p-4 rounded-[22px]"
      style={{
        background: 'white',
        border: '1.5px solid rgba(23,63,53,0.07)',
        boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div
        className="w-14 h-14 rounded-[18px] flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(145deg, ${service.color}1e 0%, ${service.color}0a 100%)`,
          border: `1.5px solid ${service.color}22`,
          boxShadow: `0 3px 12px ${service.color}22`,
        }}
      >
        <div style={{ color: service.color }}><ServiceIcon serviceId={service.id} size={26} /></div>
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="font-extrabold text-sm text-[#173F35]" style={{ letterSpacing: '-0.01em' }}>{service.name}</p>
        <p className="text-[11px] text-[#7A8B7E] mt-0.5 leading-relaxed">{service.description.slice(0, 48)}…</p>
        <div className="flex items-center gap-1 mt-1.5">
          <span className="text-[10px] font-semibold text-[#C86F52] bg-[#C86F52]/10 px-2 py-0.5 rounded-full">
            {service.options.length} options
          </span>
        </div>
      </div>
      <IconArrowRight size={18} className="text-[#A8B9A5] shrink-0" />
    </motion.button>
  );
}

function IconArrowRight({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOOKING CARD — Compact booking summary card
   ═══════════════════════════════════════════════════════════ */
export function BookingCard({ booking, worker, onPress }: { booking: any; worker?: any; onPress?: () => void }) {
  const statusColors: Record<string, { bg: string; text: string }> = {
    requested:     { bg: 'rgba(200,111,82,0.12)',  text: '#B55E42' },
    assigned:      { bg: 'rgba(23,63,53,0.10)',    text: '#173F35' },
    on_the_way:    { bg: 'rgba(23,63,53,0.10)',    text: '#173F35' },
    nearby:        { bg: 'rgba(23,63,53,0.10)',    text: '#173F35' },
    arrived:       { bg: 'rgba(23,63,53,0.10)',    text: '#173F35' },
    in_progress:   { bg: 'rgba(200,111,82,0.12)',  text: '#C86F52' },
    completed:     { bg: 'rgba(168,185,165,0.20)', text: '#4A6A42' },
    paid:          { bg: 'rgba(23,63,53,0.10)',    text: '#173F35' },
    reviewed:      { bg: 'rgba(168,185,165,0.20)', text: '#4A6A42' },
  };
  const sc = statusColors[booking.status] || statusColors.completed;
  const svc = booking.serviceType?.replace(/_/g, ' ');

  return (
    <motion.button
      whileTap={{ scale: 0.98, y: 1 }}
      onClick={onPress}
      className="w-full text-left rounded-[20px] p-4"
      style={{
        background: 'white',
        border: '1.5px solid rgba(23,63,53,0.07)',
        boxShadow: '0 2px 8px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
            style={{ background: 'rgba(23,63,53,0.07)' }}>
            <ServiceIcon serviceId={booking.serviceType} size={22} color="#173F35" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-[#173F35] text-sm capitalize">{svc}</p>
            <p className="text-[11px] text-[#7A8B7E] mt-0.5">{worker?.name || 'Professional'}</p>
          </div>
        </div>
        <span
          className="text-[10px] font-bold px-2.5 py-1 rounded-full capitalize"
          style={{ background: sc.bg, color: sc.text }}
        >
          {booking.status === 'on_the_way' ? '● LIVE' : booking.status.replace(/_/g, ' ')}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-[rgba(23,63,53,0.06)]">
        <div className="flex items-center gap-3 text-[11px] text-[#7A8B7E]">
          <span className="flex items-center gap-1"><IconCalendar size={11} /> {booking.date}</span>
          <span>·</span>
          <span>{booking.time}</span>
        </div>
        <span className="font-extrabold text-[#173F35] text-sm">₹{booking.estimatedPrice?.toLocaleString()}</span>
      </div>
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════
   WORKER CARD — Selection card for worker picker
   ═══════════════════════════════════════════════════════════ */
export function WorkerCard({ worker, selected, onPress }: { worker: any; selected?: boolean; onPress?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ y: -2 }}
      onClick={onPress}
      className="w-full flex items-center gap-3.5 p-3.5 rounded-[20px]"
      style={{
        background: selected
          ? 'linear-gradient(145deg, rgba(23,63,53,0.08) 0%, rgba(23,63,53,0.04) 100%)'
          : 'white',
        border: selected ? '2px solid rgba(23,63,53,0.35)' : '1.5px solid rgba(23,63,53,0.07)',
        boxShadow: selected
          ? '0 4px 16px rgba(23,63,53,0.14), inset 0 1px 0 rgba(255,255,255,0.8)'
          : '0 2px 8px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      {/* Avatar with ring */}
      <div className="relative shrink-0">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base"
          style={{
            background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)',
            boxShadow: '0 3px 10px rgba(23,63,53,0.30)',
          }}
        >
          {worker.name.charAt(0)}
        </div>
        {selected && (
          <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#C86F52] flex items-center justify-center shadow-sm">
            <svg width="9" height="9" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        )}
      </div>

      <div className="flex-1 text-left min-w-0">
        <p className="font-bold text-[#173F35] text-sm truncate">{worker.name}</p>
        <p className="text-[11px] text-[#7A8B7E] mt-0.3 capitalize">{worker.serviceType.replace(/_/g, ' ')} Professional</p>
        <div className="flex items-center gap-1.5 mt-1">
          <StarRating rating={worker.rating} size={12} />
          <span className="text-[11px] font-semibold text-[#173F35] ml-0.5">{worker.rating}</span>
          <span className="text-[10px] text-[#A8B9A5]">· {worker.totalJobs} jobs</span>
        </div>
      </div>

      {worker.status === 'online' && (
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-sm" style={{ boxShadow: '0 0 6px rgba(34,197,94,0.6)' }} />
          <span className="text-[9px] font-semibold text-[#4A6A42]">Online</span>
        </div>
      )}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════
   STATUS BADGE
   ═══════════════════════════════════════════════════════════ */
export function StatusBadge({ status, small = false }: { status: string; small?: boolean }) {
  const map: Record<string, { bg: string; text: string; dot?: boolean }> = {
    requested:    { bg: 'rgba(200,111,82,0.12)',  text: '#B55E42' },
    assigned:     { bg: 'rgba(23,63,53,0.10)',    text: '#173F35' },
    on_the_way:   { bg: 'rgba(23,63,53,0.10)',    text: '#173F35', dot: true },
    nearby:       { bg: 'rgba(23,63,53,0.10)',    text: '#173F35' },
    arrived:      { bg: 'rgba(23,63,53,0.10)',    text: '#173F35' },
    in_progress:  { bg: 'rgba(200,111,82,0.12)',  text: '#C86F52' },
    completed:    { bg: 'rgba(168,185,165,0.20)', text: '#4A6A42' },
    paid:         { bg: 'rgba(23,63,53,0.10)',    text: '#173F35' },
    reviewed:     { bg: 'rgba(168,185,165,0.20)', text: '#4A6A42' },
  };
  const s = map[status] || map.completed;
  const padding = small ? '3px 8px' : '4px 10px';
  const fontSize = small ? '10px' : '11px';

  return (
    <span
      className="inline-flex items-center gap-1.5 font-bold tracking-wide"
      style={{ background: s.bg, color: s.text, padding, borderRadius: 9999, fontSize, textTransform: 'capitalize' }}
    >
      {s.dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {status.replace(/_/g, ' ')}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAT CARD — for dashboards
   ═══════════════════════════════════════════════════════════ */
export function StatCard({ label, value, sub, icon, color, onPress }: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; color: string; onPress?: () => void;
}) {
  return (
    <motion.div
      whileTap={onPress ? { scale: 0.96, y: 2 } : undefined}
      className="rounded-[20px] p-4"
      style={{
        background: 'white',
        border: '1.5px solid rgba(23,63,53,0.07)',
        boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
      }}
    >
      <div
        className="w-9 h-9 rounded-[12px] flex items-center justify-center mb-3"
        style={{ background: color + '14', color }}
      >
        {icon}
      </div>
      <p className="text-[22px] font-extrabold text-[#173F35] leading-none" style={{ letterSpacing: '-0.03em' }}>{value}</p>
      <p className="text-[11px] text-[#7A8B7E] font-medium mt-1">{label}</p>
      {sub && <p className="text-[10px] text-[#A8B9A5] mt-0.5">{sub}</p>}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   DATE PILLS
   ═══════════════════════════════════════════════════════════ */
export function DatePill({ date, label, selected, onPress }: { date: string; label: string; selected?: boolean; onPress: () => void }) {
  const isToday = label === 'Today';
  const isTomorrow = label === 'Tomorrow';
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onPress}
      className="flex flex-col items-center gap-1 px-4 py-3 rounded-[18px] min-w-[68px]"
      style={{
        background: selected
          ? 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)'
          : 'white',
        border: selected ? 'none' : '1.5px solid rgba(23,63,53,0.08)',
        boxShadow: selected
          ? '0 4px 14px rgba(23,63,53,0.30), inset 0 1px 0 rgba(255,255,255,0.12)'
          : '0 2px 6px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        color: selected ? 'white' : '#173F35',
      }}
    >
      <span className="text-[10px] font-semibold opacity-70">{isToday ? 'TODAY' : isTomorrow ? 'TOM' : date.split('-')[2]}</span>
      <span className="text-[13px] font-extrabold">{label.split(' ')[0]}</span>
      {selected && <div className="w-1 h-1 rounded-full bg-[#C86F52]" style={{ boxShadow: '0 0 4px rgba(200,111,82,0.8)' }} />}
    </motion.button>
  );
}

/* ═══════════════════════════════════════════════════════════
   TIME PILLS
   ═══════════════════════════════════════════════════════════ */
export function TimePill({ time, selected, onPress }: { time: string; selected?: boolean; onPress: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.93 }}
      onClick={onPress}
      className="px-5 py-3 rounded-[16px] font-semibold text-sm"
      style={{
        background: selected
          ? 'linear-gradient(145deg, #C86F52 0%, #B55E42 100%)'
          : 'white',
        border: selected ? 'none' : '1.5px solid rgba(23,63,53,0.08)',
        boxShadow: selected
          ? '0 4px 14px rgba(200,111,82,0.30), inset 0 1px 0 rgba(255,255,255,0.2)'
          : '0 2px 6px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
        color: selected ? 'white' : '#173F35',
      }}
    >
      {time}
    </motion.button>
  );
}
