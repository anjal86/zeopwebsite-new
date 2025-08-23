import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import ActivitiesPage from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import KailashMansarovarPage from './pages/KailashMansarovar';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import NotFound from './pages/NotFound';

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
    <Router>
      <ScrollToTop />
      <div className="App">
        {/* Navigation - Sticky */}
        <Navigation />
        
        {/* Main Content */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:destinationName" element={<DestinationDetail />} />
            <Route path="/tours" element={<ToursPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:activityName" element={<ActivityDetail />} />
            <Route path="/kailash-mansarovar" element={<KailashMansarovarPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Catch-all route for 404 pages */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
