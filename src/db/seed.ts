import { db } from './database';
import type { Worker, Customer, Admin, Service, Address, Booking, Payment, Review, Message, Notification, Ad, BookingEvent, User, ServiceType, BookingStatus } from '../types';

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => Date.now();
const ago = (ms: number) => now() - ms;

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
   WORKERS — Expanded with rich profiles
   ═══════════════════════════════════════════════════════════ */
export const WORKERS: Worker[] = [
  { id: 'w1', role: 'worker', name: 'Vikram Singh', phone: '+91 98765 43210', serviceType: 'plumbing', rating: 4.8, totalJobs: 231, completionRate: 98, bio: 'Experienced plumbing professional with 8+ years in residential and commercial plumbing. Known for reliable, clean work and punctual arrivals across Hyderabad.', skills: ['Leak Repairs', 'Pipe Fixes', 'Bathroom Plumbing', 'Kitchen Plumbing', 'Installation', 'Emergency Repair'], status: 'online', todayEarnings: 1850, weekEarnings: 12850, monthEarnings: 48600, location: 'Banjara Hills', avatarUrl: '', createdAt: ago(90_000_000) },
  { id: 'w2', role: 'worker', name: 'Ravi Kumar', phone: '+91 98765 43211', serviceType: 'plumbing', rating: 4.7, totalJobs: 184, completionRate: 96, bio: 'Detail-oriented plumber specializing in emergency repairs and pipe replacements.', skills: ['Emergency Repairs', 'Pipe Replacement', 'Water Heater'], status: 'busy', todayEarnings: 2200, weekEarnings: 15400, monthEarnings: 52100, location: 'Jubilee Hills', avatarUrl: '', createdAt: ago(80_000_000) },
  { id: 'w3', role: 'worker', name: 'Mahesh Rao', phone: '+91 98765 43212', serviceType: 'plumbing', rating: 4.9, totalJobs: 302, completionRate: 99, bio: 'Master plumber with advanced certification. Handles complex renovation and industrial plumbing.', skills: ['Advanced Plumbing', 'Renovation', 'Industrial'], status: 'online', todayEarnings: 3100, weekEarnings: 18200, monthEarnings: 67000, location: 'Secunderabad', avatarUrl: '', createdAt: ago(100_000_000) },
  { id: 'w4', role: 'worker', name: 'Arjun Reddy', phone: '+91 98765 43213', serviceType: 'electrical', rating: 4.8, totalJobs: 198, completionRate: 97, bio: 'Licensed electrician with expertise in residential wiring, fan installation, and AC repair.', skills: ['Wiring', 'Fan Installation', 'AC Repair', 'Lighting'], status: 'online', todayEarnings: 2100, weekEarnings: 14500, monthEarnings: 51000, location: 'Sainikpuri', avatarUrl: '', createdAt: ago(75_000_000) },
  { id: 'w5', role: 'worker', name: 'Rahul Kumar', phone: '+91 98765 43214', serviceType: 'housekeeping', rating: 4.8, totalJobs: 127, completionRate: 97, bio: 'Meticulous housekeeper with a passion for creating spotless living spaces. Uses eco-friendly products.', skills: ['Deep Cleaning', 'Kitchen Sanitization', 'Bathroom Cleaning', 'Laundry'], status: 'online', todayEarnings: 1500, weekEarnings: 10500, monthEarnings: 38400, location: 'Banjara Hills', avatarUrl: '', createdAt: ago(60_000_000) },
  { id: 'w6', role: 'worker', name: 'Priya Sharma', phone: '+91 98765 43215', serviceType: 'cooking', rating: 4.9, totalJobs: 184, completionRate: 99, bio: 'Passionate home cook specializing in South Indian, Mughlai, and fusion cuisine. Uses fresh, local ingredients.', skills: ['South Indian', 'Mughlai', 'Baking', 'Healthy Meals', 'Party Catering'], status: 'online', todayEarnings: 2800, weekEarnings: 16800, monthEarnings: 58200, location: 'A.S. Rao Nagar', avatarUrl: '', createdAt: ago(70_000_000) },
  { id: 'w7', role: 'worker', name: 'Suresh Naidu', phone: '+91 98765 43216', serviceType: 'security', rating: 4.8, totalJobs: 312, completionRate: 99, bio: 'Former paramilitary personnel with 12 years of security experience. Trusted by premium households across Hyderabad.', skills: ['Guard Duty', 'Surveillance', 'Access Control', 'Night Patrol'], status: 'busy', todayEarnings: 3500, weekEarnings: 21000, monthEarnings: 78000, location: 'Kompally', avatarUrl: '', createdAt: ago(120_000_000) },
  { id: 'w8', role: 'worker', name: 'Anjali Rao', phone: '+91 98765 43217', serviceType: 'elder_care', rating: 4.9, totalJobs: 96, completionRate: 99, bio: 'Certified caregiver with a gentle approach. Specializes in companionship, medication management, and mobility support.', skills: ['Medication Management', 'Mobility Support', 'Companionship', 'Physiotherapy Assist'], status: 'online', todayEarnings: 2000, weekEarnings: 14000, monthEarnings: 49000, location: 'Himayatnagar', avatarUrl: '', createdAt: ago(55_000_000) },
  { id: 'w9', role: 'worker', name: 'Deepak Verma', phone: '+91 98765 43218', serviceType: 'home_support', rating: 4.7, totalJobs: 156, completionRate: 96, bio: 'Versatile home support worker handling errands, organization, and general household tasks efficiently.', skills: ['Grocery Shopping', 'Organizing', 'Pet Care', 'Minor Repairs'], status: 'offline', todayEarnings: 0, weekEarnings: 8400, monthEarnings: 31200, location: 'Begumpet', avatarUrl: '', createdAt: ago(65_000_000) },
  { id: 'w10', role: 'worker', name: 'Lakshmi Devi', phone: '+91 98765 43219', serviceType: 'caretaker', rating: 4.9, totalJobs: 88, completionRate: 98, bio: 'Experienced caretaker managing household staff, vendors, and daily operations for busy families.', skills: ['Household Management', 'Staff Supervision', 'Vendor Coordination', 'Budgeting'], status: 'online', todayEarnings: 2500, weekEarnings: 17500, monthEarnings: 61250, location: 'Banjara Hills', avatarUrl: '', createdAt: ago(50_000_000) },
  { id: 'w11', role: 'worker', name: 'Kiran Patel', phone: '+91 98765 43220', serviceType: 'electrical', rating: 4.6, totalJobs: 143, completionRate: 95, bio: 'Reliable electrician with expertise in commercial wiring and generator backup systems.', skills: ['Commercial Wiring', 'Generator Backup', 'Solar Install'], status: 'online', todayEarnings: 1900, weekEarnings: 11400, monthEarnings: 42000, location: 'Secunderabad', avatarUrl: '', createdAt: ago(60_000_000) },
  { id: 'w12', role: 'worker', name: 'Fatima Begum', phone: '+91 98765 43221', serviceType: 'cooking', rating: 4.8, totalJobs: 167, completionRate: 98, bio: 'Expert in Hyderabadi biryani, curries, and traditional sweets. 15 years of cooking experience.', skills: ['Biryani', 'Curry', 'Sweets', 'Vegetarian', 'Festival Specials'], status: 'online', todayEarnings: 2600, weekEarnings: 15600, monthEarnings: 54000, location: 'Malakpet', avatarUrl: '', createdAt: ago(65_000_000) },
  { id: 'w13', role: 'worker', name: 'Venkat Rao', phone: '+91 98765 43222', serviceType: 'housekeeping', rating: 4.7, totalJobs: 203, completionRate: 97, bio: 'Senior housekeeping professional with 10+ years experience in luxury apartments and villas.', skills: ['Deep Cleaning', 'Window Cleaning', 'Carpet Shampoo', 'Pest Control'], status: 'online', todayEarnings: 1700, weekEarnings: 11900, monthEarnings: 43000, location: 'Jubilee Hills', avatarUrl: '', createdAt: ago(75_000_000) },
  { id: 'w14', role: 'worker', name: 'Divya Sri', phone: '+91 98765 43223', serviceType: 'elder_care', rating: 4.8, totalJobs: 74, completionRate: 98, bio: 'Nursing graduate with specialization in elderly care. Patient, compassionate, and professional.', skills: ['Nursing', 'Dialysis Care', 'Post-Surgery', 'Wheelchair Assist'], status: 'online', todayEarnings: 2200, weekEarnings: 15400, monthEarnings: 52800, location: 'Banjara Hills', avatarUrl: '', createdAt: ago(45_000_000) },
  { id: 'w15', role: 'worker', name: 'Anil Kapoor', phone: '+91 98765 43224', serviceType: 'security', rating: 4.7, totalJobs: 278, completionRate: 98, bio: 'Retired police constable with 20 years of experience. Reliable and vigilant.', skills: ['Residential Security', 'Event Security', 'Body Guard', 'Fire Safety'], status: 'online', todayEarnings: 3200, weekEarnings: 19200, monthEarnings: 72000, location: 'Vanasthali Puram', avatarUrl: '', createdAt: ago(110_000_000) },
];

