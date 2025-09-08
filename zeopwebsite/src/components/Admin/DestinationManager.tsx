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
  Upload,
  Image as ImageIcon,
  MapPin,
  Search,
  Filter
} from 'lucide-react';
import { useDestinations } from '../../hooks/useApi';
import Toggle from '../UI/Toggle';
import SearchableSelect from '../UI/SearchableSelect';
// @ts-ignore
import { getData } from 'country-list';

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

interface ContentDestination {
  id?: number;
  slug?: string;
  title?: string;
  name?: string;
  country: string;
  region?: string;
  image: string;
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
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());
  const [activeTab, setActiveTab] = useState<'nepal' | 'international'>('nepal');
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const [formData, setFormData] = useState<DestinationFormData>({
    slug: '',
    title: '',
    country: 'Nepal',
    region: '',
    image: '',
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
      image: ''
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

  // Handle country selection from SearchableSelect
  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
  };

  // Get all countries from the library and add custom entries
  const allCountries = getData();
  const countryOptions = [
    // Add custom entries first
    { value: 'Tibet', label: 'Tibet' },
    // Then add all countries from the library
    ...allCountries.map((country: any) => ({
      value: country.name,
      label: country.name
    })),
    // Add other custom entries
    { value: 'Other', label: 'Other' }
  ].sort((a, b) => a.label.localeCompare(b.label));

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
        // Use the destination slug/title for organizing uploads
        const destinationSlug = formData.slug || generateSlug(formData.title || 'destination');
        uploadFormData.append('destinationSlug', destinationSlug);
        
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
          console.log('File uploaded successfully:', uploadResult);
          console.log('New image URL:', imageUrl);
        } else {
          const errorText = await uploadResponse.text();
          console.error('Upload failed:', errorText);
          throw new Error(`Upload failed: ${errorText}`);
        }
      }

      const apiData = {
        slug: formData.slug,
        title: formData.title,
        country: formData.country,
        region: formData.region,
        image: imageUrl, // This should be the new uploaded image URL
      };
      
      console.log('Sending API data:', apiData);

      const url = editingDestination
        ? `${getApiBaseUrl()}/admin/destinations/${editingDestination.slug || editingDestination.id}`
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

      const savedDestination = await response.json();
      console.log('Destination saved successfully:', savedDestination);
      
      // Force a complete data reload with cache busting
      const refreshKey = Date.now();
      setImageRefreshKey(refreshKey);
      
      // Wait a moment for the server to finish processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force refetch to get updated data and refresh UI
      await refetch();
      
      closeModal();
      
      // Trigger a global refresh event for other components
      window.dispatchEvent(new CustomEvent('destinationUpdated', {
        detail: {
          destinationId: savedDestination.id,
          newImageUrl: savedDestination.image,
          timestamp: refreshKey
        }
      }));
      
      console.log('Destination saved and UI refreshed with new image:', savedDestination.image);
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
      const response = await fetch(`${getApiBaseUrl()}/admin/destinations/${slug || 'unknown'}`, {
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

  // Enhanced filtering with search and country filter
  const filteredDestinations = destinations?.filter(destination => {
    const country = (destination as any).country || '';
    const type = (destination as any).type || '';
    const name = (destination as any).name || (destination as any).title || '';
    const region = (destination as any).region || '';
    
    // Tab filter
    let tabMatch = false;
    if (activeTab === 'nepal') {
      tabMatch = country === 'Nepal' || type === 'nepal';
    } else {
      tabMatch = country !== 'Nepal' && type === 'international';
    }
    
    // Search filter
    const searchMatch = searchTerm === '' ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      region.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Country filter
    const countryMatch = countryFilter === '' || country === countryFilter;
    
    return tabMatch && searchMatch && countryMatch;
  }) || [];

  // Get unique countries for filter dropdown
  const availableCountries = destinations ? [...new Set(destinations.map(d => (d as any).country).filter(Boolean))] : [];

  console.log('Filtered destinations for', activeTab, ':', filteredDestinations.map(d => d.name));

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

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations by name, country, or region..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Country Filter */}
          <div>
            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Countries</option>
              {availableCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setCountryFilter('');
              }}
              className="w-full px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setActiveTab('nepal')}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'nepal'
                ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                : 'text-gray-600 hover:text-primary'
            }`}
          >
            Nepal Destinations ({destinations?.filter(d => (d as any).country === 'Nepal' || (d as any).type === 'nepal').length || 0})
          </button>
          <button
            onClick={() => setActiveTab('international')}
            className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === 'international'
                ? 'bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-lg'
                : 'text-gray-600 hover:text-secondary'
            }`}
          >
            International Destinations ({destinations?.filter(d => (d as any).country !== 'Nepal' && (d as any).type !== 'nepal').length || 0})
          </button>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">
              {activeTab === 'nepal' ? 'Nepal' : 'International'} Destinations
            </h4>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''}
                {activeTab === 'nepal' ? ' in Nepal' : ' internationally'}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div key={activeTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((destination, index) => (
              <div
                key={(destination as any).slug || (destination as any).name || (destination as any).id || index}
                className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => openModal(destination)}
              >
                <div className="relative">
                  <img
                    key={`${destination.id}-${imageRefreshKey}`}
                    src={`${destination.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'}?t=${imageRefreshKey}`}
                    alt={(destination as any).name || (destination as any).title || 'Destination'}
                    className="w-full h-48 object-cover rounded-t-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                    }}
                  />
                </div>
                
                <div className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {(destination as any).title || (destination as any).name || 'Unnamed Destination'}
                  </h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {destination.country}{(destination as any).region ? `, ${(destination as any).region}` : ''}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(destination);
                      }}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete((destination as any).slug || (destination as any).id?.toString() || destination.name || '');
                      }}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center justify-center shadow-sm"
                      title="Delete destination"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {(!destinations || destinations.length === 0) && !loading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Destinations Found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first destination.</p>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create First Destination
          </button>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
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

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                <div className="overflow-y-auto flex-1 p-6">
                  <div className="space-y-6">
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
                    <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Basic Information</h4>
                          <p className="text-sm text-gray-500">Set the main details for this destination</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Title *
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={formData.title}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="e.g., Everest Region"
                            />
                            <p className="text-xs text-gray-500 mt-1">This will be the main name displayed for the destination</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Slug * (Auto-generated)
                            </label>
                            <input
                              type="text"
                              name="slug"
                              value={formData.slug}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-colors"
                              placeholder="e.g., everest-region"
                              readOnly
                            />
                            <p className="text-xs text-gray-500 mt-1">URL-friendly version of the title</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Country *
                            </label>
                            <SearchableSelect
                              options={countryOptions}
                              value={formData.country}
                              onChange={handleCountryChange}
                              placeholder="Select a country"
                              name="country"
                            />
                            <p className="text-xs text-gray-500 mt-1">Select the country where this destination is located</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Region *
                            </label>
                            <input
                              type="text"
                              name="region"
                              value={formData.region}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="e.g., Khumbu"
                            />
                            <p className="text-xs text-gray-500 mt-1">Specific region or area within the country</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Destination Image</h4>
                          <p className="text-sm text-gray-500">Upload or provide a URL for the destination image</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-3">
                            Image Upload
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-600" />
                              </div>
                              <div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            </div>
                          </div>

                          {formData.image && (
                            <div className="mt-6">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-gray-900">Current Image:</p>
                              </div>
                              <div className="relative">
                                <img
                                  src={formData.image}
                                  alt="Preview"
                                  className="w-full max-w-md h-48 object-cover rounded-lg border shadow-sm"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (previewUrl && previewUrl.startsWith('blob:')) {
                                      URL.revokeObjectURL(previewUrl);
                                    }
                                    setFormData(prev => ({ ...prev, image: '', imageFile: undefined }));
                                    setPreviewUrl(null);
                                  }}
                                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                  title="Remove image"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Image URL (Alternative)
                          </label>
                          <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="https://example.com/image.jpg or /uploads/destinations/..."
                          />
                          <p className="text-xs text-gray-500 mt-1">Provide a full URL or relative path to an image</p>
                        </div>
                      </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-900 cursor-pointer">
                              Featured Destination
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              When enabled, this destination will appear in the "Popular Destinations" section on the homepage
                            </p>
                          </div>
                          <div className="ml-4">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Footer with Action Buttons */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 font-medium"
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