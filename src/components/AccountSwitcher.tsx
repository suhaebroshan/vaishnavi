import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconLogOut, IconUser, IconCheck } from './icons';
import { useAppStore } from '../db/store';
import type { UserRole } from '../types';
import { db } from '../db/database';

const workerAvatars: Record<string, string> = {
  'w1': 'V', 'w2': 'R', 'w3': 'M', 'w4': 'A', 'w5': 'R',
  'w6': 'P', 'w7': 'S', 'w8': 'A', 'w9': 'D', 'w10': 'L',
  'w11': 'K', 'w12': 'F', 'w13': 'V', 'w14': 'D', 'w15': 'A',
};

const customerAvatars: Record<string, string> = {
  'c1': 'S', 'c2': 'M', 'c3': 'R', 'c4': 'A', 'c5': 'A',
};

const roleLabels: Record<string, string> = {
  'c1': 'Customer', 'c2': 'Customer', 'c3': 'Customer', 'c4': 'Customer', 'c5': 'Customer',
  'w1': 'Plumber', 'w2': 'Plumber', 'w3': 'Plumber', 'w4': 'Electrician', 'w5': 'Housekeeper',
  'w6': 'Cook', 'w7': 'Security', 'w8': 'Elder Care', 'w9': 'Home Support', 'w10': 'Caretaker',
  'w11': 'Electrician', 'w12': 'Cook', 'w13': 'Housekeeper', 'w14': 'Elder Care', 'w15': 'Security',
  'admin1': 'Administrator',
};

const workerNames: Record<string, string> = {
  'w1': 'Vikram Singh', 'w2': 'Ravi Kumar', 'w3': 'Mahesh Rao', 'w4': 'Arjun Reddy',
  'w5': 'Rahul Kumar', 'w6': 'Priya Sharma', 'w7': 'Suresh Naidu', 'w8': 'Anjali Rao',
  'w9': 'Deepak Verma', 'w10': 'Lakshmi Devi', 'w11': 'Kiran Patel', 'w12': 'Fatima Begum',
  'w13': 'Venkat Rao', 'w14': 'Divya Sri', 'w15': 'Anil Kapoor',
};

const customerNames: Record<string, string> = {
  'c1': 'Suhaeb', 'c2': 'Meera Sharma', 'c3': 'Ravi Kumar', 'c4': 'Ananya Reddy', 'c5': 'Arjun Mehta',
};

export default function AccountSwitcher({
  open, onOpenChange, onSwitch,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSwitch: (role: UserRole, userId?: string) => Promise<void>;
}) {
  const currentUser = useAppStore(s => s.currentUser);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-[28px] max-h-[78vh] overflow-y-auto scrollbar-hide"
            style={{
              background: 'linear-gradient(180deg, #FAF8F3 0%, #F5F0E7 100%)',
              boxShadow: '0 -8px 40px rgba(23,63,53,0.20)',
              borderTop: '1px solid rgba(255,255,255,0.6)',
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-4 pb-3 sticky top-0 z-10" style={{ background: 'linear-gradient(180deg, #FAF8F3 0%, transparent 100%)' }}>
              <div className="w-10 h-1 bg-[var(--va-border-str)] rounded-full" />
            </div>

            <div className="px-6 pb-8">
              {/* Current user header */}
              <div className="text-center mb-6">
                <p className="text-[10px] font-extrabold tracking-[0.2em] text-[var(--va-text-faint)] uppercase mb-4">Switch Account</p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
                    style={{ background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)', boxShadow: '0 4px 14px rgba(23,63,53,0.35)' }}
                  >
                    {currentUser?.name?.charAt(0) || '?'}
                  </div>
                  <div className="text-left">
                    <p className="font-extrabold text-[#173F35] text-base">{currentUser?.name}</p>
                    <p className="text-sm text-[var(--va-text-muted)] capitalize">{currentUser?.role}</p>
                  </div>
                </div>
              </div>

              <div className="nav-sep mb-5" />

              {/* CUSTOMERS */}
              <SectionLabel label="CUSTOMERS" />
              <AccountRow
                avatar="S" name="Suhaeb" sub="Customer · Banjara Hills" role="customer" current={currentUser?.role === 'customer'}
                onSelect={() => onSwitch('customer')}
              />

              {/* WORKERS */}
              <SectionLabel label="WORKERS" />
              {Object.entries(workerNames).map(([id, name]) => (
                <AccountRow
                  key={id}
                  avatar={workerAvatars[id] || name.charAt(0)}
                  name={name}
                  sub={roleLabels[id] || 'Worker'}
                  role="worker"
                  current={currentUser?.role === 'worker' && (currentUser as any).id === id}
                  onSelect={() => onSwitch('worker', id)}
                />
              ))}

              {/* ADMIN */}
              <SectionLabel label="ADMIN" />
              <AccountRow
                avatar="O" name="Vaishnavi Ops" sub="Administrator" role="admin" current={currentUser?.role === 'admin'}
                onSelect={() => onSwitch('admin')}
              />

              <div className="nav-sep my-5" />

              {/* Demo hint */}
              <div className="text-center mb-4">
                <p className="text-[10px] text-[var(--va-text-faint)]">💡 Three-finger swipe cycles roles</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p className="text-[10px] font-extrabold tracking-[0.2em] text-[var(--va-text-faint)] mt-5 mb-2 px-1">{label}</p>
  );
}

function AccountRow({
  avatar, name, sub, role, current, onSelect,
}: {
  avatar: string; name: string; sub: string; role: string; current: boolean; onSelect: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98, x: 4 }}
      onClick={onSelect}
      className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl hover:bg-[var(--va-cream)] transition-colors"
    >
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 transition-all duration-200 ${current ? '' : ''}`}
        style={{
          background: current
            ? 'linear-gradient(145deg, #C86F52 0%, #B55E42 100%)'
            : 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)',
          boxShadow: current
            ? '0 3px 10px rgba(200,111,82,0.35)'
            : '0 3px 10px rgba(23,63,53,0.30)',
        }}
      >
        {avatar}
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="font-bold text-sm text-[#173F35]">
          {name}
          {current && (
            <span className="ml-2 text-[10px] font-bold bg-[var(--va-green)] text-white px-2 py-0.5 rounded-full">YOU</span>
          )}
        </p>
        <p className="text-[11px] text-[var(--va-text-muted)]">{sub}</p>
      </div>
      {current && <IconCheck size={16} className="text-[var(--va-terracotta)] shrink-0" />}
      {!current && (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[var(--va-sage)] shrink-0">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      )}
    </motion.button>
  );
}
