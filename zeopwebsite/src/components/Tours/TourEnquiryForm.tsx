import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Globe,
  CalendarDays,
  Users,
  Send,
  AlertCircle,
  Check,
  MessageCircle
} from 'lucide-react';

interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  travelDate: string;
  groupSize: string;
  message: string;
  interests: string[];
  budget: string;
  accommodation: string;
}

interface TourEnquiryFormProps {
  price: number;
  onSubmit: (formData: EnquiryFormData) => Promise<void>;
}

const TourEnquiryForm: React.FC<TourEnquiryFormProps> = ({ price, onSubmit }) => {
  const [enquiryForm, setEnquiryForm] = useState<EnquiryFormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    travelDate: '',
    groupSize: '2',
    message: '',
    interests: [],
    budget: '',
    accommodation: 'standard'
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form validation
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!enquiryForm.name.trim()) errors.name = 'Name is required';
    if (!enquiryForm.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(enquiryForm.email)) errors.email = 'Email is invalid';
    if (!enquiryForm.phone.trim()) errors.phone = 'Phone number is required';
    if (!enquiryForm.country.trim()) errors.country = 'Country is required';
    if (!enquiryForm.travelDate) errors.travelDate = 'Travel date is required';
    if (!enquiryForm.message.trim()) errors.message = 'Message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(enquiryForm);
      
      // Reset form
      setEnquiryForm({
        name: '',
        email: '',
        phone: '',
        country: '',
        travelDate: '',
        groupSize: '2',
        message: '',
        interests: [],
        budget: '',
        accommodation: 'standard'
      });
      
      alert('Thank you for your enquiry! We will contact you within 24 hours.');
    } catch (error) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | string[]) => {
    setEnquiryForm(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle interest toggle
  const toggleInterest = (interest: string) => {
    setEnquiryForm(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Price Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 text-center">
          <div className="text-3xl font-bold mb-1">${price}</div>
          <div className="text-green-100">per person</div>
        </div>

        {/* Enquiry Form */}
        <form onSubmit={handleEnquirySubmit} className="p-6 space-y-4">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Send Enquiry</h3>
            <p className="text-sm text-gray-600">Get a personalized quote for your adventure</p>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={enquiryForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  formErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Mail className="w-4 h-4 inline mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                value={enquiryForm.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {formErrors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Phone className="w-4 h-4 inline mr-1" />
                Phone Number *
              </label>
              <input
                type="tel"
                value={enquiryForm.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  formErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {formErrors.phone && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Globe className="w-4 h-4 inline mr-1" />
                Country *
              </label>
              <input
                type="text"
                value={enquiryForm.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  formErrors.country ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Your country"
              />
              {formErrors.country && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.country}
                </p>
              )}
            </div>

            {/* Travel Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <CalendarDays className="w-4 h-4 inline mr-1" />
                  Travel Date *
                </label>
                <input
                  type="date"
                  value={enquiryForm.travelDate}
                  onChange={(e) => handleInputChange('travelDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                    formErrors.travelDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {formErrors.travelDate && (
                  <p className="text-red-500 text-xs mt-1">
                    <AlertCircle className="w-3 h-3 inline mr-1" />
                    Required
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="w-4 h-4 inline mr-1" />
                  Group Size
                </label>
                <select
                  value={enquiryForm.groupSize}
                  onChange={(e) => handleInputChange('groupSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5 people</option>
                  <option value="6+">6+ people</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                rows={3}
                value={enquiryForm.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  formErrors.message ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tell us about your travel plans, special requirements, or any questions..."
              />
              {formErrors.message && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {formErrors.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Enquiry
              </>
            )}
          </button>

          {/* Features */}
          <div className="space-y-2 text-sm border-t pt-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Free Consultation</span>
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">24h Response Time</span>
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Custom Itinerary</span>
              <Check className="w-4 h-4 text-green-600" />
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-4">
            <div className="text-sm text-gray-600 mb-2">Need immediate help?</div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-2" />
                <span>+977-1-4123456</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@zeotreks.com</span>
              </div>
              <div className="flex items-center text-gray-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>WhatsApp Support</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourEnquiryForm;
export type { EnquiryFormData };