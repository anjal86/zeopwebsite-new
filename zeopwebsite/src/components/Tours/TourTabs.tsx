import React, { useState, useEffect, useRef } from 'react';
import { Check, Info, FileText, Activity, Bed, Utensils, X, ChevronDown, ChevronUp } from 'lucide-react';

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
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [hasHiddenTabs, setHasHiddenTabs] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set([1])); // First day expanded by default
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  const toggleDay = (dayNumber: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayNumber)) {
      newExpanded.delete(dayNumber);
    } else {
      newExpanded.add(dayNumber);
    }
    setExpandedDays(newExpanded);
  };

  const expandAll = () => {
    const allDays = itinerary ? new Set(itinerary.map(day => day.day)) : new Set([1, 2, 3]);
    setExpandedDays(allDays);
  };

  const collapseAll = () => {
    setExpandedDays(new Set());
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'itinerary', label: 'Itinerary', icon: FileText },
    { id: 'inclusions', label: 'Inclusions', icon: Check }
  ];

  // Check if tabs are clipped/hidden
  useEffect(() => {
    const checkScrollable = () => {
      if (tabsContainerRef.current) {
        const container = tabsContainerRef.current;
        const isScrollable = container.scrollWidth > container.clientWidth;
        setHasHiddenTabs(isScrollable);
      }
    };

    checkScrollable();
    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm mb-8">
      {/* Tab Navigation - Mobile First Design */}
      <div className="border-b">
        <div className="px-4 sm:px-6">
          <div className="grid grid-cols-3 gap-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 py-3 sm:py-4 px-2 sm:px-4 text-center transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-primary bg-primary/5 border-b-2 border-primary'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-4 sm:p-6 tab-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4 sm:space-y-6">
            {/* About the Tour */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">About This Tour</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{description}</p>
            </div>

            {/* Highlights */}
            {highlights && highlights.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Tour Highlights</h3>
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Activities */}
            {activities.length > 0 && (
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                  Activities Included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400';
                        }}
                      />
                      <div>
                        <h4 className="text-sm sm:text-base font-medium text-gray-900">{activity.name}</h4>
                        <p className="text-xs sm:text-sm text-gray-500">Activity</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
                  {itinerary && itinerary.length > 0 ? `${itinerary.length} Days` : '3 Days'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={expandAll}
                    className="text-xs bg-primary/10 text-primary px-2 sm:px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAll}
                    className="text-xs bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              </div>
            </div>
            
            {/* Timeline Container */}
            <div className="relative">
              {/* Timeline Line - Hidden on mobile for cleaner look */}
              <div className="hidden sm:block absolute left-4 sm:left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary-dark"></div>
              
              <div className="space-y-3 sm:space-y-4">
                {itinerary && itinerary.length > 0 ? (
                  itinerary.map((day, index) => (
                    <div key={index} className="relative">
                      {/* Timeline Dot - Hidden on mobile */}
                      <div className="hidden sm:block absolute left-2 sm:left-4 w-4 h-4 bg-white border-4 border-primary rounded-full shadow-lg z-10"></div>
                      
                      {/* Accordion Card */}
                      <div className="sm:ml-12 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleDay(day.day)}
                          className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-t-lg sm:rounded-t-xl transition-colors"
                        >
                          <div className="flex items-center gap-2 sm:gap-4">
                            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-bold shadow-md">
                              {day.day}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">{day.title}</h4>
                              <p className="text-xs sm:text-sm text-gray-500">Day {day.day} of your journey</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0 ml-2">
                            {expandedDays.has(day.day) ? (
                              <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        {/* Accordion Content */}
                        {expandedDays.has(day.day) && (
                          <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100">
                            <div className="pt-3 sm:pt-4">
                              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">{day.description}</p>
                              
                              {/* Day Details */}
                              {(day.accommodation || day.meals) && (
                                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                                  {day.accommodation && (
                                    <div className="flex items-center gap-2 sm:gap-3 bg-blue-50 rounded-lg p-2 sm:p-3">
                                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Bed className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="text-xs sm:text-sm font-medium text-gray-900">Accommodation</div>
                                        <div className="text-xs sm:text-sm text-gray-600 truncate">{day.accommodation}</div>
                                      </div>
                                    </div>
                                  )}
                                  {day.meals && (
                                    <div className="flex items-center gap-2 sm:gap-3 bg-orange-50 rounded-lg p-2 sm:p-3">
                                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Utensils className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600" />
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="text-xs sm:text-sm font-medium text-gray-900">Meals</div>
                                        <div className="text-xs sm:text-sm text-gray-600 truncate">{day.meals}</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  // Enhanced fallback content with accordion style
                  <div className="space-y-3 sm:space-y-4">
                    {[
                      { day: 1, title: "Arrival and Preparation", description: "Arrive at the starting point, meet your experienced guide, and prepare for the adventure ahead. Complete necessary preparations and briefings.",  },
                      { day: 2, title: "Main Adventure", description: "Experience the main highlights of this amazing tour with expert guidance. Explore stunning landscapes and immerse yourself in local culture.",  },
                      { day: 3, title: "Conclusion and Departure", description: "Wrap up your incredible adventure and return home with unforgettable memories and new friendships that will last a lifetime.",  }
                    ].map((day, index) => (
                      <div key={index} className="relative">
                        {/* Timeline Dot - Hidden on mobile */}
                        <div className={`hidden sm:block absolute left-2 sm:left-4 w-4 h-4 bg-white border-4 border-primary rounded-full shadow-lg z-10`}></div>
                        
                        {/* Accordion Card */}
                        <div className="sm:ml-12 bg-white rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                          {/* Accordion Header */}
                          <button
                            onClick={() => toggleDay(day.day)}
                            className="w-full p-3 sm:p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-t-lg sm:rounded-t-xl transition-colors"
                          >
                            <div className="flex items-center gap-2 sm:gap-4">
                              <div className={`bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-bold shadow-md`}>
                                {day.day}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">{day.title}</h4>
                                <p className="text-xs sm:text-sm text-gray-500">Day {day.day} of your journey</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 ml-2">
                              {expandedDays.has(day.day) ? (
                                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                              )}
                            </div>
                          </button>
                          
                          {/* Accordion Content */}
                          {expandedDays.has(day.day) && (
                            <div className="px-3 sm:px-4 pb-3 sm:pb-4 border-t border-gray-100">
                              <div className="pt-3 sm:pt-4">
                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{day.description}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Inclusions Tab */}
        {activeTab === 'inclusions' && (
          <div className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-6">
              {/* Inclusions */}
              {inclusions && inclusions.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2" />
                    What's Included
                  </h3>
                  <ul className="space-y-2">
                    {inclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusions */}
              {exclusions && exclusions.length > 0 && (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mr-2" />
                    What's Not Included
                  </h3>
                  <ul className="space-y-2">
                    {exclusions.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* What to Bring */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2" />
                What to Bring
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                <ul className="space-y-2">
                  {whatToBring && whatToBring.length > 0 ? (
                    whatToBring.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">{item}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start">
                        <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">Comfortable walking shoes</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">Weather-appropriate clothing</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">Camera for memories</span>
                      </li>
                      <li className="flex items-start">
                        <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm sm:text-base text-gray-700">Personal medications</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TourTabs;
export type { ItineraryDay };