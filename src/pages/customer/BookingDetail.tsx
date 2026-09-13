import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock, Phone, MessageSquare, Star } from 'lucide-react';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { SERVICES } from '../../db/seed';
import { StatusBadge } from '../../components/Cards';

const STATUS_FLOW = ['requested', 'assigned', 'on_the_way', 'nearby', 'arrived', 'in_progress', 'completed', 'paid', 'reviewed'] as const;
type StatusLabel = Record<typeof STATUS_FLOW[number], string>;

const STATUS_LABELS: StatusLabel = {
  requested: 'Booking Requested',
  assigned: 'Professional Assigned',
  on_the_way: 'Professional is On the Way',
  nearby: 'Professional is Nearby',
  arrived: 'Professional Arrived',
  in_progress: 'Service In Progress',
  completed: 'Service Completed',
  paid: 'Payment Successful',
  reviewed: 'Review Submitted',
};

export default function BookingDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useAppStore(s => s.currentUser);
  const [booking, setBooking] = useState<any>(null);
  const [worker, setWorker] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const b = await db.bookings.get(id);
      if (!b) return;
      const w = await db.workers.get(b.workerId);
      const a = await db.addresses.get(b.addressId);
      setBooking(b);
      setWorker(w);
      setAddress(a);

      // Check if should show rating
      if (b.status === 'completed' || b.status === 'paid') {
        const existing = await db.reviews.where('bookingId').equals(id).first();
        if (!existing) setShowRating(true);
      }
    }
    load();
  }, [id]);

  async function submitReview() {
    if (!user || !booking || rating === 0) return;
    setSubmitting(true);
    await db.reviews.add({
      id: `rev-${Date.now()}`,
      bookingId: booking.id,
      customerId: user.id,
      workerId: booking.workerId,
      rating,
      comment: comment || undefined,
      createdAt: Date.now(),
    });
    await db.bookings.update(booking.id, { status: 'reviewed' });
    setShowRating(false);
    navigate('/');
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center">
        <p className="text-[#7A8B7E]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      {/* Rating Modal */}
      <AnimatePresence>
        {showRating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-[#FBF9F4] w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 pb-8"
            >
              <div className="w-10 h-1 bg-[#C8B9A5]/50 rounded-full mx-auto mb-5" />
              <h2 className="text-xl font-bold text-[#173F35] text-center mb-2">How was your experience?</h2>
              <p className="text-sm text-[#7A8B7E] text-center mb-6">Rate {worker?.name}</p>

              <div className="flex justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} onClick={() => setRating(n)} className="transition-transform hover:scale-110 active:scale-95">
                    <Star size={36} className={`${n <= rating ? 'text-[#C86F52] fill-[#C86F52]' : 'text-[#D4CFC4]'}`} />
                  </button>
                ))}
              </div>

              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Tell us about your experience... (optional)"
                className="w-full p-4 rounded-2xl bg-white border border-[rgba(23,63,53,0.1)] text-sm text-[#173F35] placeholder:text-[#A8B9A5] focus:outline-none focus:ring-2 focus:ring-[#173F35]/30 resize-none mb-4"
                rows={3}
              />

              <button
                onClick={submitReview}
                disabled={rating === 0 || submitting}
                className="w-full vaishnavi-btn vaishnavi-btn-primary disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button onClick={() => setShowRating(false)} className="w-full vaishnavi-btn vaishnavi-btn-ghost mt-2">Skip</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <ArrowLeft size={20} className="text-[#173F35]" />
        </button>
        <h1 className="font-bold text-[#173F35] text-base">Booking Details</h1>
        <span className="ml-auto text-xs font-mono text-[#7A8B7E]">{booking.id}</span>
      </div>

      <div className="px-5 space-y-4">
        {/* Status */}
        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-widest text-[#7A8B7E] uppercase">Status</span>
            <StatusBadge status={booking.status} />
          </div>

          {/* Timeline */}
          <div className="space-y-0">
            {STATUS_FLOW.map((s, i) => {
              const idx = STATUS_FLOW.indexOf(booking.status as typeof STATUS_FLOW[number]);
              const done = i <= idx;
              const current = i === idx;
              return (
                <div key={s} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-[#173F35] text-white' : 'bg-[#F5F0E7] text-[#A8B9A5]'}`}>
                      {done && i < idx ? '✓' : i + 1}
                    </div>
                    {i < STATUS_FLOW.length - 1 && <div className={`w-0.5 h-6 ${i < idx ? 'bg-[#173F35]' : 'bg-[#E8E4DB]'}`} />}
                  </div>
                  <div className="pt-1.5 pb-3">
                    <p className={`text-sm ${current ? 'font-semibold text-[#173F35]' : done ? 'text-[#173F35]' : 'text-[#A8B9A5]'}`}>
                      {STATUS_LABELS[s]}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service & Worker */}
        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#F5F0E7] flex items-center justify-center text-xl">
              {SERVICES.find(s => s.id === booking.serviceType)?.icon || '🏠'}
            </div>
            <div>
              <p className="font-semibold text-[#173F35] capitalize">{booking.serviceType.replace(/_/g, ' ')}</p>
              <p className="text-xs text-[#7A8B7E]">₹{booking.estimatedPrice} estimated</p>
            </div>
          </div>
          {worker && (
            <div className="flex items-center gap-3 pt-3 border-t border-[rgba(23,63,53,0.06)]">
              <div className="w-10 h-10 rounded-full bg-[#173F35] flex items-center justify-center text-white font-bold">
                {worker.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-[#173F35]">{worker.name}</p>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-[#C86F52] fill-[#C86F52]" />
                  <span className="text-xs text-[#7A8B7E]">{worker.rating} · {worker.totalJobs} jobs</span>
                </div>
              </div>
              <button onClick={() => navigate('/chat')} className="p-2 rounded-full bg-[#F5F0E7] hover:bg-[#EDE8DD]">
                <MessageSquare size={16} className="text-[#173F35]" />
              </button>
              <button onClick={() => navigate('/call')} className="p-2 rounded-full bg-[#F5F0E7] hover:bg-[#EDE8DD]">
                <Phone size={16} className="text-[#173F35]" />
              </button>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4 space-y-3">
          <DetailRow icon={<Calendar size={16} />} label="Date" value={booking.date} />
          <DetailRow icon={<Clock size={16} />} label="Time" value={booking.time} />
          {address && (
            <DetailRow icon={<MapPin size={16} />} label="Address" value={`${address.line1}, ${address.city}`} />
          )}
          <div className="pt-3 border-t border-[rgba(23,63,53,0.06)] flex justify-between">
            <span className="text-[#7A8B7E]">Total</span>
            <span className="text-xl font-bold text-[#173F35]">₹{booking.finalPrice || booking.estimatedPrice}</span>
          </div>
        </div>

        {/* Action buttons based on status */}
        {(booking.status === 'on_the_way' || booking.status === 'nearby') && (
          <button onClick={() => navigate('/tracking')} className="w-full vaishnavi-btn vaishnavi-btn-primary flex items-center gap-2">
            <MapPin size={18} /> Track Professional
          </button>
        )}

        {booking.status === 'completed' && !showRating && (
          <button onClick={() => setShowRating(true)} className="w-full vaishnavi-btn vaishnavi-btn-accent">
            Rate This Service
          </button>
        )}

        {booking.status === 'completed' && (
          <button onClick={() => navigate('/payment', { state: { booking } })} className="w-full vaishnavi-btn vaishnavi-btn-primary">
            Pay ₹{booking.estimatedPrice}
          </button>
        )}
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#F5F0E7] flex items-center justify-center text-[#173F35]">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-xs text-[#7A8B7E]">{label}</p>
        <p className="text-sm font-medium text-[#173F35]">{value}</p>
      </div>
    </div>
  );
}
