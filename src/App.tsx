import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDatabaseInit } from './db/use-db-init';
import { DBProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import CustomerHome from './pages/customer/Home';
import ServiceDetail from './pages/customer/ServiceDetail';
import Tracking from './pages/customer/Tracking';
import Chat from './pages/customer/Chat';
import CallScreen from './pages/customer/Call';
import Bookings from './pages/customer/Bookings';
import BookingDetail from './pages/customer/BookingDetail';
import Profile from './pages/customer/Profile';
import Notifications from './pages/customer/Notifications';
import Search from './pages/customer/Search';
import WorkerHome from './pages/worker/Home';
import WorkerRequests from './pages/worker/Requests';
import WorkerJobs from './pages/worker/Jobs';
import WorkerEarnings from './pages/worker/Earnings';
import WorkerProfile from './pages/worker/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMap from './pages/admin/Map';
import AdminBookings from './pages/admin/Bookings';
import AdminRevenue from './pages/admin/Revenue';
import AdminWorkers from './pages/admin/Workers';
import AdminNotifications from './pages/admin/Notifications';
import BottomNav from './components/BottomNav';
import AdminNav from './components/AdminNav';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import { useThreeFingerGesture } from './hooks/useThreeFingerGesture';
import { useKeyboardSwitch } from './hooks/useKeyboardSwitch';
import { useAppStore } from './db/store';

const queryClient = new QueryClient();

// Services registry for cross-page access
(window as any).__services = [
  { id: 'housekeeping', name: 'Housekeeping', description: 'Thorough home cleaning by trained professionals.', icon: '🧹', color: '#173F35', options: [{ id: 'full_home', label: 'Full Home Cleaning', priceRange: [999, 1899] }, { id: 'kitchen', label: 'Kitchen Deep Clean', priceRange: [599, 999] }, { id: 'bathroom', label: 'Bathroom Cleaning', priceRange: [399, 699] }, { id: 'laundry', label: 'Laundry & Ironing', priceRange: [299, 599] }, { id: 'general', label: 'General Household Help', priceRange: [499, 899] }] },
  { id: 'cooking', name: 'Cooking', description: 'Home-cooked meals by experienced chefs.', icon: '👩🍳', color: '#C86F52', options: [{ id: 'breakfast', label: 'Breakfast Prep', priceRange: [300, 500] }, { id: 'lunch_dinner', label: 'Lunch / Dinner', priceRange: [400, 700] }, { id: 'special_meal', label: 'Special Occasion Meal', priceRange: [800, 1500] }, { id: 'dietary', label: 'Diet-Specific Cooking', priceRange: [500, 900] }] },
  { id: 'plumbing', name: 'Plumbing', description: 'Reliable plumbing support for a hassle-free home.', icon: '🔧', color: '#173F35', options: [{ id: 'leak_repair', label: 'Leak Repair', priceRange: [400, 800] }, { id: 'pipe_repair', label: 'Pipe Repair', priceRange: [500, 1000] }, { id: 'bathroom_issue', label: 'Bathroom Issue', priceRange: [500, 1200] }, { id: 'kitchen_issue', label: 'Kitchen Issue', priceRange: [400, 900] }, { id: 'installation', label: 'Installation', priceRange: [600, 1500] }, { id: 'general_maintenance', label: 'General Maintenance', priceRange: [350, 700] }] },
  { id: 'electrical', name: 'Electrical', description: 'Safe electrical fixes and installations.', icon: '⚡', color: '#C86F52', options: [{ id: 'wiring', label: 'Wiring Work', priceRange: [500, 1200] }, { id: 'fan_light', label: 'Fan / Light Fix', priceRange: [300, 600] }, { id: 'switchboard', label: 'Switchboard Repair', priceRange: [300, 500] }, { id: 'outlet_install', label: 'Outlet Installation', priceRange: [400, 800] }, { id: 'general_electrical', label: 'General Electrical', priceRange: [350, 700] }] },
  { id: 'security', name: 'Security', description: 'Trusted security personnel for your home.', icon: '🛡️', color: '#173F35', options: [{ id: 'day_guard', label: 'Day Shift Guard', priceRange: [800, 1500] }, { id: 'night_guard', label: 'Night Shift Guard', priceRange: [900, 1800] }, { id: 'cctv', label: 'CCTV Monitoring', priceRange: [1000, 2500] }] },
  { id: 'elder_care', name: 'Elder Care', description: 'Compassionate care for your senior family members.', icon: '❤️', color: '#C86F52', options: [{ id: 'companion', label: 'Companionship', priceRange: [600, 1000] }, { id: 'medication', label: 'Medication Support', priceRange: [500, 900] }, { id: 'mobility', label: 'Mobility Assistance', priceRange: [700, 1200] }, { id: 'overnight', label: 'Overnight Care', priceRange: [1200, 2000] }] },
  { id: 'caretaker', name: 'Caretakers', description: 'Dedicated caretaker for your household needs.', icon: '🏠', color: '#173F35', options: [{ id: 'daily_caretaker', label: 'Daily Caretaker', priceRange: [800, 1500] }, { id: 'live_in', label: 'Live-in Caretaker', priceRange: [1200, 2500] }] },
  { id: 'home_support', name: 'Home Support', description: 'General household assistance for daily tasks.', icon: '✨', color: '#A8B9A5', options: [{ id: 'errands', label: 'Errands & Shopping', priceRange: [300, 600] }, { id: 'organization', label: 'Home Organization', priceRange: [500, 1000] }, { id: 'garden', label: 'Garden & Balcony', priceRange: [400, 800] }, { id: 'appliance', label: 'Appliance Setup', priceRange: [300, 700] }] },
];

function AppRoutes() {
  const role = useAppStore(s => s.currentRole);
  const user = useAppStore(s => s.currentUser);
  const { setCurrentUser } = useAppStore.getState();

  useDatabaseInit();
  useThreeFingerGesture();
  useKeyboardSwitch();

  if (!role && !user) {
    return (
      <div className="min-h-screen bg-[#FBF9F4] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(145deg, #1E4D3F 0%, #102F28 100%)', boxShadow: '0 8px 30px rgba(23,63,53,0.35)' }}>
          <span className="text-white text-2xl font-extrabold">V</span>
        </div>
        <p className="text-[#7A8B7E] text-sm font-medium">Loading Vaishnavi…</p>
      </div>
    );
  }

  const isCustomer = role === 'customer';
  const isWorker = role === 'worker';
  const isAdmin = role === 'admin';

  return (
    <div className={isAdmin ? 'max-w-none mx-auto bg-[#FBF9F4] min-h-screen' : 'max-w-[430px] mx-auto bg-[#FBF9F4] shadow-2xl min-h-screen relative'} style={{ boxShadow: isAdmin ? 'none' : '0 0 60px rgba(23,63,53,0.12)' }}>
      <DBProvider>
        <AuthProvider>
          {isCustomer && <BottomNav />}
          {isWorker && <BottomNav />}
          {isAdmin && <AdminNav />}

          <Routes>
            {/* ── CUSTOMER ── */}
            <Route path="/" element={<CustomerHome />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/call" element={<CallScreen />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/booking/:id" element={<BookingDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* ── WORKER ── */}
            <Route path="/worker/home" element={<WorkerHome />} />
            <Route path="/worker/requests" element={<WorkerRequests />} />
            <Route path="/worker/jobs" element={<WorkerJobs />} />
            <Route path="/worker/earnings" element={<WorkerEarnings />} />
            <Route path="/worker/profile" element={<WorkerProfile />} />
            <Route path="/worker/chat" element={<Chat />} />
            <Route path="/worker/call" element={<CallScreen />} />

            {/* ── ADMIN ── */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/map" element={<AdminMap />} />
            <Route path="/admin/bookings" element={<AdminBookings />} />
            <Route path="/admin/revenue" element={<AdminRevenue />} />
            <Route path="/admin/workers" element={<AdminWorkers />} />
            <Route path="/admin/notifications" element={<AdminNotifications />} />
            <Route path="/admin/more" element={<AdminDashboard />} />

            {/* ── FALLBACKS ── */}
            <Route path="/landing" element={<Landing />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </DBProvider>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