/* ═══════════════════════════════════════════════════════════
   CUSTOMERS
   ═══════════════════════════════════════════════════════════ */
export const CUSTOMERS: Customer[] = [
  { id: 'c1', role: 'customer', name: 'Suhaeb', phone: '+91 88888 77777', defaultAddress: { id: 'a1', label: 'Home', line1: 'Flat 302, GreenPark Apartments', line2: 'Road No. 12, Banjara Hills', city: 'Hyderabad', landmark: 'Near Clock Tower', lat: 17.4149, lng: 78.4438 }, totalBookings: 7, totalSpent: 4850, favoriteWorkerIds: ['w1', 'w6'], avatarUrl: '', createdAt: ago(180_000_000) },
  { id: 'c2', role: 'customer', name: 'Meera Sharma', phone: '+91 88888 77778', defaultAddress: { id: 'a2', label: 'Home', line1: '5-8-112, 2nd Floor', line2: 'Somajiguda', city: 'Hyderabad', landmark: 'Near JNTU Hostel', lat: 17.4239, lng: 78.4738 }, totalBookings: 5, totalSpent: 3200, favoriteWorkerIds: ['w6', 'w5'], avatarUrl: '', createdAt: ago(150_000_000) },
  { id: 'c3', role: 'customer', name: 'Ravi Kumar', phone: '+91 88888 77779', defaultAddress: { id: 'a3', label: 'Home', line1: 'Plot 45, D Block', line2: 'Sainikpuri', city: 'Hyderabad', landmark: 'Near Sainikpuri Circle', lat: 17.4687, lng: 78.5311 }, totalBookings: 3, totalSpent: 2100, favoriteWorkerIds: [], avatarUrl: '', createdAt: ago(120_000_000) },
  { id: 'c4', role: 'customer', name: 'Ananya Reddy', phone: '+91 88888 77780', defaultAddress: { id: 'a4', label: 'Home', line1: '12-3-99, 3rd Floor', line2: 'Ameerpet', city: 'Hyderabad', landmark: 'Near Ameerpet Metro', lat: 17.4299, lng: 78.4396 }, totalBookings: 9, totalSpent: 7200, favoriteWorkerIds: ['w7', 'w8'], avatarUrl: '', createdAt: ago(200_000_000) },
  { id: 'c5', role: 'customer', name: 'Arjun Mehta', phone: '+91 88888 77781', defaultAddress: { id: 'a5', label: 'Home', line1: 'H.No 7-1-88', line2: 'Kukatpally', city: 'Hyderabad', landmark: 'Near KPHB Colony', lat: 17.4847, lng: 78.4138 }, totalBookings: 4, totalSpent: 2800, favoriteWorkerIds: ['w4'], avatarUrl: '', createdAt: ago(90_000_000) },
];

