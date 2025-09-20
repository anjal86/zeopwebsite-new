import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Globe, Award, ArrowRight, Play, Users, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const coreValues = [
    {
      icon: Heart,
      title: 'Authentic Experiences',
      description: 'We create genuine connections with local cultures and communities.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our top priority with certified guides and protocols.'
    },
    {
      icon: Globe,
      title: 'Sustainable Travel',
      description: 'We protect the environments and communities we visit.'
    }
  ];

  const achievements = [
    { number: '25+', label: 'Years Experience' },
    { number: '15K+', label: 'Happy Travelers' },
    { number: '50+', label: 'Destinations' },
    { number: '4.9', label: 'Average Rating' }
  ];

  return (
    <div className="bg-white">
      {/* Stats Section - Clean */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section - Minimal */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8">
                Born in the
                <span className="block text-primary">Mountains</span>
              </h2>
              
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Zeo Tourism began with a simple belief: travel should transform both the traveler and the places they visit. Founded by mountain guides who grew up in the shadow of the Himalayas, we understand the profound connection between people and places.
                </p>
                <p>
                  Today, we've expanded beyond Nepal to offer authentic experiences across Asia and the Middle East, always maintaining our commitment to responsible tourism and genuine cultural exchange.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {[
                  'Local expertise and authentic experiences',
                  'Sustainable and responsible tourism',
                  'Safety-first approach with certified guides'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=800&auto=format&fit=crop"
                  alt="Mountain landscape"
                  className="rounded-3xl shadow-2xl w-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
              </div>
              
              {/* Floating Award Badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Excellence Award</div>
                    <div className="text-sm text-gray-600">Travel Industry 2024</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section - Clean Grid */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from planning your journey to ensuring lasting positive impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section - Single Featured */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex justify-center mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
              ))}
            </div>
            
            <blockquote className="text-2xl sm:text-3xl font-serif text-gray-900 mb-8 leading-relaxed">
              "Zeo Tourism didn't just show us Nepal – they helped us understand it. The cultural immersion and personal connections we made will stay with us forever."
            </blockquote>
            
            <div className="flex items-center justify-center space-x-4">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop&crop=face"
                alt="Sarah Johnson"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="font-semibold text-gray-900">Sarah Johnson</div>
                <div className="text-gray-600">Everest Base Camp Trek</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Minimal */}
      <section className="py-24 bg-gradient-to-br from-primary to-primary-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-8">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Let us craft a journey that will exceed your expectations and create memories to last a lifetime.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-primary px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Planning Today
              </Link>
              <Link
                to="/tours"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-primary transition-all duration-300"
              >
                Browse Our Tours
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
