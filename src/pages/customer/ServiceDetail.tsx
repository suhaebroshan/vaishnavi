import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '../../db/database';
import { useAppStore } from '../../db/store';
import { WorkerCard } from '../../components/Cards';

const servicesRegistry = (window as any).__services || [];

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAppStore(s => s.currentUser);
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedWorker, setSelectedWorker] = useState('');
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([]);
  const [bookingId, setBookingId] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const service = servicesRegistry.find((s: any) => s.id === id);
  const options = service?.options || [];

  useEffect(() => {
    if (id) {
      db.workers.where('serviceType').equals(id).toArray().then(setAvailableWorkers).catch(() => {});
    }
  }, [id, step]);

  async function handleConfirm() {
    if (!user || !id) return;
    setConfirming(true);

    const bid = `vh-${Math.floor(Math.random() * 8999 + 1000)}`;
    const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
    const cust = user as any;
    const addressId = cust.defaultAddress?.id || 'a1';

    await db.bookings.add({
      id: bid, customerId: user.id, workerId: selectedWorker || availableWorkers[0]?.id,
      serviceType: id, serviceOptionId: selectedOption || 'general', addressId,
      date: tomorrow, time: '4:00 PM', status: 'requested', estimatedPrice: 650, createdAt: Date.now(),
    } as any);

    await db.bookingEvents.add({
      id: `${bid}-evt`, bookingId: bid, timestamp: Date.now(),
      actorId: user.id, actorRole: 'customer', type: 'created', message: 'Booking requested',
    } as any);

    const worker = availableWorkers.find((w: any) => w.id === (user as any).defaultWorkerId || selectedWorker || availableWorkers[0]?.id);
    if (worker) {
      await db.notifications.add({
        id: `n-${Date.now()}`, userId: worker.id, type: 'new_booking',
        title: 'New Request', message: `${user.name} requested ${id.replace('_', ' ')} service.`,
        reading: false, createdAt: Date.now(),
      });
    }

    setBookingId(bid);
    setConfirming(false);
    setConfirmed(true);
  }

  if (confirmed) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center px-6">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 20, stiffness: 300 }} className="text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', damping: 15 }} className="w-20 h-20 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M10 20L17 27L30 13" stroke="#173F35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </motion.div>
          <h1 className="text-2xl font-bold text-[#173F35] mb-2">You're All Set!</h1>
          <p className="text-[#7A8B7E] mb-8">Your request has been sent to the professional.</p>
          <button onClick={() => navigate('/')} className="w-full vaishnavi-btn vaishnavi-btn-primary mb-3">Go to Home</button>
          <button onClick={() => navigate(`/booking/${bookingId}`)} className="w-full vaishnavi-btn vaishnavi-btn-secondary">View Booking</button>
        </motion.div>
      </div>
    );
  }

  if (!service) return <div className="p-8 text-center text-[#7A8B7E]">Loading...</div>;

  const steps = ['options', 'datetime', 'address', 'workers', 'summary'];

  return (
    <div className="min-h-screen bg-[#FBF9F4] pb-24">
      <div className="sticky top-0 z-30 bg-[#FBF9F4]/90 backdrop-blur-md px-5 py-3 flex items-center gap-3">
        <button onClick={() => step > 0 ? setStep(step - 1) : navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-[#F5F0E7]">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 4L6 10L12 16" stroke="#173F35" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-[#173F35] text-base">{service.name}</h1>
          <div className="flex gap-1 mt-1">
            {steps.map((_, i) => <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-[#173F35]' : 'bg-[#A8B9A5]/30'}`} />)}
          </div>
        </div>
        <span className="text-xs font-medium text-[#7A8B7E]">{step + 1}/5</span>
      </div>

      <div className="px-5 py-4">
        {step === 0 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <p className="text-sm text-[#7A8B7E] mb-4">{service.description}</p>
            <h2 className="font-bold text-[#173F35] mb-3">What kind of help do you need?</h2>
            <div className="space-y-2">
              {options.map((opt: any) => (
                <motion.button key={opt.id} whileTap={{ scale: 0.98 }} onClick={() => { setSelectedOption(opt.id); setStep(1); }} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white border border-[rgba(23,63,53,0.08)]">
                  <span className="font-medium text-sm text-[#173F35]">{opt.label}</span>
                  <span className="text-sm text-[#7A8B7E]">₹{opt.priceRange[0]}–₹{opt.priceRange[1]}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="font-bold text-[#173F35] mb-3">When?</h2>
            <div className="mb-5"><p className="text-xs font-semibold text-[#7A8B7E] uppercase tracking-wider mb-2">Date</p><div className="flex gap-2">
              {['Today', 'Tomorrow', 'Sep 14', 'Sep 15'].map((d, i) => (<button key={d} className={`px-4 py-3 rounded-xl text-sm font-medium flex-1 transition-all ${i === 1 ? 'bg-[#173F35] text-white' : 'bg-white text-[#173F35] border border-[rgba(23,63,53,0.1)]'}`}>{d}</button>))}
            </div></div>
            <div className="mb-6"><p className="text-xs font-semibold text-[#7A8B7E] uppercase tracking-wider mb-2">Time</p><div className="grid grid-cols-3 gap-2">
              {['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM', '8:00 PM'].map((t, i) => (<button key={t} className={`py-3 rounded-xl text-sm font-medium transition-all ${i === 3 ? 'bg-[#173F35] text-white' : 'bg-white text-[#173F35] border border-[rgba(23,63,53,0.1)]'}`}>{t}</button>))}
            </div></div>
            <button onClick={() => setStep(2)} className="w-full vaishnavi-btn vaishnavi-btn-primary">Continue</button>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="font-bold text-[#173F35] mb-3">Where?</h2>
            <div className="space-y-2 mb-6">
              <button className="w-full p-4 rounded-2xl bg-white border-2 border-[#173F35] text-left">
                <div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#173F35] text-white flex items-center justify-center text-sm">🏠</div><div><p className="font-semibold text-sm text-[#173F35]">Home</p><p className="text-xs text-[#7A8B7E]">Banjara Hills, Hyderabad</p></div></div>
              </button>
            </div>
            <button onClick={() => setStep(3)} className="w-full vaishnavi-btn vaishnavi-btn-primary">Continue</button>
          </motion.div>
        )}
        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="font-bold text-[#173F35] mb-1">Choose professional</h2>
            <p className="text-sm text-[#7A8B7E] mb-4">Available for {service.name}</p>
            <div className="space-y-2 mb-6">
              {availableWorkers.map((w: any) => (<WorkerCard key={w.id} worker={w} selected={selectedWorker === w.id} onPress={() => setSelectedWorker(w.id)} />))}
              {availableWorkers.length === 0 && <p className="text-sm text-[#7A8B7E] text-center py-8">No professionals available right now.</p>}
            </div>
            <button onClick={() => setStep(4)} disabled={!selectedWorker} className={`w-full vaishnavi-btn ${selectedWorker ? 'vaishnavi-btn-primary' : 'bg-[#A8B9A5] cursor-not-allowed'}`}>Continue</button>
          </motion.div>
        )}
        {step === 4 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 className="font-bold text-[#173F35] mb-4">Booking Summary</h2>
            <div className="bg-white rounded-2xl border border-[rgba(23,63,53,0.08)] p-5 space-y-3 mb-6">
              <SummaryRow label="Service" value={`${service.name} — ${options.find((o: any) => o.id === selectedOption)?.label || ''}`} />
              <SummaryRow label="Professional" value={availableWorkers.find((w: any) => w.id === selectedWorker)?.name || 'Auto-assigned'} />
              <SummaryRow label="Date" value="Tomorrow" />
              <SummaryRow label="Time" value="4:00 PM" />
              <SummaryRow label="Address" value="Banjara Hills, Hyderabad" />
              <div className="pt-3 border-t border-[rgba(23,63,53,0.08)] flex items-center justify-between"><span className="font-semibold text-[#173F35]">Estimated Price</span><span className="text-xl font-bold text-[#173F35]">₹650</span></div>
            </div>
            <motion.button whileTap={{ scale: confirming ? 0.95 : 0.97 }} onClick={handleConfirm} disabled={confirming} className="w-full vaishnavi-btn vaishnavi-btn-primary">
              {confirming ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Confirming...</span> : 'Confirm Booking'}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between"><span className="text-sm text-[#7A8B7E]">{label}</span><span className="text-sm font-medium text-[#173F35]">{value}</span></div>
  );
}