export const ADMINS: Admin[] = [
  { id: 'admin1', role: 'admin', name: 'Vaishnavi Operations', phone: '+91 75697 28464', badge: 'Administrator', avatarUrl: '', createdAt: now() },
];

/* ═══════════════════════════════════════════════════════════
   ADDRESSES
   ═══════════════════════════════════════════════════════════ */
export const ADDRESSES: Address[] = [
  { id: 'a1', label: 'Home', line1: 'Flat 302, GreenPark Apartments', line2: 'Road No. 12, Banjara Hills', city: 'Hyderabad', landmark: 'Near Clock Tower', lat: 17.4149, lng: 78.4438 },
  { id: 'a2', label: 'Office', line1: 'Tower B, HITEC City', line2: 'Madhapur', city: 'Hyderabad', landmark: 'Near Rajiv Gandhi IT Park', lat: 17.4400, lng: 78.3780 },
  { id: 'a3', label: 'Home', line1: '5-8-112, 2nd Floor', line2: 'Somajiguda', city: 'Hyderabad', landmark: 'Near JNTU Hostel', lat: 17.4239, lng: 78.4738 },
  { id: 'a4', label: 'Home', line1: 'Plot 45, D Block', line2: 'Sainikpuri', city: 'Hyderabad', landmark: 'Near Sainikpuri Circle', lat: 17.4687, lng: 78.5311 },
  { id: 'a5', label: 'Home', line1: '12-3-99, 3rd Floor', line2: 'Ameerpet', city: 'Hyderabad', landmark: 'Near Ameerpet Metro', lat: 17.4299, lng: 78.4396 },
  { id: 'a6', label: 'Home', line1: 'H.No 7-1-88', line2: 'Kukatpally', city: 'Hyderabad', landmark: 'Near KPHB Colony', lat: 17.4847, lng: 78.4138 },
  { id: 'a7', label: 'Home', line1: 'Flat 501, Sunrise Residency', line2: 'Kompally', city: 'Hyderabad', landmark: 'Near Kompally Market', lat: 17.5055, lng: 78.4965 },
  { id: 'a8', label: 'Home', line1: '2-3-15/8', line2: 'Basheer Bagh', city: 'Hyderabad', landmark: 'Near Sri Kalahasteswara Temple', lat: 17.3753, lng: 78.4747 },
  { id: 'a9', label: 'Home', line1: 'Plot 22, Sector 4', line2: 'Nanoor', city: 'Hyderabad', landmark: 'Near Nanoor X Roads', lat: 17.4800, lng: 78.3800 },
];

