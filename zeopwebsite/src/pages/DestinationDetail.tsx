import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader/PageHeader';
import TourCard from '../components/Tours/TourCard';
import EmptyState from '../components/UI/EmptyState';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { useDestinations, useTours } from '../hooks/useApi';

const DestinationDetail: React.FC = () => {
  const { destinationName } = useParams<{ destinationName: string }>();
  
  // Fetch destination data from regular destinations API (not content destinations)
  const { data: destinations } = useDestinations();
  const { data: allTours } = useTours();
  

  // Find the destination by name from the destinations list
  const destination = destinations?.find(dest => {
    const destName = dest.name.toLowerCase();
    const paramName = destinationName?.toLowerCase();
    
    return destName === paramName ||
           dest.href === `/destinations/${destinationName}` ||
           destName.includes(paramName || '') ||
           (paramName && destName.replace(/\s+/g, '-') === paramName);
  });
  
  const finalDestination = destination;

  // Get tours that are specifically assigned to this destination through relationships
  const relationshipTours = allTours?.filter(tour => {
    if (!finalDestination || !finalDestination.id) return false;
    
    // Only show listed tours (not unlisted ones)
    if (tour.listed === false) return false;
    
    // Check if this destination is the primary destination for the tour
    const isPrimaryDestination = (tour as any).primary_destination_id === finalDestination.id;
    
    // Check if this destination is in the secondary destinations for the tour
    const isSecondaryDestination = (tour as any).secondary_destination_ids?.includes(finalDestination.id);
    
    // Return tours that have this destination as primary or secondary
    return isPrimaryDestination || isSecondaryDestination;
  }) || [];

  // Fallback: Try location-based matching for legacy support (also filter for listed tours)
  const fallbackTours = allTours?.filter(tour => {
    if (!tour.location || !destinationName) return false;
    
    // Only show listed tours (not unlisted ones)
    if (tour.listed === false) return false;
    
    const tourLocation = tour.location.toLowerCase();
    const destName = destinationName.toLowerCase();
    const destTitle = (finalDestination?.name || '').toLowerCase();
    
    // Match by various location patterns
    return tourLocation.includes(destName) ||
           tourLocation.includes(destTitle) ||
           (destName === 'annapurna' && (tourLocation.includes('annapurna') || tourLocation.includes('abc'))) ||
           (destName === 'everest' && (tourLocation.includes('everest') || tourLocation.includes('ebc'))) ||
           (destName === 'langtang' && tourLocation.includes('langtang')) ||
           (destName === 'chitwan' && tourLocation.includes('chitwan')) ||
           (destName === 'pokhara' && tourLocation.includes('pokhara')) ||
           (destName === 'kathmandu' && tourLocation.includes('kathmandu')) ||
           (destName === 'manaslu' && tourLocation.includes('manaslu'));
  }) || [];

  // Combine both relationship-based and location-based tours, removing duplicates
  const allRelatedTours = [...relationshipTours];
  
  // Add fallback tours that aren't already in the relationship tours
  fallbackTours.forEach(fallbackTour => {
    if (!allRelatedTours.find(tour => tour.id === fallbackTour.id)) {
      allRelatedTours.push(fallbackTour);
    }
  });

  const finalTours = allRelatedTours;

  // Loading state
  if (!destinations || !allTours) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state - if destination not found
  if (!destination && !destinationName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Destination parameter is missing" />
      </div>
    );
  }


  if (!finalDestination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h1>
          <Link to="/destinations" className="text-blue-600 hover:underline">
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-detail-page">
      <PageHeader
        title={finalDestination.name}
        subtitle={`Discover the beauty and culture of ${finalDestination.name}`}
        breadcrumb={`Destinations > ${finalDestination.name}`}
        backgroundImage={finalDestination.image}
      />


      {/* Available Tours */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Available Tours in {finalDestination.name}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated tours and experiences in this amazing destination
            </p>
          </div>
          
          {finalTours.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {finalTours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <TourCard tour={tour} destinations={destinations} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              type="tours"
              title={`No Tours Available in ${finalDestination.name}`}
              message={`We're currently working on adding amazing tours to ${finalDestination.name}. Check back soon or contact us to create a custom itinerary for this destination.`}
              actionText="Contact Us"
              onAction={() => window.location.href = '/contact'}
              className="py-12"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default DestinationDetail;