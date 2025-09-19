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
      {/* Tab Navigation */}
      <div className="border-b px-6 tour-tabs relative">
        <div
          ref={tabsContainerRef}
          className="flex space-x-2 overflow-x-auto pb-0 scrollbar-thin"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tour-tab-button flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'active' : ''
                } ${hasHiddenTabs && tab.id === tabs[tabs.length - 1].id ? 'sacred-pulse' : ''}`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Gradient fade indicator for hidden tabs */}
        {hasHiddenTabs && (
          <div className="absolute right-6 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* Tab Content */}
      <div className="p-6 tab-content">
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Day-by-Day Itinerary</h3>
              <div className="flex items-center gap-3">
                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {itinerary && itinerary.length > 0 ? `${itinerary.length} Days` : '3 Days'}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={expandAll}
                    className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAll}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    Collapse All
                  </button>
                </div>
              </div>
            </div>
            
            {/* Timeline Container */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary-dark"></div>
              
              <div className="space-y-4">
                {itinerary && itinerary.length > 0 ? (
                  itinerary.map((day, index) => (
                    <div key={index} className="relative">
                      {/* Timeline Dot */}
                      <div className="absolute left-4 w-4 h-4 bg-white border-4 border-primary rounded-full shadow-lg z-10"></div>
                      
                      {/* Accordion Card */}
                      <div className="ml-12 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleDay(day.day)}
                          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-t-xl transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold shadow-md">
                              {day.day}
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-gray-900">{day.title}</h4>
                              <p className="text-sm text-gray-500">Day {day.day} of your journey</p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            {expandedDays.has(day.day) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </button>
                        
                        {/* Accordion Content */}
                        {expandedDays.has(day.day) && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <div className="pt-4">
                              <p className="text-gray-700 leading-relaxed mb-4">{day.description}</p>
                              
                              {/* Day Details */}
                              {(day.accommodation || day.meals) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {day.accommodation && (
                                    <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Bed className="w-4 h-4 text-blue-600" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">Accommodation</div>
                                        <div className="text-sm text-gray-600">{day.accommodation}</div>
                                      </div>
                                    </div>
                                  )}
                                  {day.meals && (
                                    <div className="flex items-center gap-3 bg-orange-50 rounded-lg p-3">
                                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <Utensils className="w-4 h-4 text-orange-600" />
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">Meals</div>
                                        <div className="text-sm text-gray-600">{day.meals}</div>
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
                  <div className="space-y-4">
                    {[
                      { day: 1, title: "Arrival and Preparation", description: "Arrive at the starting point, meet your experienced guide, and prepare for the adventure ahead. Complete necessary preparations and briefings.",  },
                      { day: 2, title: "Main Adventure", description: "Experience the main highlights of this amazing tour with expert guidance. Explore stunning landscapes and immerse yourself in local culture.",  },
                      { day: 3, title: "Conclusion and Departure", description: "Wrap up your incredible adventure and return home with unforgettable memories and new friendships that will last a lifetime.",  }
                    ].map((day, index) => (
                      <div key={index} className="relative">
                        {/* Timeline Dot */}
                        <div className={`absolute left-4 w-4 h-4 bg-white border-4 border-primary rounded-full shadow-lg z-10`}></div>
                        
                        {/* Accordion Card */}
                        <div className="ml-12 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                          {/* Accordion Header */}
                          <button
                            onClick={() => toggleDay(day.day)}
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 rounded-t-xl transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg w-10 h-10 flex items-center justify-center text-sm font-bold shadow-md`}>
                                {day.day}
                              </div>
                              <div>
                                <h4 className="text-lg font-bold text-gray-900">{day.title}</h4>
                                <p className="text-sm text-gray-500">Day {day.day} of your journey</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              {expandedDays.has(day.day) ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </button>
                          
                          {/* Accordion Content */}
                          {expandedDays.has(day.day) && (
                            <div className="px-4 pb-4 border-t border-gray-100">
                              <div className="pt-4">
                                <p className="text-gray-700 leading-relaxed">{day.description}</p>
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

      </div>
    </div>
  );
};

export default TourTabs;
export type { ItineraryDay };