/* ═══════════════════════════════════════════════════════════
   ADS
   ═══════════════════════════════════════════════════════════ */
export const ADS: Ad[] = [
  { id: 'ad1', title: 'Protect Your Home', subtitle: 'Get affordable home insurance — coverage from ₹299/month. Fire, theft & natural disaster protection.', ctaText: 'Learn More', imageUrl: '', targetPlacement: 'tracking' },
  { id: 'ad2', title: 'Premium Cleaning Kit', subtitle: 'Upgrade your home cleaning with professional-grade products. 20% off first order.', ctaText: 'Shop Now', imageUrl: '', targetPlacement: 'home' },
  { id: 'ad3', title: 'Smart Home Security', subtitle: 'Install WiFi cameras & smart locks from ₹2,499. Professional setup included.', ctaText: 'Explore', imageUrl: '', targetPlacement: 'booking' },
];

/* ═══════════════════════════════════════════════════════════
   REVIEWS
   ═══════════════════════════════════════════════════════════ */
export const REVIEWS: Review[] = [
  { id: 'r1', bookingId: 'vh-2047', customerId: 'c1', workerId: 'w6', rating: 5, comment: 'Amazing food! Very professional and arrived on time. The biryani was absolutely delicious.', createdAt: ago(2_000_000_000) },
  { id: 'r2', bookingId: 'past-0', customerId: 'c1', workerId: 'w1', rating: 5, comment: 'Quick and clean work. Fixed the leak in no time. Highly recommend Vikram.', createdAt: ago(4_000_000_000) },
  { id: 'r3', bookingId: 'past-2', customerId: 'c2', workerId: 'w5', rating: 4, comment: 'Good cleaning service, very thorough. Could improve on time though.', createdAt: ago(6_000_000_000) },
  { id: 'r4', bookingId: 'vh-past-3', customerId: 'c4', workerId: 'w7', rating: 5, comment: 'Suresh is extremely professional and dependable. Best security guard we have hired.', createdAt: ago(8_000_000_000) },
  { id: 'r5', bookingId: 'vh-past-4', customerId: 'c3', workerId: 'w4', rating: 5, comment: 'Arjun fixed all our electrical issues in one visit. Very knowledgeable.', createdAt: ago(10_000_000_000) },
  { id: 'r6', bookingId: 'past-cooking-1', customerId: 'c4', workerId: 'w6', rating: 5, comment: 'Priya made the most incredible South Indian feast. Our family loved it!', createdAt: ago(12_000_000_000) },
  { id: 'r7', bookingId: 'past-elder-1', customerId: 'c2', workerId: 'w8', rating: 5, comment: 'Anjali takes wonderful care of my mother. She is patient, kind, and professional.', createdAt: ago(14_000_000_000) },
  { id: 'r8', bookingId: 'vh-plumb-2', customerId: 'c5', workerId: 'w1', rating: 4, comment: 'Good plumbing work. Arrived within the scheduled slot.', createdAt: ago(16_000_000_000) },
];

