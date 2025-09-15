import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Star,
  AlertCircle,
  Search
} from 'lucide-react';
import DeleteModal from '../UI/DeleteModal';
import { useDeleteModal } from '../../hooks/useDeleteModal';
import { formatDuration } from '../../utils/formatDuration';

interface Tour {
  id: number;
  slug: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  group_size: string;
  difficulty: string;
  featured: boolean;
  image: string;
  rating: number;
  reviews: number;
  category: string;
  best_time: string;
  created_at: string;
  updated_at: string;
}

const TourManager: React.FC = () => {
  const navigate = useNavigate();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [destinations, setDestinations] = useState<string[]>([]);

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

  useEffect(() => {
    fetchTours();
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/destinations`);
      if (response.ok) {
        const data = await response.json();
        const uniqueLocations = [...new Set(data.map((dest: any) => dest.name || dest.title).filter(Boolean))] as string[];
        setDestinations(uniqueLocations);
      }
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tours`);
      if (!response.ok) {
        throw new Error('Failed to fetch tours');
      }
      const data = await response.json();
      setTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tours');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = async (tour: Tour) => {
    try {
      deleteModal.openModal(tour);
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Failed to delete tour: ' + (error instanceof Error ? error.message : 'Unknown error'));
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

  // Filter tours based on search term and destination
  const filteredTours = tours.filter(tour => {
    // Search filter
    const searchMatch = searchTerm === '' || (() => {
      const searchLower = searchTerm.toLowerCase();
      return (
        tour.title.toLowerCase().includes(searchLower) ||
        tour.description.toLowerCase().includes(searchLower) ||
        tour.location.toLowerCase().includes(searchLower) ||
        tour.category.toLowerCase().includes(searchLower) ||
        tour.difficulty.toLowerCase().includes(searchLower)
      );
    })();

    // Destination filter
    const destinationMatch = destinationFilter === '' ||
      tour.location.toLowerCase().includes(destinationFilter.toLowerCase());

    return searchMatch && destinationMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-slate-900">Tours</h3>
          <p className="text-slate-600">Manage your tour packages and itineraries</p>
        </div>
        <button
          onClick={() => navigate('/admin/tours/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Tour
        </button>
      </div>

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tours by title, location, category, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Destinations Dropdown */}
          <div>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Destinations</option>
              {destinations.map(destination => (
                <option key={destination} value={destination}>{destination}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setDestinationFilter('');
              }}
              className="w-full px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
            onClick={() => navigate(`/admin/tours/${tour.slug}`)}
          >
            <div className="relative">
              <img
                src={
                  tour.image
                    ? (tour.image.startsWith('http')
                        ? tour.image
                        : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${tour.image}`)
                    : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'
                }
                alt={tour.title}
                className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                }}
              />
              {tour.featured && (
                <div className="absolute top-2 right-2">
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm">
                    ★ Featured
                  </div>
                </div>
              )}
              <div className="absolute top-2 left-2">
                <div className="bg-black/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-xs font-medium">
                  {tour.category}
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                {tour.title}
              </h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span className="truncate">{tour.location}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3 h-3 text-gray-400" />
                    <span>{formatDuration(tour.duration)}</span>
                  </div>
                  <div className="text-green-600 font-semibold">
                    <span>${tour.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 group-hover:from-blue-100 group-hover:to-blue-200 transition-all">
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(tour);
                  }}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center shadow-sm"
                  title="Delete tour"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTours.length === 0 && !loading && (
        <div className="text-center py-12">
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
              onClick={() => {
                setSearchTerm('');
                setDestinationFilter('');
              }}
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