import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO/SEO';
import {
  MapPin,
  Users,
  DollarSign,
  Star,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Sparkles,
  Mountain,
  Phone,
  Mail,
  MessageCircle,
  X
} from 'lucide-react';
import { useApi, useContact } from '../hooks/useApi';

interface Destination {
  id: number;
  name: string;
  title: string;
  country: string;
  image: string;
  type: string;
  tourCount: number;
  activityTypes: string[];
  priceRange: {
    min: number;
    max: number;
  };
}

interface Activity {
  id: number;
  name: string;
  image: string;
  type: string;
  description: string;
  tourCount: number;
  priceRange: {
    min: number;
    max: number;
  };
  difficultyLevels: string[];
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  difficulty: string;
  rating: number;
  image: string;
  location: string;
  category: string;
  highlights: string[];
  bestTime: string;
  groupSize: string;
}

interface TripPlanForm {
  name: string;
  email: string;
  phone: string;
  destinations: string[];
  activities: string[];
  duration: string;
  budget: string;
  difficulty: string;
  groupSize: string;
  travelDates: string;
  specialRequirements: string;
  message: string;
}

const TripPlanning: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TripPlanForm>({
    name: '',
    email: '',
    phone: '',
    destinations: [],
    activities: [],
    duration: '',
    budget: '',
    difficulty: '',
    groupSize: '',
    travelDates: '',
    specialRequirements: '',
    message: ''
  });
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const { data: destinationsData, loading: destinationsLoading } = useApi('/api/trip-planning/destinations');
  const { data: activitiesData, loading: activitiesLoading } = useApi('/api/trip-planning/activities');

  useEffect(() => {
    if (destinationsData) {
      setDestinations(destinationsData);
    }
  }, [destinationsData]);

  useEffect(() => {
    if (activitiesData) {
      setActivities(activitiesData);
    }
  }, [activitiesData]);

  const steps = [
    { id: 1, title: 'Personal Info', icon: Users },
    { id: 2, title: 'Destinations', icon: MapPin },
    { id: 3, title: 'Activities', icon: Mountain },
    { id: 4, title: 'Preferences', icon: Star },
    { id: 5, title: 'Review & Submit', icon: CheckCircle }
  ];

  const handleInputChange = (field: keyof TripPlanForm, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDestinationToggle = (destination: string) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(destination)
        ? prev.destinations.filter(d => d !== destination)
        : [...prev.destinations, destination]
    }));
  };

  const handleActivityToggle = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  const getRecommendations = async () => {
    try {
      const params = new URLSearchParams({
        destinations: formData.destinations.join(','),
        activities: formData.activities.join(','),
        duration: formData.duration,
        budget: formData.budget,
        difficulty: formData.difficulty,
        groupSize: formData.groupSize,
        travelDates: formData.travelDates
      });

      const response = await fetch(`/api/trip-planning/recommendations?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations);
        setShowRecommendations(true);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/trip-planning/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        await getRecommendations();
      } else {
        console.error('Error submitting trip plan:', data.error);
      }
    } catch (error) {
      console.error('Error submitting trip plan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.email;
      case 2:
        return formData.destinations.length > 0;
      case 3:
        return formData.activities.length > 0;
      case 4:
        return formData.duration && formData.budget && formData.difficulty;
      default:
        return true;
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
              <p className="text-gray-600">We'll use this information to personalize your trip recommendations</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Destinations</h2>
              <p className="text-gray-600">Select one or more destinations you'd like to visit</p>
            </div>

            {destinationsLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destinations.map((destination) => (
                  <motion.div
                    key={destination.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      formData.destinations.includes(destination.name)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => handleDestinationToggle(destination.name)}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      {formData.destinations.includes(destination.name) && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-6 h-6 text-white bg-primary rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {destination.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{destination.country}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{destination.tourCount} tours</span>
                        <span>${destination.priceRange.min}-${destination.priceRange.max}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">What Activities Interest You?</h2>
              <p className="text-gray-600">Choose the types of activities you'd like to experience</p>
            </div>

            {activitiesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((activity) => (
                  <motion.div
                    key={activity.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      formData.activities.includes(activity.name)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                    onClick={() => handleActivityToggle(activity.name)}
                  >
                    <div className="aspect-video relative">
                      <img
                        src={activity.image}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20" />
                      {formData.activities.includes(activity.name) && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle className="w-6 h-6 text-white bg-primary rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1">
                        {activity.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{activity.tourCount} tours</span>
                        <span>${activity.priceRange.min}-{activity.priceRange.max}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Trip Preferences</h2>
              <p className="text-gray-600">Help us customize your perfect trip</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Duration *
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select duration</option>
                  <option value="1-3 days">1-3 days</option>
                  <option value="4-7 days">4-7 days</option>
                  <option value="8-14 days">8-14 days</option>
                  <option value="15-21 days">15-21 days</option>
                  <option value="3+ weeks">3+ weeks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range *
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select budget</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-2000">$1,000 - $2,000</option>
                  <option value="2000-5000">$2,000 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000+">$10,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => handleInputChange('difficulty', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Challenging">Challenging</option>
                  <option value="Very Challenging">Very Challenging</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Size
                </label>
                <select
                  value={formData.groupSize}
                  onChange={(e) => handleInputChange('groupSize', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Select group size</option>
                  <option value="Solo">Solo (1 person)</option>
                  <option value="Couple">Couple (2 people)</option>
                  <option value="Small Group">Small Group (3-6 people)</option>
                  <option value="Large Group">Large Group (7+ people)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Travel Dates
                </label>
                <input
                  type="text"
                  value={formData.travelDates}
                  onChange={(e) => handleInputChange('travelDates', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., March 2024, Summer 2024, Flexible"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requirements
                </label>
                <textarea
                  value={formData.specialRequirements}
                  onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Any dietary restrictions, accessibility needs, or special requests..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={3}
                  placeholder="Tell us more about your dream trip..."
                />
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Trip Plan</h2>
              <p className="text-gray-600">Please review your information before submitting</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <p className="text-gray-600">Name: {formData.name}</p>
                  <p className="text-gray-600">Email: {formData.email}</p>
                  {formData.phone && <p className="text-gray-600">Phone: {formData.phone}</p>}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Trip Details</h3>
                  <p className="text-gray-600">Duration: {formData.duration}</p>
                  <p className="text-gray-600">Budget: {formData.budget}</p>
                  <p className="text-gray-600">Difficulty: {formData.difficulty}</p>
                  {formData.groupSize && <p className="text-gray-600">Group Size: {formData.groupSize}</p>}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Destinations</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.destinations.map((dest, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary text-white rounded-full text-sm"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {formData.activities.map((activity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-secondary text-white rounded-full text-sm"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>

              {formData.specialRequirements && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Special Requirements</h3>
                  <p className="text-gray-600">{formData.specialRequirements}</p>
                </div>
              )}

              {formData.message && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Additional Message</h3>
                  <p className="text-gray-600">{formData.message}</p>
                </div>
              )}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Trip Plan Submitted Successfully!
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Thank you for your submission. We'll get back to you with personalized recommendations soon!
              </p>
            </div>

            {showRecommendations && recommendations.length > 0 && (
              <div className="mt-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Recommended Tours for You
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommendations.map((rec) => (
                    <motion.div
                      key={rec.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="aspect-video relative">
                        <img
                          src={rec.image}
                          alt={rec.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold">{rec.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">{rec.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {rec.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            ${rec.price}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {rec.highlights.slice(0, 2).map((highlight, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Plan Your Trip - Zeo Tourism"
        description="Create your perfect trip with our personalized trip planning service. Get expert recommendations for destinations, activities, and tours."
        keywords="trip planning, Nepal travel, custom itinerary, travel recommendations, personalized tours"
        url="https://zeotourism.com/plan-your-trip"
      />

      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Plan Your Perfect Trip
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Tell us about your travel preferences and we'll create a personalized itinerary
                with the best destinations, activities, and tours just for you.
              </p>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => setShowContactModal(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                Enquire Now
              </motion.button>
            </motion.div>
          </div>

          {/* Progress Steps */}
          <div className="mb-12">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        currentStep >= step.id
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-primary' : 'text-gray-400'
                      }`}>
                        {step.title}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-primary' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    currentStep === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                      canProceed()
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Submit Trip Plan
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripPlanning;

