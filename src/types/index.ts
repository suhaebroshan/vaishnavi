export type UserRole = 'customer' | 'worker' | 'admin';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email?: string;
  avatarUrl?: string;
  createdAt: number;
}

// ─── WORKER ───────────────────────────────────────────────
export interface Worker extends User {
  role: 'worker';
  serviceType: ServiceType;
  rating: number;
  totalJobs: number;
  completionRate: number;
  bio: string;
  skills: string[];
  status: 'online' | 'offline' | 'busy';
  todayEarnings: number;
  weekEarnings: number;
  monthEarnings: number;
  location: string;
}

// ─── CUSTOMER ─────────────────────────────────────────────
export interface Customer extends User {
  role: 'customer';
  defaultAddress?: Address;
  totalBookings: number;
  totalSpent: number;
  favoriteWorkerIds: string[];
}

// ─── ADMIN ────────────────────────────────────────────────
export interface Admin extends User {
  role: 'admin';
  badge?: string;
}

export type AppUser = User | Worker | Customer | Admin;

// ─── SERVICE TYPES ────────────────────────────────────────
export type ServiceType =
  | 'housekeeping'
  | 'cooking'
  | 'plumbing'
  | 'electrical'
  | 'security'
  | 'elder_care'
  | 'caretaker'
  | 'home_support';

export interface ServiceOption {
  id: string;
  label: string;
  priceRange: [number, number];
}

export interface Service {
  id: ServiceType;
  name: string;
  description: string;
  icon: string;
  color: string;
  options: ServiceOption[];
  imagePrompt?: string;
}

// ─── ADDRESS ──────────────────────────────────────────────
export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  landmark?: string;
  lat?: number;
  lng?: number;
}

// ─── BOOKING STATUS ───────────────────────────────────────
export type BookingStatus =
  | 'requested'
  | 'assigned'
  | 'on_the_way'
  | 'nearby'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'paid'
  | 'reviewed';

export interface BookingEvent {
  id: string;
  bookingId: string;
  timestamp: number;
  actorId: string;
  actorRole: UserRole;
  type: string;
  message: string;
}

export interface Booking {
  id: string;
  customerId: string;
  workerId: string;
  serviceType: ServiceType;
  serviceOptionId: string;
  addressId: string;
  date: string;
  time: string;
  status: BookingStatus;
  estimatedPrice: number;
  finalPrice?: number;
  createdAt: number;
  eventId?: string;
}

// ─── REVIEW ───────────────────────────────────────────────
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  workerId: string;
  rating: number;
  comment?: string;
  createdAt: number;
}

// ─── PAYMENT ──────────────────────────────────────────────
export type PaymentMethod = 'upi' | 'card' | 'cash';

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
}

// ─── MESSAGE ──────────────────────────────────────────────
export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  receiverId: string;
  text: string;
  read: boolean;
  createdAt: number;
}

// ─── NOTIFICATION ─────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  reading: boolean;
  createdAt: number;
}

// ─── AD ───────────────────────────────────────────────────
export interface Ad {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  imageUrl?: string;
  targetPlacement: string;
}
