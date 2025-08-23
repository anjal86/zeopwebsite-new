import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

interface FilterOptions {
  search: string;
  destination: string;
  activity: string;
}

interface TourFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  totalTours: number;
  filteredCount: number;
}

const TourFilters: React.FC<TourFiltersProps> = ({ 
  onFiltersChange, 
  totalTours, 
  filteredCount 
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    destination: '',
    activity: ''
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const destinations = [
    { value: '', label: 'All Destinations' },
    { value: 'nepal', label: 'Nepal' },
    { value: 'tibet', label: 'Tibet' },
    { value: 'bhutan', label: 'Bhutan' },
    { value: 'maldives', label: 'Maldives' },
    { value: 'thailand', label: 'Thailand' }
  ];

  const activities = [
    { value: '', label: 'All Activities' },
    { value: 'trekking', label: 'Trekking' },
    { value: 'paragliding', label: 'Paragliding' },
    { value: 'cultural tours', label: 'Cultural Tours' },
    { value: 'pilgrimage', label: 'Pilgrimage' },
    { value: 'spa treatments', label: 'Spa & Wellness' },
    { value: 'water sports', label: 'Water Sports' },
    { value: 'mountain views', label: 'Mountain Views' },
    { value: 'monastery visits', label: 'Monastery Visits' },
    { value: 'wildlife', label: 'Wildlife' },
    { value: 'adventure sports', label: 'Adventure Sports' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-sky-blue" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Tours</h3>
        </div>
        <span className="text-sm text-gray-600">
          {filteredCount} of {totalTours} tours
        </span>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search tours..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Destination */}
        <select
          value={filters.destination}
          onChange={(e) => handleFilterChange('destination', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all duration-300"
        >
          {destinations.map((dest) => (
            <option key={dest.value} value={dest.value}>
              {dest.label}
            </option>
          ))}
        </select>

        {/* Activity */}
        <select
          value={filters.activity}
          onChange={(e) => handleFilterChange('activity', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-transparent transition-all duration-300"
        >
          {activities.map((activity) => (
            <option key={activity.value} value={activity.value}>
              {activity.label}
            </option>
          ))}
        </select>
      </div>

    </motion.div>
  );
};

export default TourFilters;