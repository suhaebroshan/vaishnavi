import { db } from './database';
import type { Worker, Customer, Admin, Service, Address, Booking, Payment, Review, Message, Notification, Ad, BookingEvent, User, ServiceType, BookingStatus } from '../types';

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => Date.now();
const ago = (ms: number) => now() - ms;

/* ═══════════════════════════════════════════════════════════
   DEMAND ZONES — which areas have higher demand for each service
   ═══════════════════════════════════════════════════════════ */
export const DEMAND_ZONES: Record<string, { area: string; level: 'high' | 'medium' | 'low'; demandScore: number }[]> = {
  plumbing: [
    { area: 'Banjara Hills', level: 'high', demandScore: 92 },
    { area: 'Jubilee Hills', level: 'high', demandScore: 88 },
    { area: 'Madhapur', level: 'medium', demandScore: 65 },
    { area: 'Secunderabad', level: 'medium', demandScore: 55 },
    { area: 'Kukatpally', level: 'low', demandScore: 30 },
  ],
  electrical: [
    { area: 'HITEC City', level: 'high', demandScore: 95 },
    { area: 'Madhapur', level: 'high', demandScore: 85 },
    { area: 'Banjara Hills', level: 'medium', demandScore: 60 },
    { area: 'Gachibowli', level: 'medium', demandScore: 55 },
    { area: 'Sainikpuri', level: 'low', demandScore: 25 },
  ],
  housekeeping: [
    { area: 'Banjara Hills', level: 'high', demandScore: 97 },
    { area: 'Jubilee Hills', level: 'high', demandScore: 90 },
    { area: 'Ameerpet', level: 'medium', demandScore: 70 },
    { area: 'Somajiguda', level: 'medium', demandScore: 58 },
    { area: 'Kompally', level: 'low', demandScore: 20 },
  ],
  cooking: [
    { area: 'A.S. Rao Nagar', level: 'high', demandScore: 94 },
    { area: 'Banjara Hills', level: 'high', demandScore: 88 },
    { area: 'Malakpet', level: 'medium', demandScore: 62 },
    { area: 'Himayatnagar', level: 'medium', demandScore: 55 },
    { area: 'Begumpet', level: 'low', demandScore: 28 },
  ],
  security: [
    { area: 'Jubilee Hills', level: 'high', demandScore: 96 },
    { area: 'Banjara Hills', level: 'high', demandScore: 90 },
    { area: 'Madhapur', level: 'medium', demandScore: 68 },
    { area: 'Gachibowli', level: 'medium', demandScore: 60 },
    { area: 'Vanasthali Puram', level: 'low', demandScore: 35 },
  ],
  elder_care: [
    { area: 'Banjara Hills', level: 'high', demandScore: 93 },
    { area: 'Jubilee Hills', level: 'high', demandScore: 87 },
    { area: 'Himayatnagar', level: 'medium', demandScore: 64 },
    { area: 'Ameerpet', level: 'medium', demandScore: 50 },
    { area: 'Kukatpally', level: 'low', demandScore: 22 },
  ],
  caretaker: [
    { area: 'Banjara Hills', level: 'high', demandScore: 91 },
    { area: 'Jubilee Hills', level: 'medium', demandScore: 65 },
    { area: 'Sainikpuri', level: 'medium', demandScore: 58 },
    { area: 'Secunderabad', level: 'low', demandScore: 30 },
    { area: 'Kompally', level: 'low', demandScore: 18 },
  ],
  home_support: [
    { area: 'Madhapur', level: 'high', demandScore: 89 },
    { area: 'HITEC City', level: 'high', demandScore: 82 },
    { area: 'Gachibowli', level: 'medium', demandScore: 55 },
    { area: 'Banjara Hills', level: 'medium', demandScore: 48 },
    { area: 'Ameerpet', level: 'low', demandScore: 25 },
  ],
};

