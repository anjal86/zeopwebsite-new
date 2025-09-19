import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Globe,
  AlertCircle,
  Image as ImageIcon,
  Search,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useDestinations } from '../../hooks/useApi';
import SearchableSelect from '../UI/SearchableSelect';
import DeleteModal from '../UI/DeleteModal';
import { useDeleteModal } from '../../hooks/useDeleteModal';
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
  const [activeTab, setActiveTab] = useState<'nepal' | 'international'>('nepal');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState<DestinationFormData>({
    slug: '',
    title: '',
    country: 'Nepal',
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
        image: destination.image || '',
      };
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
        } else {
          const errorText = await uploadResponse.text();
          throw new Error(`Upload failed: ${errorText}`);
        }
      }

      const apiData = {
        slug: formData.slug,
        title: formData.title,
        country: formData.country,
        image: imageUrl, // This should be the new uploaded image URL
      };
      
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
          timestamp: Date.now()
        }
      }));
      
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save destination');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteDestination = async (destination: ContentDestination) => {
    const token = localStorage.getItem('adminToken');
    const slug = (destination as any).slug || (destination as any).id?.toString() || destination.name || '';
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
  };

  const deleteModal = useDeleteModal<ContentDestination>({
    onDelete: deleteDestination,
    getItemName: (destination) => (destination as any).title || (destination as any).name || 'Unnamed Destination',
    getItemId: (destination) => (destination as any).slug || (destination as any).id || destination.name
  });

  const handleDeleteClick = async (destination: ContentDestination) => {
    try {
      deleteModal.openModal(destination);
    } catch (error) {
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

  // Enhanced filtering with search
  const allFilteredDestinations = destinations?.filter(destination => {
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
    
    return tabMatch && searchMatch;
  }) || [];

  // Pagination calculations
  const totalItems = allFilteredDestinations.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const filteredDestinations = allFilteredDestinations.slice(startIndex, endIndex);
  
  const startItem = startIndex + 1;
  const endItem = Math.min(endIndex, totalItems);

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

  const handleTabChange = (tab: 'nepal' | 'international') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

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

      {/* Search Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 lg:p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Tab Filter */}
          <div>
            <select
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value as 'nepal' | 'international')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="nepal">Nepal Destinations</option>
              <option value="international">International</option>
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

      {/* Destinations Table - Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="w-1/4 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Country
                </th>
                <th className="w-1/4 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="w-16 px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDestinations.map((destination: ContentDestination) => (
                <tr
                  key={(destination as any).slug || (destination as any).name || (destination as any).id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => openModal(destination)}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={
                            destination.image
                              ? (destination.image.startsWith('http')
                                  ? destination.image
                                  : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${destination.image}`)
                              : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'
                          }
                          alt={(destination as any).title || (destination as any).name || 'Destination'}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                          }}
                        />
                      </div>
                      <div className="ml-3 min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate" title={(destination as any).title || (destination as any).name}>
                          {(destination as any).title || (destination as any).name || 'Unnamed Destination'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-900">
                    <div className="flex items-center min-w-0">
                      <Globe className="w-3 h-3 text-gray-400 mr-1 flex-shrink-0" />
                      <span className="truncate" title={destination.country}>{destination.country}</span>
                    </div>
                  </td>
                  <td className="px-3 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      activeTab === 'nepal'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {activeTab === 'nepal' ? 'Nepal' : 'International'}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-1">
                      <button
                        onClick={() => openModal(destination)}
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                        title="Edit destination"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(destination)}
                        className="text-red-600 hover:text-red-900 transition-colors p-1"
                        title="Delete destination"
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

      {/* Destinations Cards - Mobile & Tablet */}
      <div className="lg:hidden space-y-4">
        {filteredDestinations.map((destination: ContentDestination) => (
          <div
            key={(destination as any).slug || (destination as any).name || (destination as any).id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => openModal(destination)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <img
                  className="h-16 w-16 rounded-lg object-cover"
                  src={
                    destination.image
                      ? (destination.image.startsWith('http')
                          ? destination.image
                          : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${destination.image}`)
                      : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'
                  }
                  alt={(destination as any).title || (destination as any).name || 'Destination'}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {(destination as any).title || (destination as any).name || 'Unnamed Destination'}
                    </h3>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        activeTab === 'nepal'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {activeTab === 'nepal' ? 'Nepal' : 'International'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => openModal(destination)}
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1"
                      title="Edit destination"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(destination)}
                      className="text-red-600 hover:text-red-900 transition-colors p-1"
                      title="Delete destination"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Globe className="w-3 h-3 mr-1" />
                    <span className="truncate">{destination.country}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {(totalItems > itemsPerPage || filteredDestinations.length >= itemsPerPage) && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center text-xs sm:text-sm text-gray-700">
              <span>
                Showing <span className="font-medium">{startItem}</span> to{' '}
                <span className="font-medium">{endItem}</span> of{' '}
                <span className="font-medium">{totalItems}</span> results
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

      {filteredDestinations.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No Destinations Match Your Filters' : 'No Destinations Found'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? `No destinations found matching your search. Try adjusting your search terms.`
                : 'Get started by creating your first destination.'
              }
            </p>
            {searchTerm ? (
              <button
                onClick={handleClearFilters}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 mx-auto"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => openModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Create First Destination
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        {...deleteModal.modalProps}
        title="Delete Destination"
        message="Are you sure you want to delete this destination? This will permanently remove the destination and all its associated data."
        confirmText="Delete Destination"
        variant="danger"
      />

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