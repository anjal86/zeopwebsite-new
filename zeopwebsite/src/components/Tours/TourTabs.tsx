import React, { useState } from 'react';
import { Check, Info, FileText, Camera, Activity, Bed, Utensils, X } from 'lucide-react';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  accommodation?: string;
  meals?: string;
}

interface TourTabsProps {
  description: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  whatToBring?: string[];
  itinerary?: ItineraryDay[];
  activities: Array<{ id: number; name: string; image: string }>;
  images: string[];
  title: string;
}

const TourTabs: React.FC<TourTabsProps> = ({
  description,
  highlights,
  inclusions,
  exclusions,
  whatToBring,
  itinerary,
  activities,
  images,
  title
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'itinerary', label: 'Itinerary', icon: FileText },
    { id: 'inclusions', label: 'Inclusions', icon: Check },
    { id: 'gallery', label: 'Gallery', icon: Camera }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm mb-8">
      {/* Tab Navigation */}
      <div className="border-b px-6">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* About the Tour */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">About This Tour</h3>
              <p className="text-gray-600 leading-relaxed">{description}</p>
            </div>

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Tour Highlights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Activities */}
            {activities.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 text-blue-600 mr-2" />
                  Activities Included
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-10 h-10 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                        }}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">{activity.name}</h4>
                        <p className="text-sm text-gray-500">Activity</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Itinerary</h3>
            <div className="space-y-6">
              {itinerary && itinerary.length > 0 ? (
                itinerary.map((day, index) => (
                  <div key={index} className="border-l-4 border-green-600 pl-6">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                        {day.day}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">{day.title}</h4>
                    </div>
                    <p className="text-gray-600 mb-2">{day.description}</p>
                    {(day.accommodation || day.meals) && (
                      <div className="text-sm text-gray-500 space-y-1">
                        {day.accommodation && (
                          <div className="flex items-center">
                            <Bed className="w-4 h-4 mr-2" />
                            <span>Accommodation: {day.accommodation}</span>
                          </div>
                        )}
                        {day.meals && (
                          <div className="flex items-center">
                            <Utensils className="w-4 h-4 mr-2" />
                            <span>Meals: {day.meals}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                // Fallback content if no itinerary is available
                <>
                  <div className="border-l-4 border-green-600 pl-6">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                        1
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Arrival and Preparation</h4>
                    </div>
                    <p className="text-gray-600">Arrive at the starting point, meet your guide, and prepare for the adventure ahead.</p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-6">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                        2
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Main Adventure</h4>
                    </div>
                    <p className="text-gray-600">Experience the main highlights of this amazing tour with expert guidance.</p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-6">
                    <div className="flex items-center mb-2">
                      <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">
                        3
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900">Conclusion</h4>
                    </div>
                    <p className="text-gray-600">Wrap up your adventure and return with unforgettable memories.</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Inclusions Tab */}
        {activeTab === 'inclusions' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              {inclusions && inclusions.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Check className="w-5 h-5 text-green-600 mr-2" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {inclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusions */}
              {exclusions && exclusions.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <X className="w-5 h-5 text-red-600 mr-2" />
                    What's Not Included
                  </h3>
                  <ul className="space-y-2">
                    {exclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <X className="w-4 h-4 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* What to Bring */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Info className="w-5 h-5 text-blue-600 mr-2" />
                What to Bring
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  {whatToBring && whatToBring.length > 0 ? (
                    whatToBring.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Info className="w-4 h-4 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start">
                        <Info className="w-4 h-4 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Comfortable walking shoes</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="w-4 h-4 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Weather-appropriate clothing</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="w-4 h-4 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Camera for memories</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="w-4 h-4 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">Personal medications</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Photo Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                  <img
                    src={image.startsWith('http') ? image : `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${image}`}
                    alt={`${title} - Image ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error('Failed to load gallery image:', image);
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                    }}
                  />
                </div>
              ))}
              {/* Add more placeholder images if needed */}
              {images.length === 1 && (
                <>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TourTabs;
export type { ItineraryDay };