import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PageHeader from '../components/PageHeader/PageHeader';
import TourFilters from '../components/Tours/TourFilters';
import TourGrid from '../components/Tours/TourGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { usePaginatedTours } from '../hooks/useApi';
import type { Tour } from '../services/api';

const ToursPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [filters, setFilters] = useState(() => {
    const params = new URLSearchParams(location.search);
    return {
      search: params.get('search') || '',
      destination: params.get('destination') || '',
      activity: params.get('activity') || '',
    };
  });

  // Use paginated API hook to fetch tours
  const { tours, loading, loadingMore, error, pagination, loadMore } = usePaginatedTours(filters);

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
            totalTours={pagination.totalCount}
            filteredCount={tours.length}
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
              loadingMore={loadingMore}
              hasMore={pagination.hasNext}
              onLoadMore={loadMore}
              totalCount={pagination.totalCount}
            />
          )}
        </div>
      </section>

    </div>
  );
};

export default ToursPage;