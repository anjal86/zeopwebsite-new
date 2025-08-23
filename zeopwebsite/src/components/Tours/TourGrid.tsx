import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, SortAsc, SortDesc, Filter } from 'lucide-react';
import TourCard from './TourCard';
import EmptyState from '../UI/EmptyState';
import type { Tour } from './TourCard';

interface TourGridProps {
  tours: Tour[];
  filters: {
    search: string;
    destination: string;
    activity: string;
  };
  onTourBook?: (tour: Tour) => void;
  onTourView?: (tour: Tour) => void;
}

type SortOption = 'price-low' | 'price-high' | 'rating' | 'duration' | 'popularity';
type ViewMode = 'grid' | 'list';

const TourGrid: React.FC<TourGridProps> = ({ 
  tours, 
  filters, 
  onTourBook, 
  onTourView 
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('popularity');
  const [isLoading, setIsLoading] = useState(false);

  // Filter tours based on filters
  const filteredTours = useMemo(() => {
    return tours.filter(tour => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          tour.title.toLowerCase().includes(searchTerm) ||
          tour.description.toLowerCase().includes(searchTerm) ||
          tour.location.toLowerCase().includes(searchTerm) ||
          tour.category.toLowerCase().includes(searchTerm) ||
          tour.highlights.some(h => h.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Destination filter
      if (filters.destination && tour.location.toLowerCase() !== filters.destination.toLowerCase()) {
        return false;
      }

      // Activity filter
      if (filters.activity) {
        const activityTerm = filters.activity.toLowerCase();
        const matchesActivity =
          tour.highlights.some(h => h.toLowerCase().includes(activityTerm)) ||
          tour.category.toLowerCase().includes(activityTerm) ||
          tour.description.toLowerCase().includes(activityTerm) ||
          tour.inclusions.some(i => i.toLowerCase().includes(activityTerm));
        
        if (!matchesActivity) return false;
      }

      return true;
    });
  }, [tours, filters]);

  // Sort tours
  const sortedTours = useMemo(() => {
    const sorted = [...filteredTours];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'duration':
        return sorted.sort((a, b) => {
          const aDays = parseInt(a.duration.split(' ')[0]);
          const bDays = parseInt(b.duration.split(' ')[0]);
          return aDays - bDays;
        });
      case 'popularity':
        return sorted.sort((a, b) => {
          // Sort by featured first, then by reviews count
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.reviews - a.reviews;
        });
      default:
        return sorted;
    }
  }, [filteredTours, sortBy]);

  const sortOptions = [
    { value: 'popularity', label: 'Most Popular' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'duration', label: 'Duration' }
  ];

  const handleSortChange = (newSort: SortOption) => {
    setIsLoading(true);
    setSortBy(newSort);
    // Simulate loading delay for smooth transition
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {sortedTours.length} tour{sortedTours.length !== 1 ? 's' : ''} found
          </span>
          
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-sky-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-sky-blue shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-blue"></div>
        </div>
      )}

      {/* No Results */}
      {!isLoading && sortedTours.length === 0 && (
        <EmptyState
          type="tours"
          title="No Tours Found"
          message="We couldn't find any tours matching your criteria. Try adjusting your filters or search terms, or contact us for custom tour options."
          actionText="Clear All Filters"
          onAction={() => window.location.reload()}
          className="py-12"
        />
      )}

      {/* Tours Grid/List */}
      {!isLoading && sortedTours.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${viewMode}-${sortBy}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-6'
            }
          >
            {sortedTours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TourCard
                  tour={tour}
                  variant={viewMode}
                  onBookNow={onTourBook}
                  onViewDetails={onTourView}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Load More Button (for pagination) */}
      {!isLoading && sortedTours.length > 0 && sortedTours.length >= 9 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center pt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-sky-blue to-sky-blue-dark text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
          >
            Load More Tours
          </motion.button>
        </motion.div>
      )}

      {/* Results Summary */}
      {!isLoading && sortedTours.length > 0 && (
        <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
          Showing {sortedTours.length} of {tours.length} tours
          {Object.values(filters).some(f => f !== '') && (
            <span> • Filters applied</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TourGrid;