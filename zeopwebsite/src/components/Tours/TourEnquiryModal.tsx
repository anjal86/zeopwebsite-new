import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Users,
  CalendarDays,
  Send,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

interface EnquiryFormData {
  name: string;
  email: string;
  phone: string;
  destination: string;
  travelers: string;
  date: string;
  message: string;
}

interface TourEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourTitle: string;
  onSubmit?: (formData: EnquiryFormData) => Promise<void>;
}

const TourEnquiryModal: React.FC<TourEnquiryModalProps> = ({ 
  isOpen, 
  onClose, 
  tourTitle, 
  onSubmit 
}) => {
  // Auto-detect destination from tour title
  const getDestinationFromTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('everest')) return 'everest';
    if (lowerTitle.includes('annapurna')) return 'annapurna';
    if (lowerTitle.includes('kailash')) return 'kailash';
    if (lowerTitle.includes('langtang')) return 'langtang';
    if (lowerTitle.includes('kathmandu')) return 'kathmandu';
    if (lowerTitle.includes('pokhara')) return 'pokhara';
    return 'other';
  };

  const [formData, setFormData] = useState<EnquiryFormData>({
    name: '',
    email: '',
    phone: '',
    destination: getDestinationFromTitle(tourTitle),
    travelers: '2',
    date: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.destination) {
      setErrorMessage('Name, email, and destination are required');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    setIsSubmitting(true);
    setShowError(false);
    setErrorMessage('');
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API submission
        const response = await fetch('/api/contact/enquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to submit enquiry');
        }
      }
      
      // Success
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to submit enquiry. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-sky-blue to-sky-blue-dark text-white p-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h3 className="text-lg font-bold">Send Enquiry</h3>
            <p className="text-sky-100 text-sm">for {tourTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Success Message */}
          {showSuccess && (
            <div className="p-3 bg-green-100 border border-green-300 rounded-lg flex items-center">
              <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
              <p className="text-green-800 text-sm">Thank you for your enquiry! We'll contact you soon.</p>
            </div>
          )}

          {/* Error Message */}
          {showError && (
            <div className="p-3 bg-red-100 border border-red-300 rounded-lg flex items-center">
              <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <User className="w-4 h-4 inline mr-1" />
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue"
              placeholder="Your Name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Mail className="w-4 h-4 inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue"
              placeholder="Email Address"
              required
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Phone className="w-4 h-4 inline mr-1" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue"
              placeholder="Phone Number"
            />
          </div>

          {/* Travelers and Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Users className="w-4 h-4 inline mr-1" />
                Travelers
              </label>
              <input
                type="number"
                name="travelers"
                value={formData.travelers}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue"
                placeholder="Number of Travelers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <CalendarDays className="w-4 h-4 inline mr-1" />
                Preferred Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue"
              />
            </div>
          </div>

          {/* Message Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-blue focus:border-sky-blue resize-none"
              placeholder="Tell us about your dream trip..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-sky-blue to-sky-blue-dark text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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