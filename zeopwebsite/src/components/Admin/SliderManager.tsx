import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Plus,
  Trash2,
  Save,
  X,
  MapPin,
  AlertCircle,
  Play,
  Image as ImageIcon,
  Eye,
  EyeOff,
  GripVertical
} from 'lucide-react';
import Toggle from '../UI/Toggle';

// API base URL helper function
const getApiBaseUrl = (): string => {
  // Check if we're in production (deployed)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Use the same domain as the frontend for production
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  
  // Development environment
  return 'http://localhost:3000/api';
};

interface Slider {
  id: number;
  title: string;
  subtitle?: string;
  location?: string;
  image: string;
  video?: string;
  order_index: number;
  is_active: boolean;
  button_text?: string;
  button_url?: string;
  button_style?: 'primary' | 'secondary' | 'outline';
  show_button?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface SliderFormData extends Slider {
  mediaFile?: File;
  mediaType?: 'image' | 'video';
}

// Sortable Item Component
const SortableSliderItem: React.FC<{
  slider: Slider;
  index: number;
  onEdit: (slider: Slider) => void;
  onDelete: (id: number) => void;
  onToggleActive: (slider: Slider) => void;
}> = ({ slider, index, onEdit, onDelete, onToggleActive }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slider.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 cursor-pointer ${
        !slider.is_active ? 'opacity-60' : ''
      } ${isDragging ? 'shadow-lg z-50' : ''}`}
      onClick={() => onEdit(slider)}
    >
      <div className="flex items-center gap-4 p-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        {/* Order Number */}
        <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-sm font-medium text-gray-700">
            {index + 1}
          </span>
        </div>

        {/* Preview */}
        <div className="relative w-20 h-12 flex-shrink-0">
          {slider.video ? (
            <>
              <img
                src={slider.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'}
                alt={slider.title}
                className="w-full h-full object-cover rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                }}
              />
              <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white drop-shadow-lg" />
              </div>
            </>
          ) : (
            <img
              src={slider.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'}
              alt={slider.title}
              className="w-full h-full object-cover rounded-lg border"
              onError={(e) => {
                console.error('Image failed to load:', slider.image);
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold text-gray-900 truncate">
            {slider.title}
          </h4>
          {slider.subtitle && (
            <p className="text-gray-600 text-sm truncate mt-1">{slider.subtitle}</p>
          )}
          <div className="flex items-center gap-4 mt-2">
            {slider.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                {slider.location}
              </div>
            )}
            {slider.button_text && slider.show_button && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                {slider.button_text}
              </div>
            )}
          </div>
        </div>

        {/* Right Side Content */}
        <div className="flex items-center gap-3 ml-6">
          {/* Badges */}
          <div className="flex items-center gap-2">
            {/* Type Badge */}
            {slider.video ? (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <Play className="w-3 h-3" />
                Video
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                <ImageIcon className="w-3 h-3" />
                Image
              </span>
            )}

            {/* Status Badge */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleActive(slider);
              }}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                slider.is_active
                  ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                  : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {slider.is_active ? (
                <>
                  <Eye className="w-3 h-3" />
                  Active
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3" />
                  Inactive
                </>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(slider.id);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete slider"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SliderManager: React.FC = () => {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isReordering] = useState(false);

  // DnD Kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [formData, setFormData] = useState<SliderFormData>({
    id: 0,
    title: '',
    subtitle: '',
    location: '',
    image: '',
    video: '',
    order_index: 1,
    is_active: true,
    button_text: 'Explore Adventures',
    button_url: '#tours',
    button_style: 'primary',
    show_button: true
  });

  // Fetch all sliders (including inactive ones) for admin management
  const fetchSliders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, fetch from public endpoint since auth might not be set up
      const response = await fetch(`${getApiBaseUrl()}/sliders`);
      if (!response.ok) {
        throw new Error('Failed to fetch sliders');
      }
      
      const data = await response.json();
      setSliders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sliders');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchSliders();
  }, []);

  // Cleanup blob URLs on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resetForm = () => {
    // Clean up any existing blob URLs
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setMediaType('image');
    
    setFormData({
      id: 0,
      title: '',
      subtitle: '',
      location: '',
      image: '',
      video: '',
      order_index: sliders ? Math.max(...sliders.map(s => s.order_index)) + 1 : 1,
      is_active: true,
      button_text: 'Explore Adventures',
      button_url: '#tours',
      button_style: 'primary',
      show_button: true
    });
    setEditingSlider(null);
    setSubmitError(null);
  };

  const openModal = (slider?: Slider) => {
    if (slider) {
      setEditingSlider(slider);
      setFormData(slider);
      setMediaType(slider.video ? 'video' : 'image');
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2GB limit)
      const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
      if (file.size > maxSize) {
        alert(`File size is too large (${(file.size / (1024 * 1024 * 1024)).toFixed(2)}GB). Maximum allowed size is 2GB.`);
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Clean up previous blob URL if it exists
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
      
      // Determine if it's an image or video
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      
      if (!isVideo && !isImage) {
        alert('Please select an image or video file');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Show file size info
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      console.log(`Selected ${isVideo ? 'video' : 'image'} file: ${file.name} (${fileSizeMB}MB)`);
      
      setMediaType(isVideo ? 'video' : 'image');
      setFormData(prev => ({ ...prev, mediaFile: file }));
      
      // Create a temporary object URL for preview
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      
      if (isVideo) {
        // Clear the image and video URLs since we'll be uploading a new file
        setFormData(prev => ({
          ...prev,
          video: '', // Will be set by server after upload
          image: prev.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&h=1080&fit=crop' // Keep existing image as thumbnail or use default
        }));
      } else {
        // For images, clear the URLs since we'll be uploading a new file
        setFormData(prev => ({
          ...prev,
          image: '', // Will be set by server after upload
          video: '' // Clear video when image is selected
        }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Add the slider data as JSON string
      const sliderData = {
        title: formData.title,
        subtitle: formData.subtitle,
        location: formData.location,
        image: formData.image,
        video: formData.video,
        order_index: formData.order_index,
        is_active: formData.is_active,
        button_text: formData.button_text,
        button_url: formData.button_url,
        button_style: formData.button_style,
        show_button: formData.show_button
      };
      
      formDataToSend.append('sliderData', JSON.stringify(sliderData));
      
      // Add the media file if one was selected
      if (formData.mediaFile) {
        formDataToSend.append('mediaFile', formData.mediaFile);
      }

      const url = editingSlider
        ? `${getApiBaseUrl()}/admin/sliders/${editingSlider.id}`
        : `${getApiBaseUrl()}/admin/sliders`;
      
      const method = editingSlider ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type header - let the browser set it with boundary for FormData
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save slider');
      }

      // Refresh the sliders list
      await fetchSliders();
      closeModal();
    } catch (error) {
      console.error('Error saving slider:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save slider');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this slider? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${getApiBaseUrl()}/admin/sliders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete slider');
      }

      // Refresh the sliders list
      await fetchSliders();
    } catch (error) {
      console.error('Error deleting slider:', error);
      alert('Failed to delete slider: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleToggleActive = async (slider: Slider) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${getApiBaseUrl()}/admin/sliders/${slider.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...slider,
          is_active: !slider.is_active
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update slider');
      }

      // Refresh the sliders list
      await fetchSliders();
    } catch (error) {
      console.error('Error updating slider:', error);
      alert('Failed to update slider: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  // Handle drag end event
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sortedSliders.findIndex((slider) => slider.id === active.id);
      const newIndex = sortedSliders.findIndex((slider) => slider.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(sortedSliders, oldIndex, newIndex);
        setSliders(newOrder);
        console.log('Reordering sliders:', newOrder);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loader"></div>
        <span className="ml-3 text-gray-600">Loading sliders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Sliders</h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button 
          onClick={() => fetchSliders()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const sortedSliders = sliders ? [...sliders].sort((a, b) => a.order_index - b.order_index) : [];

  return (
    <div className="slider-manager">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Hero Sliders</h3>
          <p className="text-gray-600">Manage your homepage hero section slides</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Slider
        </button>
      </div>

      {/* Drag and Drop Sliders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900">Slider Management</h4>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {sortedSliders.length} slider{sortedSliders.length !== 1 ? 's' : ''} total
              </div>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <GripVertical className="w-3 h-3" />
                Drag to reorder
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSliders.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {sortedSliders.map((slider, index) => (
                  <SortableSliderItem
                    key={slider.id}
                    slider={slider}
                    index={index}
                    onEdit={openModal}
                    onDelete={handleDelete}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
          {isReordering && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                Updating order...
              </div>
            </div>
          )}
        </div>
      </div>

      {sortedSliders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sliders Found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first hero slider.</p>
          <button
            onClick={() => openModal()}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            Create First Slider
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
                  {editingSlider ? 'Edit Slider' : 'Add New Slider'}
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
                          <p className="text-sm text-gray-500">Set the main content and details for this slider</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
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
                            placeholder="Enter slider title (e.g., Kailash Mansarovar Yatra)"
                          />
                          <p className="text-xs text-gray-500 mt-1">This will be the main heading displayed on the slider</p>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Enter subtitle (e.g., Sacred Journey to Mount Kailash and Lake Mansarovar)"
                          />
                          <p className="text-xs text-gray-500 mt-1">Optional descriptive text that appears below the title</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Location
                            </label>
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                              placeholder="e.g., Tibet, China"
                            />
                            <p className="text-xs text-gray-500 mt-1">Geographic location for this destination</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-900 mb-2">
                              Display Order *
                            </label>
                            <input
                              type="number"
                              name="order_index"
                              value={formData.order_index}
                              onChange={handleInputChange}
                              required
                              min="1"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-1">Order in which this slider appears (1 = first)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Media Upload */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Background Media</h4>
                          <p className="text-sm text-gray-500">Upload image or video for the slider background</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-3">
                            Media File *
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                            <div className="flex flex-col items-center gap-4">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                {mediaType === 'video' ? (
                                  <Play className="w-6 h-6 text-gray-600" />
                                ) : (
                                  <ImageIcon className="w-6 h-6 text-gray-600" />
                                )}
                              </div>
                              <div>
                                <input
                                  type="file"
                                  accept="image/*,video/*"
                                  onChange={handleMediaChange}
                                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                  Images: PNG, JPG, GIF up to 2GB (auto-compressed)<br />
                                  Videos: MP4, WebM up to 2GB (auto-compressed)<br />
                                  <span className="text-orange-600 font-medium">Large files will be automatically optimized</span>
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Current Media Display */}
                          {(formData.image || formData.video || previewUrl) && (
                            <div className="mt-6">
                              <div className="flex items-center justify-between mb-3">
                                <p className="text-sm font-medium text-gray-900">Current Media:</p>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                                  mediaType === 'video'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : 'bg-gray-50 text-gray-700 border border-gray-200'
                                }`}>
                                  {mediaType === 'video' ? (
                                    <>
                                      <Play className="w-3 h-3" />
                                      Video
                                    </>
                                  ) : (
                                    <>
                                      <ImageIcon className="w-3 h-3" />
                                      Image
                                    </>
                                  )}
                                </span>
                              </div>
                              
