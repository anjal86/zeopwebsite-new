import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Share2, Heart } from 'lucide-react';

interface TourImageSliderProps {
  images: string[];
  title: string;
}

const TourImageSlider: React.FC<TourImageSliderProps> = ({ images, title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="relative h-[250px] md:h-[350px] bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No images available</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="relative h-[350px] md:h-[450px]">
        <div className="relative w-full h-full overflow-hidden">
          <motion.div
            className="flex h-full"
            animate={{ x: `-${currentImageIndex * 100}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ width: `${images.length * 100}%` }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full h-full flex-shrink-0">
                <img
                  src={image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${image}`}
                  alt={`${title} - View ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Failed to load gallery image:', image);
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                  }}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all backdrop-blur-sm">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all backdrop-blur-sm">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourImageSlider;