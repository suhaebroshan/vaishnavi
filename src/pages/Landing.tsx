import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '../db/store';
import { SERVICES } from '../db/seed';
import { IconWrench, IconChef, IconBroom, IconShield, IconLightning, IconHeart, IconSparkle, IconUsers } from '../components/icons';
import { db } from '../db/database';

const LOADER_DURATION = 1500;

type AccountType = 'customer' | 'worker' | 'admin';

interface AccountDef {
  id: AccountType;
  label: string;
  subtitle: string;
  sampleName: string;
  sampleRole: string;
  gradient: [string, string];
  accentColor: string;
  icon: React.ReactNode;
  features: string[];
}

const ACCOUNTS: Record<AccountType, AccountDef> = {
  customer: {
    id: 'customer',
    label: 'Customer',
    subtitle: 'Book trusted help for your home',
    sampleName: 'Suhaeb',
    sampleRole: 'Banjara Hills, Hyderabad',
    gradient: ['#173F35', '#2D6A4F'],
    accentColor: '#173F35',
    icon: <IconSparkle size={26} />,
    features: ['Browse 8+ services', 'Live booking tracking', 'Secure payments', 'Real-time chat'],
  },
  worker: {
    id: 'worker',
    label: 'Professional',
    subtitle: 'Find jobs near you & earn on your schedule',
    sampleName: 'Vikram Singh',
    sampleRole: 'Plumbing Professional · 4.8★',
    gradient: ['#C86F52', '#B55E42'],
    accentColor: '#C86F52',
    icon: <IconWrench size={26} />,
    features: ['Instant job requests', 'Earn tracker', 'In-app messaging', 'Performance insights'],
  },
  admin: {
    id: 'admin',
    label: 'Administrator',
    subtitle: 'Manage operations, bookings & workforce',
    sampleName: 'Vaishnavi Ops',
    sampleRole: 'Operations Dashboard',
    gradient: ['#102F28', '#1E4D3F'],
    accentColor: '#102F28',
    icon: <IconUsers size={26} />,
    features: ['Live map view', 'Revenue analytics', 'Worker management', 'Booking oversight'],
  },
};

/* ═══════════════════════════════════════════════════════════
   ACCOUNT CARD
   ═══════════════════════════════════════════════════════════ */
