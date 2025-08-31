import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Globe,
  Clock,
  Shield,
  AlertCircle,
  Building,
  Users,
  Plus,
  Trash2
} from 'lucide-react';
import { useContact } from '../../hooks/useApi';
import Toggle from '../UI/Toggle';

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

interface ContactFormData {
  company: {
    name: string;
    tagline: string;
    description: string;
  };
  contact: {
    phone: {
      primary: string;
      secondary: string;
      display: string;
    };
    email: {
      primary: string;
      booking: string;
      admin: string;
      support: string;
    };
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
      full: string;
    };
    location: {
      coordinates: {
        latitude: number;
        longitude: number;
      };
      timezone: string;
      display: string;
    };
  };
  business: {
    hours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
      display: string;
    };
    support: {
      availability: string;
      emergency: string;
      response_time: string;
    };
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
    whatsapp: string;
  };
  legal: {
    registration: string;
    tax_id: string;
    established: string;
    certifications: string[];
  };
}

const ContactManager: React.FC = () => {
  const { data: contactInfo, loading, error, refetch } = useContact();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    company: {
      name: 'Zeo Tourism',
      tagline: 'Embrace the Journey',
      description: 'Your trusted partner for authentic Himalayan adventures and spiritual journeys'
    },
    contact: {
      phone: {
        primary: '+977-985-123-4567',
        secondary: '+977-1-4123456',
        display: '+977 985 123 4567'
      },
      email: {
        primary: 'info@zeotourism.com',
        booking: 'booking@zeotourism.com',
        admin: 'admin@zeotourism.com',
        support: 'support@zeotourism.com'
      },
      address: {
        street: 'Thamel, Kathmandu',
        city: 'Kathmandu',
        state: 'Bagmati Province',
        country: 'Nepal',
        postal_code: '44600',
        full: 'Thamel, Kathmandu 44600, Nepal'
      },
      location: {
        coordinates: {
          latitude: 27.7172,
          longitude: 85.3240
        },
        timezone: 'Asia/Katmandu',
        display: 'Kathmandu, Nepal'
      }
    },
    business: {
      hours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '9:00 AM - 5:00 PM',
        sunday: '10:00 AM - 4:00 PM',
        display: 'Mon-Fri: 9:00 AM - 6:00 PM'
      },
      support: {
        availability: '24/7 Support Available',
        emergency: '+977-985-123-4567',
        response_time: 'Within 2 hours'
      }
    },
    social: {
      facebook: 'https://facebook.com/zeotourism',
      instagram: 'https://instagram.com/zeotourism',
      twitter: 'https://twitter.com/zeotourism',
      youtube: 'https://youtube.com/@zeotourism',
      linkedin: 'https://linkedin.com/company/zeotourism',
      whatsapp: 'https://wa.me/9779851234567'
    },
    legal: {
      registration: 'Tourism License: 1234/078-79',
      tax_id: '600123456',
      established: '2018',
      certifications: ['Nepal Tourism Board Certified', 'TAAN Member', 'NMA Affiliated']
    }
  });

  // Load contact data when available
  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setFormData(prev => {
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${getApiBaseUrl()}/admin/contact`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save contact information');
      }

      await refetch();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving contact information:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save contact information');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEdit = () => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
    setIsEditing(false);
    setSubmitError(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loader"></div>
        <span className="ml-3 text-gray-600">Loading contact information...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Error Loading Contact Information</h3>
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
    <div className="contact-manager">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
          <p className="text-gray-600">Manage your business contact details and information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Edit Contact Info
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={cancelEdit}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
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
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Contact Information Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-8">
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Error</span>
                </div>
                <p className="text-red-700 mt-1">{submitError}</p>
              </div>
            )}

            {/* Company Information */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Building className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Company Information</h4>
                  <p className="text-sm text-gray-500">Basic company details and branding</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company.name"
                      value={formData.company.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                      placeholder="e.g., Zeo Tourism"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      name="company.tagline"
                      value={formData.company.tagline}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                      placeholder="e.g., Embrace the Journey"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    name="company.description"
                    value={formData.company.description}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                    placeholder="Brief description of your company"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Contact Details</h4>
                  <p className="text-sm text-gray-500">Phone numbers, email addresses, and location</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-6">
                {/* Phone Numbers */}
                <div>
                  <h5 className="text-md font-semibold text-gray-900 mb-4">Phone Numbers</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Phone *</label>
                      <input
                        type="tel"
                        name="contact.phone.primary"
                        value={formData.contact.phone.primary}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="+977-985-123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Phone</label>
                      <input
                        type="tel"
                        name="contact.phone.secondary"
                        value={formData.contact.phone.secondary}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="+977-1-4123456"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Display Format</label>
                      <input
                        type="text"
                        name="contact.phone.display"
                        value={formData.contact.phone.display}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="+977 985 123 4567"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Addresses */}
                <div>
                  <h5 className="text-md font-semibold text-gray-900 mb-4">Email Addresses</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Email *</label>
                      <input
                        type="email"
                        name="contact.email.primary"
                        value={formData.contact.email.primary}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="info@zeotourism.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Booking Email</label>
                      <input
                        type="email"
                        name="contact.email.booking"
                        value={formData.contact.email.booking}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="booking@zeotourism.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                      <input
                        type="email"
                        name="contact.email.admin"
                        value={formData.contact.email.admin}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="admin@zeotourism.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                      <input
                        type="email"
                        name="contact.email.support"
                        value={formData.contact.email.support}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="support@zeotourism.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h5 className="text-md font-semibold text-gray-900 mb-4">Address Information</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="contact.address.street"
                        value={formData.contact.address.street}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="Thamel, Kathmandu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        name="contact.address.city"
                        value={formData.contact.address.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="Kathmandu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
                      <input
                        type="text"
                        name="contact.address.state"
                        value={formData.contact.address.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="Bagmati Province"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                      <input
                        type="text"
                        name="contact.address.country"
                        value={formData.contact.address.country}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                        placeholder="Nepal"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Business Hours</h4>
                  <p className="text-sm text-gray-500">Operating hours and support availability</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Support Availability</label>
                    <input
                      type="text"
                      name="business.support.availability"
                      value={formData.business.support.availability}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                      placeholder="24/7 Support Available"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Response Time</label>
                    <input
                      type="text"
                      name="business.support.response_time"
                      value={formData.business.support.response_time}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                      placeholder="Within 2 hours"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">Social Media</h4>
                  <p className="text-sm text-gray-500">Social media profiles and links</p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                    <input
                      type="url"
                      name="social.facebook"
                      value={formData.social.facebook}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                      placeholder="https://facebook.com/zeotourism"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                    <input
                      type="url"
                      name="social.instagram"
                      value={formData.social.instagram}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                      placeholder="https://instagram.com/zeotourism"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                    <input
                      type="url"
                      name="social.whatsapp"
                      value={formData.social.whatsapp}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                      placeholder="https://wa.me/9779851234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label>
                    <input
                      type="url"
                      name="social.youtube"
                      value={formData.social.youtube}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-50"
                      placeholder="https://youtube.com/@zeotourism"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactManager;