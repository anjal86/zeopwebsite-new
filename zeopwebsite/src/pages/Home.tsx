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
  Phone,
  Mail,
  Clock3
} from 'lucide-react';
import SEO from '../components/SEO/SEO';
import Hero from '../components/Hero/Hero';
import FeaturedDestinations from '../components/FeaturedDestinations/FeaturedDestinations';
import TestimonialsSlider from '../components/Testimonials/TestimonialsSlider';
import { useCountUp } from '../hooks/useCountUp';
import { useContact } from '../hooks/useApi';
import { createOrganizationSchema, createWebSiteSchema, createLocalBusinessSchema } from '../utils/schema';

// Animated Counter Component
const AnimatedCounter: React.FC<{
  end: number;
  suffix?: string;
  label: string;
  duration?: number;
}> = ({ end, suffix = '', label, duration = 2500 }) => {
  const { count, ref } = useCountUp({
    end,
    suffix,
    duration,
    start: 0
  });

  return (
    <div ref={ref} className="group text-center">
      <div className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-primary transition-colors duration-300">
        {count}
      </div>
      <div className="text-xs xs:text-sm sm:text-base text-gray-600">{label}</div>
    </div>
  );
};

const Home: React.FC = () => {
  const { data: contactInfo } = useContact();
  
  // Create structured data for the homepage
  const organizationSchema = createOrganizationSchema();
  const websiteSchema = createWebSiteSchema();
  const localBusinessSchema = createLocalBusinessSchema();
  
  return (
    <>
      <SEO
        title="Zeo Tourism - Nepal Tours, Travel & Holiday Packages"
        description="Discover Nepal with Zeo Tourism. Customized tour packages, cultural holidays, adventure travel, and spiritual journeys. 25+ years of Nepal travel expertise."
        keywords="Nepal tours, Nepal travel packages, Nepal holidays, cultural tours Nepal, adventure travel, spiritual journeys, luxury travel Nepal, Nepal vacation packages, tour operator Nepal"
        url="https://zeotourism.com"
        type="website"
        structuredData={[organizationSchema, websiteSchema, localBusinessSchema]}
      />
      
      <div className="home-page">
        <Hero />
      
      {/* Quick Services Section */}
      <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-64 sm:w-96 h-64 sm:h-96 bg-primary rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-64 sm:w-96 h-64 sm:h-96 bg-secondary rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="section-container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Start Your Journey
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 sm:mb-6 px-2">
              Plan Your Perfect <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Adventure</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
              From majestic mountain peaks to sacred spiritual journeys, discover Nepal's most extraordinary experiences with our expert guidance
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group relative">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                <div className="absolute -top-4 left-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
                <div className="pt-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Explore Destinations</h3>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed flex-grow">Discover breathtaking locations from the towering peaks of Everest to the sacred valleys of ancient Nepal</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
                    <Link to="/destinations" className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors group">
                      View All Destinations
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                <div className="absolute -top-4 left-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
                <div className="pt-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Book Tours</h3>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed flex-grow">Choose from expertly crafted tours and adventures designed to create memories that last a lifetime</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
                    <Link to="/tours" className="inline-flex items-center text-secondary font-semibold hover:text-secondary-dark transition-colors group">
                      Browse Tours
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="group relative sm:col-span-2 lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col">
                <div className="absolute -top-4 left-6">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
                <div className="pt-6 flex flex-col flex-grow">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">Expert Consultation</h3>
                  <p className="text-base text-gray-600 mb-6 leading-relaxed flex-grow">Connect with our travel experts for personalized planning and insider knowledge of Nepal's hidden gems</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
                    <Link to="/contact" className="inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors group">
                      Contact Us
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
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
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="section-container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4 mr-2" />
              Why Choose Us
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 px-2">
              Why Choose <span className="text-gradient bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Zeo Tourism</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2 sm:px-4">
              With decades of experience and deep-rooted connections to Nepal's mountains and culture, we deliver authentic adventures that exceed expectations
            </p>
          </div>
          
          {/* Mobile-First Feature Cards */}
          <div className="space-y-6 sm:space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 lg:grid-cols-4">
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
                description: 'Comprehensive safety protocols with certified guides, 24/7 medical support, and advanced equipment',
                stat: 'Top Safety',
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
                {/* Mobile: Horizontal Card Layout */}
                <div className="md:hidden bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                        <div className={`bg-gradient-to-r ${feature.color} text-white px-2 py-1 rounded-full text-xs font-bold`}>
                          {feature.stat}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>

                {/* Desktop: Vertical Card Layout */}
                <div className="hidden md:block bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 h-full">
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  
                  <div className="text-center mb-4">
                    <div className={`inline-block bg-gradient-to-r ${feature.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                      {feature.stat}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-base text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                  
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Trust Indicators */}
          {/* Trust Indicators - Mobile Optimized */}
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
              <div className="flex-1 min-w-[120px] max-w-[200px] text-center">
                <AnimatedCounter
                  end={1500}
                  suffix="+"
                  label="Happy Travelers"
                  duration={3000}
                />
              </div>
              <div className="flex-1 min-w-[120px] max-w-[200px] text-center">
                <AnimatedCounter
                  end={14}
                  suffix=""
                  label="Destinations"
                  duration={2500}
                />
              </div>
              <div className="flex-1 min-w-[120px] max-w-[200px] text-center">
                <AnimatedCounter
                  end={25}
                  suffix="+"
                  label="Years Experience"
                  duration={2000}
                />
              </div>
              <div className="flex-1 min-w-[120px] max-w-[200px] text-center">
                <AnimatedCounter
                  end={98}
                  suffix="%"
                  label="Satisfaction Rate"
                  duration={2800}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Testimonials Slider */}
      <TestimonialsSlider />

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-primary via-primary-dark to-secondary relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black/20"></div>
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="section-container relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 px-2">
              Ready for Your Next <span className="text-secondary-light">Adventure?</span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-10 leading-relaxed px-2">
              Join thousands of adventurers who have discovered the magic of Nepal with Zeo Tourism. Your extraordinary journey awaits.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-2">
              <Link
                to="/destinations"
                className="w-full sm:w-auto bg-white text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl min-w-[200px] text-center"
              >
                Start Planning
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 min-w-[200px] text-center"
              >
                Get Free Consultation
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-10 sm:mt-12 pt-8 border-t border-white/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-white/80">
                <div className="flex items-center justify-center text-base">
                  <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">{contactInfo?.contact.phone.primary || '+977-1-4123456'}</span>
                </div>
                <div className="flex items-center justify-center text-base">
                  <Mail className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">{contactInfo?.contact.email.primary || 'info@zeotourism.com'}</span>
                </div>
                <div className="flex items-center justify-center text-base">
                  <Clock3 className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">{contactInfo?.business.support.availability || '24/7 Support Available'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;