/* ═══════════════════════════════════════════════════════════
   MESSAGES
   ═══════════════════════════════════════════════════════════ */
export const MESSAGES: Message[] = [
  { id: 'm1', bookingId: 'vh-2048', senderId: 'c1', receiverId: 'w1', text: 'Hi Vikram, are you close?', read: true, createdAt: ago(300000) },
  { id: 'm2', bookingId: 'vh-2048', senderId: 'w1', receiverId: 'c1', text: "Yes, I'm about 10 minutes away. On my way from Banjara Hills!", read: true, createdAt: ago(240000) },
  { id: 'm3', bookingId: 'vh-2048', senderId: 'c1', receiverId: 'w1', text: 'Perfect 👍 See you soon', read: true, createdAt: ago(180000) },
  { id: 'm4', bookingId: 'vh-2048', senderId: 'w1', receiverId: 'c1', text: 'Almost there, pulling up now', read: false, createdAt: ago(60000) },
  { id: 'm5', bookingId: 'vh-2047', senderId: 'c1', receiverId: 'w6', text: 'Priya, can you make it vegetarian only for tomorrow?', read: true, createdAt: ago(5_000_000_000) },
  { id: 'm6', bookingId: 'vh-2047', senderId: 'w6', receiverId: 'c1', text: 'Of course! I will prepare a special thali for you 😊', read: true, createdAt: ago(4_900_000_000) },
  { id: 'm7', bookingId: 'vh-house-1', senderId: 'c2', receiverId: 'w5', text: 'Rahul, please focus on kitchen and bathroom today', read: true, createdAt: ago(3_000_000_000) },
  { id: 'm8', bookingId: 'vh-house-1', senderId: 'w5', receiverId: 'c2', text: 'Understood Meera! Will deep clean both areas thoroughly.', read: true, createdAt: ago(2_900_000_000) },
];

/* ═══════════════════════════════════════════════════════════
   PAYMENTS
   ═══════════════════════════════════════════════════════════ */
