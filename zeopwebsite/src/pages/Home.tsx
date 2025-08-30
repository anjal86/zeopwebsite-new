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
import FeaturedDestinations from '../components/FeaturedDestinations/FeaturedDestinations';
import { useCountUp } from '../hooks/useCountUp';
import { useDestinations } from '../hooks/useApi';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

// Animated Counter Component
const AnimatedCounter: React.FC<{
  end: number;
  suffix?: string;
  prefix?: string;
  label: string;
  duration?: number;
}> = ({ end, suffix = '', prefix = '', label, duration = 2500 }) => {
  const { count, ref } = useCountUp({
    end,
    suffix,
    prefix,
    duration,
    start: 0
  });

  return (
    <div ref={ref} className="group">
      <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
        {count}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Hero />
      
      {/* Quick Services Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
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
                    <div className="text-sm text-gray-400">14 Destinations</div>
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
                    <div className="text-sm text-gray-400">9 Tours</div>
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
      <FeaturedDestinations />
      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
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
              <AnimatedCounter
                end={1500}
                suffix="+"
                label="Happy Travelers"
                duration={3000}
              />
              <AnimatedCounter
                end={14}
                suffix=""
                label="Destinations"
                duration={2500}
              />
              <AnimatedCounter
                end={5}
                suffix="+"
                label="Years Experience"
                duration={2000}
              />
              <AnimatedCounter
                end={98}
                suffix="%"
                label="Satisfaction Rate"
                duration={2800}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl"></div>
        </div>

        <div className="section-container relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Quote className="w-4 h-4 mr-2" />
              Testimonials
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              What Our Traveler Say About <br />
              <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Our Tour Services</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                name: 'Sarah Johnson',
                title: 'Adventure Enthusiast',
                rating: 5,
                text: 'To take a trivial example which of us ever undertakes laborious physical exercise except to obtain advantage from has any right to find fault with man.',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'Michael Chen',
                title: 'Travel Blogger',
                rating: 5,
                text: 'To take a trivial example which of us ever undertakes laborious physical exercise except to obtain advantage from has any right to find fault with man.',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop&crop=face'
              },
              {
                name: 'Emma Thompson',
                title: 'Photography Expert',
                rating: 5,
                text: 'To take a trivial example which of us ever undertakes laborious physical exercise except to obtain advantage from has any right to find fault with man.',
                image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&h=150&fit=crop&crop=face'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 relative group">
                {/* Large Quote Icon */}
                <div className="mb-6">
                  <Quote className="w-16 h-16 text-primary/20 transform rotate-180" />
                </div>

                {/* Service Title */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Services</h3>
                  
                  {/* Rating Stars */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed">{testimonial.text}</p>

                <div className="flex items-center">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-gray-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
            <div className="w-3 h-3 bg-primary/30 rounded-full"></div>
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