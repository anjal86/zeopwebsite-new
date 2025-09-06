import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import components
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';

// Import pages
import Home from './pages/Home';
import DestinationsPage from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import ToursPage from './pages/Tours';
import TourDetail from './pages/TourDetail';
import ActivitiesPage from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import KailashMansarovarPage from './pages/KailashMansarovar';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import NotFound from './pages/NotFound';

// Import admin pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import TourEditor from './pages/TourEditor';

// Component to handle scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top on route changes, not on initial load/reload
    const isInitialLoad = sessionStorage.getItem('initialLoad') === null;
    
    if (isInitialLoad) {
      sessionStorage.setItem('initialLoad', 'false');
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

// Layout component that conditionally shows navigation and footer
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {/* Navigation - Only show on non-admin routes */}
      {!isAdminRoute && <Navigation />}
      
      {/* Main Content */}
      <main>
        {children}
      </main>
      
      {/* Footer - Only show on non-admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      offset: 100,
    });

    // Refresh AOS on window resize
    window.addEventListener('resize', () => {
      AOS.refresh();
    });

    return () => {
      window.removeEventListener('resize', () => {
        AOS.refresh();
      });
    };
  }, []);

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:destinationName" element={<DestinationDetail />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/tours/:tourSlug" element={<TourDetail />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:activityName" element={<ActivityDetail />} />
            <Route path="/kailash-mansarovar" element={<KailashMansarovarPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/tours/new" element={<TourEditor />} />
            <Route path="/admin/tours/:tourSlug" element={<TourEditor />} />
            
            {/* Catch-all route for 404 pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </HelmetProvider>
  );
}

export default App;
