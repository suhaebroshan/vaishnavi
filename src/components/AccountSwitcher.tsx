import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { useAppStore } from '../db/store';
import type { UserRole } from '../types';

export default function AccountSwitcher({
  open,
  onOpenChange,
  onSwitch,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSwitch: (role: UserRole) => Promise<void>;
}) {
  const currentUser = useAppStore(s => s.currentUser);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-[#FBF9F4] rounded-t-[28px] max-h-[70vh] overflow-y-auto shadow-2xl"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#C8B9A5]/50 rounded-full" />
            </div>

            <div className="px-6 pb-8">
              {/* Current user header */}
              <div className="text-center mb-6">
                <p className="text-xs font-medium text-[#7A8B7E] uppercase tracking-widest mb-3">Switch Account</p>
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-12 h-12 rounded-full bg-[#173F35] flex items-center justify-center text-white font-bold text-lg">
                    {currentUser?.name?.charAt(0) || '?'}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#173F35] text-base">{currentUser?.name}</p>
                    <p className="text-sm text-[#7A8B7E] capitalize">{currentUser?.role}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[rgba(23,63,53,0.1)] pt-4" />

              {/* Customers */}
              <SectionLabel label="CUSTOMERS" />
              <AccountRow
                avatar="S"
                name="Suhaeb"
                sub="Customer"
                role="customer"
                current={currentUser?.role === 'customer' && currentUser?.id === 'c1'}
                onSelect={() => onSwitch('customer')}
              />

              {/* Workers */}
              <SectionLabel label="WORKERS" />
              <AccountRow avatar="V" name="Vikram Singh" sub="Plumber" role="worker" current={currentUser?.role === 'worker' && currentUser?.id === 'w1'} onSelect={() => onSwitch('worker')} />
              <AccountRow avatar="A" name="Arjun Reddy" sub="Electrician" role="worker" current={false} onSelect={() => onSwitch('worker')} />
              <AccountRow avatar="R" name="Rahul Kumar" sub="Housekeeping" role="worker" current={false} onSelect={() => onSwitch('worker')} />
              <AccountRow avatar="P" name="Priya Sharma" sub="Cook" role="worker" current={false} onSelect={() => onSwitch('worker')} />
              <AccountRow avatar="S" name="Suresh Naidu" sub="Security" role="worker" current={false} onSelect={() => onSwitch('worker')} />
              <AccountRow avatar="A" name="Anjali Rao" sub="Caretaker" role="worker" current={false} onSelect={() => onSwitch('worker')} />

              {/* Admin */}
              <SectionLabel label="ADMIN" />
              <AccountRow
                avatar="O"
                name="Vaishnavi Ops"
                sub="Administrator"
                role="admin"
                current={currentUser?.role === 'admin'}
                onSelect={() => onSwitch('admin')}
              />

              <div className="border-t border-[rgba(23,63,53,0.1)] my-4" />

              {/* Sign out */}
              <button
                onClick={() => { onOpenChange(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-medium text-sm">Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-bold tracking-[0.2em] text-[#7A8B7E] mt-5 mb-2 px-1">{label}</p>
  );
}

function AccountRow({
  avatar, name, sub, role, current, onSelect,
}: {
  avatar: string;
  name: string;
  sub: string;
  role: UserRole;
  current: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onSelect}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-[#F5F0E7] transition-colors"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${current ? 'bg-[#C86F52]' : 'bg-[#173F35]'}`}>
        {avatar}
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-sm text-[#173F35]">
          {name}
          {current && <span className="ml-2 text-[10px] font-medium bg-[#173F35] text-white px-2 py-0.5 rounded-full">YOU</span>}
        </p>
        <p className="text-xs text-[#7A8B7E]">{sub}</p>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="#A8B9A5" strokeWidth="1.5" strokeLinecap="round"/></svg>
    </motion.button>
  );
}