/* ═══════════════════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════════════════ */
export const SERVICES: Service[] = [
  { id: 'housekeeping', name: 'Housekeeping', description: 'Thorough home cleaning by trained professionals.', icon: '🧹', color: '#173F35', options: [
    { id: 'full_home', label: 'Full Home Cleaning', priceRange: [999, 1899] },
    { id: 'kitchen', label: 'Kitchen Deep Clean', priceRange: [599, 999] },
    { id: 'bathroom', label: 'Bathroom Cleaning', priceRange: [399, 699] },
    { id: 'laundry', label: 'Laundry & Ironing', priceRange: [299, 599] },
    { id: 'general', label: 'General Household Help', priceRange: [499, 899] },
  ]},
  { id: 'cooking', name: 'Cooking', description: 'Home-cooked meals by experienced chefs.', icon: '👩🍳', color: '#C86F52', options: [
    { id: 'breakfast', label: 'Breakfast Prep', priceRange: [300, 500] },
    { id: 'lunch_dinner', label: 'Lunch / Dinner', priceRange: [400, 700] },
    { id: 'special_meal', label: 'Special Occasion Meal', priceRange: [800, 1500] },
    { id: 'dietary', label: 'Diet-Specific Cooking', priceRange: [500, 900] },
  ]},
  { id: 'plumbing', name: 'Plumbing', description: 'Reliable plumbing support for a hassle-free home.', icon: '🔧', color: '#173F35', options: [
    { id: 'leak_repair', label: 'Leak Repair', priceRange: [400, 800] },
    { id: 'pipe_repair', label: 'Pipe Repair', priceRange: [500, 1000] },
    { id: 'bathroom_issue', label: 'Bathroom Issue', priceRange: [500, 1200] },
    { id: 'kitchen_issue', label: 'Kitchen Issue', priceRange: [400, 900] },
    { id: 'installation', label: 'Installation', priceRange: [600, 1500] },
    { id: 'general_maintenance', label: 'General Maintenance', priceRange: [350, 700] },
  ]},
  { id: 'electrical', name: 'Electrical', description: 'Safe electrical fixes and installations.', icon: '⚡', color: '#C86F52', options: [
    { id: 'wiring', label: 'Wiring Work', priceRange: [500, 1200] },
    { id: 'fan_light', label: 'Fan / Light Fix', priceRange: [300, 600] },
    { id: 'switchboard', label: 'Switchboard Repair', priceRange: [300, 500] },
    { id: 'outlet_install', label: 'Outlet Installation', priceRange: [400, 800] },
    { id: 'general_electrical', label: 'General Electrical', priceRange: [350, 700] },
  ]},
  { id: 'security', name: 'Security', description: 'Trusted security personnel for your home.', icon: '🛡️', color: '#173F35', options: [
    { id: 'day_guard', label: 'Day Shift Guard', priceRange: [800, 1500] },
    { id: 'night_guard', label: 'Night Shift Guard', priceRange: [900, 1800] },
    { id: 'cctv', label: 'CCTV Monitoring', priceRange: [1000, 2500] },
  ]},
  { id: 'elder_care', name: 'Elder Care', description: 'Compassionate care for your senior family members.', icon: '❤️', color: '#C86F52', options: [
    { id: 'companion', label: 'Companionship', priceRange: [600, 1000] },
    { id: 'medication', label: 'Medication Support', priceRange: [500, 900] },
    { id: 'mobility', label: 'Mobility Assistance', priceRange: [700, 1200] },
    { id: 'overnight', label: 'Overnight Care', priceRange: [1200, 2000] },
  ]},
  { id: 'caretaker', name: 'Caretakers', description: 'Dedicated caretaker for your household needs.', icon: '🏠', color: '#173F35', options: [
    { id: 'daily_caretaker', label: 'Daily Caretaker', priceRange: [800, 1500] },
    { id: 'live_in', label: 'Live-in Caretaker', priceRange: [1200, 2500] },
  ]},
  { id: 'home_support', name: 'Home Support', description: 'General household assistance for daily tasks.', icon: '✨', color: '#A8B9A5', options: [
    { id: 'errands', label: 'Errands & Shopping', priceRange: [300, 600] },
    { id: 'organization', label: 'Home Organization', priceRange: [500, 1000] },
    { id: 'garden', label: 'Garden & Balcony', priceRange: [400, 800] },
    { id: 'appliance', label: 'Appliance Setup', priceRange: [300, 700] },
  ]},
];

