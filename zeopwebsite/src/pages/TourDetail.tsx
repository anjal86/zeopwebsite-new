
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star,
  MapPin,
  Clock,
  Users,
  Calendar,
  Check,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  Heart,
  Award,
  Mountain,
  Camera,
  Utensils,
  Bed,
  FileText,
  Info
} from 'lucide-react';
import TourCard from '../components/Tours/TourCard';
import { useTours } from '../hooks/useApi';
import type { Tour } from '../services/api';

// Extended tour interface for detailed data
interface TourDetails extends Tour {
  gallery?: string[];
  exclusions?: string[];
  itinerary?: Array<{
    day: number;
    title: string;
    description: string;
    accommodation?: string;
    meals?: string;
  }>;
  what_to_bring?: string[];
  fitness_requirements?: string;
  altitude_profile?: {
    max_altitude: string;
    acclimatization_days: number;
    difficulty_level: string;
  };
  wildlife_info?: {
    best_viewing_time: string;
    common_species: string[];
    conservation_status: string;
  };
  booking_info?: {
    advance_booking: string;
    group_discounts: string;
    cancellation_policy: string;
  };
}

const TourDetail: React.FC = () => {
  const { tourSlug } = useParams<{ tourSlug: string }>();
  const navigate = useNavigate();
  const { data: allTours, loading, error } = useTours();
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [tourDetails, setTourDetails] = useState<TourDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  
  // Find the tour by slug
  const tour = allTours?.find(t => t.slug === tourSlug);
  
  // Fetch detailed tour data when tour is found
  useEffect(() => {
    const fetchTourDetails = async () => {
      if (!tour) return;
      
      setDetailsLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/tours/slug/${tour.slug}`);
        if (response.ok) {
          const details = await response.json();
          setTourDetails(details);
        } else {
          console.warn('Failed to fetch tour details, using basic tour data');
          setTourDetails(tour as TourDetails);
        }
      } catch (error) {
        console.error('Error fetching tour details:', error);
        setTourDetails(tour as TourDetails);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchTourDetails();
  }, [tour]);

  // Get related tours (same category or location, excluding current tour)
  const relatedTours = allTours?.filter(t =>
    t.id !== tour?.id &&
    (t.category === tour?.category || t.location === tour?.location)
  ).slice(0, 3) || [];

  // Create image gallery using detailed tour data
  const images = tourDetails ? (
    tourDetails.gallery && tourDetails.gallery.length > 1
      ? tourDetails.gallery
      : [
          tourDetails.image,
          tourDetails.image, // Duplicate for demo - in real app these would be different images
          tourDetails.image,
          tourDetails.image,
          tourDetails.image,
          tourDetails.image,
          tourDetails.image,
          tourDetails.image
        ]
  ).filter(Boolean) : [];

  const [dragStartX, setDragStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(clientX);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const clientX = 'touches' in e ? e.changedTouches[0].clientX : e.clientX;
    const dragDistance = dragStartX - clientX;
    
    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        // Dragged left, go to next
        setCurrentImageIndex((prev) => Math.min(prev + 1, images.length - 3));
      } else {
        // Dragged right, go to previous
        setCurrentImageIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  useEffect(() => {
    // Auto-advance seamless slider every 5 seconds
    if (images.length > 3) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => {
          if (prev >= images.length - 3) {
            return 0; // Reset to beginning for seamless loop
          }
          return prev + 1;
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images.length]);

  if (loading || detailsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <span className="ml-3 text-gray-600">Loading tour details...</span>
      </div>
    );
  }

  if (error || !tour || !tourDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error ? 'Error loading tour' : 'Tour not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error || 'The tour you are looking for does not exist.'}
          </p>
          <Link
            to="/tours"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Back to Tours
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'itinerary', label: 'Itinerary', icon: FileText },
    { id: 'inclusions', label: 'Inclusions', icon: Check },
    { id: 'gallery', label: 'Gallery', icon: Camera }
  ];

  return (
    <div className="tour-detail-page">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link to="/tours" className="hover:text-green-600">Tours</Link>
            <span>/</span>
            <span className="text-gray-900">{tourDetails.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section with Seamless Draggable Grid Slider */}
      <section className="relative h-96 md:h-[500px] overflow-hidden">
        {images.length > 0 && (
          <div 
            className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            {/* Seamless Horizontal Scroll Container */}
            <motion.div
              className="flex h-full"
              animate={{ x: `-${currentImageIndex * 33.333}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{ width: `${images.length * 33.333}%` }}
            >
              {images.map((image, index) => (
                <div key={index} className="w-1/3 h-full flex-shrink-0 px-2">
                  <div className="w-full h-full relative rounded-xl overflow-hidden">
                    <img
                      src={image}
                      alt={`${tourDetails.title} - View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Action Buttons */}
            <div className="absolute top-6 right-6 flex space-x-3 z-10">
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all backdrop-blur-sm">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-all backdrop-blur-sm">
                <Heart className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Tour Header Info with Tabs and Booking Card */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Tour Info and Tabs */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {tourDetails.category}
                </span>
                {tourDetails.featured && (
                  <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    Featured
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{tourDetails.title}</h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  <span>{tourDetails.location}</span>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(tourDetails.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {tourDetails.rating} ({tourDetails.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold text-gray-900">{tourDetails.duration}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Group Size</div>
                  <div className="font-semibold text-gray-900">{tourDetails.group_size}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Mountain className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Difficulty</div>
                  <div className="font-semibold text-gray-900">{tourDetails.difficulty}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Calendar className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Best Time</div>
                  <div className="font-semibold text-gray-900">{tourDetails.best_time}</div>
                </div>
              </div>

              {/* Tab Navigation - Moved below stat cards */}
              <div className="border-b">
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

              {/* Tab Content - In upper container */}
              <div className="mt-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-8">
                    {/* About the Tour */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-xl p-8 shadow-sm border"
                    >
                      <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Tour</h2>
                      <p className="text-gray-600 leading-relaxed text-lg">{tourDetails.description}</p>
                    </motion.div>

                    {/* Highlights */}
                    {tourDetails.highlights && tourDetails.highlights.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-8 shadow-sm border"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Highlights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {tourDetails.highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start">
                              <Check className="w-5 h-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{highlight}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* Activities */}
                    {tourDetails.activities && tourDetails.activities.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl p-8 shadow-sm border"
                      >
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Activities</h2>
                        <div className="flex flex-wrap gap-3">
                          {tourDetails.activities.map((activity, index) => (
                            <span
                              key={index}
                              className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium"
                            >
                              {typeof activity === 'string' ? activity : activity.name}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Itinerary Tab */}
                {activeTab === 'itinerary' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-8 shadow-sm border"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Itinerary</h2>
                    <div className="space-y-6">
                      {tourDetails.itinerary && tourDetails.itinerary.length > 0 ? (
                        tourDetails.itinerary.map((day, index) => (
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
                  </motion.div>
                )}

                {/* Inclusions Tab */}
                {activeTab === 'inclusions' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {/* Inclusions */}
                    {tourDetails.inclusions && tourDetails.inclusions.length > 0 && (
                      <div className="bg-white rounded-xl p-8 shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <Check className="w-6 h-6 text-green-600 mr-2" />
                          What's Included
                        </h3>
                        <ul className="space-y-3">
                          {tourDetails.inclusions.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* What to Bring */}
                    {tourDetails.what_to_bring && tourDetails.what_to_bring.length > 0 ? (
                      <div className="bg-white rounded-xl p-8 shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <Info className="w-6 h-6 text-blue-600 mr-2" />
                          What to Bring
                        </h3>
                        <ul className="space-y-3">
                          {tourDetails.what_to_bring.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl p-8 shadow-sm border">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                          <Info className="w-6 h-6 text-blue-600 mr-2" />
                          What to Bring
                        </h3>
                        <ul className="space-y-3">
                          <li className="flex items-start">
                            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Comfortable walking shoes</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Weather-appropriate clothing</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Camera for memories</span>
                          </li>
                          <li className="flex items-start">
                            <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Personal medications</span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-8 shadow-sm border"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`${tourDetails.title} - Image ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
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
                  </motion.div>
                )}
              </div>
            </div>

            {/* Sticky Booking Card - Right Side */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ${tourDetails.price}
                    </div>
                    <div className="text-gray-600">per person</div>
                  </div>

                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors mb-4 text-lg"
                  >
                    Enquire Now
                  </button>

                  <div className="space-y-3 text-sm border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Free Cancellation</span>
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Instant Confirmation</span>
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">24/7 Support</span>
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-3">Need help?</div>
                    <div className="space-y-2 text-sm">
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
          </div>
        </div>
      </section>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
              <p className="text-gray-600">Discover more amazing tours and experiences</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedTours.map((relatedTour, index) => (
                <motion.div
                  key={relatedTour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <TourCard
                    tour={relatedTour}
                    onViewDetails={(tour) => navigate(`/tours/${tour.slug}`)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Book {tourDetails.title}</h3>
            <p className="text-gray-600 mb-6">
              Contact us to book this amazing tour. We'll get back to you within 24 hours.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Tell us about your travel plans..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowBookingForm(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Thank you for your interest! We will contact you soon.');
                  setShowBookingForm(false);
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TourDetail;
