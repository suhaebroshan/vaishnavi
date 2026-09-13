import { useEffect, useState } from 'react';
import { useNavigate, useParams as useRouterParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { SERVICES } from '../../db/seed';
import { IconArrowLeft } from '../../components/icons';
import { WorkerCard, DatePill, TimePill } from '../../components/Cards';

export default function ServiceDetail() {
  const navigate = useNavigate();
  const { id } = useRouterParams<{ id: string }>();
  const service = SERVICES.find(s => s.id === id);
  const [selectedOption, setSelectedOption] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [address, setAddress] = useState<any>(null);
  const [workers, setWorkers] = useState<any[]>([]);
  const rawUser = useAppStore(s => s.currentUser);
  const user = rawUser as any;

  useEffect(() => {
    async function load() {
      if (user?.defaultAddress) {
        const addr = await db.addresses.get(user.defaultAddress.id);
        setAddress(addr || user.defaultAddress);
      }
      if (id) {
        const ws = await db.workers.where('serviceType').equals(id).toArray();
        setWorkers(ws.filter((w: any) => w.status !== 'offline'));
      }
    }
    load();
  }, [user, id]);

  if (!service) return <NotFound />;

  const nextDates = get_next_dates();
  const timeSlots = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-[var(--va-cream-light)] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[var(--va-cream-light)]/92 backdrop-blur-xl px-5 pt-4 pb-3 border-b border-[rgba(23,63,53,0.06)]">
        <div className="flex items-center gap-3">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)} className="p-2.5 rounded-xl hover:bg-[var(--va-cream)] active:scale-95 transition-all">
            <IconArrowLeft size={22} className="text-[var(--va-green)]" />
          </motion.button>
          <div className="flex-1">
            <h1 className="font-extrabold text-[#173F35] text-base">{service.name}</h1>
            <p className="text-xs text-[var(--va-text-muted)] mt-0.5">{service.description.slice(0, 40)}…</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mx-5 mt-4 flex gap-1.5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= step ? 'linear-gradient(90deg, #1E4D3F, #173F35)' : 'rgba(23,63,53,0.1)' }} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 0: Select option */}
        {step === 0 && (
          <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ type: 'spring', damping: 20 }} className="px-5 py-5 space-y-3">
            <p className="section-label mb-3">What do you need?</p>
            {service.options.map((opt: any, i: number) => (
              <motion.button
                key={opt.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.97, y: 1 }}
                onClick={() => { setSelectedOption(opt); setStep(1); }}
                className="w-full flex items-center justify-between p-4 rounded-[18px]"
                style={{
                  background: 'white',
                  border: '1.5px solid rgba(23,63,53,0.07)',
                  boxShadow: '0 2px 8px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <div>
                  <p className="font-bold text-sm text-[#173F35]">{opt.label}</p>
                  <p className="text-xs text-[var(--va-text-muted)] mt-0.5">₹{opt.priceRange[0]} – ₹{opt.priceRange[1]}</p>
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A8B9A5" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Step 1: Date & Time */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ type: 'spring', damping: 20 }} className="px-5 py-5 space-y-5">
            <div>
              <p className="section-label mb-3">Select Date</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {nextDates.map(d => (
                  <motion.button key={d.iso} whileTap={{ scale: 0.93 }} onClick={() => setSelectedDate(d.iso)}>
                    <DatePill date={d.iso.slice(8)} label={d.label} selected={selectedDate === d.iso} onPress={() => setSelectedDate(d.iso)} />
                  </motion.button>
                ))}
              </div>
            </div>
            <div>
              <p className="section-label mb-3">Select Time</p>
              <div className="flex flex-wrap gap-2">
                {timeSlots.map(t => (
                  <motion.button key={t} whileTap={{ scale: 0.93 }} onClick={() => setSelectedTime(t)}>
                    <TimePill time={t} selected={selectedTime === t} onPress={() => setSelectedTime(t)} />
                  </motion.button>
                ))}
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.97 }} disabled={!selectedDate || !selectedTime} onClick={() => setStep(2)} className="w-full btn-primary disabled:opacity-40">
              Continue
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Choose worker */}
        {step === 2 && (
          <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ type: 'spring', damping: 20 }} className="px-5 py-5 space-y-3">
            <p className="section-label mb-3">Choose a Professional</p>
            {workers.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">🔍</p>
                <p className="text-sm text-[var(--va-text-muted)]">Finding professionals near you…</p>
              </div>
            ) : workers.map((w, i) => (
              <motion.div key={w.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <WorkerCard worker={w} selected={selectedWorker?.id === w.id} onPress={() => setSelectedWorker(w)} />
              </motion.div>
            ))}
            <motion.button whileTap={{ scale: 0.97 }} disabled={!selectedWorker} onClick={() => setStep(3)} className="w-full btn-primary mt-4 disabled:opacity-40">
              Continue
            </motion.button>
          </motion.div>
        )}

        {/* Step 3: Summary */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ type: 'spring', damping: 20 }} className="px-5 py-5 space-y-4">
            <p className="section-label mb-3">Booking Summary</p>
            <div
              className="rounded-[22px] p-5"
              style={{
                background: 'white',
                border: '1.5px solid rgba(23,63,53,0.07)',
                boxShadow: '0 4px 16px rgba(23,63,53,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-[16px] flex items-center justify-center" style={{ background: `${service.color}14`, border: `1.5px solid ${service.color}25` }}>
                  <span style={{ fontSize: 22 }}>{service.icon}</span>
                </div>
                <div>
                  <p className="font-extrabold text-[#173F35]">{service.name}</p>
                  <p className="text-xs text-[var(--va-text-muted)]">{selectedOption?.label}</p>
                </div>
              </div>
              <InfoRow icon="👤" label="Professional" value={selectedWorker?.name || '—'} />
              <InfoRow icon="calendar" label="Date" value={selectedDate ? new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—'} />
              <InfoRow icon="🕐" label="Time" value={selectedTime || '—'} />
              <InfoRow icon="📍" label="Location" value={address?.line1 ? `${address.line1}, ${address.line2}` : 'Banjara Hills, Hyderabad'} />
              <div className="mt-4 pt-4 border-t border-[rgba(23,63,53,0.07)] flex items-center justify-between">
                <span className="text-sm text-[var(--va-text-muted)]">Estimated Price</span>
                <span className="font-extrabold text-xl text-[#173F35]">₹{selectedOption?.priceRange?.[0] ?? 650}</span>
              </div>
            </div>

            {/* Confirm button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={async () => {
                if (!selectedWorker || !selectedDate || !selectedTime || !user) return;
                const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
                const bid = `vh-${Date.now()}`;
                await db.bookings.add({
                  id: bid, customerId: user.id, workerId: selectedWorker.id,
                  serviceType: service.id, serviceOptionId: selectedOption?.id || 'general',
                  addressId: address?.id || 'a1', date: selectedDate || tomorrow,
                  time: selectedTime, status: 'requested' as any,
                  estimatedPrice: selectedOption?.priceRange?.[0] || 650,
                  createdAt: Date.now(),
                });
                await db.bookingEvents.add({
                  id: `${bid}-evt`, bookingId: bid, timestamp: Date.now(),
                  actorId: user.id, actorRole: 'customer', type: 'created',
                  message: `Booking requested for ${service.name}`,
                });
                navigate(`/booking/${bid}`);
              }}
              className="w-full btn-accent text-base py-4"
            >
              Confirm Booking — ₹{selectedOption?.priceRange?.[0] ?? 650}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <span className="text-base w-6 shrink-0">{icon}</span>
      <span className="text-xs text-[var(--va-text-muted)] w-20 shrink-0">{label}</span>
      <span className="text-sm font-semibold text-[#173F35] truncate">{value}</span>
    </div>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[var(--va-cream-light)] flex flex-col items-center justify-center px-6">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--va-green-pale)] flex items-center justify-center">
          <span className="text-3xl">🔍</span>
        </div>
        <p className="text-[var(--va-text-muted)] mb-4 text-center text-sm">Service not found</p>
        <button onClick={() => navigate('/')} className="btn-primary">Go Home</button>
      </motion.div>
    </div>
  );
}

function get_next_dates() {
  const labels = ['Today', 'Tomorrow', 'Wed 14', 'Thu 15', 'Fri 16', 'Sat 17'];
  return Array.from({ length: 6 }).map((_, i) => ({
    iso: new Date(Date.now() + i * 86400000).toISOString().slice(0, 10),
    label: labels[i],
  }));
}
