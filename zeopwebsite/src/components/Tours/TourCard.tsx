import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Star,
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
}

const TourCard: React.FC<TourCardProps> = ({
  tour,
  onViewDetails,
  variant = 'grid'
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

  // List layout design - horizontal layout
  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group w-full"
        onClick={handleViewDetails}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Container - Left Side */}
          <div className="relative md:w-80 h-64 md:h-auto overflow-hidden flex-shrink-0">
            <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`} />
            <img
              src={tour.image}
              alt={tour.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>

          {/* Content Area - Right Side */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                {tour.title}
              </h3>

              {/* Location */}
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                <span className="text-base">{tour.location}</span>
              </div>

              {/* Tour Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{formatDuration(tour.duration)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{tour.group_size}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {tour.difficulty}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                {tour.description}
              </p>
            </div>

            {/* Price and Action */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-green-600">
                  ${tour.price}
                </span>
                {tour.originalPrice && (
                  <span className="ml-2 text-base text-gray-400 line-through">
                    ${tour.originalPrice}
                  </span>
                )}
                <span className="ml-2 text-sm text-gray-500">per person</span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleViewDetails}
                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium transition-colors group/btn"
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
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group w-full"
      onClick={handleViewDetails}
    >
      {/* Large Image Container */}
      <div className="relative h-72 overflow-hidden">
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${imageLoaded ? 'hidden' : 'block'}`} />
        <img
          src={tour.image}
          alt={tour.title}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content Area */}
      <div className="p-6">

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
          {tour.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 mb-4">
          <MapPin className="w-4 h-4 mr-2 text-green-600" />
          <span className="text-sm">{tour.location}</span>
        </div>

        {/* Tour Details Grid */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatDuration(tour.duration)}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-400" />
            <span>{tour.group_size}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">{tour.reviews} reviews</span>
          </div>
        </div>

        {/* Price and Details Button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-green-600">
              ${tour.price}
            </span>
            {tour.originalPrice && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                ${tour.originalPrice}
              </span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewDetails}
            className="flex items-center bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors group/btn"
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
