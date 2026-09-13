import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export function ServiceCard({ service, onPress }: { service: any; onPress?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onPress}
      className="flex flex-col items-center gap-2 min-w-[80px]"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-md"
        style={{ backgroundColor: service.color + '18', border: `1.5px solid ${service.color}30` }}
      >
        {service.icon}
      </div>
      <span className="text-xs font-semibold text-[#173F35] text-center leading-tight">{service.name}</span>
    </motion.button>
  );
}

export function WorkerCard({ worker, selected, onPress }: { worker: any; selected?: boolean; onPress?: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onPress}
      className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${
        selected ? 'border-[#173F35] bg-[#173F35]/5' : 'border-transparent bg-white'
      }`}
    >
      <div className="w-12 h-12 rounded-full bg-[#173F35] flex items-center justify-center text-white font-bold text-base shrink-0">
        {worker.name.charAt(0)}
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="font-semibold text-sm text-[#173F35] truncate">{worker.name}</p>
        <p className="text-xs text-[#7A8B7E]">{worker.serviceType.replace('_', ' ')} Professional</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={12} className="text-[#C86F52] fill-[#C86F52]" />
          <span className="text-xs font-medium text-[#173F35]">{worker.rating}</span>
          <span className="text-xs text-[#7A8B7E]">· {worker.totalJobs} jobs</span>
        </div>
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-[#173F35] flex items-center justify-center">
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      )}
    </motion.button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    requested: 'bg-orange-100 text-orange-700',
    assigned: 'bg-blue-100 text-blue-700',
    on_the_way: 'bg-green-100 text-green-700',
    nearby: 'bg-purple-100 text-purple-700',
    arrived: 'bg-green-100 text-green-700',
    in_progress: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-[#173F35]/10 text-[#173F35]',
    paid: 'bg-[#C86F52]/10 text-[#C86F52]',
    reviewed: 'bg-[#A8B9A5]/30 text-[#7A8B7E]',
  };
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}