/* ═══════════════════════════════════════════════════════════
   OFFERS RUNNING — current promotional campaigns
   ═══════════════════════════════════════════════════════════ */
export const ACTIVE_OFFERS: Ad[] = [
  { id: 'offer-1', title: 'First Housekeeping Deal', subtitle: 'Get 30% off your first deep clean. Use code CLEAN30 at checkout.', ctaText: 'Book Now', imageUrl: '', targetPlacement: 'home' },
  { id: 'offer-2', title: 'Festival Cooking Special', subtitle: 'Order any special meal package this week and get free dessert prep.', ctaText: 'Explore', imageUrl: '', targetPlacement: 'home' },
  { id: 'offer-3', title: 'Secure Your Home', subtitle: 'Book 7 days of security guard and pay for only 5. Limited offer!', ctaText: 'Learn More', imageUrl: '', targetPlacement: 'home' },
  { id: 'offer-4', title: 'Electrical Checkup', subtitle: '₹199 full home electrical inspection — normally ₹600. This weekend only.', ctaText: 'Claim Offer', imageUrl: '', targetPlacement: 'booking' },
];

/* ═══════════════════════════════════════════════════════════
   CUSTOMER — Single account
   ═══════════════════════════════════════════════════════════ */
export const CUSTOMERS: Customer[] = [
  {
    id: 'c1', role: 'customer', name: 'Suhaeb',
    phone: '+91 88888 77777',
    defaultAddress: {
      id: 'a1', label: 'Home', line1: 'Flat 302, GreenPark Apartments', line2: 'Road No. 12, Banjara Hills',
      city: 'Hyderabad', landmark: 'Near Clock Tower', lat: 17.4149, lng: 78.4438,
    },
    totalBookings: 18, totalSpent: 12650, favoriteWorkerIds: ['w1', 'w6'], avatarUrl: '',
    createdAt: ago(180_000_000),
  },
];

/* ═══════════════════════════════════════════════════════════
   WORKERS — One per service type
   ═══════════════════════════════════════════════════════════ */
