import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import {
  GiWaterDrop
} from 'react-icons/gi';
import TourGrid from '../components/Tours/TourGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import type { Tour } from '../services/api';

interface GalleryPhoto {
  id: number;
  title: string;
  image: string;
  alt: string;
  gridSpan: string;
  order: number;
  isActive: boolean;
  uploadedAt: string;
}

interface GalleryMetadata {
  totalPhotos: number;
  lastUpdated: string;
  pageTitle: string;
  pageSubtitle: string;
}

const KailashMansarovarPage: React.FC = () => {
  const navigate = useNavigate();

  const [filters] = useState({
    search: '',
    destination: '',
    activity: ''
  });

  // State for API data
  const [kailashTours, setKailashTours] = useState<Tour[]>([]);
  const [galleryPhotos, setGalleryPhotos] = useState<GalleryPhoto[]>([]);
  const [galleryMetadata, setGalleryMetadata] = useState<GalleryMetadata>({
    totalPhotos: 0,
    lastUpdated: '',
    pageTitle: 'Kailash Mansarovar',
    pageSubtitle: 'Sacred Journey Gallery'
  });
  const [loading, setLoading] = useState(true);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  
  // Hero slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Parallax scroll effects
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 200]);
  const overlayOpacity = useTransform(scrollY, [0, 400], [0.6, 0.95]);

  // Check for mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch Kailash gallery data
  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setGalleryLoading(true);
        const response = await fetch('/api/kailash-gallery');
        if (!response.ok) {
          throw new Error('Failed to fetch gallery data');
        }
        const data = await response.json();
        setGalleryPhotos(data.gallery || []);
        setGalleryMetadata(data.metadata || galleryMetadata);
        setGalleryError(null);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
        setGalleryError(err instanceof Error ? err.message : 'Failed to load gallery');
        // Fallback to default photos if API fails
        setGalleryPhotos([
          {
            id: 1,
            title: "Sacred Kailash Peak",
            image: "https://images.unsplash.com/photo-1601999109497-ba1c7b6e0cfb?q=80&w=2070",
            alt: "Majestic view of Mount Kailash peak",
            gridSpan: "col-span-2 row-span-3",
            order: 1,
            isActive: true,
            uploadedAt: new Date().toISOString()
          },
          {
            id: 2,
            title: "Mansarovar Lake",
            image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070",
            alt: "Sacred waters of Lake Mansarovar",
            gridSpan: "col-span-1 row-span-2",
            order: 2,
            isActive: true,
            uploadedAt: new Date().toISOString()
          }
        ]);
      } finally {
        setGalleryLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!galleryPhotos || galleryPhotos.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
    }, 8000); // 8 seconds per slide
    
    return () => clearInterval(interval);
  }, [galleryPhotos, currentSlide]);

  // Fetch Kailash packages from tours API
  useEffect(() => {
    const fetchKailashPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tours?search=kailash');
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const kailashTours = await response.json();
        
        // If no Kailash tours found with search, try broader search
        if (kailashTours.length === 0) {
          const fallbackResponse = await fetch('/api/tours');
          const allTours = await fallbackResponse.json();
          const filteredTours = allTours.filter((tour: Tour) =>
            tour.location?.toLowerCase().includes('kailash') ||
            tour.title?.toLowerCase().includes('kailash') ||
            tour.category?.toLowerCase().includes('pilgrimage') ||
            tour.location?.toLowerCase().includes('tibet')
          );
          setKailashTours(filteredTours.length > 0 ? filteredTours : allTours);
        } else {
          setKailashTours(kailashTours);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching Kailash packages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchKailashPackages();
  }, []);

  const handleTourBook = (tour: Tour) => {
    navigate(`/tours/${tour.slug}`);
  };

  const handleTourView = (tour: Tour) => {
    navigate(`/tours/${tour.slug}`);
  };

  // Slider navigation functions
  const goToPrevSlide = () => {
    if (!galleryPhotos || galleryPhotos.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + galleryPhotos.length) % galleryPhotos.length);
  };

  const goToNextSlide = () => {
    if (!galleryPhotos || galleryPhotos.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % galleryPhotos.length);
  };

  // Touch/swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextSlide();
    } else if (isRightSwipe) {
      goToPrevSlide();
    }
  };


  return (
    <div className="kailash-mansarovar-page overflow-hidden">
      {/* Hero Slider Gallery */}
      <section
        className="relative w-full overflow-hidden bg-black h-[60vh] md:h-[80vh]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {galleryLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-xl">Loading sacred gallery...</div>
          </div>
        ) : galleryError ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-400 text-xl">Error loading gallery: {galleryError}</div>
          </div>
        ) : galleryPhotos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-xl">No gallery photos available</div>
          </div>
        ) : (
          <>
            {/* Background Image Slider */}
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: isMobile ? 0.5 : 1, ease: "easeInOut" }}
                className="absolute inset-0"
                style={{ y: backgroundY }}
              >
                <img
                  src={galleryPhotos[currentSlide]?.image}
                  alt={galleryPhotos[currentSlide]?.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Image loading error:', galleryPhotos[currentSlide]?.image);
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&h=1080&fit=crop';
                  }}
                />
                {/* Gradient Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"
                  style={{ opacity: overlayOpacity }}
                />
              </motion.div>
            </AnimatePresence>


            {/* Navigation Arrows */}
            {galleryPhotos && galleryPhotos.length > 1 && (
              <>
                <motion.button
                  onClick={goToPrevSlide}
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 bg-black/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/40 transition-all duration-300 border border-white/20"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>

                <motion.button
                  onClick={goToNextSlide}
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 bg-black/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-black/40 transition-all duration-300 border border-white/20"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
              </>
            )}

            {/* Slide Indicators */}
            <motion.div className="absolute bottom-8 md:bottom-10 w-full z-20">
              <div className="w-full flex justify-center items-center">
                <div className="flex space-x-3">
                  {galleryPhotos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`transition-all duration-300 ${
                        index === currentSlide
                          ? 'w-8 md:w-12 h-2 bg-orange-400'
                          : 'w-2 h-2 bg-white/50 hover:bg-white/70'
                      } rounded-full`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-20 md:bottom-24 w-full z-20"
            >
              <div className="w-full flex justify-center items-center">
                <div className="text-white">
                  <ChevronDown className="w-6 h-6 md:w-8 md:h-8" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </section>

      {/* Page Title Section - Overlaid on hero for desktop, separate for mobile */}
      <div className="relative -mt-16 md:-mt-30 mb-8 z-30">
        <div className="section-container">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 text-center md:mx-8 lg:mx-16 xl:mx-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                Kailash Mansarovar <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Yatra</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Choose from our sacred pilgrimage experiences to the most holy mountain.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tours Section */}
      <section className="pt-8 pb-12 bg-gray-50">
        <div className="section-container">
          {/* Loading State */}
          {loading && (
            <LoadingSpinner className="py-20" size="lg" />
          )}

          {/* Error State */}
          {error && (
            <ErrorMessage
              message={`Failed to load Kailash packages: ${error}`}
              className="py-20"
            />
          )}

          {/* Tours Grid */}
          {!loading && !error && (
            <TourGrid
              tours={kailashTours}
              filters={filters}
              onTourBook={handleTourBook}
              onTourView={handleTourView}
            />
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <GiWaterDrop className="text-6xl text-orange-400" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Your Sacred Journey Awaits
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The sacred mountain awaits. The holy waters are ready to purify your spirit.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl transition-all duration-300"
              >
                <Phone className="inline mr-3 w-6 h-6" />
                Call for Guidance
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-orange-400 text-orange-400 px-10 py-5 rounded-full font-bold text-xl hover:bg-orange-400 hover:text-white transition-all duration-300"
              >
                <Mail className="inline mr-3 w-6 h-6" />
                Request Information
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default KailashMansarovarPage;