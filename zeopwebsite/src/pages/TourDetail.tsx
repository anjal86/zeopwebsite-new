import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TourCard from '../components/Tours/TourCard';
import TourImageSlider from '../components/Tours/TourImageSlider';
import TourEnquiryButton from '../components/Tours/TourEnquiryButton';
import TourEnquiryModal, { type EnquiryFormData } from '../components/Tours/TourEnquiryModal';
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
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  
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

  // Handle enquiry form submission
  const handleEnquirySubmit = async (formData: EnquiryFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically send the data to your backend
    console.log('Enquiry submitted:', formData);
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
        <div className="container mx-auto px-4 py-8">
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
                  whatToBring={tourDetails.what_to_bring}
                  itinerary={tourDetails.itinerary}
                  activities={tourActivities}
                  images={images}
                  title={tourDetails.title}
                />
              </div>
            </div>

            {/* Right Column - Enquiry Button */}
            <div className="lg:col-span-1">
              <TourEnquiryButton
                price={tourDetails.price}
                onEnquiryClick={() => setShowEnquiryModal(true)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Modal */}
      <TourEnquiryModal
        isOpen={showEnquiryModal}
        onClose={() => setShowEnquiryModal(false)}
        tourTitle={tourDetails.title}
        onSubmit={handleEnquirySubmit}
      />

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
    </div>
  );
};

export default TourDetail;
