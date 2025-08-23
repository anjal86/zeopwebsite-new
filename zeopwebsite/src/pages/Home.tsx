import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero/Hero';

const Home: React.FC = () => {
  return (
    <div className="home-page">
      <Hero />
      
      {/* Quick Services Section */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Plan Your Perfect <span className="text-gradient">Adventure</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our most popular services designed to create unforgettable experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-blue to-sky-blue-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Explore Destinations</h3>
              <p className="text-gray-600 mb-4">Discover breathtaking locations from Everest to sacred valleys</p>
              <Link to="/destinations" className="text-sky-blue font-semibold hover:underline">
                View All Destinations →
              </Link>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-sunrise-orange to-sunrise-orange-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Book Tours</h3>
              <p className="text-gray-600 mb-4">Choose from expertly crafted tours and adventures</p>
              <Link to="/tours" className="text-sunrise-orange font-semibold hover:underline">
                Browse Tours →
              </Link>
            </div>
            
            <div className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-earth-green to-earth-green-light rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Expert Advice</h3>
              <p className="text-gray-600 mb-4">Connect with our travel experts for personalized planning</p>
              <Link to="/contact" className="text-earth-green font-semibold hover:underline">
                Contact Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Preview */}
      <section className="py-16 bg-gray-50">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Featured <span className="text-gradient">Destinations</span>
            </h2>
            <p className="text-lg text-gray-600">
              Handpicked destinations that offer the most authentic experiences
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Everest Base Camp',
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=500',
                description: 'Trek to the base of the world\'s highest mountain',
                duration: '14 Days',
                difficulty: 'Challenging'
              },
              {
                name: 'Kailash Mansarovar',
                image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=500',
                description: 'Sacred pilgrimage to the holy mountain',
                duration: '12 Days',
                difficulty: 'Moderate'
              },
              {
                name: 'Annapurna Circuit',
                image: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=500',
                description: 'Classic trek through diverse landscapes',
                duration: '16 Days',
                difficulty: 'Challenging'
              }
            ].map((destination, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">{destination.name}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Duration: {destination.duration}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      destination.difficulty === 'Challenging' 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {destination.difficulty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/destinations"
              className="bg-gradient-to-r from-sky-blue to-sky-blue-dark text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 inline-block"
            >
              Explore All Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Why Choose <span className="text-gradient">Zeo Tourism</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🏔️',
                title: 'Local Expertise',
                description: 'Born in the mountains with generations of knowledge'
              },
              {
                icon: '🛡️',
                title: 'Safety First',
                description: '100% safe with comprehensive insurance coverage'
              },
              {
                icon: '⭐',
                title: 'Rated #1',
                description: '10,000+ happy travelers and 5-star reviews'
              },
              {
                icon: '🎯',
                title: 'Personalized',
                description: 'Customized itineraries for your perfect adventure'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;