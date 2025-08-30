import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useDestinations } from '../../hooks/useApi';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';
import type { Destination } from '../../services/api';


const Destinations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'nepal' | 'international'>('nepal');

  // Use API hook to fetch destinations
  const { data: destinations, loading, error } = useDestinations();
  
  // Filter destinations based on country since SQLite data doesn't have 'type' field
  const filteredDestinations = destinations?.filter(destination => {
    if (activeTab === 'nepal') {
      return destination.country === 'Nepal';
    } else {
      return destination.country !== 'Nepal';
    }
  }) || [];

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
    <section className="py-20 bg-white">
      <div className="section-container">
        {/* Minimal Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Simple Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setActiveTab('nepal')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'nepal'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Nepal
              </button>
              <button
                onClick={() => setActiveTab('international')}
                className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeTab === 'international'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                International
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <LoadingSpinner className="py-20" size="lg" />
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage
            message={`Failed to load destinations: ${error}`}
            className="py-20"
          />
        )}

        {/* Immersive Grid */}
        {!loading && !error && (
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredDestinations.map((destination) => (
              <motion.div
                key={destination.id}
                variants={itemVariants}
                whileHover={{ scale: 1.03 }}
                className="group cursor-pointer"
              >
                <Link to={destination.href || `/destinations/${destination.name.toLowerCase()}`} className="block">
                  <div className="relative rounded-3xl overflow-hidden aspect-[3/2] shadow-lg hover:shadow-2xl transition-all duration-500">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Tour Count Badge */}
                    {destination.tourCount && (
                      <div className="absolute top-6 right-6">
                        <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                          {destination.tourCount}
                        </span>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="flex items-center mb-3 opacity-80">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{destination.country}</span>
                      </div>
                      <h3 className="text-2xl font-bold">
                        {destination.name}
                      </h3>
                    </div>
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Destinations;
