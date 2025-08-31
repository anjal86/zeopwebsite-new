import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mountain, ArrowRight, MapPin } from 'lucide-react';
import { useFeaturedDestinations } from '../../hooks/useApi';
import LoadingSpinner from '../UI/LoadingSpinner';

const FeaturedDestinations: React.FC = () => {
  const { data: destinations, loading, error } = useFeaturedDestinations();

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

  // Show only first 6 featured destinations for homepage
  const featuredDestinations = destinations?.slice(0, 6) || [];

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
          <div className="inline-flex items-center bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Mountain className="w-4 h-4 mr-2" />
            Featured Destinations
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
            Popular Destinations
          </h2>
        </motion.div>

        {/* Minimal Grid - Same as Destinations page */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featuredDestinations.map((destination) => (
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
        
        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/destinations"
            className="inline-flex items-center bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            View All Destinations
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDestinations;