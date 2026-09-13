import { type SVGProps } from 'react';

/* ═══════════════════════════════════════════════════════════
   VAISHNAVI CUSTOM ICON SYSTEM
   Hand-crafted SVG icons — zero external icon library deps
   ═══════════════════════════════════════════════════════════ */

type IconProps = SVGProps<SVGSVGElement> & { size?: number; className?: string };

const BaseIcon = ({ children, size = 24, className = '' }: IconProps) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true"
  >{children}</svg>
);

/* ── Navigation ───────────────────────────────────────────── */
export const IconHome = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10.5z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </BaseIcon>
);

export const IconSearch = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="11" cy="11" r="7"/>
    <line x1="16.5" y1="16.5" x2="22" y2="22"/>
  </BaseIcon>
);

export const IconCalendar = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <rect x="6" y="13" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/>
  </BaseIcon>
);

export const IconBell = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </BaseIcon>
);

export const IconUser = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="8" r="4"/>
    <path d="M20 21a8 8 0 1 0-16 0"/>
  </BaseIcon>
);

export const IconChat = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </BaseIcon>
);

export const IconArrowLeft = (p: IconProps) => (
  <BaseIcon {...p}>
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12 19 5 12 12 5"/>
  </BaseIcon>
);

export const IconArrowRight = (p: IconProps) => (
  <BaseIcon {...p}>
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </BaseIcon>
);

export const IconCheck = (p: IconProps) => (
  <BaseIcon {...p}>
    <polyline points="20 6 9 17 4 12"/>
  </BaseIcon>
);

export const IconX = (p: IconProps) => (
  <BaseIcon {...p}>
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </BaseIcon>
);

export const IconMapPin = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
  </BaseIcon>
);

export const IconPhone = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.09 8.63 19.79 19.79 0 0 1 1.02 5.18 2 2 0 0 1 3 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </BaseIcon>
);

export const IconClock = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </BaseIcon>
);

export const IconCalendarDays = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <rect x="6" y="13" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/>
    <rect x="11" y="13" width="3" height="3" rx="0.5" fill="currentColor" stroke="none"/>
  </BaseIcon>
);

export const IconStar = ({ filled = false, ...p }: IconProps & { filled?: boolean }) => (
  <svg width={p.size || 24} height={p.size || 24} viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
    className={p.className} aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

export const IconTrendingUp = (p: IconProps) => (
  <BaseIcon {...p}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </BaseIcon>
);

export const IconWallet = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </BaseIcon>
);

export const IconBriefcase = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
  </BaseIcon>
);

export const IconLayout = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </BaseIcon>
);

export const IconMap = (p: IconProps) => (
  <BaseIcon {...p}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
    <line x1="8" y1="2" x2="8" y2="18"/>
    <line x1="16" y1="6" x2="16" y2="22"/>
  </BaseIcon>
);

export const IconClipboard = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1"/>
  </BaseIcon>
);

export const IconUsers = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </BaseIcon>
);

export const IconNav = (p: IconProps) => (
  <BaseIcon {...p}>
    <polygon points="3 11 22 2 13 21 11 13 3 11"/>
  </BaseIcon>
);

export const IconTruck = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="1" y="3" width="15" height="13"/>
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </BaseIcon>
);

export const IconLiveTrack = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </BaseIcon>
);

export const IconCheckCircle = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M22 11.08V12a10 10 0 0 1-5.93 9.14"/>
    <polyline points="22 4 12 14.01 9 11.01" strokeWidth="2.5"/>
  </BaseIcon>
);

export const IconVerified = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M22 11.08V12a10 10 0 0 1-5.93 9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </BaseIcon>
);

export const IconMicOff = (p: IconProps) => (
  <BaseIcon {...p}>
    <line x1="1" y1="1" x2="23" y2="23"/>
    <rect x="9" y="2" width="6" height="11" rx="3"/>
    <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </BaseIcon>
);

export const IconVolume2 = (p: IconProps) => (
  <BaseIcon {...p}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </BaseIcon>
);

export const IconPhoneOff = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M10.68 13.31a16 16 0 0 0 9.14-9.14L20 4l-5 5"/>
    <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2"/>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.09 8.63 19.79 19.79 0 0 1 1.02 5.18 2 2 0 0 1 3 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </BaseIcon>
);

export const IconSend = (p: IconProps) => (
  <BaseIcon {...p}>
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </BaseIcon>
);

export const IconPlus = (p: IconProps) => (
  <BaseIcon {...p}>
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </BaseIcon>
);

export const IconMic = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="9" y="2" width="6" height="11" rx="3"/>
    <path d="M19 10v1a7 7 0 0 1-14 0v-1"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </BaseIcon>
);

export const IconSpeaker = (p: IconProps) => (
  <BaseIcon {...p}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </BaseIcon>
);

export const IconLogOut = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </BaseIcon>
);

export const IconHelpCircle = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </BaseIcon>
);

export const IconCreditCard = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="1" y="4" width="22" height="16" rx="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </BaseIcon>
);

export const IconHeartOutline = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </BaseIcon>
);

export const IconWifi = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </BaseIcon>
);

export const IconWifiOff = (p: IconProps) => (
  <BaseIcon {...p}>
    <line x1="1" y1="1" x2="23" y2="23"/>
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/>
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/>
    <path d="M10.71 5.05A16 16 0 0 1 22.36 9"/>
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
    <line x1="12" y1="20" x2="12.01" y2="20"/>
  </BaseIcon>
);

export const IconShield = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <polyline points="9 12 11 14 15 10"/>
  </BaseIcon>
);

export const IconWrench = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </BaseIcon>
);

export const IconLightning = (p: IconProps) => (
  <BaseIcon {...p}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </BaseIcon>
);

