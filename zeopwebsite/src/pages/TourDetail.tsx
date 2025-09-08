import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, MessageCircle, Mail } from 'lucide-react';
import TourCard from '../components/Tours/TourCard';
import TourImageSlider from '../components/Tours/TourImageSlider';
import TourEnquiryButton from '../components/Tours/TourEnquiryButton';
import TourHeader from '../components/Tours/TourHeader';
import TourTabs, { type ItineraryDay } from '../components/Tours/TourTabs';
import { useTours, useDestinations, useActivities } from '../hooks/useApi';
import type { Tour } from '../services/api';

// Extended tour interface for detailed data
interface TourDetails extends Tour {
  gallery?: string[];
  exclusions?: string[];
  itinerary?: ItineraryDay[];
  what_to_bring?: string[];
  fitness_requirements?: string;
  altitude_profile?: {
    max_altitude: string;
    acclimatization_days: number;
    difficulty_level: string;
  };
  wildlife_info?: {
    best_viewing_time: string;
    common_species: string[];
    conservation_status: string;
  };
  booking_info?: {
    advance_booking: string;
    group_discounts: string;
    cancellation_policy: string;
  };
  // Relationship fields - Primary + Secondary Destinations
  primary_destination_id?: number;
  secondary_destination_ids?: number[];
  activity_ids?: number[];
  related_destinations?: string[];
  related_activities?: string[];
}

