import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { StatusBadge } from '../../components/Cards';
import { IconMapPin, IconClock, IconCalendar } from '../../components/icons';

export default function WorkerRequests() {
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [requests, setRequests] = useState<any[]>([]);
  const [accepting, setAccepting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      if (!user) return;
      const bookings = await db.bookings.where('workerId').equals(user.id).toArray();
      const pending = bookings.filter((b: any) => b.status === 'requested');
      setRequests(pending);
    }
    load();
  }, [user?.id]);

  async function acceptRequest(bookingId: string) {
    setAccepting(bookingId);
    const booking = await db.bookings.get(bookingId);
    if (!booking) return;

    await db.transaction('rw', db.bookings, db.bookingEvents, db.notifications, async () => {
      await db.bookings.update(bookingId, { status: 'assigned' });
      await db.bookingEvents.add({
        id: `${bookingId}-accepted`,
        bookingId,
        timestamp: Date.now(),
        actorId: user!.id,
        actorRole: 'worker',
        type: 'accepted',
        message: 'Worker accepted request',
      });
      const customer = await db.customers.get(booking.customerId);
      if (customer) {
        await db.notifications.add({
          id: `n-${Date.now()}`,
          userId: customer.id,
          type: 'booking_update',
          title: 'Professional Assigned',
          message: `${user?.name} accepted your booking.`,
          reading: false,
          createdAt: Date.now(),
        });
      }
    });

    setRequests(prev => prev.filter(r => r.id !== bookingId));
    setAccepting(null);
  }

  async function declineRequest(bookingId: string) {
    const booking = await db.bookings.get(bookingId);
    if (booking) {
      await db.bookings.update(bookingId, { status: 'requested' });
    }
    setRequests(prev => prev.filter(r => r.id !== bookingId));
  }

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <h1 className="font-bold text-[#173F35] text-lg">Requests</h1>
        <span className="ml-auto text-xs font-medium text-[#C86F52]">{requests.length} pending</span>
      </div>

      <div className="px-5 space-y-3 mt-4">
        {requests.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[#7A8B7E]">No pending requests</p>
          </div>
        ) : (
          requests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#C86F52] uppercase">New Request</span>
                  <p className="font-bold text-[#173F35] text-base mt-1">{req.serviceType.replace(/_/g, ' ')}</p>
                  <p className="text-sm text-[#7A8B7E]">{req.serviceOptionId?.replace(/_/g, ' ')}</p>
                </div>
                <StatusBadge status={req.status} />
              </div>

              <div className="space-y-2 mb-4">
                <Detail icon={<IconCalendar size={14} />} label="Date" value={req.date} />
                <Detail icon={<IconClock size={14} />} label="Time" value={req.time} />
                <Detail icon={<IconMapPin size={14} />} label="Location" value="Banjara Hills, Hyderabad" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[rgba(23,63,53,0.06)]">
                <span className="font-bold text-[#173F35]">₹{req.estimatedPrice}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => declineRequest(req.id)}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[#7A8B7E] hover:bg-[#F5F0E7] transition-colors"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => acceptRequest(req.id)}
                    disabled={accepting === req.id}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-[#173F35] text-white hover:bg-[#102F28] transition-colors disabled:opacity-50"
                  >
                    {accepting === req.id ? 'Accepting...' : 'Accept'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-[#A8B9A5]">{icon}</span>
      <span className="text-[#7A8B7E]">{label}</span>
      <span className="text-[#173F35] font-medium ml-auto">{value}</span>
    </div>
  );
}
