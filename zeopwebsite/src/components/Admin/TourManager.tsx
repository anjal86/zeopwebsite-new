import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  AlertCircle,
  Search,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  X,
  Filter,
  Loader2
} from 'lucide-react';
import DeleteModal from '../UI/DeleteModal';
import Toggle from '../UI/Toggle';
import { useDeleteModal } from '../../hooks/useDeleteModal';
import { formatDuration } from '../../utils/formatDuration';
import { toursApi, type Tour } from '../../services/api';

// API base URL helper function
const getApiBaseUrl = (): string => {
  // Check if we're in production (deployed)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Use the same domain as the frontend for production
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  
  // Development environment - use relative URL to leverage Vite proxy
  return '/api';
};

// Image base URL helper function
const getImageBaseUrl = (): string => {
  // Check if we're in production (deployed)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Use the same domain as the frontend for production
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Development environment - use relative URL to leverage Vite proxy
  return '';
};

const TourManager: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [destinationsMap, setDestinationsMap] = useState<Map<number, string>>(new Map());
  const [updatingTours, setUpdatingTours] = useState<Set<number>>(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20); // Increased from 10 to 20 to show more tours
  const [totalItems, setTotalItems] = useState(0);

  // Add status filter (client-side)
  const [statusFilter, setStatusFilter] = useState('');

  // Search suggestions state
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);

  // Sorting state and helpers
  const [sortBy, setSortBy] = useState<{ field: 'title' | 'category' | 'destination' | 'duration' | 'price' | 'listed'; direction: 'asc' | 'desc' }>({ field: 'title', direction: 'asc' });

  // Enhanced debounced search with loading states - now using client-side filtering
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: number;
      return () => {
        clearTimeout(timeoutId);
        setSearchLoading(true);
        
        timeoutId = window.setTimeout(() => {
          // Just set loading to false after debounce - filtering happens in useMemo
          setSearchLoading(false);
        }, 300); // Reduced to 300ms for more responsive feel
      };
    })(),
    []
  );

  // Generate search suggestions based on existing tours
  const generateSearchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    
    const suggestions = new Set<string>();
    const searchLower = searchTerm.toLowerCase();
    
    tours.forEach(tour => {
      // Add matching tour titles
      if (tour.title?.toLowerCase().includes(searchLower)) {
        suggestions.add(tour.title);
      }
      
      // Add matching categories
      if (tour.category?.toLowerCase().includes(searchLower)) {
        suggestions.add(tour.category);
      }
      
      // Add matching destinations
      const destination = destinationsMap.get(tour.primary_destination_id || 0) || tour.location;
      if (destination?.toLowerCase().includes(searchLower)) {
        suggestions.add(destination);
      }
    });
    
    return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
  }, [searchTerm, tours, destinationsMap]);

  const toggleSort = (field: 'title' | 'category' | 'destination' | 'duration' | 'price' | 'listed') => {
    setSortBy(prev => prev.field === field ? { field, direction: prev.direction === 'asc' ? 'desc' : 'asc' } : { field, direction: 'asc' });
  };

  const getComparableValue = (tour: Tour, field: 'title' | 'category' | 'destination' | 'duration' | 'price' | 'listed') => {
    switch (field) {
      case 'title':
        return (tour.title || '').toLowerCase();
      case 'category':
        return (tour.category || '').toLowerCase();
      case 'destination':
        return ((destinationsMap.get(tour.primary_destination_id || 0) || tour.location || '')).toLowerCase();
      case 'duration': {
        const match = (tour.duration || '').match(/(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      }
      case 'price':
        return Number(tour.price) || 0;
      case 'listed':
        return tour.listed === false ? 0 : 1;
      default:
        return 0;
    }
  };

  const sortedTours = React.useMemo(() => {
    const list = [...tours];
    list.sort((a, b) => {
      const aVal = getComparableValue(a, sortBy.field);
      const bVal = getComparableValue(b, sortBy.field);
      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }
      return sortBy.direction === 'asc' ? cmp : -cmp;
    });
    return list;
  }, [tours, sortBy, destinationsMap]);

  const filteredTours = React.useMemo(() => {
    let list = sortedTours;
    
    // Apply search filter
    if (searchTerm && searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      list = list.filter(tour => {
        return (
          tour.title?.toLowerCase().includes(searchLower) ||
          tour.category?.toLowerCase().includes(searchLower) ||
          tour.location?.toLowerCase().includes(searchLower) ||
          tour.description?.toLowerCase().includes(searchLower) ||
          (destinationsMap.get(tour.primary_destination_id || 0) || '')?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Apply status filter
    if (statusFilter === 'listed') {
      list = list.filter(t => t.listed ?? true);
    } else if (statusFilter === 'unlisted') {
      list = list.filter(t => !(t.listed ?? true));
    }
    
    return list;
  }, [sortedTours, statusFilter, searchTerm, destinationsMap]);

  const deleteTour = async (tour: Tour) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${getApiBaseUrl()}/admin/tours/${tour.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete tour');
    }

    await fetchTours();
  };

  const deleteModal = useDeleteModal<Tour>({
    onDelete: deleteTour,
    getItemName: (tour) => tour.title,
    getItemId: (tour) => tour.id
  });

  // Fetch destinations only once
  useEffect(() => {
    fetchDestinations();
  }, []);

  // Initial fetch of tours
  useEffect(() => {
    fetchTours();
  }, [currentPage, destinationFilter]); // Only trigger on page and destination filter changes, not searchTerm

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/destinations`);
      if (response.ok) {
        const data = await response.json();
        const uniqueLocations = [...new Set(data.map((dest: any) => dest.name || dest.title).filter(Boolean))] as string[];
        setDestinations(uniqueLocations);
        
        // Create a map of destination ID to destination name for quick lookup
        const destMap = new Map<number, string>();
        data.forEach((dest: any) => {
          destMap.set(dest.id, dest.name || dest.title);
        });
        setDestinationsMap(destMap);
      }
    } catch (error) {
      // Error fetching destinations
    }
  };

  const fetchTours = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        // Remove search term from API call - we'll filter client-side
        ...(destinationFilter && { destination: destinationFilter })
      });

      const response = await fetch(`${getApiBaseUrl()}/admin/tours?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tours');
      }

      const data = await response.json();
      
      // Handle the new API response structure
      if (data.tours && data.pagination) {
        setTours(data.tours);
        setTotalItems(data.pagination.totalItems);
      } else {
        // Fallback for old API structure (if any)
        const toursArray = Array.isArray(data) ? data : (data.tours || []);
        setTours(toursArray);
        setTotalItems(toursArray.length);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (tour: Tour) => {
    try {
      deleteModal.openModal(tour);
    } catch (error) {
      alert('Failed to delete tour: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleToggleListing = async (tour: Tour) => {
    const newListedStatus = !tour.listed;
    
    // Add tour ID to updating set
    setUpdatingTours(prev => new Set(prev).add(tour.id));
    
    try {
      await toursApi.updateListingStatus(tour.id, newListedStatus);
      
      // Update local state
      setTours(prevTours =>
        prevTours.map(t =>
          t.id === tour.id
            ? { ...t, listed: newListedStatus }
            : t
        )
      );
    } catch (error) {
      alert('Failed to update tour listing status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      // Remove tour ID from updating set
      setUpdatingTours(prev => {
        const newSet = new Set(prev);
        newSet.delete(tour.id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Loading tours...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-600 mb-2">Error Loading Tours</h3>
        <p className="text-slate-500 mb-4">{error}</p>
        <button
          onClick={fetchTours}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Pagination calculations
  const displayTotalItems = statusFilter ? filteredTours.length : totalItems;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, displayTotalItems);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Enhanced search change handler
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    setShowSuggestions(value.length >= 2);
    
    if (value.length >= 2) {
      setSearchSuggestions(generateSearchSuggestions);
    } else {
      setSearchSuggestions([]);
    }
    
    debouncedSearch();
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
    setCurrentPage(1);
    debouncedSearch();
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setShowSuggestions(false);
    setSearchSuggestions([]);
    setCurrentPage(1);
    debouncedSearch();
  };

  const handleDestinationFilterChange = (value: string) => {
    setDestinationFilter(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setDestinationFilter('');
    setStatusFilter('');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Tours</h3>
          <p className="text-slate-600 text-sm sm:text-base">Manage your tour packages and itineraries</p>
        </div>
        <button
          onClick={() => navigate('/admin/tours/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Tour</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Enhanced Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
        {/* Search Results Summary */}
        {(searchTerm || destinationFilter || statusFilter) && (
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="w-4 h-4" />
              <span>
                Showing {filteredTours.length} of {totalItems} tours
                {searchTerm && ` for "${searchTerm}"`}
                {destinationFilter && ` in ${destinationFilter}`}
                {statusFilter && ` (${statusFilter})`}
              </span>
            </div>
            <button
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Enhanced Search Input */}
          <div className="sm:col-span-2 lg:col-span-2 relative">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours, destinations, categories..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowSuggestions(searchTerm.length >= 2)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200"
              />
              
              {/* Loading indicator */}
              {searchLoading && (
                <Loader2 className="w-4 h-4 absolute right-8 top-1/2 transform -translate-y-1/2 text-blue-500 animate-spin" />
              )}
              
              {/* Clear search button */}
              {searchTerm && !searchLoading && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                <div className="p-2">
                  <div className="text-xs text-gray-500 mb-2 px-2">Suggestions</div>
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionSelect(suggestion)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Search className="w-3 h-3 text-gray-400" />
                        <span>{suggestion}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Destinations Dropdown */}
          <div>
            <div className="relative">
              <select
                value={destinationFilter}
                onChange={(e) => handleDestinationFilterChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
              >
                <option value="">All Destinations</option>
                {destinations.map(destination => (
                  <option key={destination} value={destination}>{destination}</option>
                ))}
              </select>
              <ChevronLeft className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Enhanced Status Dropdown */}
          <div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm appearance-none bg-white"
              >
                <option value="">All Status</option>
                <option value="listed">Listed</option>
                <option value="unlisted">Unlisted</option>
              </select>
              <ChevronLeft className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Enhanced Clear Filters Button */}
          <div>
            <button
              onClick={handleClearFilters}
              disabled={!searchTerm && !destinationFilter && !statusFilter}
              className={`w-full px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                searchTerm || destinationFilter || statusFilter
                  ? 'text-white bg-red-500 hover:bg-red-600 shadow-sm'
                  : 'text-gray-400 bg-gray-100 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <X className="w-4 h-4" />
                Clear Filters
              </div>
            </button>
          </div>
        </div>

        {/* Quick Filter Tags */}
        {(searchTerm || destinationFilter || statusFilter) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Search: "{searchTerm}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {destinationFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Destination: {destinationFilter}
                <button
                  onClick={() => handleDestinationFilterChange('')}
                  className="hover:bg-green-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                Status: {statusFilter}
                <button
                  onClick={() => handleStatusFilterChange('')}
                  className="hover:bg-purple-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Loading State for Search */}
      {searchLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500 mr-3" />
            <span className="text-gray-600">Searching tours...</span>
          </div>
        </div>
      )}

      {/* Tours Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('title')} className="flex items-center gap-1">
                    <span>Tour</span>
                    <span className="text-gray-400">
                      {sortBy.field === 'title' ? (sortBy.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
                <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('category')} className="flex items-center gap-1">
                    <span>Category</span>
                    <span className="text-gray-400">
                      {sortBy.field === 'category' ? (sortBy.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
                <th className="w-24 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('destination')} className="flex items-center gap-1">
                    <span>Destination</span>
                    <span className="text-gray-400">
                      {sortBy.field === 'destination' ? (sortBy.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
                <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('duration')} className="flex items-center gap-1">
                    <span>Duration</span>
                    <span className="text-gray-400">
                      {sortBy.field === 'duration' ? (sortBy.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
                <th className="w-16 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('price')} className="flex items-center gap-1">
                    <span>Price</span>
                    <span className="text-gray-400">
                      {sortBy.field === 'price' ? (sortBy.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
                <th className="w-20 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button onClick={() => toggleSort('listed')} className="flex items-center gap-1">
                    <span>Listed</span>
                    <span className="text-gray-400">
                      {sortBy.field === 'listed' ? (sortBy.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                </th>
                <th className="w-16 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTours.map((tour: Tour) => (
                <tr
                  key={tour.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => navigate(`/admin/tours/${tour.slug}`)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={
                            tour.image
                              ? (tour.image.startsWith('http')
                                  ? tour.image
                                  : `${getImageBaseUrl()}${tour.image}`)
                              : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'
                          }
                          alt={tour.title}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                          }}
                        />
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate" title={tour.title}>
                          {tour.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 truncate">
                      {tour.category}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">
                    <div className="flex items-center min-w-0">
                      <MapPin className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" />
                      <span className="truncate" title={destinationsMap.get(tour.primary_destination_id || 0) || tour.location || 'No destination'}>
                        {destinationsMap.get(tour.primary_destination_id || 0) || tour.location || 'No destination'}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">
                    <div className="flex items-center min-w-0">
                      <Calendar className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" />
                      <span className="truncate">{formatDuration(tour.duration)}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">
                    <span className="font-semibold text-green-600">${tour.price}</span>
                  </td>
                  <td className="px-3 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center">
                      <Toggle
                        checked={tour.listed ?? true}
                        onChange={() => handleToggleListing(tour)}
                        disabled={updatingTours.has(tour.id)}
                        size="sm"
                      />
                      <span className="ml-2 text-xs text-gray-600 hidden xl:block">
                        {tour.listed ?? true ? (
                          <span className="flex items-center text-green-600">
                            <Eye className="w-3 h-3 mr-1" />
                            Listed
                          </span>
                        ) : (
                          <span className="flex items-center text-gray-500">
                            <EyeOff className="w-3 h-3 mr-1" />
                            Unlisted
                          </span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => navigate(`/admin/tours/${tour.slug}`)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                        title="Edit tour"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(tour)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1"
                        title="Delete tour"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tours Cards - Mobile & Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredTours.map((tour: Tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/admin/tours/${tour.slug}`)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="h-16 w-16 rounded-lg object-cover"
                  src={
                    tour.image
                      ? (tour.image.startsWith('http')
                          ? tour.image
                          : `${getImageBaseUrl()}${tour.image}`)
                      : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'
                  }
                  alt={tour.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {tour.title}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {tour.category}
                      </span>
                      {tour.featured && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                          ★ Featured
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => navigate(`/admin/tours/${tour.slug}`)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                      title="Edit tour"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(tour)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1"
                      title="Delete tour"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{destinationsMap.get(tour.primary_destination_id || 0) || tour.location || 'No destination'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span className="truncate">{formatDuration(tour.duration)}</span>
                  </div>
                </div>
                
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm font-semibold text-green-600">
                    ${tour.price}
                  </div>
                  
                  <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                    <Toggle
                      checked={tour.listed ?? true}
                      onChange={() => handleToggleListing(tour)}
                      disabled={updatingTours.has(tour.id)}
                      size="sm"
                    />
                    <span className="ml-2 text-xs text-gray-600">
                      {tour.listed ?? true ? (
                        <span className="flex items-center text-green-600">
                          <Eye className="w-3 h-3 mr-1" />
                          Listed
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Unlisted
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {(totalItems > itemsPerPage || tours.length >= itemsPerPage) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center text-xs sm:text-sm text-gray-700">
              <span>
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{displayTotalItems}</span> results
              </span>
            </div>
            <div className="flex items-center justify-center sm:justify-end space-x-1 sm:space-x-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`
                  inline-flex items-center px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium
                  ${currentPage === 1
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
                  }
                `}
              >
                <ChevronLeft className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePageChange(pageNumber)}
                      className={`
                        inline-flex items-center px-2 sm:px-3 py-2 border text-xs sm:text-sm font-medium rounded-md
                        ${currentPage === pageNumber
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`
                  inline-flex items-center px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium
                  ${currentPage === totalPages
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white hover:bg-gray-50 cursor-pointer'
                  }
                `}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="w-4 h-4 sm:ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}

      {tours.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || destinationFilter ? 'No Tours Match Your Filters' : 'No Tours Found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || destinationFilter
                ? `No tours found matching your filters. Try adjusting your search terms or destination filter.`
                : 'Get started by creating your first tour package.'
              }
            </p>
            {searchTerm || destinationFilter ? (
              <button
                onClick={handleClearFilters}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => navigate('/admin/tours/new')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create First Tour
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        {...deleteModal.modalProps}
        title="Delete Tour"
        message="Are you sure you want to delete this tour? This will permanently remove the tour and all its associated data."
        confirmText="Delete Tour"
        variant="danger"
      />
    </div>
  );
};

export default TourManager;