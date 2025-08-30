import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Globe,
  Star,
  AlertCircle,
  Upload
} from 'lucide-react';
import { useDestinations } from '../../hooks/useApi';

// API base URL helper function
const getApiBaseUrl = (): string => {
  // Check if we're in production (deployed)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Use the same domain as the frontend for production
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  
  // Development environment
  return import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
};

interface ContentDestination {
  id?: number;
  slug?: string;
  title?: string;
  name?: string;
  country: string;
  region?: string;
  image: string;
  featured: boolean;
  href?: string;
  type?: string;
  description?: string;
}

interface DestinationFormData extends ContentDestination {
  imageFile?: File;
}

const DestinationManager: React.FC = () => {
  const { data: destinations, loading, error, refetch } = useDestinations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDestination, setEditingDestination] = useState<ContentDestination | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState<DestinationFormData>({
    slug: '',
    title: '',
    country: 'Nepal',
    region: '',
    image: '',
    featured: false
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Cleanup blob URLs on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    // Clean up any existing blob URL
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    
    setFormData({
      slug: '',
      title: '',
      country: 'Nepal',
      region: '',
      image: '',
      featured: false
    });
    setEditingDestination(null);
    setSubmitError(null);
  };

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const openModal = (destination?: ContentDestination) => {
    if (destination) {
      setEditingDestination(destination);
      // Map the destination data to form structure
      const mappedData: DestinationFormData = {
        slug: (destination as any).slug || generateSlug((destination as any).name || ''),
        title: (destination as any).title || (destination as any).name || '',
        country: destination.country || 'Nepal',
        region: (destination as any).region || '',
        image: destination.image || '',
        featured: destination.featured || false
      };
      console.log('Opening modal with destination:', destination);
      console.log('Mapped form data:', mappedData);
      setFormData(mappedData);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'title') {
      // Auto-generate slug when title changes
      const slug = generateSlug(value);
      setFormData(prev => ({ ...prev, title: value, slug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous blob URL if it exists
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      setFormData(prev => ({ ...prev, imageFile: file }));
      // Create a temporary object URL for preview
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      setFormData(prev => ({ ...prev, image: newPreviewUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let imageUrl = formData.image;

      // Handle file upload if there's a new image file
      if (formData.imageFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', formData.imageFile);
        uploadFormData.append('destinationSlug', formData.slug || formData.title || 'destination');
        
        const token = localStorage.getItem('adminToken');
        const uploadResponse = await fetch(`${getApiBaseUrl()}/admin/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: uploadFormData,
        });

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          imageUrl = uploadResult.url;
        }
      }

      const apiData = {
        slug: formData.slug,
        title: formData.title,
        country: formData.country,
        region: formData.region,
        image: imageUrl,
        featured: formData.featured
      };

      const url = editingDestination
        ? `${getApiBaseUrl()}/admin/destinations/${editingDestination.slug}`
        : `${getApiBaseUrl()}/admin/destinations`;
      
      const method = editingDestination ? 'PUT' : 'POST';
      const token = localStorage.getItem('adminToken');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save destination');
      }

      await refetch();
      closeModal();
    } catch (error) {
      console.error('Error saving destination:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save destination');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this destination? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${getApiBaseUrl()}/admin/destinations/${slug}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete destination');
      }

      await refetch();
    } catch (error) {
      console.error('Error deleting destination:', error);
      alert('Failed to delete destination: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loader"></div>
        <span className="ml-3 text-gray-600">Loading destinations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Destinations</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => refetch()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="destination-manager">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Destinations</h3>
          <p className="text-gray-600">Manage your destination content and information</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Destination
        </button>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations?.map((destination, index) => (
          <div
            key={(destination as any).slug || (destination as any).name || (destination as any).id || index}
            className="card-base hover:shadow-lg transition-all duration-300"
          >
            <div className="relative">
              <img
                src={destination.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'}
                alt={(destination as any).name || (destination as any).title || 'Destination'}
                className="w-full h-48 object-cover rounded-t-xl"
              />
              {destination.featured && (
                <div className="absolute top-3 right-3">
                  <div className="bg-secondary text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Featured
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{(destination as any).title || (destination as any).name || 'Unnamed Destination'}</h4>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Globe className="w-4 h-4" />
                  {destination.country}{(destination as any).region ? `, ${(destination as any).region}` : ''}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(destination)}
                  className="flex-1 bg-primary text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(destination.slug || destination.name || destination.id?.toString() || '')}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingDestination ? 'Edit Destination' : 'Add New Destination'}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6 space-y-6">
                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">Error</span>
                      </div>
                      <p className="text-red-700 mt-1">{submitError}</p>
                    </div>
                  )}

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="e.g., Everest Region"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Slug * (Auto-generated)
                      </label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50"
                        placeholder="e.g., everest-region"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      >
                        <option value="Nepal">Nepal</option>
                        <option value="Tibet">Tibet</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="India">India</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Region *
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="e.g., Khumbu"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Upload
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    {formData.image && (
                      <div className="mt-3">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="h-32 w-32 object-cover rounded-lg border"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image URL (Alternative)
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Featured Destination
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingDestination ? 'Update' : 'Create'} Destination
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DestinationManager;