export const WORKERS: Worker[] = [
  {
    id: 'w1', role: 'worker', name: 'Vikram Singh', phone: '+91 98765 43210',
    serviceType: 'plumbing', rating: 4.8, totalJobs: 231, completionRate: 98,
    bio: 'Experienced plumbing professional with 8+ years in residential and commercial plumbing across Hyderabad.',
    skills: ['Leak Repairs', 'Pipe Fixes', 'Bathroom Plumbing', 'Kitchen Plumbing', 'Installation'],
    status: 'online', todayEarnings: 1850, weekEarnings: 12850, monthEarnings: 48600,
    location: 'Banjara Hills', avatarUrl: '', createdAt: ago(90_000_000),
  },
  {
    id: 'w2', role: 'worker', name: 'Arjun Reddy', phone: '+91 98765 43211',
    serviceType: 'electrical', rating: 4.9, totalJobs: 198, completionRate: 97,
    bio: 'Licensed electrician with expertise in residential wiring, fan installation, and AC repair.',
    skills: ['Wiring', 'Fan Installation', 'AC Repair', 'Lighting', 'Switchboard Fix'],
    status: 'online', todayEarnings: 2100, weekEarnings: 14500, monthEarnings: 51000,
    location: 'Sainikpuri', avatarUrl: '', createdAt: ago(75_000_000),
  },
  {
    id: 'w3', role: 'worker', name: 'Rahul Kumar', phone: '+91 98765 43212',
    serviceType: 'housekeeping', rating: 4.8, totalJobs: 127, completionRate: 97,
    bio: 'Meticulous housekeeper with a passion for creating spotless living spaces using eco-friendly products.',
    skills: ['Deep Cleaning', 'Kitchen Sanitization', 'Bathroom Cleaning', 'Laundry'],
    status: 'online', todayEarnings: 1500, weekEarnings: 10500, monthEarnings: 38400,
    location: 'Banjara Hills', avatarUrl: '', createdAt: ago(60_000_000),
  },
  {
    id: 'w4', role: 'worker', name: 'Priya Sharma', phone: '+91 98765 43213',
    serviceType: 'cooking', rating: 4.9, totalJobs: 184, completionRate: 99,
    bio: 'Passionate home cook specializing in South Indian, Mughlai, and fusion cuisine with fresh local ingredients.',
    skills: ['South Indian', 'Mughlai', 'Baking', 'Healthy Meals', 'Party Catering'],
    status: 'online', todayEarnings: 2800, weekEarnings: 16800, monthEarnings: 58200,
    location: 'A.S. Rao Nagar', avatarUrl: '', createdAt: ago(70_000_000),
  },
  {
    id: 'w5', role: 'worker', name: 'Suresh Naidu', phone: '+91 98765 43214',
    serviceType: 'security', rating: 4.8, totalJobs: 312, completionRate: 99,
    bio: 'Former paramilitary personnel with 12 years of security experience. Trusted by premium households.',
    skills: ['Guard Duty', 'Surveillance', 'Access Control', 'Night Patrol'],
    status: 'online', todayEarnings: 3500, weekEarnings: 21000, monthEarnings: 78000,
    location: 'Kompally', avatarUrl: '', createdAt: ago(120_000_000),
  },
  {
    id: 'w6', role: 'worker', name: 'Anjali Rao', phone: '+91 98765 43215',
    serviceType: 'elder_care', rating: 4.9, totalJobs: 96, completionRate: 99,
    bio: 'Certified caregiver with a gentle approach. Specializes in companionship, medication management, and mobility support.',
    skills: ['Medication Management', 'Mobility Support', 'Companionship', 'Physiotherapy Assist'],
    status: 'online', todayEarnings: 2000, weekEarnings: 14000, monthEarnings: 49000,
    location: 'Himayatnagar', avatarUrl: '', createdAt: ago(55_000_000),
  },
  {
    id: 'w7', role: 'worker', name: 'Lakshmi Devi', phone: '+91 98765 43216',
    serviceType: 'caretaker', rating: 4.9, totalJobs: 88, completionRate: 98,
    bio: 'Experienced caretaker managing household staff, vendors, and daily operations for busy families.',
    skills: ['Household Management', 'Staff Supervision', 'Vendor Coordination', 'Budgeting'],
    status: 'busy', todayEarnings: 2500, weekEarnings: 17500, monthEarnings: 61250,
    location: 'Banjara Hills', avatarUrl: '', createdAt: ago(50_000_000),
  },
  {
    id: 'w8', role: 'worker', name: 'Deepak Verma', phone: '+91 98765 43217',
    serviceType: 'home_support', rating: 4.7, totalJobs: 156, completionRate: 96,
    bio: 'Versatile home support worker handling errands, organization, and general household tasks efficiently.',
    skills: ['Grocery Shopping', 'Organizing', 'Pet Care', 'Minor Repairs'],
    status: 'online', todayEarnings: 1200, weekEarnings: 8400, monthEarnings: 31200,
    location: 'Madhapur', avatarUrl: '', createdAt: ago(65_000_000),
  },
];

/* ═══════════════════════════════════════════════════════════
   ADMIN — Single account
   ═══════════════════════════════════════════════════════════ */
export const ADMINS: Admin[] = [
  { id: 'admin1', role: 'admin', name: 'Vaishnavi Ops', phone: '+91 75697 28464', badge: 'Administrator', avatarUrl: '', createdAt: now() },
];

/* ═══════════════════════════════════════════════════════════
   ADDRESSES
   ═══════════════════════════════════════════════════════════ */
