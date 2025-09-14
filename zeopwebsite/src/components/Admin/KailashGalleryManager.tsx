import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Edit3,
  Trash2,
  Save,
  X,
  Eye,
  EyeOff,
  Plus,
  Image as ImageIcon
} from 'lucide-react';

interface GalleryPhoto {
  id: number;
  title: string;
  image: string;
  alt: string;
  gridSpan: string;
  order: number;
  isActive: boolean;
  uploadedAt: string;
}

interface GalleryMetadata {
  totalPhotos: number;
  lastUpdated: string;
  pageTitle: string;
  pageSubtitle: string;
}

const KailashGalleryManager: React.FC = () => {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [metadata, setMetadata] = useState<GalleryMetadata>({
    totalPhotos: 0,
    lastUpdated: '',
    pageTitle: 'Kailash Mansarovar',
    pageSubtitle: 'Sacred Journey Gallery'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const gridSpanOptions = [
    { value: 'col-span-1 row-span-1', label: '1x1 - Small' },
    { value: 'col-span-2 row-span-1', label: '2x1 - Wide' },
    { value: 'col-span-1 row-span-2', label: '1x2 - Tall' },
    { value: 'col-span-2 row-span-2', label: '2x2 - Large' },
    { value: 'col-span-2 row-span-3', label: '2x3 - Featured' }
  ];

  useEffect(() => {
    fetchGalleryData();
  }, []);

  const fetchGalleryData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/kailash-gallery', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gallery data');
      }

      const data = await response.json();
      setPhotos(data.gallery || []);
      setMetadata(data.metadata || metadata);
      setError(null);
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError(err instanceof Error ? err.message : 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = async (formData: FormData, isEdit = false, photoId?: number) => {
    try {
      setUploading(true);
      const token = localStorage.getItem('adminToken');
      const url = isEdit ? `/api/admin/kailash-gallery/${photoId}` : '/api/admin/kailash-gallery';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} photo`);
      }

      const result = await response.json();
      
      if (isEdit) {
        setPhotos(photos.map(p => p.id === photoId ? result : p));
        setEditingPhoto(null);
      } else {
        await fetchGalleryData(); // Refresh to get updated data
        setShowAddForm(false);
      }

      setError(null);
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/kailash-gallery/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete photo');
      }

      setPhotos(photos.filter(p => p.id !== photoId));
      setError(null);
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete photo');
    }
  };

  const handleUpdateMetadata = async (newMetadata: Partial<GalleryMetadata>) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/kailash-gallery/metadata', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newMetadata),
      });

      if (!response.ok) {
        throw new Error('Failed to update metadata');
      }

      const result = await response.json();
      setMetadata(result);
      setError(null);
    } catch (err) {
      console.error('Error updating metadata:', err);
      setError(err instanceof Error ? err.message : 'Failed to update metadata');
    }
  };

  const PhotoForm: React.FC<{
    photo?: GalleryPhoto;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
  }> = ({ photo, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
      title: photo?.title || '',
      alt: photo?.alt || '',
      gridSpan: photo?.gridSpan || 'col-span-1 row-span-1',
      order: photo?.order || photos.length + 1,
      isActive: photo?.isActive !== undefined ? photo.isActive : true,
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const submitFormData = new FormData();
      const photoData = {
        ...formData,
        alt: formData.alt || formData.title,
      };
      
      submitFormData.append('photoData', JSON.stringify(photoData));
      if (selectedFile) {
        submitFormData.append('image', selectedFile);
      }

      onSubmit(submitFormData);
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {photo ? 'Edit Photo' : 'Add New Photo'}
              </h3>
              <button
                onClick={onCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text (optional)
                </label>
                <input
                  type="text"
                  value={formData.alt}
                  onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Will use title if empty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grid Size
                </label>
                <select
                  value={formData.gridSpan}
                  onChange={(e) => setFormData({ ...formData, gridSpan: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {gridSpanOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Active (visible on website)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {photo ? 'Replace Image (optional)' : 'Select Image'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  required={!photo}
                />
              </div>

              {photo && photo.image && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Image
                  </label>
                  <img
                    src={photo.image}
                    alt={photo.alt}
                    className="w-full h-32 object-cover rounded-md"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      {photo ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {photo ? 'Update Photo' : 'Add Photo'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading gallery...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kailash Gallery Manager</h2>
          <p className="text-gray-600 mt-1">
            Manage photos for the Kailash Mansarovar hero gallery
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Photo
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title
            </label>
            <input
              type="text"
              value={metadata.pageTitle}
              onChange={(e) => setMetadata({ ...metadata, pageTitle: e.target.value })}
              onBlur={() => handleUpdateMetadata({ pageTitle: metadata.pageTitle })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Subtitle
            </label>
            <input
              type="text"
              value={metadata.pageSubtitle}
              onChange={(e) => setMetadata({ ...metadata, pageSubtitle: e.target.value })}
              onBlur={() => handleUpdateMetadata({ pageSubtitle: metadata.pageSubtitle })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          Total Photos: {metadata.totalPhotos} | Last Updated: {new Date(metadata.lastUpdated).toLocaleString()}
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="aspect-video relative">
              <img
                src={photo.image}
                alt={photo.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {photo.isActive ? (
                  <div className="bg-green-500 text-white p-1 rounded-full">
                    <Eye className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="bg-gray-500 text-white p-1 rounded-full">
                    <EyeOff className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 truncate">{photo.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Grid: {gridSpanOptions.find(opt => opt.value === photo.gridSpan)?.label}
                  </p>
                  <p className="text-sm text-gray-500">Order: {photo.order}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingPhoto(photo)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {photos.length === 0 && !loading && (
        <div className="text-center py-12">
          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No photos yet</h3>
          <p className="text-gray-600 mb-4">Add your first photo to get started</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition-colors"
          >
            Add First Photo
          </button>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {showAddForm && (
          <PhotoForm
            onSubmit={(formData) => handlePhotoUpload(formData, false)}
            onCancel={() => setShowAddForm(false)}
          />
        )}
        
        {editingPhoto && (
          <PhotoForm
            photo={editingPhoto}
            onSubmit={(formData) => handlePhotoUpload(formData, true, editingPhoto.id)}
            onCancel={() => setEditingPhoto(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KailashGalleryManager;