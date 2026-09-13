import { db } from './database';
import type { Worker, Customer, Admin, Service, Address, Booking, Payment, Review, Message, Notification, Ad, BookingEvent, User, ServiceType, BookingStatus } from '../types';

const uid = () => Math.random().toString(36).slice(2, 10);
const now = () => Date.now();

export const SERVICES: Service[] = [
  { id: 'housekeeping', name: 'Housekeeping', description: 'Thorough home cleaning by trained professionals.', icon: '🧹', color: '#173F35', options: [{ id: 'full_home', label: 'Full Home Cleaning', priceRange: [999, 1899] }, { id: 'kitchen', label: 'Kitchen Deep Clean', priceRange: [599, 999] }, { id: 'bathroom', label: 'Bathroom Cleaning', priceRange: [399, 699] }, { id: 'laundry', label: 'Laundry & Ironing', priceRange: [299, 599] }, { id: 'general', label: 'General Household Help', priceRange: [499, 899] }] },
  { id: 'cooking', name: 'Cooking', description: 'Home-cooked meals by experienced chefs.', icon: '👩‍🍳', color: '#C86F52', options: [{ id: 'breakfast', label: 'Breakfast Prep', priceRange: [300, 500] }, { id: 'lunch_dinner', label: 'Lunch / Dinner', priceRange: [400, 700] }, { id: 'special_meal', label: 'Special Occasion Meal', priceRange: [800, 1500] }, { id: 'dietary', label: 'Diet-Specific Cooking', priceRange: [500, 900] }] },
  { id: 'plumbing', name: 'Plumbing', description: 'Reliable plumbing support for a hassle-free home.', icon: '🔧', color: '#173F35', options: [{ id: 'leak_repair', label: 'Leak Repair', priceRange: [400, 800] }, { id: 'pipe_repair', label: 'Pipe Repair', priceRange: [500, 1000] }, { id: 'bathroom_issue', label: 'Bathroom Issue', priceRange: [500, 1200] }, { id: 'kitchen_issue', label: 'Kitchen Issue', priceRange: [400, 900] }, { id: 'installation', label: 'Installation', priceRange: [600, 1500] }, { id: 'general_maintenance', label: 'General Maintenance', priceRange: [350, 700] }] },
  { id: 'electrical', name: 'Electrical', description: 'Safe electrical fixes and installations.', icon: '⚡', color: '#C86F52', options: [{ id: 'wiring', label: 'Wiring Work', priceRange: [500, 1200] }, { id: 'fan_light', label: 'Fan / Light Fix', priceRange: [300, 600] }, { id: 'switchboard', label: 'Switchboard Repair', priceRange: [300, 500] }, { id: 'outlet_install', label: 'Outlet Installation', priceRange: [400, 800] }, { id: 'general_electrical', label: 'General Electrical', priceRange: [350, 700] }] },
  { id: 'security', name: 'Security', description: 'Trusted security personnel for your home.', icon: '🛡️', color: '#173F35', options: [{ id: 'day_guard', label: 'Day Shift Guard', priceRange: [800, 1500] }, { id: 'night_guard', label: 'Night Shift Guard', priceRange: [900, 1800] }, { id: 'cctv', label: 'CCTV Monitoring', priceRange: [1000, 2500] }] },
  { id: 'elder_care', name: 'Elder Care', description: 'Compassionate care for your senior family members.', icon: '❤️', color: '#C86F52', options: [{ id: 'companion', label: 'Companionship', priceRange: [600, 1000] }, { id: 'medication', label: 'Medication Support', priceRange: [500, 900] }, { id: 'mobility', label: 'Mobility Assistance', priceRange: [700, 1200] }, { id: 'overnight', label: 'Overnight Care', priceRange: [1200, 2000] }] },
  { id: 'caretaker', name: 'Caretakers', description: 'Dedicated caretaker for your household needs.', icon: '🏠', color: '#173F35', options: [{ id: 'daily_caretaker', label: 'Daily Caretaker', priceRange: [800, 1500] }, { id: 'live_in', label: 'Live-in Caretaker', priceRange: [1200, 2500] }] },
  { id: 'home_support', name: 'Home Support', description: 'General household assistance for daily tasks.', icon: '✨', color: '#A8B9A5', options: [{ id: 'errands', label: 'Errands & Shopping', priceRange: [300, 600] }, { id: 'organization', label: 'Home Organization', priceRange: [500, 1000] }, { id: 'garden', label: 'Garden & Balcony', priceRange: [400, 800] }, { id: 'appliance', label: 'Appliance Setup', priceRange: [300, 700] }] },
];

