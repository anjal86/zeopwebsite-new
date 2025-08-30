
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  Star,
  Camera,
  Calendar,
  X,
  BarChart3,
  Mountain,
  Backpack,
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronUp,
  ChevronDown,
  Copy,
  Bed,
  Utensils,
  Upload,
  Image,
  Eye
} from 'lucide-react';
import ProgressModal from '../components/UI/ProgressModal';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
}

interface Activity {
  name: string;
  description: string;
}

interface TourDetails {
  id?: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  location: string;
  price: number;
  duration: string;
  group_size: string;
  difficulty: string;
  rating: number;
  reviews: number;
  best_time: string;
  featured: boolean;
  image: string;
  gallery?: string[];
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  activities?: Activity[];
  itinerary?: ItineraryDay[];
  what_to_bring?: string[];
  fitness_requirements?: string;
}

const TourEditor: React.FC = () => {
  const { tourSlug } = useParams<{ tourSlug: string }>();
  const tourId = tourSlug; // Use tourSlug as tourId for consistency
  const navigate = useNavigate();
  const isEditing = tourId !== 'new';

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Progress modal state
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStatus, setProgressStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [progressValue, setProgressValue] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  
  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState<TourDetails>({
    slug: '',
    title: '',
    category: 'Trekking',
    description: '',
    location: '',
    price: 0,
    duration: '',
    group_size: '',
    difficulty: 'Moderate',
    rating: 4.5,
    reviews: 0,
    best_time: '',
    featured: false,
    image: '',
    gallery: [],
    highlights: [],
    inclusions: [],
    exclusions: [],
    activities: [],
    itinerary: [],
    what_to_bring: [],
    fitness_requirements: ''
  });

  // Debug log to see formData changes
  useEffect(() => {
    console.log('FormData updated:', formData);
  }, [formData]);

  useEffect(() => {
    // Check authentication and get user data
    const userData = localStorage.getItem('adminUser');
    const token = localStorage.getItem('adminToken');
    
    console.log('Auth check - userData:', !!userData, 'token:', !!token, 'tourId:', tourId);
    
    if (userData && token) {
      try {
        setUser(JSON.parse(userData));
        console.log('User authenticated, isEditing:', isEditing, 'tourId:', tourId);
        
        if (isEditing && tourId && tourId !== 'new') {
          console.log('Calling fetchTourDetails...');
          fetchTourDetails();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/admin/login');
      }
    } else {
      console.log('No auth data found, redirecting to login');
      navigate('/admin/login');
    }
  }, [tourId, isEditing, navigate]);

  const fetchTourDetails = async () => {
    if (!tourId || tourId === 'new') return;

    setLoading(true);
    try {
      // Check if tourId is a number (ID) or string (slug)
      const isNumericId = /^\d+$/.test(tourId);
      const endpoint = isNumericId
        ? `/api/tours/${tourId}`
        : `/api/tours/slug/${tourId}`;
      
      console.log('Fetching tour details for:', tourId, 'using endpoint:', endpoint);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${endpoint}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const details = await response.json();
        console.log('Tour details received:', details);
        console.log('Setting form data...');
        setFormData(details);
        console.log('Form data set successfully');
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`Failed to fetch tour details: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching tour details:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch tour details');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        // Auto-generate slug when title changes
        if (name === 'title') {
          updated.slug = generateSlug(value);
        }
        return updated;
      });
    }
  };

  const handleArrayChange = (field: keyof TourDetails, index: number, value: string) => {
    setFormData(prev => {
      const array = (prev[field] as string[]) || [];
      const newArray = [...array];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: keyof TourDetails) => {
    setFormData(prev => {
      const array = (prev[field] as string[]) || [];
      return { ...prev, [field]: [...array, ''] };
    });
  };

  const removeArrayItem = (field: keyof TourDetails, index: number) => {
    setFormData(prev => {
      const array = (prev[field] as string[]) || [];
      const newArray = array.filter((_, i) => i !== index);
      return { ...prev, [field]: newArray };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    // Show progress modal
    setShowProgressModal(true);
    setProgressStatus('loading');
    setProgressValue(0);
    setProgressMessage('Preparing to save tour...');

    try {
      // Step 1: Validate data
      setProgressValue(25);
      setProgressMessage('Validating tour data...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Prepare API call
      setProgressValue(50);
      setProgressMessage('Updating tour information...');
      
      const token = localStorage.getItem('adminToken');
      const url = isEditing
        ? `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tours/${formData.id}`
        : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tours`;
      
      const method = isEditing ? 'PUT' : 'POST';

      // Step 3: Make API call
      setProgressValue(75);
      setProgressMessage('Generating tour details...');

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save tour');
      }

      // Step 4: Complete
      setProgressValue(100);
      setProgressMessage('Finalizing changes...');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Success
      setProgressStatus('success');
      setProgressMessage('Tour saved successfully! What would you like to do next?');

    } catch (error) {
      console.error('Error saving tour:', error);
      setProgressStatus('error');
      setProgressMessage(error instanceof Error ? error.message : 'Failed to save tour');
      setError(error instanceof Error ? error.message : 'Failed to save tour');
      
      // Auto-close error modal after 3 seconds
      setTimeout(() => {
        setShowProgressModal(false);
      }, 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3, path: '/admin/dashboard?tab=overview' },
    { id: 'destinations', label: 'Destinations', icon: Mountain, path: '/admin/dashboard?tab=destinations' },
    { id: 'tours', label: 'Tours', icon: Backpack, path: '/admin/dashboard?tab=tours' },
    { id: 'users', label: 'Users', icon: Users, path: '/admin/dashboard?tab=users' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/dashboard?tab=settings' },
  ];

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'details', label: 'Details', icon: Star },
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'media', label: 'Media', icon: Camera }
  ];

  const handleItineraryChange = (index: number, field: keyof ItineraryDay, value: string | number) => {
    setFormData(prev => {
      const itinerary = [...(prev.itinerary || [])];
      itinerary[index] = { ...itinerary[index], [field]: value };
      return { ...prev, itinerary };
    });
  };

  // Image upload functionality
  const handleImageUpload = async (file: File, isGallery: boolean = false) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('destinationSlug', 'tours'); // Use tours folder for tour images

      const token = localStorage.getItem('adminToken');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      
      if (isGallery) {
        // Add to gallery
        setFormData(prev => ({
          ...prev,
          gallery: [...(prev.gallery || []), result.url]
        }));
      } else {
        // Set as main image
        setFormData(prev => ({
          ...prev,
          image: result.url
        }));
      }

      setUploadProgress(100);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent, isGallery: boolean = false) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      handleImageUpload(imageFiles[0], isGallery);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file, isGallery);
    }
  };

  const addItineraryDay = () => {
    const nextDay = (formData.itinerary?.length || 0) + 1;
    setFormData(prev => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), {
        day: nextDay,
        title: '',
        description: '',
        accommodation: '',
        meals: ''
      }]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: (prev.itinerary || []).filter((_, i) => i !== index).map((day, i) => ({
        ...day,
        day: i + 1 // Renumber days
      }))
    }));
  };

  const moveItineraryDay = (index: number, direction: 'up' | 'down') => {
    setFormData(prev => {
      const itinerary = [...(prev.itinerary || [])];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= itinerary.length) return prev;
      
      // Swap items
      [itinerary[index], itinerary[newIndex]] = [itinerary[newIndex], itinerary[index]];
      
      // Renumber days
      const renumbered = itinerary.map((day, i) => ({ ...day, day: i + 1 }));
      
      return { ...prev, itinerary: renumbered };
    });
  };

  const duplicateItineraryDay = (index: number) => {
    setFormData(prev => {
      const itinerary = [...(prev.itinerary || [])];
      const dayToDuplicate = { ...itinerary[index] };
      dayToDuplicate.day = itinerary.length + 1;
      dayToDuplicate.title = `${dayToDuplicate.title} (Copy)`;
      
      return { ...prev, itinerary: [...itinerary, dayToDuplicate] };
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Loading tour details...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <div className={`bg-slate-800 text-white ${sidebarOpen ? 'w-64' : 'w-16'} fixed left-0 top-0 h-full z-40`}>
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            {sidebarOpen && (
              <div>
                <h1 className="font-bold text-lg">Zeo Admin</h1>
                <p className="text-slate-400 text-xs">Content Management</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = item.id === 'tours'; // Highlight tours since we're editing a tour
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                  isActive ? 'bg-slate-700 border-r-2 border-blue-500' : ''
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user.name?.charAt(0) || 'A'}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || 'Admin'}</p>
                <p className="text-xs text-slate-400 truncate">{user.email || 'admin@zeotreks.com'}</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="w-full mt-3 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Bar with Integrated Tab Navigation */}
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
          {/* Main Header */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-4">
                  <Link
                    to="/admin/dashboard?tab=tours"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Link>
                  <div>
                    <h2 className="text-xl font-semibold text-slate-800">
                      {isEditing ? 'Edit Tour' : 'Create New Tour'}
                    </h2>
                    <p className="text-sm text-slate-600">
                      {isEditing ? 'Update tour information and details' : 'Add a new tour to your collection'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard?tab=tours')}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {isEditing ? 'Update' : 'Create'} Tour
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Integrated in Header */}
          <div className="px-6">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-600 text-gray-500'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">Error</span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}

          {/* Tab Content */}
          <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border p-6"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tour Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g., Everest Base Camp Trek"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug (Auto-generated)
                        </label>
                        <input
                          type="text"
                          name="slug"
                          value={formData.slug}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50"
                          placeholder="everest-base-camp-trek"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="Describe the tour experience..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="Trekking">Trekking</option>
                          <option value="Wildlife">Wildlife</option>
                          <option value="Cultural">Cultural</option>
                          <option value="Adventure">Adventure</option>
                          <option value="Pilgrimage">Pilgrimage</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location *
                        </label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g., Everest Region"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Difficulty *
                        </label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Moderate">Moderate</option>
                          <option value="Challenging">Challenging</option>
                          <option value="Very Challenging">Very Challenging</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration *
                        </label>
                        <input
                          type="text"
                          name="duration"
                          value={formData.duration}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g., 13 nights 14 days"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (USD) *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Group Size *
                        </label>
                        <input
                          type="text"
                          name="group_size"
                          value={formData.group_size}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g., 2-12 people"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Best Time *
                        </label>
                        <input
                          type="text"
                          name="best_time"
                          value={formData.best_time}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g., March-May, September-November"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleInputChange}
                          min="0"
                          max="5"
                          step="0.1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reviews Count
                        </label>
                        <input
                          type="number"
                          name="reviews"
                          value={formData.reviews}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="w-4 h-4 text-gray-500 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label className="text-sm font-medium text-gray-700">
                          Featured Tour
                        </label>
                      </div>
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Main Image URL
                      </label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Details Tab */}
                {activeTab === 'details' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Highlights */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Tour Highlights</h3>
                        <button
                          type="button"
                          onClick={() => addArrayItem('highlights')}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(formData.highlights || []).map((highlight, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={highlight}
                              onChange={(e) => handleArrayChange('highlights', index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="Tour highlight..."
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('highlights', index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!formData.highlights || formData.highlights.length === 0) && (
                          <p className="text-gray-500 text-sm">No highlights added yet. Click "Add" to add tour highlights.</p>
                        )}
                      </div>
                    </div>

                    {/* Inclusions */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">What's Included</h3>
                        <button
                          type="button"
                          onClick={() => addArrayItem('inclusions')}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(formData.inclusions || []).map((inclusion, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={inclusion}
                              onChange={(e) => handleArrayChange('inclusions', index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="What's included..."
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('inclusions', index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!formData.inclusions || formData.inclusions.length === 0) && (
                          <p className="text-gray-500 text-sm">No inclusions added yet. Click "Add" to add what's included.</p>
                        )}
                      </div>
                    </div>

                    {/* What to Bring */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">What to Bring</h3>
                        <button
                          type="button"
                          onClick={() => addArrayItem('what_to_bring')}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                      <div className="space-y-3">
                        {(formData.what_to_bring || []).map((item, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <input
                              type="text"
                              value={item}
                              onChange={(e) => handleArrayChange('what_to_bring', index, e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="Item to bring..."
                            />
                            <button
                              type="button"
                              onClick={() => removeArrayItem('what_to_bring', index)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        {(!formData.what_to_bring || formData.what_to_bring.length === 0) && (
                          <p className="text-gray-500 text-sm">No items added yet. Click "Add" to add what to bring.</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm border p-6"
                  >
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Tour Itinerary</h2>
                      <p className="text-sm text-gray-600 mt-1">Create a detailed day-by-day itinerary for your tour</p>
                    </div>
                    
                    <div className="space-y-4">
                      {(formData.itinerary || []).map((day, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
                        >
                          {/* Day Header with Enhanced Controls */}
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="bg-gray-700 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg shadow-lg">
                                {day.day}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">Day {day.day}</h3>
                                <p className="text-sm text-gray-600">Itinerary Details</p>
                              </div>
                            </div>
                            
                            {/* Enhanced Action Buttons */}
                            <div className="flex items-center gap-2">
                              {/* Move Up/Down */}
                              <div className="flex flex-col bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <button
                                  type="button"
                                  onClick={() => moveItineraryDay(index, 'up')}
                                  disabled={index === 0}
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  title="Move up"
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveItineraryDay(index, 'down')}
                                  disabled={index === (formData.itinerary?.length || 0) - 1}
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-t border-gray-200"
                                  title="Move down"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {/* Duplicate */}
                              <button
                                type="button"
                                onClick={() => duplicateItineraryDay(index)}
                                className="p-3 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                                title="Duplicate day"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              
                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => removeItineraryDay(index)}
                                className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                                title="Delete day"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Enhanced Form Fields */}
                          <div className="grid grid-cols-1 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Day Title *
                              </label>
                              <input
                                type="text"
                                value={day.title}
                                onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm transition-all"
                                placeholder="e.g., Arrival in Kathmandu"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Description *
                              </label>
                              <textarea
                                value={day.description}
                                onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm resize-none transition-all"
                                placeholder="Describe what happens on this day in detail..."
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                  <Bed className="w-4 h-4 text-gray-500" />
                                  Accommodation
                                </label>
                                <input
                                  type="text"
                                  value={day.accommodation || ''}
                                  onChange={(e) => handleItineraryChange(index, 'accommodation', e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm transition-all"
                                  placeholder="e.g., Hotel in Kathmandu"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                                  <Utensils className="w-4 h-4 text-gray-500" />
                                  Meals
                                </label>
                                <input
                                  type="text"
                                  value={day.meals || ''}
                                  onChange={(e) => handleItineraryChange(index, 'meals', e.target.value)}
                                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white shadow-sm transition-all"
                                  placeholder="e.g., Breakfast, Lunch, Dinner"
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {(!formData.itinerary || formData.itinerary.length === 0) && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Itinerary Added</h3>
                          <p className="text-gray-600 mb-4">Start building your tour itinerary by adding the first day.</p>
                          <button
                            type="button"
                            onClick={addItineraryDay}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                          >
                            <Plus className="w-4 h-4" />
                            Add First Day
                          </button>
                        </div>
                      )}

                      {/* Add Day Button - At the end of itinerary */}
                      {formData.itinerary && formData.itinerary.length > 0 && (
                        <div className="text-center pt-4">
                          <button
                            type="button"
                            onClick={addItineraryDay}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto shadow-sm"
                          >
                            <Plus className="w-5 h-5" />
                            Add Another Day
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Media Tab */}
                {activeTab === 'media' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Main Image Section */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-6">Main Tour Image</h2>
                      
                      {/* Main Image Upload Area */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upload Area */}
                        <div>
                          <div
                            onDrop={(e) => handleDrop(e, false)}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
                          >
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Main Image</h3>
                            <p className="text-gray-600 mb-4">Drag and drop an image here, or click to browse</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileSelect(e, false)}
                              className="hidden"
                              id="main-image-upload"
                            />
                            <label
                              htmlFor="main-image-upload"
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer inline-flex items-center gap-2"
                            >
                              <Camera className="w-4 h-4" />
                              Choose Image
                            </label>
                          </div>
                          
                          {/* URL Input Alternative */}
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Or enter image URL
                            </label>
                            <input
                              type="url"
                              name="image"
                              value={formData.image}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>
                        
                        {/* Image Preview */}
                        <div>
                          {formData.image ? (
                            <div className="relative">
                              <img
                                src={formData.image}
                                alt="Main tour image"
                                className="w-full h-64 object-cover rounded-xl border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                                }}
                              />
                              <div className="absolute top-2 right-2 flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => window.open(formData.image, '_blank')}
                                  className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-colors"
                                  title="View full size"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                                  className="bg-red-500 bg-opacity-80 text-white p-2 rounded-lg hover:bg-opacity-100 transition-colors"
                                  title="Remove image"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-64 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center">
                              <div className="text-center">
                                <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-500">No image selected</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">Gallery Images</h2>
                        <div className="flex gap-2">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              files.forEach(file => handleImageUpload(file, true));
                            }}
                            className="hidden"
                            id="gallery-upload"
                          />
                          <label
                            htmlFor="gallery-upload"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Images
                          </label>
                        </div>
                      </div>

                      {/* Gallery Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                        {(formData.gallery || []).map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => window.open(imageUrl, '_blank')}
                                  className="bg-white text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                  title="View full size"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeArrayItem('gallery', index)}
                                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
                                  title="Remove image"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add More Images Drop Zone */}
                        <div
                          onDrop={(e) => handleDrop(e, true)}
                          onDragOver={(e) => e.preventDefault()}
                          className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center hover:border-green-500 transition-colors cursor-pointer"
                        >
                          <div className="text-center">
                            <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">Drop images here</p>
                          </div>
                        </div>
                      </div>

                      {/* Upload Progress */}
                      {uploading && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {(!formData.gallery || formData.gallery.length === 0) && !uploading && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Gallery Images</h3>
                          <p className="text-gray-600 mb-4">Upload images to create a beautiful gallery for your tour</p>
                          <label
                            htmlFor="gallery-upload"
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer inline-flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload First Image
                          </label>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </form>
            </div>
        </main>
      </div>

      {/* Progress Modal */}
      <ProgressModal
        isOpen={showProgressModal}
        title={isEditing ? 'Updating Tour' : 'Creating Tour'}
        message={progressMessage}
        progress={progressValue}
        status={progressStatus}
        onClose={() => setShowProgressModal(false)}
        showCloseButton={progressStatus === 'error'}
        actionButtons={progressStatus === 'success' ? [
          {
            label: 'View Tour',
            onClick: () => {
              setShowProgressModal(false);
              window.open(`/tours/${formData.slug}`, '_blank');
            },
            variant: 'primary'
          },
          {
            label: 'Back to Tours',
            onClick: () => {
              setShowProgressModal(false);
              navigate('/admin/dashboard?tab=tours');
            },
            variant: 'secondary'
          },
          {
            label: 'Continue Editing',
            onClick: () => {
              setShowProgressModal(false);
            },
            variant: 'secondary'
          }
        ] : []}
      />
    </div>
  );
};

export default TourEditor;