export const IconSparkle = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z"/>
    <path d="M19 15l.5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5.5-2z"/>
  </BaseIcon>
);

export const IconHeart = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </BaseIcon>
);

export const IconChef = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M6 13.87A2 2 0 0 1 7.71 16h8.58A2 2 0 0 1 18 13.87V7H6v6.87z"/>
    <path d="M6 3h12v4H6z"/>
    <path d="M12 3V1"/><path d="M8 3V2"/><path d="M16 3V2"/>
  </BaseIcon>
);

export const IconBroom = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M12 2v7"/>
    <path d="M8 4l8 4"/>
    <path d="M4 20l2-8 4-4"/>
    <path d="M18 8l2 4-4 8"/>
    <path d="M6 20l3-3 6-6"/>
  </BaseIcon>
);

export const IconSettings = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </BaseIcon>
);

export const IconMoreHorizontal = (p: IconProps) => (
  <BaseIcon {...p}>
    <circle cx="12" cy="12" r="1"/>
    <circle cx="19" cy="12" r="1"/>
    <circle cx="5" cy="12" r="1"/>
  </BaseIcon>
);

export const IconSwap = (p: IconProps) => (
  <BaseIcon {...p}>
    <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
    <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
  </BaseIcon>
);

export const IconMinus = (p: IconProps) => (
  <BaseIcon {...p}>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </BaseIcon>
);

export const IconPause = (p: IconProps) => (
  <BaseIcon {...p}>
    <rect x="6" y="4" width="4" height="16"/>
    <rect x="14" y="4" width="4" height="16"/>
  </BaseIcon>
);

export const IconPlay = (p: IconProps) => (
  <BaseIcon {...p}>
    <polygon points="5 3 19 12 5 21 5 3"/>
  </BaseIcon>
);

/* ═══════════════════════════════════════════════════════════
   SERVICE ICONS — Custom SVG per service type
   ═══════════════════════════════════════════════════════════ */

const SERVICE_SVG: Record<string, React.ReactNode> = {
  housekeeping: (
    <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
      <rect x="3" y="8" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <line x1="3" y1="14" x2="25" y2="14" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M9 8V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.4"/>
      <circle cx="14" cy="19" r="1.5" fill="currentColor"/>
    </svg>
  ),
  cooking: (
    <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
      <path d="M5 20c0-4 3-8 9-10 6 2 9 6 9 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M8 20h12" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M11 10c0-2 1-4 3-4s3 2 3 4" stroke="currentColor" strokeWidth="1.4"/>
      <path d="M7 8c.5-1 1.5-2 2-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M14 5c.5-1 1.5-2 2-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M21 8c.5-1 1.5-2 2-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  plumbing: (
    <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
      <path d="M19 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <path d="M15 4h4v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 19l4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
      <rect x="14" y="14" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  electrical: (
    <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
      <polygon points="16 3 6 16 13 16 11 25 22 11 15 11 16 3" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
    </svg>
  ),
  security: (
    <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
      <path d="M14 3L4 8v7c0 6 4 10 10 12 6-2 10-6 10-12V8L14 3z" stroke="currentColor" strokeWidth="1.7"/>
      <polyline points="10 14 13 17 18 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  elder_care: (
    <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
      <path d="M14 24s-7-4.5-7-9.5c0-3.5 3-6 7-6s7 2.5 7 6c0 5-7 9.5-7 9.5z" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="11" cy="13" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="17" cy="13" r="1.5" fill="currentColor" stroke="none"/>
      <path d="M12 17c.8.8 2.2.8 3 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  caretaker: (
    <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
      <rect x="4" y="10" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.7"/>
      <path d="M9 10V7a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.7"/>
      <circle cx="14" cy="17" r="2" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  home_support: (
    <svg viewBox="0 0 28 28" fill="none" className="w-full h-full">
      <path d="M14 3L3 12v11a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V12L14 3z" stroke="currentColor" strokeWidth="1.7"/>
      <rect x="10" y="17" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="14" y1="17" x2="14" y2="25" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
};

export function ServiceIcon({ serviceId, size = 28, color = 'currentColor' }: { serviceId: string; size?: number; color?: string }) {
  const svg = SERVICE_SVG[serviceId];
  if (!svg) return null;
  return (
    <span style={{ color, width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {svg}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   STAR RATING COMPONENT
   ═══════════════════════════════════════════════════════════ */
export function StarRating({ rating, size = 14, count = 5 }: { rating: number; size?: number; count?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: count }).map((_, i) => (
        <IconStar
          key={i}
          size={size}
          filled={i < Math.round(rating)}
          className={i < Math.round(rating) ? 'text-[#C86F52]' : 'text-[#D4CFC4]'}
        />
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPORT ALL ICONS AS NAMED EXPORTS FOR CONVENIENCE
   ═══════════════════════════════════════════════════════════ */
export default {
  IconHome, IconSearch, IconCalendar, IconBell, IconUser, IconChat,
  IconArrowLeft, IconArrowRight, IconCheck, IconX, IconMapPin,
  IconPhone, IconClock, IconStar, IconTrendingUp, IconWallet,
  IconBriefcase, IconLayout, IconMap, IconClipboard, IconUsers,
  IconNav, IconTruck, IconLiveTrack, IconVerified, IconSend,
  IconPlus, IconMinus, IconMic, IconSpeaker, IconLogOut,
  IconHelpCircle, IconCreditCard, IconHeartOutline, IconWifi,
  IconWifiOff, IconShield, IconWrench, IconLightning, IconSparkle,
  IconHeart, IconChef, IconBroom, IconSettings, IconMoreHorizontal,
  IconPause, IconPlay, IconCalendarDays,
};
