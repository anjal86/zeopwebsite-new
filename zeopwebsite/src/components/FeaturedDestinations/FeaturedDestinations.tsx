import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mountain, ArrowRight, MapPin } from 'lucide-react';
import { useDestinations, useTours } from '../../hooks/useApi';
import LoadingSpinner from '../UI/LoadingSpinner';

const FeaturedDestinations: React.FC = () => {
  const { data: allDestinations, loading, error, refetch } = useDestinations();
  const { data: allTours } = useTours();
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  
  // Calculate tour count for each destination based on relationship system
  const getDestinationTourCount = (destinationId: number, destinationName: string) => {
    if (!allTours) return 0;
    
    // Count tours using relationship-based matching
    const relationshipTours = allTours.filter(tour => {
      if (tour.listed === false) return false; // Only count listed tours
      
      // Check if this destination is the primary destination for the tour
      const isPrimaryDestination = (tour as any).primary_destination_id === destinationId;
      
      // Check if this destination is in the secondary destinations for the tour
      const isSecondaryDestination = (tour as any).secondary_destination_ids?.includes(destinationId);
      
      return isPrimaryDestination || isSecondaryDestination;
    });
    
    // Fallback to location-based matching for legacy support
    const locationTours = allTours.filter(tour => {
      if (!tour.location || tour.listed === false) return false;
      
      const tourLocation = tour.location.toLowerCase();
      const destName = destinationName.toLowerCase();
      
      // Match by various location patterns
      return tourLocation.includes(destName) ||
             (destName === 'annapurna' && (tourLocation.includes('annapurna') || tourLocation.includes('abc'))) ||
             (destName === 'everest' && (tourLocation.includes('everest') || tourLocation.includes('ebc'))) ||
             (destName === 'langtang' && tourLocation.includes('langtang')) ||
             (destName === 'manaslu' && tourLocation.includes('manaslu')) ||
             (destName === 'kailash' && (tourLocation.includes('kailash') || tourLocation.includes('mansarovar'))) ||
             (destName === 'tibet' && (tourLocation.includes('tibet') || tourLocation.includes('lhasa'))) ||
             (destName === 'kathmandu' && tourLocation.includes('kathmandu')) ||
             (destName === 'pokhara' && tourLocation.includes('pokhara')) ||
             (destName === 'chitwan' && tourLocation.includes('chitwan')) ||
             (destName === 'lumbini' && tourLocation.includes('lumbini')) ||
             (destName === 'mustang' && tourLocation.includes('mustang')) ||
             (destName === 'dolpo' && tourLocation.includes('dolpo'));
    });
    
    // Combine and deduplicate tours
    const allRelatedTours = [...relationshipTours];
    locationTours.forEach(locationTour => {
      if (!allRelatedTours.find(tour => tour.id === locationTour.id)) {
        allRelatedTours.push(locationTour);
      }
    });
    
    return allRelatedTours.length;
  };

  // Filter destinations to only show those with tours and take first 6
  const featuredDestinations = allDestinations?.map(destination => ({
    ...destination,
    tourCount: getDestinationTourCount(destination.id, destination.name)
  })).filter(destination => destination.tourCount > 0).slice(0, 6) || [];

  // Listen for destination updates from admin interface
  useEffect(() => {
    const handleDestinationUpdate = () => {
      setImageRefreshKey(Date.now());
      refetch();
    };

    window.addEventListener('destinationUpdated', handleDestinationUpdate as EventListener);
    
    return () => {
      window.removeEventListener('destinationUpdated', handleDestinationUpdate as EventListener);
    };
  }, [refetch]);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="text-center">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="text-center">
            <p className="text-red-600">Failed to load destinations.</p>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="section-container px-4 sm:px-6 lg:px-8">
        {/* Minimal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Mountain className="w-4 h-4 mr-2" />
            Featured Destinations
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900">
            Popular Destinations
          </h2>
        </motion.div>

        {/* Minimal Grid - Same as Destinations page */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {featuredDestinations.map((destination) => (
            <motion.div
              key={destination.id}
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              className="group cursor-pointer"
            >
              <Link to={destination.href || `/destinations/${destination.name.toLowerCase()}`} className="block">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[3/2] shadow-lg hover:shadow-2xl transition-all duration-500">
                  <img
                    key={`${destination.id}-${imageRefreshKey}`}
                    src={`${destination.image}?t=${imageRefreshKey}`}
                    alt={destination.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                    }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 text-white">
                    <div className="flex items-center mb-2 sm:mb-3 opacity-80">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span className="text-xs sm:text-sm">{destination.country}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                      {destination.name}
                    </h3>
                    <div className="flex items-center mt-2 opacity-80">
                      <Mountain className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span className="text-xs sm:text-sm">
                        {destination.tourCount} {destination.tourCount === 1 ? 'Tour' : 'Tours'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
        
        {/* View All Button */}
        <div className="text-center mt-8 sm:mt-12">
          <Link
            to="/destinations"
            className="inline-flex items-center bg-gradient-to-r from-primary to-primary-dark text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            View All Destinations
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          </Link>
        </div>

        {featuredDestinations.length === 0 && (
          <div className="text-center text-gray-600 mt-8">
            No destinations with tours available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedDestinations;