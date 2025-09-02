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
  X
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

interface TourEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle: string;
  onSubmit: (formData: EnquiryFormData) => Promise<void>;
}

const TourEnquiryModal: React.FC<TourEnquiryModalProps> = ({ 
  isOpen, 
  onClose, 
  tourTitle, 
  onSubmit 
}) => {
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
      onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-1">Send Enquiry</h3>
            <p className="text-green-100">for {tourTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleEnquirySubmit} className="p-6 space-y-4">
          <div className="text-center mb-6">
            <p className="text-gray-600">Get a personalized quote for your adventure</p>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          {/* Budget Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Budget Range (Optional)</label>
            <select
              value={enquiryForm.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Select budget range</option>
              <option value="under-1000">Under $1,000</option>
              <option value="1000-2500">$1,000 - $2,500</option>
              <option value="2500-5000">$2,500 - $5,000</option>
              <option value="5000-10000">$5,000 - $10,000</option>
              <option value="over-10000">Over $10,000</option>
            </select>
          </div>

          {/* Accommodation Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation Preference</label>
            <select
              value={enquiryForm.accommodation}
              onChange={(e) => handleInputChange('accommodation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="standard">Standard</option>
              <option value="deluxe">Deluxe</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          {/* Special Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Interests (Optional)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {['Photography', 'Wildlife', 'Culture', 'Adventure', 'Relaxation', 'Food'].map((interest) => (
                <label key={interest} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={enquiryForm.interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              rows={4}
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourEnquiryModal;
export type { EnquiryFormData };