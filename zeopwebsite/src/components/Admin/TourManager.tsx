import React, { useState, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import DeleteModal from '../UI/DeleteModal';
import Toggle from '../UI/Toggle';
import { useDeleteModal } from '../../hooks/useDeleteModal';
import { formatDuration } from '../../utils/formatDuration';
import { toursApi, type Tour } from '../../services/api';

const TourManager: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Sorting state and helpers
  const [sortBy, setSortBy] = useState<{ field: 'title' | 'category' | 'destination' | 'duration' | 'price' | 'listed'; direction: 'asc' | 'desc' }>({ field: 'title', direction: 'asc' });

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
    if (statusFilter === 'listed') {
      list = list.filter(t => t.listed ?? true);
    } else if (statusFilter === 'unlisted') {
      list = list.filter(t => !(t.listed ?? true));
    }
    return list;
  }, [sortedTours, statusFilter]);

  const deleteTour = async (tour: Tour) => {
    const token = localStorage.getItem('adminToken');
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/tours/${tour.id}`, {
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

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTours();
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, destinationFilter]);

  // Fetch destinations only once
  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/destinations`);
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
        ...(searchTerm && { search: searchTerm }),
        ...(destinationFilter && { destination: destinationFilter })
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/tours?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tours');
      }

      const tours = await response.json();
      
      // Extract pagination info from headers
      const totalCount = parseInt(response.headers.get('X-Total-Count') || tours.length.toString());
      
      setTours(tours);
      setTotalItems(totalCount);
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

  // Reset to first page when filters change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
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

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Destinations Dropdown */}
          <div>
            <select
              value={destinationFilter}
              onChange={(e) => handleDestinationFilterChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Destinations</option>
              {destinations.map(destination => (
                <option key={destination} value={destination}>{destination}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">All Status</option>
              <option value="listed">Listed</option>
              <option value="unlisted">Unlisted</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

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
                                  : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${tour.image}`)
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
                          : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${tour.image}`)
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