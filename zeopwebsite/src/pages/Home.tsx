import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  MessageCircle,
  Mountain,
  Shield,
  Star,
  Target,
  ArrowRight,
  Quote,
  Phone,
  Mail,
  Clock3
} from 'lucide-react';
import Hero from '../components/Hero/Hero';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Hero />
      
      {/* Quick Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-sky-blue rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-sunrise-orange rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="section-container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              Start Your Journey
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Plan Your Perfect <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Adventure</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From majestic mountain peaks to sacred spiritual journeys, discover Nepal's most extraordinary experiences with our expert guidance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Explore Destinations</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">Discover breathtaking locations from the towering peaks of Everest to the sacred valleys of ancient Nepal</p>
                  <div className="flex items-center justify-between">
                    <Link to="/destinations" className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors group">
                      View All Destinations
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="text-sm text-gray-400">50+ Destinations</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Book Tours</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">Choose from expertly crafted tours and adventures designed to create memories that last a lifetime</p>
                  <div className="flex items-center justify-between">
                    <Link to="/tours" className="inline-flex items-center text-secondary font-semibold hover:text-secondary-dark transition-colors group">
                      Browse Tours
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="text-sm text-gray-400">100+ Tours</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="absolute -top-6 left-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Expert Consultation</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">Connect with our travel experts for personalized planning and insider knowledge of Nepal's hidden gems</p>
                  <div className="flex items-center justify-between">
                    <Link to="/contact" className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors group">
                      Contact Us
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <div className="text-sm text-gray-400">24/7 Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Preview */}
      <section className="py-20 bg-white relative">
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Mountain className="w-4 h-4 mr-2" />
              Top Destinations
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Featured <span className="text-gradient bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Destinations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Handpicked destinations that offer the most authentic and transformative experiences in the heart of the Himalayas
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Everest Base Camp',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600',
                description: 'Trek to the base of the world\'s highest mountain and witness breathtaking Himalayan vistas',
                duration: '14 Days',
                difficulty: 'Challenging',
                altitude: '5,364m',
                highlights: ['Sherpa Culture', 'Khumbu Icefall', 'Tengboche Monastery'],
                price: 'From $2,499'
              },
              {
                name: 'Kailash Mansarovar',
                image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=600',
                description: 'Sacred pilgrimage to the holy mountain revered by millions across different faiths',
                duration: '12 Days',
                difficulty: 'Moderate',
                altitude: '4,590m',
                highlights: ['Sacred Kora', 'Lake Mansarovar', 'Spiritual Journey'],
                price: 'From $1,899'
              },
              {
                name: 'Annapurna Circuit',
                image: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=600',
                description: 'Classic trek through diverse landscapes from subtropical forests to alpine deserts',
                duration: '16 Days',
                difficulty: 'Challenging',
                altitude: '5,416m',
                highlights: ['Thorong La Pass', 'Muktinath Temple', 'Diverse Cultures'],
                price: 'From $1,699'
              }
            ].map((destination, index) => (
              <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Price Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-900">
                      {destination.price}
                    </div>
                  </div>
                  
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                      destination.difficulty === 'Challenging'
                        ? 'bg-secondary/90 text-white'
                        : 'bg-primary/90 text-white'
                    }`}>
                      {destination.difficulty}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
                    <div className="flex items-center text-sm opacity-90">
                      <MapPin className="w-4 h-4 mr-1" />
                      Max Altitude: {destination.altitude}
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{destination.description}</p>
                  
                  {/* Highlights */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {destination.highlights.map((highlight, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {destination.duration}
                    </div>
                    <button className="bg-gradient-to-r from-primary to-primary-dark text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link
              to="/destinations"
              className="inline-flex items-center bg-gradient-to-r from-secondary to-secondary-dark text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              Explore All Destinations
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-earth-green rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-sky-blue rounded-full blur-3xl"></div>
        </div>
        
        <div className="section-container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Why Choose <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Zeo Tourism</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              With decades of experience and deep-rooted connections to Nepal's mountains and culture, we deliver authentic adventures that exceed expectations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Mountain,
                title: 'Local Expertise',
                description: 'Born in the mountains with generations of knowledge and authentic cultural connections',
                stat: '25+ Years',
                color: 'from-primary to-primary-dark'
              },
              {
                icon: Shield,
                title: 'Safety First',
                description: '100% safe with comprehensive insurance coverage and certified mountain guides',
                stat: '0 Incidents',
                color: 'from-secondary to-secondary-dark'
              },
              {
                icon: Star,
                title: 'Rated #1',
                description: '10,000+ happy travelers and consistently 5-star reviews across all platforms',
                stat: '4.9/5 Rating',
                color: 'from-primary to-primary-dark'
              },
              {
                icon: Target,
                title: 'Personalized',
                description: 'Customized itineraries tailored to your interests, fitness level, and dreams',
                stat: '100% Custom',
                color: 'from-secondary to-secondary-dark'
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-full">
                  {/* Icon with gradient background */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Stat Badge */}
                  <div className="text-center mb-4">
                    <div className={`inline-block bg-gradient-to-r ${feature.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                      {feature.stat}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                  
                  {/* Hover effect border */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="group">
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">10,000+</div>
                <div className="text-gray-600">Happy Travelers</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors">150+</div>
                <div className="text-gray-600">Destinations</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">25+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
              <div className="group">
                <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-secondary transition-colors">100%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white relative">
        <div className="section-container">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Quote className="w-4 h-4 mr-2" />
              What Our Travelers Say
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Stories from <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Amazing Adventures</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don't just take our word for it - hear from fellow adventurers who have experienced the magic of Nepal with us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                location: 'California, USA',
                trip: 'Everest Base Camp Trek',
                rating: 5,
                text: 'The most incredible experience of my life! The guides were knowledgeable, the scenery was breathtaking, and every detail was perfectly planned. Zeo Tourism made my dream come true.',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150'
              },
              {
                name: 'Michael Chen',
                location: 'Singapore',
                trip: 'Annapurna Circuit',
                rating: 5,
                text: 'Outstanding service from start to finish. The cultural immersion was authentic, and the mountain views were simply spectacular. I felt safe and well-cared for throughout the journey.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'
              },
              {
                name: 'Emma Thompson',
                location: 'London, UK',
                trip: 'Kailash Mansarovar',
                rating: 5,
                text: 'A spiritual journey that exceeded all expectations. The team\'s respect for local customs and their deep knowledge of the region made this pilgrimage truly transformative.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center">
                    <Quote className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Rating Stars */}
                <div className="flex justify-center mb-4 pt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed italic">"{testimonial.text}"</p>

                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <p className="text-xs text-sky-blue font-medium">{testimonial.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary-dark to-secondary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="section-container relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
              Ready for Your Next <span className="text-secondary-light">Adventure?</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Join thousands of adventurers who have discovered the magic of Nepal with Zeo Tourism. Your extraordinary journey awaits.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/destinations"
                className="bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl min-w-[200px]"
              >
                Start Planning
              </Link>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 min-w-[200px]"
              >
                Get Free Consultation
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <div className="grid md:grid-cols-3 gap-6 text-white/80">
                <div className="flex items-center justify-center">
                  <Phone className="w-5 h-5 mr-2" />
                  <span>+977-1-4123456</span>
                </div>
                <div className="flex items-center justify-center">
                  <Mail className="w-5 h-5 mr-2" />
                  <span>info@zeotourism.com</span>
                </div>
                <div className="flex items-center justify-center">
                  <Clock3 className="w-5 h-5 mr-2" />
                  <span>24/7 Support Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;