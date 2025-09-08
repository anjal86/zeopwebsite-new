import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Quote,
  Star
} from 'lucide-react';
import {
  GiMountaintop,
  GiLotusFlower,
  GiPrayer,
  GiMeditation,
  GiShield,
  GiHeartWings,
  GiWaterDrop,
  GiTempleGate
} from 'react-icons/gi';
import {
  FaMountain,
  FaPray
} from 'react-icons/fa';
import PageHeader from '../components/PageHeader/PageHeader';
import TourGrid from '../components/Tours/TourGrid';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import type { Tour } from '../services/api';

const KailashMansarovarPage: React.FC = () => {
  const navigate = useNavigate();
  const spiritualJourney = [
    {
      title: "Purification of Soul",
      description: "Cleanse your spirit in the sacred waters of Lake Mansarovar",
      icon: GiLotusFlower,
      color: "text-blue-600"
    },
    {
      title: "Divine Connection",
      description: "Experience the presence of Lord Shiva at Mount Kailash",
      icon: GiPrayer,
      color: "text-orange-600"
    },
    {
      title: "Inner Transformation",
      description: "Return home with profound spiritual awakening",
      icon: GiMeditation,
      color: "text-purple-600"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Sharma",
      location: "Mumbai, India",
      text: "This journey changed my life forever. The spiritual energy at Mount Kailash is beyond words.",
      rating: 5
    },
    {
      name: "Priya Patel",
      location: "Delhi, India", 
      text: "A once-in-a-lifetime experience. The team took care of everything, allowing me to focus on my spiritual journey.",
      rating: 5
    }
  ];

  const [filters] = useState({
    search: '',
    destination: '',
    activity: ''
  });

  // State for API data
  const [kailashTours, setKailashTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Kailash packages from tours API
  useEffect(() => {
    const fetchKailashPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/tours');
        if (!response.ok) {
          throw new Error('Failed to fetch tours');
        }
        const allTours = await response.json();
        console.log('All tours from API:', allTours);
        // Filter for Kailash-related tours
        const kailashTours = allTours.filter((tour: Tour) =>
          tour.location.toLowerCase().includes('kailash') ||
          tour.title.toLowerCase().includes('kailash') ||
          tour.category.toLowerCase().includes('pilgrimage')
        );
        
        // If no Kailash tours found, show all tours temporarily
        const toursToShow = kailashTours.length > 0 ? kailashTours : allTours;
        console.log('Tours to show:', toursToShow);
        setKailashTours(toursToShow);
        setError(null);
      } catch (err) {
        console.error('Error fetching Kailash packages:', err);
        setError(err instanceof Error ? err.message : 'Failed to load packages');
      } finally {
        setLoading(false);
      }
    };

    fetchKailashPackages();
  }, []);

  const handleTourBook = (tour: Tour) => {
    console.log('Booking Kailash tour:', tour.title);
    // Navigate to tour detail page for booking
    navigate(`/tours/${tour.slug}`);
  };

  const handleTourView = (tour: Tour) => {
    console.log('Viewing Kailash tour details:', tour.title);
    // Navigate to tour detail page
    navigate(`/tours/${tour.slug}`);
  };

  return (
    <div className="kailash-mansarovar-page overflow-hidden">
      {/* Page Header */}
      <PageHeader
        title="Kailash Mansarovar"
        subtitle="The most sacred pilgrimage on Earth - Where the divine meets the mortal, and souls find their eternal peace"
        breadcrumb="Kailash Mansarovar"
        backgroundImage="https://images.unsplash.com/photo-1601999109497-ba1c7b6e0cfb?q=80&w=2070"
      />

      {/* Sacred Statistics */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white -mt-16 relative z-10">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "6,638m", label: "Sacred Peak Height", icon: GiMountaintop, color: "text-white" },
              { number: "4,590m", label: "Holy Lake Altitude", icon: FaMountain, color: "text-white" },
              { number: "52km", label: "Divine Parikrama", icon: GiTempleGate, color: "text-white" },
              { number: "1000+", label: "Blessed Pilgrims", icon: FaPray, color: "text-white" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="stat-counter"
              >
                <div className="flex justify-center mb-2">
                  <stat.icon className={`text-4xl ${stat.color}`} />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2 sacred-glow">{stat.number}</div>
                <div className="text-orange-100 font-medium text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Journey Introduction */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <GiLotusFlower className="text-6xl sacred-pulse text-orange-500" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Sacred Path</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Embark on the most sacred pilgrimage on Earth. Each journey is carefully crafted to provide
              a transformative spiritual experience while ensuring your comfort and safety.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {spiritualJourney.map((journey, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <journey.icon className={`text-4xl sacred-pulse ${journey.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{journey.title}</h3>
                <p className="text-gray-600 leading-relaxed">{journey.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kailash Tours Grid - Moved up for prominence */}
      <section className="pt-8 pb-12 bg-gray-50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Sacred <span className="text-gradient bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Pilgrimage Packages</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every soul's journey is unique. Select the path that resonates with your spiritual calling and travel preferences.
            </p>
          </motion.div>

          {/* Loading State */}
          {loading && (
            <LoadingSpinner className="py-20" size="lg" />
          )}

          {/* Error State */}
          {error && (
            <ErrorMessage
              message={`Failed to load Kailash packages: ${error}`}
              className="py-20"
            />
          )}

          {/* Tours Grid */}
          {!loading && !error && (
            <TourGrid
              tours={kailashTours}
              filters={filters}
              onTourBook={handleTourBook}
              onTourView={handleTourView}
            />
          )}
        </div>
      </section>

      {/* Trust & Safety Section - Moved up */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Sacred Journey?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional pilgrimage experiences with the highest standards of safety, spirituality, and service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: GiShield,
                title: '100% Safe & Blessed',
                description: 'All our pilgrimages are fully insured and follow strict safety protocols with experienced guides.',
                color: 'text-green-600'
              },
              {
                icon: GiLotusFlower,
                title: 'Spiritual Guidance',
                description: 'Expert spiritual guides and masters accompany you throughout your sacred journey.',
                color: 'text-purple-600'
              },
              {
                icon: GiMountaintop,
                title: '25+ Years Experience',
                description: 'Decades of experience organizing successful Kailash Mansarovar pilgrimages.',
                color: 'text-blue-600'
              },
              {
                icon: GiHeartWings,
                title: '1000+ Blessed Souls',
                description: 'Over a thousand pilgrims have completed their spiritual transformation with us.',
                color: 'text-red-600'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  <feature.icon className={`text-4xl sacred-pulse ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Emotional Stories */}
      <section className="py-20 bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Souls <span className="text-gradient">Transformed</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Listen to the hearts of those who have walked this sacred path before you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl shadow-lg border border-orange-100 testimonial-card hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-orange-400 mb-4" />
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.location}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Emotional Call to Action */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              <GiWaterDrop className="text-6xl sacred-pulse float-animation text-orange-400" />
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Your Soul is Calling
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The sacred mountain awaits. The holy waters are ready to purify your spirit. 
              Will you answer the divine call?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,165,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="divine-cta bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-full font-bold text-xl shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 sacred-glow"
              >
                <Phone className="inline mr-3 w-6 h-6" />
                Call for Divine Guidance
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-orange-400 text-orange-400 px-10 py-5 rounded-full font-bold text-xl hover:bg-orange-400 hover:text-white transition-all duration-300 sacred-border"
              >
                <Mail className="inline mr-3 w-6 h-6" />
                Request Sacred Blessing
              </motion.button>
            </div>

            <div className="text-orange-300 text-lg sacred-pulse flex items-center justify-center gap-3">
              <GiPrayer className="text-2xl" />
              <span>May Lord Shiva bless your journey</span>
              <GiPrayer className="text-2xl" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default KailashMansarovarPage;