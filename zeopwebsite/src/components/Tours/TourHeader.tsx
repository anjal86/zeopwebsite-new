import React from 'react';
import { MapPin, Clock, Users, Calendar, Activity } from 'lucide-react';

interface TourHeaderProps {
  title: string;
  duration: string;
  groupSize: string;
  bestTime: string;
  activities: Array<{ id: number; name: string; image: string }>;
  destinations: Array<{ id: number; name: string }>;
  primaryDestination?: { name: string };
  secondaryDestinations: Array<{ name: string }>;
}

const TourHeader: React.FC<TourHeaderProps> = ({
  title,
  duration,
  groupSize,
  bestTime,
  activities,
  destinations,
  primaryDestination,
  secondaryDestinations
}) => {
  return (
    <section className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-8">
        {/* Activity Badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {activities.slice(0, 3).map((activity, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {activity.name}
            </span>
          ))}
          {activities.length > 3 && (
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
              +{activities.length - 3} more
            </span>
          )}
        </div>

        {/* Tour Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        
        {/* Location and Activity Info */}
        <div className="flex flex-wrap items-center gap-6 mb-6">
          {/* Destinations */}
          {destinations.length > 0 && (
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-green-600" />
              <span>
                {primaryDestination?.name}
                {secondaryDestinations.length > 0 && (
                  <span className="text-gray-500"> + {secondaryDestinations.length} more</span>
                )}
              </span>
            </div>
          )}
          
          {/* Activities */}
          {activities.length > 0 && (
            <div className="flex items-center text-gray-600">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              <span>{activities.map(a => a.name).join(', ')}</span>
            </div>
          )}
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Duration</div>
            <div className="font-semibold text-gray-900">{duration}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Group Size</div>
            <div className="font-semibold text-gray-900">{groupSize}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Activity className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Activities</div>
            <div className="font-semibold text-gray-900">{activities.length} included</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-sm text-gray-600">Best Time</div>
            <div className="font-semibold text-gray-900">{bestTime}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourHeader;