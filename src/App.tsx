import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { useDatabaseInit } from './db/use-db-init';
import { DBProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import CustomerHome from './pages/customer/Home';
import CustomerHistory from './pages/customer/History';
import CustomerBookings from './pages/customer/Bookings';
import Search from './pages/customer/Search';
import ServiceDetail from './pages/customer/ServiceDetail';
import Tracking from './pages/customer/Tracking';
import Chat from './pages/customer/Chat';
import CallScreen from './pages/customer/Call';
import BookingDetail from './pages/customer/BookingDetail';
import Profile from './pages/customer/Profile';
import Notifications from './pages/customer/Notifications';
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

function PageTransition({ children, key }: { children: React.ReactNode; key?: string }) {
  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const role = useAppStore(s => s.currentRole);
  const user = useAppStore(s => s.currentUser);
  // Tick counter that forces remount whenever user or role changes, bypassing
  // React Router's same-URL no-op behavior.
  const tickRef = useRef(0);
  const [, setTick] = useState(0);
  const tick = tickRef.current;
  useEffect(() => {
    tickRef.current += 1;
    setTick(tickRef.current);
  }, [role, user?.id]);

  useDatabaseInit();
  useThreeFingerGesture();
  useKeyboardSwitch();

  // No user yet → show landing page (outside keyed container so it always remounts fresh)
  if (!role && !user) {
    return <Landing />;
  }

  const isCustomer = role === 'customer';
  const isWorker = role === 'worker';
  const isAdmin = role === 'admin';

  const containerStyle = isAdmin
    ? { boxShadow: 'none' as const }
    : { boxShadow: '0 0 60px rgba(23,63,53,0.12)' as const };

  const renderPage = (element: React.ReactNode, pathKey: string) => (
    <PageTransition key={pathKey}>{element}</PageTransition>
  );

  return (
    // Keyed wrapper: when tick changes, React unmounts+remounts everything,
    // forcing a fresh render regardless of whether the URL actually changed.
    <div key={tick} className="max-w-[430px] mx-auto bg-[var(--va-cream-light)] min-h-screen relative" style={containerStyle}>
      <DBProvider>
        <AuthProvider>
          {isCustomer && <BottomNav />}
          {isWorker && <BottomNav />}
          {isAdmin && <AdminNav />}

          <div className="relative min-h-screen" style={{ paddingBottom: '80px' }}>
            <AnimatePresence mode="wait">
              <Routes>
                {/* ── CUSTOMER ── */}
                <Route path="/" element={renderPage(<CustomerHome />, 'customer-home')} />
                <Route path="/search" element={renderPage(<Search />, 'search')} />
                <Route path="/service/:id" element={renderPage(<ServiceDetail />, 'service-detail')} />
                <Route path="/history" element={renderPage(<CustomerHistory />, 'customer-history')} />
                <Route path="/bookings" element={renderPage(<CustomerBookings />, 'customer-bookings')} />
                <Route path="/tracking" element={renderPage(<Tracking />, 'tracking')} />
                <Route path="/chat" element={renderPage(<Chat />, 'chat')} />
                <Route path="/call" element={renderPage(<CallScreen />, 'call')} />
                <Route path="/booking/:id" element={renderPage(<BookingDetail />, 'booking-detail')} />
                <Route path="/profile" element={renderPage(<Profile />, 'profile')} />
                <Route path="/notifications" element={renderPage(<Notifications />, 'notifications')} />

                {/* ── WORKER ── */}
                <Route path="/worker/home" element={renderPage(<WorkerHome />, 'worker-home')} />
                <Route path="/worker/requests" element={renderPage(<WorkerRequests />, 'worker-requests')} />
                <Route path="/worker/jobs" element={renderPage(<WorkerJobs />, 'worker-jobs')} />
                <Route path="/worker/earnings" element={renderPage(<WorkerEarnings />, 'worker-earnings')} />
                <Route path="/worker/profile" element={renderPage(<WorkerProfile />, 'worker-profile')} />
                <Route path="/worker/chat" element={renderPage(<Chat />, 'worker-chat')} />
                <Route path="/worker/call" element={renderPage(<CallScreen />, 'worker-call')} />

                {/* ── ADMIN ── */}
                <Route path="/admin/dashboard" element={renderPage(<AdminDashboard />, 'admin-dashboard')} />
                <Route path="/admin/map" element={renderPage(<AdminMap />, 'admin-map')} />
                <Route path="/admin/bookings" element={renderPage(<AdminBookings />, 'admin-bookings')} />
                <Route path="/admin/revenue" element={renderPage(<AdminRevenue />, 'admin-revenue')} />
                <Route path="/admin/workers" element={renderPage(<AdminWorkers />, 'admin-workers')} />
                <Route path="/admin/notifications" element={renderPage(<AdminNotifications />, 'admin-notifications')} />
                <Route path="/admin/more" element={renderPage(<AdminDashboard />, 'admin-more')} />

                {/* ── FALLBACKS ── */}
                <Route path="/landing" element={<Landing />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </div>
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
