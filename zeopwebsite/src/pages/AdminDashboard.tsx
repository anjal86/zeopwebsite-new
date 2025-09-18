import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  BarChart3,
  Mountain,
  Backpack,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Image as ImageIcon,
  MessageSquare,
  Mail,
  Camera
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import DestinationManager from '../components/Admin/DestinationManager';
import TourManager from '../components/Admin/TourManager';
import SliderManager from '../components/Admin/SliderManager';
import ContactManager from '../components/Admin/ContactManager';
import ContactEnquiryManager from '../components/Admin/ContactEnquiryManager';
import TestimonialManager from '../components/Admin/TestimonialManager';
import KailashGalleryManager from '../components/Admin/KailashGalleryManager';

interface User {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}

type ActiveTab = 'overview' | 'destinations' | 'tours' | 'sliders' | 'kailash-gallery' | 'enquiries' | 'testimonials' | 'users' | 'settings';

const AdminDashboard: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  // Get active tab from URL or default to 'overview'
  const activeTab = (searchParams.get('tab') as ActiveTab) || 'overview';

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');

    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  // Function to handle tab changes and update URL
  const handleTabChange = (tab: ActiveTab) => {
    setSearchParams({ tab });
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'destinations', label: 'Destinations', icon: Mountain },
    { id: 'tours', label: 'Tours', icon: Backpack },
    { id: 'sliders', label: 'Hero Sliders', icon: ImageIcon },
    { id: 'kailash-gallery', label: 'Kailash Gallery', icon: Camera },
    { id: 'enquiries', label: 'Contact Enquiries', icon: Mail },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewContent onTabChange={handleTabChange} />;
      case 'destinations':
        return <DestinationManager />;
      case 'tours':
        return <TourManager />;
      case 'sliders':
        return <SliderManager />;
      case 'kailash-gallery':
        return <KailashGalleryManager />;
      case 'enquiries':
        return <ContactEnquiryManager />;
      case 'testimonials':
        return <TestimonialManager />;
      case 'users':
        return <UsersContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <OverviewContent onTabChange={handleTabChange} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <div className={`bg-slate-800 text-white ${sidebarOpen ? 'w-64' : 'w-16'} fixed left-0 top-0 h-full z-30`}>
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
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as ActiveTab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                  activeTab === item.id ? 'bg-slate-700 border-r-2 border-blue-500' : ''
                }`}
              >
                <IconComponent className="w-5 h-5" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{user.name.charAt(0)}</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
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
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <h2 className="text-xl font-semibold text-slate-800 capitalize">{activeTab}</h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600">
                Welcome back, <span className="font-medium">{user.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

// Overview Content Component
const OverviewContent: React.FC<{ onTabChange: (tab: ActiveTab) => void }> = ({ onTabChange }) => {
  const { data: destinations } = useApi('/api/destinations');
  const { data: tours } = useApi('/api/tours');
  const { data: users } = useApi('/api/users');
  const { data: bookings } = useApi('/api/bookings');
  const { data: enquiries } = useApi('/api/contact/enquiries');
  const { data: testimonials } = useApi('/api/testimonials');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Destinations</p>
              <p className="text-2xl font-bold text-slate-900">
                {destinations ? destinations.length : '...'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Mountain className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Tours</p>
              <p className="text-2xl font-bold text-slate-900">
                {tours ? tours.length : '...'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Backpack className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Contact Enquiries</p>
              <p className="text-2xl font-bold text-slate-900">
                {enquiries ? enquiries.length : '...'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Testimonials</p>
              <p className="text-2xl font-bold text-slate-900">
                {testimonials ? testimonials.length : '...'}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onTabChange('destinations')}
            className="p-4 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-left group"
          >
            <div className="mb-2">
              <Mountain className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <h4 className="font-medium text-slate-900">Manage Destinations</h4>
            <p className="text-sm text-slate-600">Add or edit travel destinations</p>
          </button>
          
          <button
            onClick={() => onTabChange('tours')}
            className="p-4 border border-slate-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-left group"
          >
            <div className="mb-2">
              <Backpack className="w-8 h-8 text-green-600 group-hover:scale-110 transition-transform" />
            </div>
            <h4 className="font-medium text-slate-900">Manage Tours</h4>
            <p className="text-sm text-slate-600">Add or edit tour packages</p>
          </button>
          
          <button
            onClick={() => onTabChange('sliders')}
            className="p-4 border border-slate-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors text-left group"
          >
            <div className="mb-2">
              <ImageIcon className="w-8 h-8 text-purple-600 group-hover:scale-110 transition-transform" />
            </div>
            <h4 className="font-medium text-slate-900">Manage Sliders</h4>
            <p className="text-sm text-slate-600">Update hero section sliders</p>
          </button>
          
          <button
            onClick={() => onTabChange('enquiries')}
            className="p-4 border border-slate-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors text-left group"
          >
            <div className="mb-2">
              <Mail className="w-8 h-8 text-orange-600 group-hover:scale-110 transition-transform" />
            </div>
            <h4 className="font-medium text-slate-900">View Enquiries</h4>
            <p className="text-sm text-slate-600">Check customer enquiries</p>
          </button>
        </div>
      </div>
    </div>
  );
};

// Users Content Component
const UsersContent: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">User Management</h3>
      <p className="text-slate-600">User management functionality will be implemented here.</p>
    </div>
  );
};

// Settings Content Component
const SettingsContent: React.FC = () => {
  return <ContactManager />;
};

export default AdminDashboard;