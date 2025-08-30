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
  AlertCircle
} from 'lucide-react';

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

  useEffect(() => {
    fetchTours();
  }, []);

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

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tour? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tours/${id}`, {
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

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all duration-300"
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
                className="w-full h-48 object-cover rounded-t-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                }}
              />
              {tour.featured && (
                <div className="absolute top-3 right-3">
                  <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                </div>
              )}
              <div className="absolute top-3 left-3">
                <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {tour.category}
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <h4 className="text-lg font-semibold text-slate-900 mb-2">{tour.title}</h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  {tour.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  {tour.duration}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <DollarSign className="w-4 h-4" />
                  ${tour.price}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  {tour.group_size}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {tour.rating} ({tour.reviews} reviews)
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/admin/tours/${tour.slug}`)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(tour.id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {tours.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tours Found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first tour package.</p>
          <button
            onClick={() => navigate('/admin/tours/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create First Tour
          </button>
        </div>
      )}
    </div>
  );
};

export default TourManager;