export const PAYMENTS: Payment[] = [
  { id: 'pay1', bookingId: 'past-0', amount: 850, method: 'upi', status: 'completed', createdAt: ago(4_000_000_000) },
  { id: 'pay2', bookingId: 'past-2', amount: 699, method: 'cash', status: 'completed', createdAt: ago(6_000_000_000) },
  { id: 'pay3', bookingId: 'vh-2047', amount: 450, method: 'upi', status: 'completed', createdAt: ago(2_000_000_000) },
  { id: 'pay4', bookingId: 'vh-past-3', amount: 1200, method: 'card', status: 'completed', createdAt: ago(8_000_000_000) },
  { id: 'pay5', bookingId: 'vh-past-4', amount: 600, method: 'upi', status: 'completed', createdAt: ago(10_000_000_000) },
  { id: 'pay6', bookingId: 'past-cooking-1', amount: 750, method: 'upi', status: 'completed', createdAt: ago(12_000_000_000) },
  { id: 'pay7', bookingId: 'past-elder-1', amount: 1500, method: 'cash', status: 'completed', createdAt: ago(14_000_000_000) },
];

/* ═══════════════════════════════════════════════════════════
   NOTIFICATIONS
   ═══════════════════════════════════════════════════════════ */
export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'c1', type: 'booking_update', title: 'Booking Confirmed', message: 'Your plumbing request has been sent to Vikram. He will confirm shortly.', reading: false, createdAt: ago(600000) },
  { id: 'n2', userId: 'c1', type: 'chat', title: 'New Message', message: 'Vikram sent you a message: "Almost there!"', reading: false, createdAt: ago(120000) },
  { id: 'n3', userId: 'c1', type: 'notification', title: 'Welcome to Vaishnavi', message: 'Explore our services and book your first job. Get ₹100 off your first booking!', reading: true, createdAt: ago(86400000) },
  { id: 'n4', userId: 'w1', type: 'new_booking', title: 'New Request', message: 'Suhaeb requested bathroom plumbing repair tomorrow at 4:00 PM. Location: Banjara Hills.', reading: false, createdAt: ago(600000) },
  { id: 'n5', userId: 'admin1', type: 'system', title: 'System Update', message: 'Welcome to Vaishnavi Operations Dashboard.', reading: true, createdAt: ago(86400000) },
  { id: 'n6', userId: 'c2', type: 'booking_update', title: 'Worker Assigned', message: 'Rahul Kumar has been assigned to your housekeeping request.', reading: false, createdAt: ago(300000) },
  { id: 'n7', userId: 'c4', type: 'payment', title: 'Payment Received', message: 'Payment of ₹1,200 received for security guard booking.', reading: true, createdAt: ago(8_000_000_000) },
  { id: 'n8', userId: 'w6', type: 'new_booking', title: 'New Request', message: 'Meera Sharma requested lunch/dinner cooking for Sep 15.', reading: false, createdAt: ago(180000) },
  { id: 'n9', userId: 'c1', type: 'rating', title: 'Rate Your Experience', message: 'How was your cooking session with Priya? Leave a review!', reading: true, createdAt: ago(1_800_000_000) },
  { id: 'n10', userId: 'admin1', type: 'revenue', title: 'Daily Revenue', message: 'Today\'s revenue: ₹18,450 across 24 bookings.', reading: true, createdAt: ago(3600000) },
];

/* ═══════════════════════════════════════════════════════════
   BOOKINGS — Full lifecycle with historical data
   ═══════════════════════════════════════════════════════════ */