export const ADDRESSES: Address[] = [
  { id: 'a1', label: 'Home', line1: 'Flat 302, GreenPark Apartments', line2: 'Road No. 12, Banjara Hills', city: 'Hyderabad', landmark: 'Near Clock Tower', lat: 17.4149, lng: 78.4438 },
  { id: 'a2', label: 'Office', line1: 'Tower B, HITEC City', line2: 'Madhapur', city: 'Hyderabad', landmark: 'Near Rajiv Gandhi IT Park', lat: 17.4400, lng: 78.3780 },
  { id: 'a3', label: 'Summer House', line1: '5-8-112, 2nd Floor', line2: 'Jubilee Hills', city: 'Hyderabad', landmark: 'Near Film Nagar', lat: 17.4239, lng: 78.4738 },
];

/* ═══════════════════════════════════════════════════════════
   REVIEWS
   ═══════════════════════════════════════════════════════════ */
export const REVIEWS: Review[] = [
  { id: 'r1', bookingId: 'bk-001', customerId: 'c1', workerId: 'w4', rating: 5, comment: 'Priya made the most amazing biryani! Absolutely authentic Hyderabadi taste. Will order again.', createdAt: ago(3_000_000_000) },
  { id: 'r2', bookingId: 'bk-002', customerId: 'c1', workerId: 'w1', rating: 5, comment: 'Vikram fixed the kitchen sink leak in under 30 minutes. Very professional and clean work.', createdAt: ago(5_000_000_000) },
  { id: 'r3', bookingId: 'bk-003', customerId: 'c1', workerId: 'w3', rating: 4, comment: 'Great deep cleaning. Kitchen and bathrooms looked brand new. Could have spent a bit more time on windows.', createdAt: ago(8_000_000_000) },
  { id: 'r4', bookingId: 'bk-004', customerId: 'c1', workerId: 'w6', rating: 5, comment: 'Anjali is so caring with my father. She manages his medications perfectly and keeps him company throughout the day.', createdAt: ago(10_000_000_000) },
  { id: 'r5', bookingId: 'bk-005', customerId: 'c1', workerId: 'w2', rating: 5, comment: 'Arjun rewired our entire balcony ceiling fan setup. Work was neat and he explained everything clearly.', createdAt: ago(14_000_000_000) },
  { id: 'r6', bookingId: 'bk-006', customerId: 'c1', workerId: 'w5', rating: 5, comment: 'Suresh has been guarding our home for 3 months now. Extremely vigilant and polite.', createdAt: ago(20_000_000_000) },
  { id: 'r7', bookingId: 'bk-007', customerId: 'c1', workerId: 'w7', rating: 4, comment: 'Lakshmi manages our household very well. Cooks, cleans, and coordinates with all the vendors seamlessly.', createdAt: ago(25_000_000_000) },
  { id: 'r8', bookingId: 'bk-008', customerId: 'c1', workerId: 'w8', rating: 5, comment: 'Deepak picked up groceries, organized our storeroom, and even fixed a loose cabinet door. Great value!', createdAt: ago(30_000_000_000) },
];

/* ═══════════════════════════════════════════════════════════
   MESSAGES
   ═══════════════════════════════════════════════════════════ */
export const MESSAGES: Message[] = [
  { id: 'm1', bookingId: 'bk-010', senderId: 'c1', receiverId: 'w1', text: 'Hi Vikram, the bathroom tap is leaking badly. Can you come tomorrow?', read: true, createdAt: ago(7_200_000) },
  { id: 'm2', bookingId: 'bk-010', senderId: 'w1', receiverId: 'c1', text: 'Sure Suhaeb, I will come around 10 AM. Please confirm the address.', read: true, createdAt: ago(7_000_000) },
  { id: 'm3', bookingId: 'bk-010', senderId: 'c1', receiverId: 'w1', text: 'Yes, Flat 302 GreenPark, Road 12 Banjara Hills. See you tomorrow!', read: true, createdAt: ago(6_800_000) },
  { id: 'm4', bookingId: 'bk-011', senderId: 'c1', receiverId: 'w4', text: 'Priya, can you make a special festival meal for this Saturday? 6 people.', read: true, createdAt: ago(1_800_000) },
  { id: 'm5', bookingId: 'bk-011', senderId: 'w4', receiverId: 'c1', text: 'Of course! I can do Hyderabadi Dum Biryani, Kebabs, and Desserts. Total would be around ₹1,200.', read: true, createdAt: ago(1_500_000) },
  { id: 'm6', bookingId: 'bk-011', senderId: 'c1', receiverId: 'w4', text: 'Perfect! Booked. See you Saturday at 11 AM 👍', read: false, createdAt: ago(1_200_000) },
];