export const WORKERS: Worker[] = [
  { id: 'w1', role: 'worker', name: 'Vikram Singh', phone: '+91 98765 43210', serviceType: 'plumbing' as ServiceType, rating: 4.8, totalJobs: 231, completionRate: 98, bio: 'Experienced plumbing professional focused on reliable and respectful home service.', skills: ['Leak Repairs', 'Pipe Fixes', 'Bathroom Plumbing', 'Kitchen Plumbing', 'Installation'], status: 'online', todayEarnings: 1850, weekEarnings: 12850, monthEarnings: 48600, location: 'Banjara Hills', avatarUrl: '', createdAt: now() - 90_000_000 },
  { id: 'w2', role: 'worker', name: 'Ravi Kumar', phone: '+91 98765 43211', serviceType: 'plumbing' as ServiceType, rating: 4.7, totalJobs: 184, completionRate: 96, bio: 'Detail-oriented plumber.', skills: ['Emergency Repairs', 'Pipe Replacement'], status: 'busy', todayEarnings: 2200, weekEarnings: 15400, monthEarnings: 52100, location: 'Jubilee Hills', avatarUrl: '', createdAt: now() - 80_000_000 },
  { id: 'w3', role: 'worker', name: 'Mahesh Rao', phone: '+91 98765 43212', serviceType: 'plumbing' as ServiceType, rating: 4.9, totalJobs: 302, completionRate: 99, bio: 'Master plumber.', skills: ['Advanced Plumbing', 'Renovation'], status: 'online', todayEarnings: 3100, weekEarnings: 18200, monthEarnings: 67000, location: 'Secunderabad', avatarUrl: '', createdAt: now() - 100_000_000 },
  { id: 'w4', role: 'worker', name: 'Arjun Reddy', phone: '+91 98765 43213', serviceType: 'electrical' as ServiceType, rating: 4.8, totalJobs: 198, completionRate: 97, bio: 'Certified electrician.', skills: ['Wiring', 'Fan Installation', 'AC Repair'], status: 'online', todayEarnings: 2100, weekEarnings: 14500, monthEarnings: 51000, location: 'Sainikpuri', avatarUrl: '', createdAt: now() - 75_000_000 },
  { id: 'w5', role: 'worker', name: 'Rahul Kumar', phone: '+91 98765 43214', serviceType: 'housekeeping' as ServiceType, rating: 4.8, totalJobs: 127, completionRate: 97, bio: 'Meticulous housekeeper.', skills: ['Deep Cleaning', 'Kitchen Sanitization'], status: 'online', todayEarnings: 1500, weekEarnings: 10500, monthEarnings: 38400, location: 'Banjara Hills', avatarUrl: '', createdAt: now() - 60_000_000 },
  { id: 'w6', role: 'worker', name: 'Priya Sharma', phone: '+91 98765 43215', serviceType: 'cooking' as ServiceType, rating: 4.9, totalJobs: 184, completionRate: 99, bio: 'Passionate home cook.', skills: ['South Indian', 'Mughlai', 'Baking'], status: 'online', todayEarnings: 2800, weekEarnings: 16800, monthEarnings: 58200, location: 'A.S. Rao Nagar', avatarUrl: '', createdAt: now() - 70_000_000 },
  { id: 'w7', role: 'worker', name: 'Suresh Naidu', phone: '+91 98765 43216', serviceType: 'security' as ServiceType, rating: 4.8, totalJobs: 312, completionRate: 99, bio: 'Former paramilitary.', skills: ['Guard Duty', 'Surveillance'], status: 'busy', todayEarnings: 3500, weekEarnings: 21000, monthEarnings: 78000, location: 'Kompally', avatarUrl: '', createdAt: now() - 120_000_000 },
  { id: 'w8', role: 'worker', name: 'Anjali Rao', phone: '+91 98765 43217', serviceType: 'elder_care' as ServiceType, rating: 4.9, totalJobs: 96, completionRate: 99, bio: 'Certified caregiver.', skills: ['Medication Management', 'Mobility Support'], status: 'online', todayEarnings: 2000, weekEarnings: 14000, monthEarnings: 49000, location: 'Himayatnagar', avatarUrl: '', createdAt: now() - 55_000_000 },
  { id: 'w9', role: 'worker', name: 'Deepak Verma', phone: '+91 98765 43218', serviceType: 'home_support' as ServiceType, rating: 4.7, totalJobs: 156, completionRate: 96, bio: 'Versatile home support worker.', skills: ['Grocery Shopping', 'Organizing'], status: 'offline', todayEarnings: 0, weekEarnings: 8400, monthEarnings: 31200, location: 'Begumpet', avatarUrl: '', createdAt: now() - 65_000_000 },
  { id: 'w10', role: 'worker', name: 'Lakshmi Devi', phone: '+91 98765 43219', serviceType: 'caretaker' as ServiceType, rating: 4.9, totalJobs: 88, completionRate: 98, bio: 'Experienced caretaker.', skills: ['Household Management', 'Staff Supervision'], status: 'online', todayEarnings: 2500, weekEarnings: 17500, monthEarnings: 61250, location: 'Banjara Hills', avatarUrl: '', createdAt: now() - 50_000_000 },
  { id: 'w11', role: 'worker', name: 'Kiran Patel', phone: '+91 98765 43220', serviceType: 'electrical' as ServiceType, rating: 4.6, totalJobs: 143, completionRate: 95, bio: 'Reliable electrician.', skills: ['Commercial Wiring', 'Generator Backup'], status: 'online', todayEarnings: 1900, weekEarnings: 11400, monthEarnings: 42000, location: 'Secunderabad', avatarUrl: '', createdAt: now() - 60_000_000 },
];

