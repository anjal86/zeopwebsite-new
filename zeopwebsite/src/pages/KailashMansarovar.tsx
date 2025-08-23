import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mountain, 
  Calendar, 
  Users, 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Award,
  Heart,
  Compass,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
  Quote
} from 'lucide-react';

const KailashMansarovarPage: React.FC = () => {
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

  const packages = [
    {
      name: 'Sacred Journey',
      duration: '12 Days',
      price: 3999,
      originalPrice: 4999,
      groupSize: '10-15',
      includes: ['Accommodation', 'All Meals', 'Transportation', 'Permits', 'Spiritual Guide'],
      popular: false,
      badge: 'Best Value'
    },
    {
      name: 'Divine Experience',
      duration: '14 Days',
      price: 5999,
      originalPrice: 7499,
      groupSize: '6-10',
      includes: ['Premium Accommodation', 'All Meals', 'Private Transport', 'Permits', 'Expert Guide', 'Medical Support', 'Spiritual Ceremonies'],
      popular: true,
      badge: 'Most Popular'
    },
    {
      name: 'Enlightened Path',
      duration: '16 Days',
      price: 8999,
      originalPrice: 11999,
      groupSize: '2-6',
      includes: ['Luxury Hotels', 'Gourmet Meals', 'Private Helicopter', 'All Permits', 'Personal Guide', 'Medical Team', 'Private Ceremonies', 'Luxury Amenities'],
      popular: false,
      badge: 'Premium'
    }
  ];

  return (
    <div className="kailash-mansarovar-page overflow-hidden">
      {/* Hero Section - Full Screen with Emotional Impact */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1601999109497-ba1c7b6e0cfb?q=80&w=2070"
            alt="Mount Kailash"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Floating Sacred Symbol */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-20 right-20 text-6xl opacity-20 float-animation sacred-pulse"
        >
          🕉️
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="mb-6">
              <span className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
                Sacred Pilgrimage
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Kailash Mansarovar
              <span className="block text-3xl md:text-4xl text-orange-300 font-light mt-2">
                The Journey Within
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed max-w-3xl mx-auto">
              Embark on the most sacred pilgrimage on Earth. Where the divine meets the mortal, 
              and souls find their eternal peace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="divine-cta bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 sacred-glow"
              >
                Begin Your Sacred Journey
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 sacred-border"
              >
                Watch Sacred Journey
              </motion.button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                <span>100% Safe & Blessed</span>
              </div>
              <div className="flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-400" />
                <span>25+ Years Experience</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                <span>1000+ Souls Transformed</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white scroll-indicator"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center sacred-glow">
            <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
          </div>
        </motion.div>
      </section>

      {/* Emotional Connection Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden spiritual-bg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="section-container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <Quote className="w-12 h-12 text-orange-400 mx-auto mb-6 sacred-pulse" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              "When you touch the sacred waters of Mansarovar,
              <span className="block text-orange-300 mt-2">your soul touches eternity"</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              This is not just a journey to a destination. It's a pilgrimage to your inner self,
              a transformation that begins the moment you decide to answer the call of the divine.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {spiritualJourney.map((journey, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-8 bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl backdrop-blur-sm border border-gray-700/50 glass-dark hover:scale-105 transition-all duration-300"
              >
                <div className="text-6xl mb-6 sacred-pulse">{journey.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-orange-300">{journey.title}</h3>
                <p className="text-gray-300 leading-relaxed">{journey.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sacred Statistics */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "6,638m", label: "Sacred Peak Height" },
              { number: "4,590m", label: "Holy Lake Altitude" },
              { number: "52km", label: "Divine Parikrama" },
              { number: "1000+", label: "Blessed Pilgrims" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="stat-counter"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 sacred-glow">{stat.number}</div>
                <div className="text-orange-100 font-medium">{stat.label}</div>
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

      {/* Sacred Packages - Emotional Pricing */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choose Your <span className="text-gradient">Sacred Path</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every soul's journey is unique. Select the path that resonates with your spiritual calling.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`package-card relative bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                  pkg.popular ? 'ring-4 ring-orange-400 scale-105 popular sacred-glow' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center py-3 font-bold">
                    ✨ {pkg.badge} ✨
                  </div>
                )}
                
                <div className={`p-8 ${pkg.popular ? 'pt-16' : ''}`}>
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                    <div className="flex items-center justify-center mb-4">
                      <span className="text-5xl font-bold text-orange-500">${pkg.price}</span>
                      <div className="ml-3">
                        <div className="text-gray-400 line-through text-lg">${pkg.originalPrice}</div>
                        <div className="text-sm text-gray-600">per person</div>
                      </div>
                    </div>
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Save ${pkg.originalPrice - pkg.price}
                    </div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-5 h-5 mr-3 text-orange-500" />
                      {pkg.duration} Sacred Journey
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-5 h-5 mr-3 text-orange-500" />
                      Intimate Group: {pkg.groupSize}
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {pkg.includes.map((item, i) => (
                      <div key={i} className="flex items-center text-gray-700">
                        <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-4 rounded-full font-bold text-lg transition-all duration-300 ${
                      pkg.popular
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-2xl hover:shadow-orange-500/25'
                        : 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'
                    }`}
                  >
                    Begin This Sacred Path
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Emotional Call to Action */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=2070"
            alt="Sacred Mountain"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="section-container relative z-10 text-center">
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