/* ═══════════════════════════════════════════════════════════
   PAYMENTS
   ═══════════════════════════════════════════════════════════ */
export const PAYMENTS: Payment[] = [
  { id: 'pay-001', bookingId: 'bk-001', amount: 850, method: 'upi', status: 'completed', createdAt: ago(3_000_000_000) },
  { id: 'pay-002', bookingId: 'bk-002', amount: 650, method: 'card', status: 'completed', createdAt: ago(5_000_000_000) },
  { id: 'pay-003', bookingId: 'bk-003', amount: 1200, method: 'upi', status: 'completed', createdAt: ago(8_000_000_000) },
  { id: 'pay-004', bookingId: 'bk-004', amount: 900, method: 'cash', status: 'completed', createdAt: ago(10_000_000_000) },
  { id: 'pay-005', bookingId: 'bk-005', amount: 550, method: 'upi', status: 'completed', createdAt: ago(14_000_000_000) },
  { id: 'pay-006', bookingId: 'bk-006', amount: 1500, method: 'card', status: 'completed', createdAt: ago(20_000_000_000) },
  { id: 'pay-007', bookingId: 'bk-007', amount: 2000, method: 'upi', status: 'completed', createdAt: ago(25_000_000_000) },
  { id: 'pay-008', bookingId: 'bk-008', amount: 450, method: 'cash', status: 'completed', createdAt: ago(30_000_000_000) },
];

/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS
   ═══════════════════════════════════════════════════════════ */
export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'c1', type: 'booking_update', title: 'Booking Confirmed', message: 'Your plumbing request has been sent to Vikram. He will confirm shortly.', reading: false, createdAt: ago(600000) },
  { id: 'n2', userId: 'c1', type: 'chat', title: 'New Message', message: 'Priya sent you a message: "Perfect! See you Saturday!"', reading: false, createdAt: ago(120000) },
  { id: 'n3', userId: 'c1', type: 'offer', title: 'Special Offer', message: 'Get 30% off your first deep clean! Use code CLEAN30.', reading: true, createdAt: ago(86400000) },
  { id: 'n4', userId: 'w1', type: 'new_booking', title: 'New Request', message: 'Suhaeb requested bathroom plumbing repair tomorrow at 10:00 AM. Location: Banjara Hills.', reading: false, createdAt: ago(7_200_000) },
  { id: 'n5', userId: 'w4', type: 'new_booking', title: 'New Request', message: 'Suhaeb requested special occasion meal for Saturday 11 AM. Location: Banjara Hills.', reading: false, createdAt: ago(1_800_000) },
  { id: 'n6', userId: 'admin1', type: 'system', title: 'Welcome Back', message: 'Operations dashboard is live. Today\'s revenue: ₹18,450 across 12 bookings.', reading: true, createdAt: ago(3600000) },
];

/* ═══════════════════════════════════════════════════════════
   BOOKINGS — Rich history for the single customer + workers
   ═══════════════════════════════════════════════════════════ */