export const CUSTOMERS: Customer[] = [
  { id: 'c1', role: 'customer', name: 'Suhaeb', phone: '+91 88888 77777', defaultAddress: { id: 'a1', label: 'Home', line1: 'Flat 302, GreenPark Apartments', line2: 'Road No. 12, Banjara Hills', city: 'Hyderabad', landmark: 'Near Clock Tower', lat: 17.4149, lng: 78.4438 }, totalBookings: 7, totalSpent: 4850, favoriteWorkerIds: ['w1', 'w6'], avatarUrl: '', createdAt: now() - 180_000_000 },
  { id: 'c2', role: 'customer', name: 'Meera Sharma', phone: '+91 88888 77778', defaultAddress: { id: 'a2', label: 'Home', line1: '5-8-112, 2nd Floor', line2: 'Somajiguda', city: 'Hyderabad', landmark: 'Near JNTU Hostel', lat: 17.4239, lng: 78.4738 }, totalBookings: 5, totalSpent: 3200, favoriteWorkerIds: ['w6'], avatarUrl: '', createdAt: now() - 150_000_000 },
  { id: 'c3', role: 'customer', name: 'Ravi Kumar', phone: '+91 88888 77779', defaultAddress: { id: 'a3', label: 'Home', line1: 'Plot 45, D Block', line2: 'Sainikpuri', city: 'Hyderabad', landmark: 'Near Sainikpuri Circle', lat: 17.4687, lng: 78.5311 }, totalBookings: 3, totalSpent: 2100, favoriteWorkerIds: [], avatarUrl: '', createdAt: now() - 120_000_000 },
];

