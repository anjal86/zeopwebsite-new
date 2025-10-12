import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Users,
  ArrowRight
} from 'lucide-react';
import type { Tour } from '../../services/api';
import { formatDuration } from '../../utils/formatDuration';

interface TourCardProps {
  tour: Tour;
  onBookNow?: (tour: Tour) => void;
  onViewDetails?: (tour: Tour) => void;
  variant?: 'grid' | 'list';
  destinations?: Array<{ id: number; name: string; country?: string }>;
}

const TourCard: React.FC<TourCardProps> = ({
  tour,
  onViewDetails,
  variant = 'grid',
  destinations
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(tour);
    } else {
      // Default navigation to tour detail page using slug with React Router
      navigate(`/tours/${tour.slug}`);
    }
  };

  // Get the primary destination name for this tour
  const getDestinationName = () => {
    if (destinations && (tour as any).primary_destination_id) {
      const primaryDestination = destinations.find(dest => dest.id === (tour as any).primary_destination_id);
      if (primaryDestination) {
        return primaryDestination.country ? `${primaryDestination.name}, ${primaryDestination.country}` : primaryDestination.name;
      }
    }
    
    // Fallback to the location field if no destination relationship exists
    return tour.location || 'Location not specified';
  };

  const destinationName = getDestinationName();

  // List layout design - horizontal layout
  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group w-full border border-gray-100"
        onClick={handleViewDetails}
      >
        <div className="flex flex-col md:flex-row md:items-stretch">
          {/* Image Container - Left Side */}
          <div className="relative md:w-80 h-48 md:h-full overflow-hidden flex-shrink-0">
            <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`} />
            <img
              src={tour.image}
              alt={tour.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {tour.featured && (
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  Featured
                </span>
              )}
              {tour.hasDiscount && tour.discountPercentage && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {tour.discountPercentage}% OFF
                </span>
              )}
              {tour.discount && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {tour.discount}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Content Area - Right Side */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-sky-blue transition-colors">
                {tour.title}
              </h3>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-sky-blue" />
                <span className="text-base font-medium">{destinationName}</span>
              </div>

              {/* Tour Details */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <Clock className="w-4 h-4 mr-2 text-sky-blue" />
                  <span className="font-medium">{formatDuration(tour.duration)}</span>
                </div>
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <Users className="w-4 h-4 mr-2 text-sky-blue" />
                  <span className="font-medium">{tour.group_size}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                {tour.description}
              </p>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-baseline">
                {tour.priceAvailable !== false ? (
                  <>
                    {tour.hasDiscount && tour.discountPercentage ? (
                      <>
                        <span className="text-3xl font-bold text-sky-blue">
                          ${Math.round(tour.price * (1 - tour.discountPercentage / 100))}
                        </span>
                        <span className="ml-2 text-base text-gray-400 line-through">
                          ${tour.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold text-sky-blue">
                        ${tour.price}
                      </span>
                    )}
                    <span className="ml-2 text-sm text-gray-500">per person</span>
                  </>
                ) : (
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-green-600">
                      Request Price
                    </span>
                    <span className="text-xs text-gray-500">Contact for pricing</span>
                  </div>
                )}
              </div>
              
              <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewDetails}
            className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid layout design - vertical layout (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group w-full h-full flex flex-col border border-gray-100"
      onClick={handleViewDetails}
    >
      {/* Large Image Container */}
      <div className="relative h-56 overflow-hidden flex-shrink-0">
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`} />
        <img
          src={tour.image}
          alt={tour.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {tour.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Featured
            </span>
          )}
          {tour.hasDiscount && tour.discountPercentage && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {tour.discountPercentage}% OFF
            </span>
          )}
          {tour.discount && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {tour.discount}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-sky-blue transition-colors">
          {tour.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2 text-sky-blue" />
          <span className="text-sm font-medium">{destinationName}</span>
        </div>

        {/* Tour Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 text-sm text-gray-600">
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
            <Clock className="w-4 h-4 mr-2 text-sky-blue" />
            <span className="font-medium">{formatDuration(tour.duration)}</span>
          </div>
          <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
            <Users className="w-4 h-4 mr-2 text-sky-blue" />
            <span className="font-medium">{tour.group_size}</span>
          </div>
        </div>

        {/* Spacer to push price/button to bottom */}
        <div className="flex-1"></div>

        {/* Price and Details Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <div className="flex flex-col">
            {tour.priceAvailable !== false ? (
              <>
                <div className="flex items-baseline">
                  {tour.hasDiscount && tour.discountPercentage ? (
                    <>
                      <span className="text-2xl font-bold text-sky-blue">
                        ${Math.round(tour.price * (1 - tour.discountPercentage / 100))}
                      </span>
                      <span className="ml-2 text-sm text-gray-400 line-through">
                        ${tour.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-sky-blue">
                      ${tour.price}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">per person</span>
              </>
            ) : (
              <>
                <span className="text-xl font-bold text-green-600">
                  Request Price
                </span>
                <span className="text-xs text-gray-500">Contact for pricing</span>
              </>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewDetails}
            className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group/btn"
          >
            <span>Details</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default TourCard;
