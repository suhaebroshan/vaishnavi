import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../db/store';
import type { UserRole } from '../types';

const workerAvatars: Record<string, string> = {
  'w1': 'Vikram Singh', 'w2': 'Ravi Kumar', 'w3': 'Mahesh Rao', 'w4': 'Arjun Reddy',
  'w5': 'Rahul Kumar', 'w6': 'Priya Sharma', 'w7': 'Suresh Naidu', 'w8': 'Anjali Rao',
  'w9': 'Deepak Verma', 'w10': 'Lakshmi Devi', 'w11': 'Kiran Patel', 'w12': 'Fatima Begum',
  'w13': 'Venkat Rao', 'w14': 'Divya Sri', 'w15': 'Anil Kapoor',
};

const customerAvatars: Record<string, string> = {
  'c1': 'Suhaeb', 'c2': 'Meera Sharma', 'c3': 'Ravi Kumar', 'c4': 'Ananya Reddy', 'c5': 'Arjun Mehta',
};

const roleLabels: Record<string, string> = {
  'c1': 'Customer', 'c2': 'Customer', 'c3': 'Customer', 'c4': 'Customer', 'c5': 'Customer',
  'w1': 'Plumbing Professional', 'w2': 'Plumbing Professional', 'w3': 'Plumbing Professional',
  'w4': 'Electrical Professional', 'w5': 'Housekeeping Professional',
  'w6': 'Cooking Professional', 'w7': 'Security Professional', 'w8': 'Elder Care Professional',
  'w9': 'Home Support Professional', 'w10': 'Caretaker Professional',
  'w11': 'Electrical Professional', 'w12': 'Cooking Professional',
  'w13': 'Housekeeping Professional', 'w14': 'Elder Care Professional', 'w15': 'Security Professional',
  'admin1': 'Administrator',
};

const avatarColors: Record<string, string> = {
  'w1': '#173F35', 'w2': '#1E4D3F', 'w3': '#2D6A4F', 'w4': '#C86F52',
  'w5': '#A8B9A5', 'w6': '#B55E42', 'w7': '#102F28', 'w8': '#1E4D3F',
  'w9': '#173F35', 'w10': '#C86F52', 'w11': '#2D6A4F', 'w12': '#102F28',
  'w13': '#173F35', 'w14': '#A8B9A5', 'w15': '#B55E42',
  'c1': '#173F35', 'c2': '#C86F52', 'c3': '#1E4D3F', 'c4': '#2D6A4F', 'c5': '#A8B9A5',
  'admin1': '#102F28',
};

type PersonEntry = {
  id: string;
  name: string;
  role: string;
  roleLabel: string;
  color: string;
  type: 'customer' | 'worker' | 'admin';
};