export const ADMINS: Admin[] = [
  { id: 'admin1', role: 'admin', name: 'Vaishnavi Operations', phone: '+91 75697 28464', badge: 'Administrator', avatarUrl: '', createdAt: now() },
];

export const ADDRESSES: Address[] = [
  { id: 'a1', label: 'Home', line1: 'Flat 302, GreenPark Apartments', line2: 'Road No. 12, Banjara Hills', city: 'Hyderabad', landmark: 'Near Clock Tower', lat: 17.4149, lng: 78.4438 },
  { id: 'a2', label: 'Office', line1: 'Tower B, HITEC City', line2: 'Madhapur', city: 'Hyderabad', landmark: 'Near Rajiv Gandhi IT Park', lat: 17.4400, lng: 78.3780 },
  { id: 'a3', label: 'Home', line1: '5-8-112, 2nd Floor', line2: 'Somajiguda', city: 'Hyderabad', landmark: 'Near JNTU Hostel', lat: 17.4239, lng: 78.4738 },
  { id: 'a4', label: 'Home', line1: 'Plot 45, D Block', line2: 'Sainikpuri', city: 'Hyderabad', landmark: 'Near Sainikpuri Circle', lat: 17.4687, lng: 78.5311 },
];

export const ADS: Ad[] = [
  { id: 'ad1', title: 'Protect Your Home', subtitle: 'Get affordable home insurance — coverage from ₹299/month.', ctaText: 'Learn More', targetPlacement: 'tracking' },
  { id: 'ad2', title: 'Premium Cleaning Kit', subtitle: 'Upgrade your home cleaning with professional-grade products.', ctaText: 'Shop Now', targetPlacement: 'home' },
];

export const MESSAGES: Message[] = [
  { id: 'm1', bookingId: 'vh-2048', senderId: 'c1', receiverId: 'w1', text: 'Hi Vikram, are you close?', read: true, createdAt: now() - 300000 },
  { id: 'm2', bookingId: 'vh-2048', senderId: 'w1', receiverId: 'c1', text: "Yes, I'm about 10 minutes away. On my way!", read: true, createdAt: now() - 240000 },
  { id: 'm3', bookingId: 'vh-2048', senderId: 'c1', receiverId: 'w1', text: 'Perfect 👍', read: true, createdAt: now() - 180000 },
];

export const REVIEWS: Review[] = [
  { id: 'r1', bookingId: 'vh-2047', customerId: 'c1', workerId: 'w6', rating: 5, comment: 'Amazing food! Very professional and arrived on time.', createdAt: now() - 2_000_000_000 },
  { id: 'r2', bookingId: 'past-0', customerId: 'c1', workerId: 'w1', rating: 5, comment: 'Quick and clean work. Fixed the leak in no time.', createdAt: now() - 4_000_000_000 },
  { id: 'r3', bookingId: 'past-2', customerId: 'c2', workerId: 'w5', rating: 4, comment: 'Good cleaning service, very thorough.', createdAt: now() - 6_000_000_000 },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'c1', type: 'booking_update', title: 'Booking Confirmed', message: 'Your plumbing request has been sent to Vikram.', reading: false, createdAt: now() - 600000 },
  { id: 'n2', userId: 'c1', type: 'chat', title: 'New Message', message: 'Vikram sent you a message.', reading: false, createdAt: now() - 300000 },
  { id: 'n3', userId: 'c1', type: 'notification', title: 'Welcome to Vaishnavi', message: 'Explore our services and book your first job.', reading: true, createdAt: now() - 86400000 },
  { id: 'n4', userId: 'w1', type: 'new_booking', title: 'New Request', message: 'Suhaeb requested bathroom plumbing repair tomorrow at 4:00 PM.', reading: false, createdAt: now() - 600000 },
  { id: 'n5', userId: 'admin1', type: 'system', title: 'System Update', message: 'Welcome to Vaishnavi Operations Dashboard.', reading: true, createdAt: now() - 86400000 },
];