function generateAllBookings(): (Booking | BookingEvent)[] {
  const items: (Booking | BookingEvent)[] = [];
  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const dayAfter = new Date(Date.now() + 172800000).toISOString().slice(0, 10);
  const pastDates = [
    new Date(Date.now() - 2_000_000_000).toISOString().slice(0, 10),
    new Date(Date.now() - 4_000_000_000).toISOString().slice(0, 10),
    new Date(Date.now() - 7_000_000_000).toISOString().slice(0, 10),
    new Date(Date.now() - 10_000_000_000).toISOString().slice(0, 10),
    new Date(Date.now() - 14_000_000_000).toISOString().slice(0, 10),
    new Date(Date.now() - 20_000_000_000).toISOString().slice(0, 10),
    new Date(Date.now() - 25_000_000_000).toISOString().slice(0, 10),
    new Date(Date.now() - 30_000_000_000).toISOString().slice(0, 10),
    new Date(Date.now() - 40_000_000_000).toISOString().slice(0, 10),
    new Date(Date.now() - 50_000_000_000).toISOString().slice(0, 10),
  ];

  // ── Suhaeb's bookings (all 18 across all services) ────────
  const bookingDefs = [
    { id: 'bk-010', workerId: 'w1', svc: 'plumbing', opt: 'bathroom_issue', date: tomorrow, time: '10:00 AM', status: 'requested' as BookingStatus, price: 650, addr: 'a1' },
    { id: 'bk-011', workerId: 'w4', svc: 'cooking', opt: 'special_meal', date: '2026-09-20', time: '11:00 AM', status: 'requested' as BookingStatus, price: 1200, addr: 'a1' },
    { id: 'bk-009', workerId: 'w3', svc: 'housekeeping', opt: 'full_home', date: today, time: '2:00 PM', status: 'in_progress' as BookingStatus, price: 999, addr: 'a1' },
    { id: 'bk-008', workerId: 'w8', svc: 'home_support', opt: 'errands', date: pastDates[0], time: '11:00 AM', status: 'reviewed' as BookingStatus, price: 450, addr: 'a1' },
    { id: 'bk-007', workerId: 'w7', svc: 'caretaker', opt: 'daily_caretaker', date: pastDates[1], time: '9:00 AM', status: 'reviewed' as BookingStatus, price: 2000, addr: 'a1' },
    { id: 'bk-006', workerId: 'w5', svc: 'security', opt: 'day_guard', date: pastDates[2], time: '8:00 AM', status: 'paid' as BookingStatus, price: 1500, addr: 'a3' },
    { id: 'bk-005', workerId: 'w2', svc: 'electrical', opt: 'fan_light', date: pastDates[3], time: '3:00 PM', status: 'reviewed' as BookingStatus, price: 550, addr: 'a1' },
    { id: 'bk-004', workerId: 'w6', svc: 'elder_care', opt: 'companion', date: pastDates[4], time: '10:00 AM', status: 'paid' as BookingStatus, price: 900, addr: 'a1' },
    { id: 'bk-003', workerId: 'w3', svc: 'housekeeping', opt: 'kitchen', date: pastDates[5], time: '11:00 AM', status: 'reviewed' as BookingStatus, price: 1200, addr: 'a1' },
    { id: 'bk-002', workerId: 'w1', svc: 'plumbing', opt: 'leak_repair', date: pastDates[6], time: '4:00 PM', status: 'paid' as BookingStatus, price: 650, addr: 'a1' },
    { id: 'bk-001', workerId: 'w4', svc: 'cooking', opt: 'lunch_dinner', date: pastDates[7], time: '12:30 PM', status: 'reviewed' as BookingStatus, price: 850, addr: 'a1' },
    { id: 'bk-000', workerId: 'w1', svc: 'plumbing', opt: 'general_maintenance', date: pastDates[8], time: '9:00 AM', status: 'completed' as BookingStatus, price: 700, addr: 'a2' },
    { id: 'bk-old-1', workerId: 'w5', svc: 'security', opt: 'night_guard', date: pastDates[9], time: '6:00 PM', status: 'completed' as BookingStatus, price: 1800, addr: 'a1' },
  ];

  for (const def of bookingDefs) {
    const created = def.status === 'requested' ? ago(600000) : ago((bookingDefs.indexOf(def) + 2) * 3_000_000_000);
    const booking: Booking = {
      id: def.id, customerId: 'c1', workerId: def.workerId, serviceType: def.svc as ServiceType,
      serviceOptionId: def.opt, addressId: def.addr, date: def.date, time: def.time,
      status: def.status, estimatedPrice: def.price,
      finalPrice: ['completed', 'paid', 'reviewed'].includes(def.status) ? def.price : undefined,
      createdAt: created,
    };
    items.push(booking);
    items.push({ id: `${def.id}-evt-create`, bookingId: def.id, timestamp: created, actorId: 'c1', actorRole: 'customer', type: 'created', message: `Booking created for ${def.svc}` });
    if (!['requested'].includes(def.status)) {
      items.push({ id: `${def.id}-evt-accept`, bookingId: def.id, timestamp: created + 60000, actorId: def.workerId, actorRole: 'worker', type: 'accepted', message: 'Worker accepted the request' });
    }
    if (['in_progress', 'completed', 'paid', 'reviewed'].includes(def.status)) {
      items.push({ id: `${def.id}-evt-start`, bookingId: def.id, timestamp: created + 120000, actorId: def.workerId, actorRole: 'worker', type: 'started', message: 'Service started' });
    }
    if (['completed', 'paid', 'reviewed'].includes(def.status)) {
      items.push({ id: `${def.id}-evt-comp`, bookingId: def.id, timestamp: created + 300000, actorId: def.workerId, actorRole: 'worker', type: 'completed', message: 'Service completed' });
    }
    if (['paid', 'reviewed'].includes(def.status)) {
      items.push({ id: `${def.id}-evt-paid`, bookingId: def.id, timestamp: created + 360000, actorId: 'c1', actorRole: 'customer', type: 'paid', message: `Payment of ₹${def.price} received` });
    }
  }

  return items;
}

