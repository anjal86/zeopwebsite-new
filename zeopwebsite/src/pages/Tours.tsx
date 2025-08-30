import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader/PageHeader';
import TourFilters from '../components/Tours/TourFilters';
import TourGrid from '../components/Tours/TourGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { useFilteredTours } from '../hooks/useApi';
import type { Tour } from '../services/api';

const ToursPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    destination: '',
    activity: ''
  });

  // Use API hook to fetch and filter tours
  const { tours, loading, error, totalCount, filteredCount } = useFilteredTours(filters);

  const handleTourBook = (tour: Tour) => {
    console.log('Booking tour:', tour.title);
    // Navigate to tour detail page for booking
    navigate(`/tours/${tour.slug}`);
  };

  const handleTourView = (tour: Tour) => {
    console.log('Viewing tour details:', tour.title);
    // Navigate to tour detail page
    navigate(`/tours/${tour.slug}`);
  };

  return (
    <div className="tours-page">
      <PageHeader
        title="Handcrafted Experiences"
        subtitle="Choose from our carefully curated collection of tours, each designed to create memories that last a lifetime"
        breadcrumb="Tours"
        backgroundImage="https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=2070"
      />
      
      {/* Floating Filter between sections */}
      <div className="relative -mt-16 mb-8 z-20">
        <div className="section-container">
          <TourFilters
            onFiltersChange={setFilters}
            totalTours={totalCount}
            filteredCount={filteredCount}
          />
        </div>
      </div>

      <section className="pt-8 pb-12 bg-gray-50">
        <div className="section-container">
          {/* Loading State */}
          {loading && (
            <LoadingSpinner className="py-20" size="lg" />
          )}

          {/* Error State */}
          {error && (
            <ErrorMessage
              message={`Failed to load tours: ${error}`}
              className="py-20"
            />
          )}

          {/* Tours Grid */}
          {!loading && !error && (
            <TourGrid
              tours={tours}
              filters={filters}
              onTourBook={handleTourBook}
              onTourView={handleTourView}
            />
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Tours?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional travel experiences with the highest standards of safety and service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🛡️',
                title: '100% Safe & Secure',
                description: 'All our tours are fully insured and follow strict safety protocols.'
              },
              {
                icon: '💰',
                title: 'Best Price Guarantee',
                description: 'We offer competitive prices and will match any lower price you find.'
              },
              {
                icon: '👥',
                title: 'Expert Local Guides',
                description: 'Our experienced guides provide authentic insights and ensure your safety.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gray-50 rounded-2xl"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ToursPage;