function AccountCard({
  def, onSelect, isDefault, index,
}: {
  def: AccountDef;
  onSelect: () => void;
  isDefault?: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      className="relative rounded-[24px] overflow-hidden cursor-pointer"
      style={{
        background: `linear-gradient(160deg, ${def.gradient[0]} 0%, ${def.gradient[1]} 100%)`,
        boxShadow: hovered
          ? `0 12px 40px ${def.accentColor}55`
          : `0 6px 24px ${def.accentColor}30`,
        border: isDefault
          ? `2px solid rgba(255,255,255,0.30)`
          : '2px solid transparent',
        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 4 L36 36 L4 36 Z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative p-5 pb-4">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-12 h-12 rounded-[16px] flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
          >
            <span style={{ color: 'white' }}>{def.icon}</span>
          </div>
          {isDefault && (
            <div
              className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase"
              style={{ background: 'rgba(255,255,255,0.20)', color: 'white', backdropFilter: 'blur(8px)' }}
            >
              Default
            </div>
          )}
        </div>

        {/* Sample avatar */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
            style={{
              background: 'rgba(255,255,255,0.20)',
              border: '2px solid rgba(255,255,255,0.30)',
            }}
          >
            {def.sampleName.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-white text-sm">{def.sampleName}</p>
            <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.65)' }}>{def.sampleRole}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-4" />

        {/* Features */}
        <div className="space-y-2 mb-4">
          {def.features.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>{f}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className="w-full py-3 rounded-[14px] text-center font-bold text-sm"
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: 'white',
            backdropFilter: 'blur(8px)',
            transition: 'background 0.2s ease',
            ...(hovered ? { background: 'rgba(255,255,255,0.25)' } : {}),
          }}
        >
          Enter as {def.label} →
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN LANDING PAGE
   ═══════════════════════════════════════════════════════════ */
export default function Landing() {
  const navigate = useNavigate();
  const setCurrentUser = useAppStore(s => s.setCurrentUser);
  const switchToRole = useAppStore(s => s.switchToRole);
  // No progress bar needed — cards render immediately on mount.

  const handleSelect = async (role: AccountType) => {
    await switchToRole(role);

    let fresh: any = null;
    if (role === 'customer') fresh = await db.customers.get('c1');
    else if (role === 'worker') fresh = await db.workers.get('w1');
    else if (role === 'admin') fresh = await db.admins.get('admin1');

    if (fresh) {
      setCurrentUser(fresh);
      localStorage.setItem('vaishnavi-current-user', JSON.stringify(fresh));
    }

    // Navigate immediately after store is ready — no delay needed
    const targetPath = role === 'admin' ? '/admin/dashboard' : role === 'worker' ? '/worker/home' : '/';
    navigate(targetPath);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#FBF9F4' }}>
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30 5 C20 15, 10 25, 15 40 C20 50, 30 55, 30 55 C30 55, 40 50, 45 40 C50 25, 40 15, 30 5Z' fill='%23173F35'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative z-10 max-w-[480px] mx-auto px-5 pb-16">
        {/* ── BRAND ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center pt-10 pb-8"
        >
          {/* Leaf Logo */}
          <motion.div
            initial={{ scale: 0.5, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 mx-auto mb-5"
          >
            <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
              <defs>
                <linearGradient id="leafGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2D6A4F" />
                  <stop offset="100%" stopColor="#173F35" />
                </linearGradient>
              </defs>
              <path d="M40 8C28 18 12 32 15 52C18 68 32 80 40 92C48 80 62 68 65 52C68 32 52 18 40 8Z" fill="url(#leafGradMain)" />
              <path d="M40 18V82" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M40 35C34 32 28 33 24 38" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M40 50C46 47 52 48 56 53" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M40 65C35 62 30 63 26 68" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            </svg>
          </motion.div>

          <motion.p
            className="text-[32px] font-black tracking-[0.14em] uppercase"
            style={{ color: '#173F35', letterSpacing: '0.16em' }}
          >
            Vaishnavi
          </motion.p>
          <motion.p
            className="text-sm font-medium tracking-wide mt-1"
            style={{ color: '#7A8B7E', letterSpacing: '0.06em' }}
          >
            Help for Everyday Life
          </motion.p>
          <motion.p
            className="text-sm italic mt-3 font-semibold"
            style={{ color: '#5A6B5E' }}
          >
            Your home. Our people. A better everyday.
          </motion.p>
        </motion.div>

        {/* ── SECTION LABEL ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-5"
        >
          <p className="text-[10px] font-extrabold tracking-[0.2em] text-[#A8B9A5] uppercase text-center">
            Choose your experience
          </p>
        </motion.div>

        {/* ── ACCOUNT CARDS ─────────────────────────── */}
        <div className="space-y-4">
          {(['customer', 'worker', 'admin'] as AccountType[]).map((roleId, i) => (
            <AccountCard
              key={roleId}
              def={ACCOUNTS[roleId]}
              onSelect={() => handleSelect(roleId)}
              isDefault={i === 0}
              index={i}
            />
          ))}
        </div>

        {/* ── SERVICE PREVIEW ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <p className="text-[10px] font-extrabold tracking-[0.15em] text-[#A8B9A5] uppercase text-center mb-4">
            Available Services
          </p>
          <div className="grid grid-cols-4 gap-3">
            {SERVICES.slice(0, 8).map((svc, i) => (
              <motion.div
                key={svc.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.04 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center"
                  style={{ background: svc.color + '12', color: svc.color }}
                >
                  {svc.icon}
                </div>
                <span className="text-[9px] font-medium text-[#7A8B7E] text-center leading-tight">{svc.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── FOOTER ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-4 text-[10px] text-[#A8B9A5] font-medium">
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 22s-8-4-8-10V5l8-3 8 3v7c0 6-8 10-8 10z" stroke="currentColor" strokeWidth="2"/></svg>
              Verified Professionals
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              Real-time Tracking
            </span>
            <span className="flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2"/><path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Secure Payments
            </span>
          </div>
          <p className="text-[10px] text-[#C4CFC4] mt-4">© 2026 Vaishnavi Services Pvt. Ltd.</p>
        </motion.div>
      </div>
    </div>
  );
}