function generateAllBookings(): (Booking | BookingEvent)[] {
  const items: (Booking | BookingEvent)[] = [];
  const hyDates = ['2025-09-01','2025-09-03','2025-09-05','2025-09-07','2025-09-09',
                   '2025-09-10','2025-09-12','2025-09-14','2025-09-16'];
  const hyTimes = ['10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];
  const svcTypes: ServiceType[] = ['plumbing','housekeeping','cooking','electrical','elder_care','security','cooking','plumbing','housekeeping'];
  const statuses: BookingStatus[] = ['reviewed','completed','paid','completed','completed','paid','in_progress','requested','completed'];
  const prices   = [850, 699, 450, 600, 1200, 800, 550, 650, 750];

  hyDates.forEach((date, i) => {
    const cust = CUSTOMERS[i % CUSTOMERS.length];
    const svc = svcTypes[i];
    const worker = WORKERS.find(w => w.serviceType === svc) || WORKERS[0];
    const bid = `vh-${['past-0','past-1','past-2','past-3','past-4','cook-1','elec-1','plumb-2','house-2'][i]}`;
    const st = statuses[i];
    const created = ago((i + 1) * 2_500_000_000);

    const booking: Booking = {
      id: bid, customerId: cust.id, workerId: worker.id, serviceType: svc,
      serviceOptionId: 'general', addressId: cust.defaultAddress?.id || 'a1',
      date, time: hyTimes[i], status: st, estimatedPrice: prices[i],
      finalPrice: st === 'completed' || st === 'paid' ? prices[i] : undefined,
      createdAt: created,
    };
    items.push(booking);
    items.push({ id: `${bid}-evt-create`, bookingId: bid, timestamp: created, actorId: cust.id, actorRole: 'customer', type: 'created', message: `Booking created for ${svc}` });
    if (st !== 'requested') {
      items.push({ id: `${bid}-evt-assign`, bookingId: bid, timestamp: created + 60000, actorId: worker.id, actorRole: 'worker', type: 'assigned', message: 'Professional assigned' });
    }
    if (st === 'in_progress' || st === 'completed' || st === 'paid' || st === 'reviewed') {
      items.push({ id: `${bid}-evt-start`, bookingId: bid, timestamp: created + 120000, actorId: worker.id, actorRole: 'worker', type: 'started', message: 'Service started' });
    }
    if (st === 'completed' || st === 'paid' || st === 'reviewed') {
      items.push({ id: `${bid}-evt-comp`, bookingId: bid, timestamp: created + 300000, actorId: worker.id, actorRole: 'worker', type: 'completed', message: 'Service completed' });
    }
    if (st === 'paid' || st === 'reviewed') {
      items.push({ id: `${bid}-evt-paid`, bookingId: bid, timestamp: created + 360000, actorId: cust.id, actorRole: 'customer', type: 'paid', message: `Payment of ₹${prices[i]} received` });
    }
  });

  // ── Active / upcoming bookings ───────────────────────────
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  const dayAfter = new Date(Date.now() + 172800000).toISOString().slice(0, 10);
  const laterThisWeek = new Date(Date.now() + 432000000).toISOString().slice(0, 10);

  // Suhaeb's active plumbing (requested → the demo hook)
  const vh2048: Booking = {
    id: 'vh-2048', customerId: 'c1', workerId: 'w1', serviceType: 'plumbing',
    serviceOptionId: 'bathroom_issue', addressId: 'a1',
    date: tomorrow, time: '4:00 PM', status: 'requested',
    estimatedPrice: 650, createdAt: ago(600000),
  };
  items.push(vh2048);
  items.push({ id: 'vh-2048-e1', bookingId: 'vh-2048', timestamp: ago(600000), actorId: 'c1', actorRole: 'customer', type: 'created', message: 'Booking requested' });

  // Meera's housekeeping (in_progress — shows real activity)
  const vhHouseActive: Booking = {
    id: 'vh-house-active', customerId: 'c2', workerId: 'w5', serviceType: 'housekeeping',
    serviceOptionId: 'full_home', addressId: 'a3',
    date: todayStr(), time: '11:00 AM', status: 'in_progress',
    estimatedPrice: 999, createdAt: ago(7_200_000),
  };
  items.push(vhHouseActive);
  items.push({ id: 'vh-ha-e1', bookingId: 'vh-house-active', timestamp: ago(7_200_000), actorId: 'c2', actorRole: 'customer', type: 'created', message: 'Booking requested' });
  items.push({ id: 'vh-ha-e2', bookingId: 'vh-house-active', timestamp: ago(6_900_000), actorId: 'w5', actorRole: 'worker', type: 'accepted', message: 'Rahul accepted the request' });
  items.push({ id: 'vh-ha-e3', bookingId: 'vh-house-active', timestamp: ago(6_000_000), actorId: 'w5', actorRole: 'worker', type: 'started', message: 'Service in progress' });

  // Ananya's cooking (on_the_way)
  const vhCookOnWay: Booking = {
    id: 'vh-cook-onway', customerId: 'c4', workerId: 'w12', serviceType: 'cooking',
    serviceOptionId: 'special_meal', addressId: 'a5',
    date: todayStr(), time: '1:00 PM', status: 'on_the_way',
    estimatedPrice: 1200, createdAt: ago(3_600_000),
  };
  items.push(vhCookOnWay);
  items.push({ id: 'vh-cow-e1', bookingId: 'vh-cook-onway', timestamp: ago(3_600_000), actorId: 'c4', actorRole: 'customer', type: 'created', message: 'Booking requested' });
  items.push({ id: 'vh-cow-e2', bookingId: 'vh-cook-onway', timestamp: ago(3_300_000), actorId: 'w12', actorRole: 'worker', type: 'accepted', message: 'Fatima accepted the request' });
  items.push({ id: 'vh-cow-e3', bookingId: 'vh-cook-onway', timestamp: ago(1_800_000), actorId: 'w12', actorRole: 'worker', type: 'on_the_way', message: 'Fatima is on the way' });

  // Ravi's electrical (assigned)
  const vhElecAssign: Booking = {
    id: 'vh-elec-asgn', customerId: 'c3', workerId: 'w4', serviceType: 'electrical',
    serviceOptionId: 'fan_light', addressId: 'a4',
    date: tomorrow, time: '10:00 AM', status: 'assigned',
    estimatedPrice: 550, createdAt: ago(1_800_000),
  };
  items.push(vhElecAssign);
  items.push({ id: 'vh-ea-e1', bookingId: 'vh-elec-asgn', timestamp: ago(1_800_000), actorId: 'c3', actorRole: 'customer', type: 'created', message: 'Booking requested' });
  items.push({ id: 'vh-ea-e2', bookingId: 'vh-elec-asgn', timestamp: ago(1_500_000), actorId: 'w4', actorRole: 'worker', type: 'accepted', message: 'Arjun accepted the request' });

  // Ananya's elder care (upcoming tomorrow)
  const vhElderUp: Booking = {
    id: 'vh-elder-up', customerId: 'c4', workerId: 'w8', serviceType: 'elder_care',
    serviceOptionId: 'companion', addressId: 'a5',
    date: tomorrow, time: '9:00 AM', status: 'requested',
    estimatedPrice: 800, createdAt: ago(900000),
  };
  items.push(vhElderUp);
  items.push({ id: 'vh-eu-e1', bookingId: 'vh-elder-up', timestamp: ago(900000), actorId: 'c4', actorRole: 'customer', type: 'created', message: 'Booking requested' });

  return items;
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

/* ═══════════════════════════════════════════════════════════
   SEED FUNCTION
   ═══════════════════════════════════════════════════════════ */
export async function seedDatabase() {
  try {
    const userCount = await db.users.count();
    if (userCount > 0) return; // already seeded

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
      await db.ads.bulkAdd(ADS);
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

    console.log('[Seed] Database initialized with', bk.length, 'bookings,', WORKERS.length, 'workers,', CUSTOMERS.length, 'customers');
  } catch (e) {
    console.error('[DB Seed Error]', e);
  }
}