const TourDetail: React.FC = () => {
  const { tourSlug } = useParams<{ tourSlug: string }>();
  const navigate = useNavigate();
  const { data: allTours, loading, error } = useTours();
  const { data: destinations } = useDestinations();
  const { data: activities } = useActivities();
  
  const [tourDetails, setTourDetails] = useState<TourDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [showFloatingButton, setShowFloatingButton] = useState(true);
  const enquirySectionRef = useRef<HTMLDivElement>(null);
  
  // Find the tour by slug
  const tour = allTours?.find(t => t.slug === tourSlug);
  
  // Fetch detailed tour data when tour is found
  useEffect(() => {
    const fetchTourDetails = async () => {
      if (!tour) return;
      
      setDetailsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tours/slug/${tour.slug}`);
        if (response.ok) {
          const details = await response.json();
          setTourDetails(details);
        } else {
          console.warn('Failed to fetch tour details, using basic tour data');
          setTourDetails(tour as TourDetails);
        }
      } catch (error) {
        console.error('Error fetching tour details:', error);
        setTourDetails(tour as TourDetails);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchTourDetails();
  }, [tour]);

  // Get related tours based on shared destinations or activities
  const relatedTours = allTours?.filter(t => {
    if (t.id === tour?.id) return false;
    
    // Check if tours share primary destination
    const sharedPrimaryDestination = tourDetails?.primary_destination_id &&
      (t as any).primary_destination_id === tourDetails.primary_destination_id;
    
    // Check if tours share any destinations (primary or secondary)
    const allTourDestIds = [tourDetails?.primary_destination_id, ...(tourDetails?.secondary_destination_ids || [])].filter(Boolean);
    const allOtherTourDestIds = [(t as any).primary_destination_id, ...((t as any).secondary_destination_ids || [])].filter(Boolean);
    const sharedAnyDestination = allTourDestIds.some(id => allOtherTourDestIds.includes(id));
    
    // Check if tours share activities
    const sharedActivities = (tourDetails?.activity_ids || []).some((actId: number) =>
      (t as any).activity_ids?.includes(actId)
    );
    
    return sharedPrimaryDestination || sharedAnyDestination || sharedActivities;
  }).slice(0, 3) || [];

  // Get primary destination for this tour
  const primaryDestination = destinations?.find(dest =>
    dest.id === tourDetails?.primary_destination_id
  );

  // Get secondary destinations for this tour
  const secondaryDestinations = destinations?.filter(dest =>
    tourDetails?.secondary_destination_ids?.includes(dest.id)
  ) || [];

  // Get all destinations for this tour
  const allTourDestinations = [primaryDestination, ...secondaryDestinations].filter(Boolean);

  // Get activity names for this tour
  const tourActivities = activities?.filter(activity =>
    tourDetails?.activity_ids?.includes(activity.id)
  ) || [];

  // Create image gallery using detailed tour data
  const images = tourDetails ? (
    tourDetails.gallery && tourDetails.gallery.length > 0
      ? tourDetails.gallery
      : tourDetails.image
        ? [tourDetails.image]
        : []
  ).filter(Boolean) : [];


  // Handle floating button visibility
  useEffect(() => {
    const handleScroll = () => {
      if (!enquirySectionRef.current) return;
      
      const enquirySection = enquirySectionRef.current;
      const rect = enquirySection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Hide floating button when enquiry section is visible or passed
      if (rect.top <= windowHeight && rect.bottom >= 0) {
        setShowFloatingButton(false);
      } else {
        setShowFloatingButton(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // WhatsApp and Email handlers for floating button
  const handleFloatingWhatsApp = () => {
    const message = `Hi! I'm interested in the ${tourDetails?.title || 'tour'}. Could you please provide more details?`;
    const whatsappUrl = `https://wa.me/9779851234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleFloatingEmail = () => {
    const subject = `Enquiry about ${tourDetails?.title || 'Tour'}`;
    const body = `Hi,\n\nI'm interested in the ${tourDetails?.title || 'tour'}. Could you please provide more details?\n\nThank you!`;
    const emailUrl = `mailto:info@zeotourism.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = emailUrl;
  };

  const handleFloatingEnquiry = () => {
    // Scroll to enquiry section
    enquirySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading || detailsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Loading tour details...</span>
      </div>
    );
  }

  if (error || !tour || !tourDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error loading tour' : 'Tour not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'The tour you are looking for does not exist.'}
          </p>
          <Link
            to="/tours"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-detail-page">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link to="/tours" className="hover:text-green-600">Tours</Link>
            <span>/</span>
            <span className="text-gray-900">{tourDetails.title}</span>
          </nav>
        </div>
      </div>

      {/* Slider and Tour Details Section - Side by Side */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Image Slider */}
            <div className="lg:col-span-2">
              <TourImageSlider images={images} title={tourDetails.title} />
              
              {/* Tour Header - Title and Stats - Right below slider */}
              <div className="mt-8">
                <TourHeader
                  title={tourDetails.title}
                  duration={tourDetails.duration}
                  groupSize={tourDetails.group_size}
                  bestTime={tourDetails.best_time}
                  activities={tourActivities}
                  destinations={allTourDestinations.filter(Boolean) as Array<{ id: number; name: string }>}
                  primaryDestination={primaryDestination}
                  secondaryDestinations={secondaryDestinations}
                />
              </div>
              
              {/* Tour Details - Below title and stats */}
              <div className="mt-8">
                <TourTabs
                  description={tourDetails.description}
                  highlights={tourDetails.highlights}
                  inclusions={tourDetails.inclusions}
                  exclusions={tourDetails.exclusions}
                  whatToBring={tourDetails.what_to_bring}
                  itinerary={tourDetails.itinerary}
                  activities={tourActivities}
                  images={images}
                  title={tourDetails.title}
                />
              </div>
            </div>

            {/* Right Column - Enquiry Button */}
            <div className="lg:col-span-1" ref={enquirySectionRef}>
              <TourEnquiryButton
                price={tourDetails.price}
                tourTitle={tourDetails.title}
              />
            </div>
          </div>
        </div>
      </section>


      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
              <p className="text-gray-600">Discover more amazing tours and experiences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTours.map((relatedTour, index) => (
                <motion.div
                  key={relatedTour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <TourCard
                    tour={relatedTour}
                    onViewDetails={(tour) => navigate(`/tours/${tour.slug}`)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Floating Enquiry Button for Mobile */}
      {showFloatingButton && (
        <div className="fixed bottom-4 right-4 z-40 lg:hidden">
          <div className="flex flex-col gap-2">
            {/* Main Enquiry Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleFloatingEnquiry}
              className="bg-gradient-to-r from-sky-blue to-sky-blue-dark text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Send className="w-6 h-6" />
            </motion.button>
            
            {/* WhatsApp Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleFloatingWhatsApp}
              className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>
            
            {/* Email Button */}
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={handleFloatingEmail}
              className="bg-gray-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Mail className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;
