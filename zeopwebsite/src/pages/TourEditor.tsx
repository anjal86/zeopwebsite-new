
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
  Eye,
  MapPin,
  Activity,
  Info
} from 'lucide-react';
import ProgressModal from '../components/UI/ProgressModal';
import { useDestinations, useActivities } from '../hooks/useApi';

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
  description: string;
  price: number;
  duration: string;
  group_size: string;
  best_time: string;
  image: string;
  gallery?: string[];
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  activities?: Activity[];
  itinerary?: ItineraryDay[];
  what_to_bring?: string[];
  fitness_requirements?: string;
  // Relationship fields - Primary + Secondary Destinations
  primary_destination_id?: number;
  secondary_destination_ids?: number[];
  activity_ids?: number[];
  related_destinations?: string[];
  related_activities?: string[];
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

  // Fetch destinations and activities for relationship management
  const { data: destinations } = useDestinations();
  const { data: activities } = useActivities();
  
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
    description: '',
    price: 0,
    duration: '',
    group_size: '',
    best_time: '',
    image: '',
    gallery: [],
    highlights: [],
    inclusions: [],
    exclusions: [],
    activities: [],
    itinerary: [],
    what_to_bring: [],
    fitness_requirements: '',
    primary_destination_id: undefined,
    secondary_destination_ids: [],
    activity_ids: [],
    related_destinations: [],
    related_activities: []
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
      
      const response = await fetch(endpoint);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const details = await response.json();
        console.log('Tour details received:', details);
        console.log('Setting form data...');
        
        // Ensure relationship fields are properly initialized
        const formattedDetails = {
          ...details,
          primary_destination_id: details.primary_destination_id || details.destination_id || details.destination_ids?.[0] || undefined,
          secondary_destination_ids: details.secondary_destination_ids || [],
          activity_ids: details.activity_ids || [],
          related_destinations: details.related_destinations || [],
          related_activities: details.related_activities || [],
          gallery: details.gallery || [],
          highlights: details.highlights || [],
          inclusions: details.inclusions || [],
          exclusions: details.exclusions || [],
          activities: details.activities || [],
          itinerary: details.itinerary || [],
          what_to_bring: details.what_to_bring || []
        };
        
        setFormData(formattedDetails);
        console.log('Form data set successfully with relationships:', formattedDetails);
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
        ? `/api/admin/tours/${formData.id}`
        : `/api/admin/tours`;
      
      const method = isEditing ? 'PUT' : 'POST';

      // Step 3: Make API call
      setProgressValue(75);
      setProgressMessage('Generating tour details...');

      // Prepare tour data with relationships
      const tourData = {
        ...formData,
        // Ensure relationships are properly formatted
        primary_destination_id: formData.primary_destination_id || undefined,
        secondary_destination_ids: formData.secondary_destination_ids || [],
        activity_ids: formData.activity_ids || [],
        related_destinations: formData.related_destinations || [],
        related_activities: formData.related_activities || []
      };

      console.log('Saving tour with relationships:', tourData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(tourData),
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
    { id: 'relationships', label: 'Destinations & Activities', icon: MapPin },
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
      
      const response = await fetch('/api/admin/upload', {
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
      if (isGallery && imageFiles.length > 1) {
        // Handle multiple files for gallery
        imageFiles.forEach((file, index) => {
          setTimeout(() => handleImageUpload(file, isGallery), index * 500);
        });
      } else {
        handleImageUpload(imageFiles[0], isGallery);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      if (isGallery && imageFiles.length > 1) {
        // Handle multiple files for gallery
        imageFiles.forEach((file, index) => {
          setTimeout(() => handleImageUpload(file, isGallery), index * 500);
        });
      } else {
        handleImageUpload(imageFiles[0], isGallery);
      }
    }
    
    // Reset the input value to allow selecting the same files again
    e.target.value = '';
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

                    {/* Category and difficulty are now derived from activities, so these fields are removed */}

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

                    {/* Removed rating, reviews, and featured fields */}

                    {/* Main Image Upload Section */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-4">
                        Main Image *
                      </label>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upload Area */}
                        <div>
                          <div
                            onDrop={(e) => handleDrop(e, false)}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors cursor-pointer bg-gray-50"
                          >
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Upload Image</h4>
                            <p className="text-xs text-gray-600 mb-3">Drag and drop or click to browse</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileSelect(e, false)}
                              className="hidden"
                              id="basic-image-upload"
                            />
                            <label
                              htmlFor="basic-image-upload"
                              className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors cursor-pointer inline-flex items-center gap-2 text-sm"
                            >
                              <Camera className="w-4 h-4" />
                              Choose Image
                            </label>
                          </div>
                          
                          {/* Upload Progress */}
                          {uploading && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
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
                          
                          {/* URL Input Alternative */}
                          <div className="mt-4">
                            <label className="block text-xs font-medium text-gray-600 mb-2">
                              Or enter image URL
                            </label>
                            <input
                              type="url"
                              name="image"
                              value={formData.image}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                        </div>
                        
                        {/* Image Preview */}
                        <div>
                          {formData.image ? (
                            <div className="relative">
                              <img
                                src={formData.image.startsWith('http') ? formData.image : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${formData.image}`}
                                alt="Main tour image preview"
                                className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm"
                                onError={(e) => {
                                  console.error('Failed to load main image:', formData.image);
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
                              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                                Main Image
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <div className="text-center">
                                <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500">No image selected</p>
                                <p className="text-xs text-gray-400">Upload or enter URL above</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Relationships Tab */}
                {activeTab === 'relationships' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Related Destinations */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Mountain className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Related Destinations</h3>
                          <p className="text-sm text-gray-500">Select destinations that this tour visits or relates to</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {destinations?.map((destination) => {
                          const isPrimary = formData.primary_destination_id === destination.id;
                          const isSecondary = formData.secondary_destination_ids?.includes(destination.id);
                          const isSelected = isPrimary || isSecondary;
                          
                          return (
                            <div
                              key={destination.id}
                              onClick={() => {
                                const secondaryIds = formData.secondary_destination_ids || [];
                                const relatedDestinations = formData.related_destinations || [];
                                
                                if (isPrimary) {
                                  // If clicking on primary, make it unselected
                                  setFormData(prev => ({
                                    ...prev,
                                    primary_destination_id: undefined,
                                    related_destinations: relatedDestinations.filter(name => name !== destination.name)
                                  }));
                                } else if (isSecondary) {
                                  // If clicking on secondary, remove from secondary
                                  setFormData(prev => ({
                                    ...prev,
                                    secondary_destination_ids: secondaryIds.filter(id => id !== destination.id),
                                    related_destinations: relatedDestinations.filter(name => name !== destination.name)
                                  }));
                                } else {
                                  // If not selected, add as primary if no primary exists, otherwise add as secondary
                                  if (!formData.primary_destination_id) {
                                    setFormData(prev => ({
                                      ...prev,
                                      primary_destination_id: destination.id,
                                      related_destinations: [...relatedDestinations, destination.name]
                                    }));
                                  } else {
                                    setFormData(prev => ({
                                      ...prev,
                                      secondary_destination_ids: [...secondaryIds, destination.id],
                                      related_destinations: [...relatedDestinations, destination.name]
                                    }));
                                  }
                                }
                              }}
                              className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                                isPrimary
                                  ? 'border-primary bg-primary/10 shadow-md'
                                  : isSecondary
                                  ? 'border-secondary bg-secondary/10 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                              }`}
                            >
                              <div className="p-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={destination.image}
                                    alt={destination.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                                    }}
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{destination.name}</h4>
                                    <p className="text-sm text-gray-500">{(destination as any).country}</p>
                                  </div>
                                  {isPrimary && (
                                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">P</span>
                                    </div>
                                  )}
                                  {isSecondary && (
                                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-bold">S</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {(!destinations || destinations.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <Mountain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No destinations available. Create destinations first.</p>
                        </div>
                      )}
                    </div>

                    {/* Related Activities */}
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <Activity className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Related Activities</h3>
                          <p className="text-sm text-gray-500">Select activities that are part of this tour</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activities?.map((activity) => {
                          const isSelected = formData.activity_ids?.includes(activity.id) ||
                                           formData.related_activities?.includes(activity.name);
                          return (
                            <div
                              key={activity.id}
                              onClick={() => {
                                const activityIds = formData.activity_ids || [];
                                const relatedActivities = formData.related_activities || [];
                                
                                if (isSelected) {
                                  // Remove from selection
                                  setFormData(prev => ({
                                    ...prev,
                                    activity_ids: activityIds.filter(id => id !== activity.id),
                                    related_activities: relatedActivities.filter(name => name !== activity.name)
                                  }));
                                } else {
                                  // Add to selection
                                  setFormData(prev => ({
                                    ...prev,
                                    activity_ids: [...activityIds, activity.id],
                                    related_activities: [...relatedActivities, activity.name]
                                  }));
                                }
                              }}
                              className={`relative cursor-pointer rounded-lg border-2 transition-all duration-200 ${
                                isSelected
                                  ? 'border-secondary bg-secondary/5 shadow-md'
                                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                              }`}
                            >
                              <div className="p-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={activity.image}
                                    alt={activity.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                                    }}
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900">{activity.name}</h4>
                                    <p className="text-sm text-gray-500">{(activity as any).type || 'Activity'}</p>
                                  </div>
                                  {isSelected && (
                                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {(!activities || activities.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p>No activities available. Create activities first.</p>
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationship Summary</h3>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Primary Destination</h4>
                          <div className="space-y-1">
                            {formData.primary_destination_id ? (
                              <div className="text-sm text-gray-600 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full inline-block mr-2 mb-1">
                                <span className="text-primary font-medium">P</span> {destinations?.find(d => d.id === formData.primary_destination_id)?.name}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">No primary destination selected</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Secondary Destinations ({formData.secondary_destination_ids?.length || 0})</h4>
                          <div className="space-y-1">
                            {formData.secondary_destination_ids?.length ? (
                              formData.secondary_destination_ids.map((destId) => {
                                const dest = destinations?.find(d => d.id === destId);
                                return dest ? (
                                  <div key={destId} className="text-sm text-gray-600 bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-full inline-block mr-2 mb-1">
                                    <span className="text-secondary font-medium">S</span> {dest.name}
                                  </div>
                                ) : null;
                              })
                            ) : (
                              <p className="text-sm text-gray-500">No secondary destinations selected</p>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-700 mb-2">Selected Activities ({formData.activity_ids?.length || 0})</h4>
                          <div className="space-y-1">
                            {formData.related_activities?.map((activity, index) => (
                              <div key={index} className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full inline-block mr-2 mb-1">
                                {activity}
                              </div>
                            )) || <p className="text-sm text-gray-500">No activities selected</p>}
                          </div>
                        </div>
                      </div>
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
                    {/* Enhanced Gallery Section */}
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-8">
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900">Gallery Images</h2>
                            <p className="text-sm text-gray-600">Create a stunning visual gallery for your tour</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-gray-700">
                              {(formData.gallery || []).length} images
                            </span>
                          </div>
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
                            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 cursor-pointer flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                          >
                            <Upload className="w-5 h-5" />
                            <span className="font-medium">Add Images</span>
                          </label>
                        </div>
                      </div>

                      {/* Enhanced Upload Progress */}
                      {uploading && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6"
                        >
                          <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse">
                              <Upload className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">Uploading Image...</div>
                              <div className="text-sm text-gray-600">Processing your image for the gallery</div>
                            </div>
                            <div className="ml-auto text-2xl font-bold text-blue-600">
                              {uploadProgress}%
                            </div>
                          </div>
                          <div className="w-full bg-white rounded-full h-4 overflow-hidden shadow-inner">
                            <motion.div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full relative overflow-hidden"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="absolute inset-0 bg-white opacity-20 animate-pulse"></div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {/* Enhanced Gallery Grid */}
                      {(formData.gallery || []).length > 0 ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {(formData.gallery || []).map((imageUrl, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="relative group bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              >
                                <div className="aspect-square overflow-hidden">
                                  <img
                                    src={imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imageUrl}`}
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => {
                                      console.error('Failed to load gallery image:', imageUrl);
                                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                                    }}
                                  />
                                </div>
                                
                                {/* Enhanced Image Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                                    <div className="text-white">
                                      <div className="text-sm font-semibold">Image {index + 1}</div>
                                      <div className="text-xs opacity-80">Gallery Photo</div>
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => window.open(imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${imageUrl}`, '_blank')}
                                        className="bg-white/20 backdrop-blur-sm text-white p-2.5 rounded-xl hover:bg-white/30 transition-all duration-200 shadow-lg"
                                        title="View full size"
                                      >
                                        <Eye className="w-4 h-4" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => removeArrayItem('gallery', index)}
                                        className="bg-red-500/80 backdrop-blur-sm text-white p-2.5 rounded-xl hover:bg-red-600 transition-all duration-200 shadow-lg"
                                        title="Remove image"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Enhanced Image Number Badge */}
                                <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                  #{index + 1}
                                </div>

                                {/* Image Quality Indicator */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                                    ✓ Ready
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                            
                            {/* Enhanced Add More Images Drop Zone */}
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8, y: 20 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: (formData.gallery || []).length * 0.1 }}
                              onDrop={(e) => handleDrop(e, true)}
                              onDragOver={(e) => e.preventDefault()}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add('border-green-500', 'bg-green-50', 'scale-105');
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-green-500', 'bg-green-50', 'scale-105');
                              }}
                              className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all duration-300 cursor-pointer group transform hover:scale-105"
                            >
                              <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-green-200 group-hover:to-blue-200 transition-all duration-300 shadow-lg">
                                  <Plus className="w-8 h-8 text-green-600 group-hover:text-green-700 group-hover:scale-110 transition-all duration-300" />
                                </div>
                                <p className="text-sm font-semibold text-gray-700 group-hover:text-green-700 mb-1">Add More Images</p>
                                <p className="text-xs text-gray-500">Drag & drop or click</p>
                              </div>
                            </motion.div>
                          </div>

                          {/* Enhanced Gallery Actions */}
                          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 px-4 py-2 rounded-full">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span><strong>Tip:</strong> Drag images to reorder them</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600 bg-purple-50 px-4 py-2 rounded-full">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span>Supports JPG, PNG, WebP</span>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm('Are you sure you want to remove all gallery images?')) {
                                    setFormData(prev => ({ ...prev, gallery: [] }));
                                  }
                                }}
                                className="text-red-600 hover:text-red-700 px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-200 text-sm flex items-center gap-2 border border-red-200 hover:border-red-300"
                                disabled={(formData.gallery || []).length === 0}
                              >
                                <Trash2 className="w-4 h-4" />
                                Clear All
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Enhanced Empty State */
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-16"
                        >
                          <div className="relative mb-8">
                            <div className="w-32 h-32 bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                              <Camera className="w-16 h-16 text-blue-600" />
                            </div>
                            <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                              <Plus className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          
                          <h3 className="text-3xl font-bold text-gray-900 mb-4">Create Your Gallery</h3>
                          <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                            Showcase the beauty of your tour with stunning images. Upload multiple photos to give travelers a preview of their adventure.
                          </p>
                          
                          {/* Enhanced Upload Options */}
                          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
                            <label
                              htmlFor="gallery-upload"
                              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-10 py-4 rounded-2xl hover:from-green-700 hover:to-green-800 transition-all duration-200 cursor-pointer flex items-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-105"
                            >
                              <Upload className="w-6 h-6" />
                              <span className="font-semibold text-lg">Upload Images</span>
                            </label>
                            
                            <div className="flex items-center gap-3 text-gray-400">
                              <div className="w-8 h-px bg-gray-300"></div>
                              <span className="text-sm font-medium">or</span>
                              <div className="w-8 h-px bg-gray-300"></div>
                            </div>
                            
                            <div
                              onDrop={(e) => handleDrop(e, true)}
                              onDragOver={(e) => e.preventDefault()}
                              onDragEnter={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add('border-blue-500', 'bg-blue-100', 'scale-105');
                              }}
                              onDragLeave={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove('border-blue-500', 'bg-blue-100', 'scale-105');
                              }}
                              onClick={() => document.getElementById('gallery-upload')?.click()}
                              className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-2xl px-10 py-4 hover:border-blue-500 hover:bg-blue-100 transition-all duration-300 cursor-pointer transform hover:scale-105"
                            >
                              <div className="flex items-center gap-3 text-blue-700">
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                                  <Image className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="font-semibold">Drag & Drop Here</div>
                                  <div className="text-sm opacity-75">Multiple files supported</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Enhanced Upload Guidelines */}
                          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <Info className="w-3 h-3 text-blue-600" />
                              </div>
                              Upload Guidelines
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                  <FileText className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-green-800">File Types</div>
                                  <div className="text-xs text-green-600">JPG, PNG, WebP</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Upload className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-blue-800">File Size</div>
                                  <div className="text-xs text-blue-600">Max 10MB each</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                  <Image className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-purple-800">Resolution</div>
                                  <div className="text-xs text-purple-600">1920x1080px ideal</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
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
