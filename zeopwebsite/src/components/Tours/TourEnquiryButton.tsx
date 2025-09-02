import React from 'react';
import { Send, Check, Phone, Mail, MessageCircle } from 'lucide-react';

interface TourEnquiryButtonProps {
  price: number;
  onEnquiryClick: () => void;
}

const TourEnquiryButton: React.FC<TourEnquiryButtonProps> = ({ price, onEnquiryClick }) => {
  return (
    <div className="sticky top-24">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Price Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 text-center">
          <div className="text-3xl font-bold mb-1">${price}</div>
          <div className="text-green-100">per person</div>
        </div>

        {/* Enquiry Button */}
        <div className="p-6">
          <button
            onClick={onEnquiryClick}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center text-lg"
          >
            <Send className="w-5 h-5 mr-2" />
            Send Enquiry
          </button>

          {/* Features */}
          <div className="space-y-2 text-sm border-t pt-4 mt-4">
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
          <div className="border-t pt-4 mt-4">
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
        </div>
      </div>
    </div>
  );
};

export default TourEnquiryButton;