                              <div className="relative">
                                {mediaType === 'video' ? (
                                  previewUrl ? (
                                    <video
                                      src={previewUrl}
                                      className="w-full max-w-md h-48 object-cover rounded-lg border shadow-sm"
                                      controls
                                      onError={(e) => {
                                        console.error('Video preview error:', e);
                                      }}
                                    />
                                  ) : formData.video ? (
                                    <video
                                      src={formData.video}
                                      className="w-full max-w-md h-48 object-cover rounded-lg border shadow-sm"
                                      controls
                                      onError={(e) => {
                                        console.error('Video error:', e);
                                      }}
                                    />
                                  ) : null
                                ) : (
                                  <img
                                    src={previewUrl || formData.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400'}
                                    alt="Preview"
                                    className="w-full max-w-md h-48 object-cover rounded-lg border shadow-sm"
                                    onError={(e) => {
                                      console.error('Image preview error:', previewUrl || formData.image);
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                                    }}
                                  />
                                )}
                                
                                {/* Remove Media Button */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (previewUrl && previewUrl.startsWith('blob:')) {
                                      URL.revokeObjectURL(previewUrl);
                                    }
                                    setFormData(prev => ({ ...prev, image: '', video: '', mediaFile: undefined }));
                                    setPreviewUrl(null);
                                    setMediaType('image');
                                  }}
                                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                                  title="Remove media"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Info Box */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <div className="flex gap-3">
                              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Media Guidelines:</p>
                                <ul className="space-y-1 text-xs">
                                  <li>• <strong>Images:</strong> Will be used as static background (auto-compressed to WebP/JPEG)</li>
                                  <li>• <strong>Videos:</strong> Will autoplay as background (auto-compressed to MP4 H.264)</li>
                                  <li>• <strong>Recommended:</strong> Use high-quality, landscape-oriented media</li>
                                  <li>• <strong>Performance:</strong> Files are automatically optimized for web delivery</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Button Configuration */}
                    <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">Call-to-Action Button</h4>
                          <p className="text-sm text-gray-500">Configure the action button that appears on this slider</p>
                        </div>
                      </div>
                      
                      {/* Show Button Toggle */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-900 cursor-pointer">
                              Display action button
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              Show a clickable button on this slider to guide user actions
                            </p>
                          </div>
                          <div className="ml-4">
                            <Toggle
                              checked={formData.show_button || false}
                              onChange={(checked: boolean) => setFormData(prev => ({ ...prev, show_button: checked }))}
                              size="md"
                            />
                          </div>
                        </div>
                      </div>

                      {formData.show_button && (
                        <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Button Text
                              </label>
                              <input
                                type="text"
                                name="button_text"
                                value={formData.button_text}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter button text (e.g., Explore Adventures)"
                              />
                              <p className="text-xs text-gray-500 mt-1">This text will appear on the button</p>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Button Link
                              </label>
                              <input
                                type="text"
                                name="button_url"
                                value={formData.button_url}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter destination URL (e.g., #tours, /tours, https://example.com)"
                              />
                              <p className="text-xs text-gray-500 mt-1">Where users will go when they click the button</p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-900 mb-2">
                                Button Style
                              </label>
                              <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-3">
                                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                      type="radio"
                                      name="button_style"
                                      value="primary"
                                      checked={formData.button_style === 'primary'}
                                      onChange={handleInputChange}
                                      className="w-4 h-4 text-orange-600 focus:ring-orange-500"
                                    />
                                    <div className="ml-3 flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">Primary</span>
                                        <div className="w-16 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded text-white text-xs flex items-center justify-center">
                                          Button
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-500">Orange gradient - most prominent</p>
                                    </div>
                                  </label>
                                  
                                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                      type="radio"
                                      name="button_style"
                                      value="secondary"
                                      checked={formData.button_style === 'secondary'}
                                      onChange={handleInputChange}
                                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                    />
                                    <div className="ml-3 flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">Secondary</span>
                                        <div className="w-16 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded text-white text-xs flex items-center justify-center">
                                          Button
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-500">Blue gradient - secondary action</p>
                                    </div>
                                  </label>
                                  
                                  <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input
                                      type="radio"
                                      name="button_style"
                                      value="outline"
                                      checked={formData.button_style === 'outline'}
                                      onChange={handleInputChange}
                                      className="w-4 h-4 text-gray-600 focus:ring-gray-500"
                                    />
                                    <div className="ml-3 flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">Outline</span>
                                        <div className="w-16 h-6 border-2 border-white rounded text-white text-xs flex items-center justify-center bg-gray-800">
                                          Button
                                        </div>
                                      </div>
                                      <p className="text-xs text-gray-500">Transparent with border - subtle</p>
                                    </div>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Active Toggle */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <label className="text-sm font-medium text-gray-900 cursor-pointer">
                              Publish this slider
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              When enabled, this slider will be visible on the website homepage
                            </p>
                          </div>
                          <div className="ml-4">
                            <Toggle
                              checked={formData.is_active}
                              onChange={(checked: boolean) => setFormData(prev => ({ ...prev, is_active: checked }))}
                              size="md"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Footer with Action Buttons */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0 sticky bottom-0">
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
                        {formData.mediaFile ? 'Compressing & Saving...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingSlider ? 'Update' : 'Create'} Slider
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

export default SliderManager;