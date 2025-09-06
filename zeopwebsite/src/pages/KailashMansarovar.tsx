import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone,
  Mail,
  Quote,
  Star
} from 'lucide-react';
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
      icon: "🕉️"
    },
    {
      title: "Divine Connection",
      description: "Experience the presence of Lord Shiva at Mount Kailash",
      icon: "🙏"
    },
    {
      title: "Inner Transformation",
      description: "Return home with profound spiritual awakening",
      icon: "✨"
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
        // For now, show all tours until server is restarted to pick up new Kailash tours
        // Filter for Kailash-related tours (will work once server is restarted)
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

  // Remove hardcoded data - now using API
  const kailashToursOld: Tour[] = [
    {
      id: 1,
      slug: 'kailash-sacred-journey',
      title: 'Sacred Journey - Kailash Mansarovar',
      description: 'Embark on the most sacred pilgrimage on Earth. Experience the divine presence of Lord Shiva at Mount Kailash and cleanse your spirit in the holy waters of Lake Mansarovar.',
      image: 'https://images.unsplash.com/photo-1601999109497-ba1c7b6e0cfb?q=80&w=2070',
      price: 3999,
      originalPrice: 4999,
      duration: '12 Days',
      location: 'Mount Kailash, Tibet',
      rating: 4.8,
      reviews: 156,
      group_size: '10-15 people',
      difficulty: 'Moderate',
      category: 'Pilgrimage',
      featured: false,
      highlights: ['Mount Kailash Darshan', 'Mansarovar Lake', 'Sacred Parikrama', 'Spiritual Ceremonies'],
      inclusions: ['Accommodation', 'All Meals', 'Transportation', 'Permits', 'Spiritual Guide', 'Sacred Ceremonies'],
      best_time: 'May to September'
    },
    {
      id: 2,
      slug: 'kailash-divine-experience',
      title: 'Divine Experience - Kailash Mansarovar',
      description: 'The most popular pilgrimage package with extended journey including Everest Base Camp and Tibetan monasteries. Perfect blend of spirituality and cultural immersion.',
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=2070',
      price: 5999,
      originalPrice: 7499,
      duration: '14 Days',
      location: 'Mount Kailash, Tibet',
      rating: 4.9,
      reviews: 243,
      group_size: '6-10 people',
      difficulty: 'Moderate',
      category: 'Pilgrimage',
      featured: true,
      highlights: ['Extended Parikrama', 'Everest Base Camp', 'Tibetan Monasteries', 'Cultural Immersion'],
      inclusions: ['Premium Accommodation', 'All Meals', 'Private Transport', 'Permits', 'Expert Guide', 'Medical Support', 'Spiritual Ceremonies', 'Cultural Tours'],
      best_time: 'May to September'
    },
    {
      id: 3,
      slug: 'kailash-enlightened-path',
      title: 'Enlightened Path - Luxury Kailash',
      description: 'Premium luxury pilgrimage with helicopter access, private ceremonies, and personal spiritual guide. The ultimate comfort journey to the sacred mountain.',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
      price: 8999,
      originalPrice: 11999,
      duration: '16 Days',
      location: 'Mount Kailash, Tibet',
      rating: 5.0,
      reviews: 89,
      group_size: '2-6 people',
      difficulty: 'Easy',
      category: 'Luxury Pilgrimage',
      featured: false,
      highlights: ['Helicopter Access', 'Private Ceremonies', 'Luxury Camping', 'Personal Spiritual Guide'],
      inclusions: ['Luxury Hotels', 'Gourmet Meals', 'Private Helicopter', 'All Permits', 'Personal Guide', 'Medical Team', 'Private Ceremonies', 'Luxury Amenities', 'Photography Service'],
      best_time: 'May to September'
    },
    {
      id: 4,
      slug: 'kailash-pilgrims-path',
      title: 'Pilgrims Path - Budget Kailash',
      description: 'Traditional overland route for authentic pilgrimage experience. Budget-friendly option with group experience and basic facilities for the true spiritual seeker.',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070',
      price: 2999,
      originalPrice: 3999,
      duration: '10 Days',
      location: 'Mount Kailash, Tibet',
      rating: 4.6,
      reviews: 198,
      group_size: '15-20 people',
      difficulty: 'Challenging',
      category: 'Budget Pilgrimage',
      featured: false,
      highlights: ['Traditional Route', 'Group Experience', 'Basic Facilities', 'Authentic Journey'],
      inclusions: ['Basic Accommodation', 'Meals', 'Group Transport', 'Permits', 'Group Guide', 'Basic Medical Kit'],
      best_time: 'May to September'
    },
    {
      id: 5,
      slug: 'kailash-spiritual-retreat',
      title: 'Spiritual Retreat - Wellness Kailash',
      description: 'Extended spiritual journey with meditation retreats, yoga sessions, and Ayurvedic treatments. Perfect for those seeking deep spiritual transformation and wellness.',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2070',
      price: 12999,
      originalPrice: 15999,
      duration: '18 Days',
      location: 'Mount Kailash, Tibet',
      rating: 4.9,
      reviews: 67,
      group_size: '4-8 people',
      difficulty: 'Easy',
      category: 'Spiritual Wellness',
      featured: false,
      highlights: ['Meditation Retreats', 'Yoga Sessions', 'Spiritual Teachings', 'Wellness Focus'],
      inclusions: ['Luxury Accommodation', 'Organic Meals', 'Private Transport', 'All Permits', 'Spiritual Master', 'Meditation Sessions', 'Yoga Classes', 'Ayurvedic Treatments'],
      best_time: 'May to September'
    },
    {
      id: 6,
      slug: 'kailash-cultural-explorer',
      title: 'Cultural Explorer - Heritage Kailash',
      description: 'Comprehensive cultural journey exploring Tibetan heritage, local communities, traditional arts, and historical sites along with the sacred pilgrimage.',
      image: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=2070',
      price: 7999,
      originalPrice: 9999,
      duration: '15 Days',
      location: 'Mount Kailash, Tibet',
      rating: 4.7,
      reviews: 134,
      group_size: '8-12 people',
      difficulty: 'Moderate',
      category: 'Cultural Pilgrimage',
      featured: false,
      highlights: ['Tibetan Culture', 'Local Communities', 'Traditional Arts', 'Historical Sites'],
      inclusions: ['Cultural Hotels', 'Local Cuisine', 'Cultural Transport', 'Permits', 'Cultural Guide', 'Museum Visits', 'Local Interactions', 'Traditional Ceremonies'],
      best_time: 'May to September'
    }
  ];

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
              { number: "6,638m", label: "Sacred Peak Height", icon: "⛰️" },
              { number: "4,590m", label: "Holy Lake Altitude", icon: "🏔️" },
              { number: "52km", label: "Divine Parikrama", icon: "🚶‍♂️" },
              { number: "1000+", label: "Blessed Pilgrims", icon: "🙏" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="stat-counter"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
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
            <div className="text-6xl mb-6 sacred-pulse">🕉️</div>
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
                <div className="text-4xl mb-4 sacred-pulse">{journey.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{journey.title}</h3>
                <p className="text-gray-600 leading-relaxed">{journey.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kailash Tours Grid */}
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

      {/* Trust & Safety Section */}
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
                icon: '🛡️',
                title: '100% Safe & Blessed',
                description: 'All our pilgrimages are fully insured and follow strict safety protocols with experienced guides.'
              },
              {
                icon: '🕉️',
                title: 'Spiritual Guidance',
                description: 'Expert spiritual guides and masters accompany you throughout your sacred journey.'
              },
              {
                icon: '🏔️',
                title: '25+ Years Experience',
                description: 'Decades of experience organizing successful Kailash Mansarovar pilgrimages.'
              },
              {
                icon: '❤️',
                title: '1000+ Blessed Souls',
                description: 'Over a thousand pilgrims have completed their spiritual transformation with us.'
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
                <div className="text-4xl mb-4 sacred-pulse">{feature.icon}</div>
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

      {/* Final CTA - Emotional Call to Action */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        <div className="section-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-6xl mb-8 sacred-pulse float-animation">🕉️</div>
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

            <div className="text-orange-300 text-lg sacred-pulse">
              🙏 May Lord Shiva bless your journey 🙏
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default KailashMansarovarPage;