export default function AccountSwitcher({
  open, onOpenChange, onSwitch,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSwitch: (role: UserRole, userId?: string) => Promise<void>;
}) {
  const currentUser = useAppStore(s => s.currentUser);

  const people: PersonEntry[] = [
    { id: 'c1', name: 'Suhaeb', role: 'customer', roleLabel: 'Customer · Banjara Hills', color: '#173F35', type: 'customer' },
    { id: 'c2', name: 'Meera Sharma', role: 'customer', roleLabel: 'Customer ·HITEC City', color: '#C86F52', type: 'customer' },
    { id: 'c3', name: 'Ravi Kumar', role: 'customer', roleLabel: 'Customer · Gachibowli', color: '#1E4D3F', type: 'customer' },
    { id: 'c4', name: 'Ananya Reddy', role: 'customer', roleLabel: 'Customer · Jubilee Hills', color: '#2D6A4F', type: 'customer' },
    { id: 'w1', name: 'Vikram Singh', role: 'worker', roleLabel: 'Plumbing Professional', color: '#173F35', type: 'worker' },
    { id: 'w2', name: 'Ravi Kumar', role: 'worker', roleLabel: 'Plumbing Professional', color: '#1E4D3F', type: 'worker' },
    { id: 'w3', name: 'Mahesh Rao', role: 'worker', roleLabel: 'Plumbing Professional', color: '#2D6A4F', type: 'worker' },
    { id: 'w4', name: 'Arjun Reddy', role: 'worker', roleLabel: 'Electrical Professional', color: '#C86F52', type: 'worker' },
    { id: 'w5', name: 'Rahul Kumar', role: 'worker', roleLabel: 'Housekeeping Professional', color: '#A8B9A5', type: 'worker' },
    { id: 'w6', name: 'Priya Sharma', role: 'worker', roleLabel: 'Cooking Professional', color: '#B55E42', type: 'worker' },
    { id: 'w7', name: 'Suresh Naidu', role: 'worker', roleLabel: 'Security Professional', color: '#102F28', type: 'worker' },
    { id: 'w8', name: 'Anjali Rao', role: 'worker', roleLabel: 'Elder Care Professional', color: '#1E4D3F', type: 'worker' },
    { id: 'admin1', name: 'Vaishnavi Ops', role: 'admin', roleLabel: 'Administrator', color: '#102F28', type: 'admin' },
  ];

  const currentPersonId = currentUser?.role === 'admin' ? 'admin1' :
    currentUser?.role === 'worker' ? (currentUser as any).id || 'w1' : 'c1';
  const currentIdx = people.findIndex(p => p.id === currentPersonId);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.8 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[24px] overflow-hidden"
            style={{
              background: '#FBF9F4',
              boxShadow: '0 -8px 40px rgba(23,63,53,0.25)',
              borderTop: '1px solid rgba(255,255,255,0.5)',
              maxHeight: '75vh',
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2 sticky top-0 z-10" style={{ background: '#FBF9F4' }}>
              <div className="w-10 h-1 bg-[#D0CAC0] rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-2 sticky top-0 z-10" style={{ background: '#FBF9F4' }}>
              <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#8A9B8E] uppercase">Switch Experience</p>
            </div>

            {/* Current user highlight */}
            <div className="mx-4 mb-3 p-3 rounded-2xl flex items-center gap-3" style={{
              background: 'white',
              border: '1.5px solid rgba(23,63,53,0.10)',
              boxShadow: '0 2px 10px rgba(23,63,53,0.06), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}>
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{
                  background: `linear-gradient(145deg, ${people[currentIdx]?.color || '#173F35'}, ${people[currentIdx]?.color || '#173F35'}dd)`,
                  boxShadow: '0 3px 10px rgba(23,63,53,0.30)',
                }}
              >
                {people[currentIdx]?.name.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-[#173F35]">{people[currentIdx]?.name}</p>
                <p className="text-[11px] text-[#7A8B7E]">{people[currentIdx]?.roleLabel}</p>
              </div>
              <span className="text-[10px] font-bold bg-[#173F35] text-white px-2 py-1 rounded-full">YOU</span>
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto px-4 pb-8 scrollbar-hide" style={{ maxHeight: 'calc(75vh - 140px)' }}>
              <p className="text-[10px] font-extrabold tracking-[0.15em] text-[#A8B9A5] uppercase mb-2 mt-1 pl-1">All Accounts</p>
              {people.map((person, i) => (
                <motion.button
                  key={person.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.2 }}
                  whileTap={{ scale: 0.97, x: 3 }}
                  onClick={() => onSwitch(person.role as UserRole, person.id)}
                  className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-2xl mb-1 hover:bg-[#F5F0E7] transition-colors"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{
                      background: `linear-gradient(145deg, ${person.color}, ${person.color}cc)`,
                      boxShadow: `0 3px 8px ${person.color}40`,
                    }}
                  >
                    {person.name.charAt(0)}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-bold text-sm text-[#173F35] truncate">
                      {person.name}
                      {person.id === currentPersonId && (
                        <span className="ml-2 text-[9px] font-bold bg-[#C86F52] text-white px-1.5 py-0.5 rounded-full align-top">YOU</span>
                      )}
                    </p>
                    <p className="text-[11px] text-[#7A8B7E]">{person.roleLabel}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#A8B9A5] shrink-0">
                    <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