/* ═══════════════════════════════════════════════════════════
   SEED FUNCTION
   ═══════════════════════════════════════════════════════════ */
export async function seedDatabase() {
  try {
    // Wait for the database to be ready (migration may still be in progress)
    await db.open();

    // Clear any stale data from a previous schema mismatch
    try {
      const storeNames = Object.keys(db.tables).filter((k: any) => k !== '__proto__' && k !== 'constructor');
      for (const storeName of storeNames) {
        await (db as any)[storeName].clear();
      }
    } catch {
      // Some stores may not exist yet during migration — ignore
    }

    const allUsers: User[] = [
      ...CUSTOMERS.map(c => ({ ...c, role: 'customer' as const })),
      ...WORKERS.map(w => ({ ...w, role: 'worker' as const })),
      ...ADMINS.map(a => ({ ...a, role: 'admin' as const })),
    ];

    await db.transaction('rw', db.users, db.workers, db.customers, db.admins, async () => {
      await db.users.bulkAdd(allUsers);
      await db.workers.bulkAdd(WORKERS);
      await db.customers.bulkAdd(CUSTOMERS);
      await db.admins.bulkAdd(ADMINS);
    });

    await db.transaction('rw', db.services, db.addresses, db.ads, async () => {
      await db.services.bulkAdd(SERVICES);
      await db.addresses.bulkAdd(ADDRESSES);
      await db.ads.bulkAdd(ACTIVE_OFFERS);
    });

    const bae = generateAllBookings();
    const bk = bae.filter(x => 'customerId' in x) as Booking[];
    const ev = bae.filter(x => 'type' in x && 'message' in x) as BookingEvent[];

    await db.transaction('rw', db.bookings, db.bookingEvents, db.reviews, async () => {
      await db.bookings.bulkAdd(bk);
      await db.bookingEvents.bulkAdd(ev);
      await db.reviews.bulkAdd(REVIEWS);
    });

    await db.transaction('rw', db.payments, db.messages, db.notifications, async () => {
      await db.payments.bulkAdd(PAYMENTS);
      await db.messages.bulkAdd(MESSAGES);
      await db.notifications.bulkAdd(NOTIFICATIONS);
    });

    console.log('[Seed] Database initialized with', bk.length, 'bookings,', WORKERS.length, 'workers, 1 customer');
  } catch (e) {
    console.error('[DB Seed Error]', e);
    // If seed fails catastrophically (e.g. schema mismatch), delete and retry once
    try {
      await db.delete();
      console.log('[DB] Deleted corrupted database, will reinitialize on next load');
    } catch {
      // Ignore — will retry on next page load
    }
  }
}