export const PAYMENTS: Payment[] = [
  { id: 'pay1', bookingId: 'past-0', amount: 850, method: 'upi' as const, status: 'completed' as const, createdAt: now() - 4_000_000_000 },
  { id: 'pay2', bookingId: 'past-2', amount: 699, method: 'cash' as const, status: 'completed' as const, createdAt: now() - 6_000_000_000 },
  { id: 'pay3', bookingId: 'vh-2047', amount: 450, method: 'upi' as const, status: 'completed' as const, createdAt: now() - 2_000_000_000 },
];

function generatePastBookings(): (Booking | BookingEvent)[] {
  const items: (Booking | BookingEvent)[] = [];
  const services: ServiceType[] = ['plumbing', 'housekeeping', 'cooking', 'electrical', 'elder_care'];
  const statuses: BookingStatus[] = ['completed', 'completed', 'completed', 'paid', 'reviewed'];
  const dates = ['2025-09-07', '2025-09-05', '2025-08-28', '2025-08-21', '2025-08-17'];
  const times = ['10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM', '6:00 PM'];
  const prices = [850, 699, 450, 600, 1200];

  dates.forEach((date, i) => {
    const cust = CUSTOMERS[i % CUSTOMERS.length];
    const svc = services[i % services.length];
    const worker = WORKERS.find(w => w.serviceType === svc) || WORKERS[0];
    const bid = `vh-past-${i}`;
    const booking: Booking = {
      id: bid, customerId: cust.id, workerId: worker.id, serviceType: svc,
      serviceOptionId: 'general', addressId: cust.defaultAddress?.id || 'a1',
      date, time: times[i], status: statuses[Math.min(i, statuses.length - 1)],
      estimatedPrice: prices[i], finalPrice: prices[i], createdAt: now() - (i + 1) * 2_000_000_000,
    };
    items.push(booking);
    items.push({ id: `${bid}-evt`, bookingId: bid, timestamp: booking.createdAt, actorId: cust.id, actorRole: 'customer' as const, type: 'created', message: `Booking created for ${svc}` });
  });

  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
  items.push({ id: 'vh-2048', customerId: 'c1', workerId: 'w1', serviceType: 'plumbing' as ServiceType, serviceOptionId: 'bathroom_issue', addressId: 'a1', date: tomorrow, time: '4:00 PM', status: 'requested' as BookingStatus, estimatedPrice: 650, createdAt: now() - 600000 });
  items.push({ id: 'vh-2048-e1', bookingId: 'vh-2048', timestamp: now() - 600000, actorId: 'c1', actorRole: 'customer' as const, type: 'created', message: 'Booking requested' });
  items.push({ id: 'vh-2047', customerId: 'c1', workerId: 'w6', serviceType: 'cooking' as ServiceType, serviceOptionId: 'lunch_dinner', addressId: 'a1', date: '2025-09-10', time: '1:00 PM', status: 'completed' as BookingStatus, estimatedPrice: 450, finalPrice: 450, createdAt: now() - 3_000_000_000 });
  return items;
}

export async function seedDatabase() {
  try {
    const userCount = await db.users.count();
    if (userCount > 0) return;

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

    await db.transaction('rw', db.bookings, db.bookingEvents, db.reviews, async () => {
      const bae = generatePastBookings();
      const bk = bae.filter(x => 'customerId' in x) as Booking[];
      const ev = bae.filter(x => 'bookingId' in x && 'type' in x) as BookingEvent[];
      await db.bookings.bulkAdd(bk);
      await db.bookingEvents.bulkAdd(ev);
      await db.reviews.bulkAdd(REVIEWS);
    });

    await db.transaction('rw', db.payments, db.messages, db.notifications, async () => {
      await db.payments.bulkAdd(PAYMENTS);
      await db.messages.bulkAdd(MESSAGES);
      await db.notifications.bulkAdd(NOTIFICATIONS);
    });
  } catch (e) {
    console.error('[DB Seed Error]', e);
  }
}
