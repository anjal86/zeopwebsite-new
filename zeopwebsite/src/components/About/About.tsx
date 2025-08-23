import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Globe, Heart, Shield, Clock, Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  image: string;
  rating: number;
  text: string;
  tour: string;
}

const About: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      location: 'United States',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
      rating: 5,
      text: 'The Everest Base Camp trek was life-changing. The guides were incredibly knowledgeable and supportive throughout the journey.',
      tour: 'Everest Base Camp Trek'
    },
    {
      id: 2,
      name: 'Michael Chen',
      location: 'Canada',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
      rating: 5,
      text: 'Kailash Mansarovar Yatra was a deeply spiritual experience. Everything was perfectly organized, from permits to accommodation.',
      tour: 'Kailash Mansarovar'
    },
    {
      id: 3,
      name: 'Emma Wilson',
      location: 'United Kingdom',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
      rating: 5,
      text: 'The cultural immersion in Kathmandu was incredible. We experienced authentic local life and made memories to last a lifetime.',
      tour: 'Kathmandu Cultural Tour'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Travelers' },
    { icon: Globe, value: '50+', label: 'Destinations' },
    { icon: Award, value: '15+', label: 'Years Experience' },
    { icon: Shield, value: '100%', label: 'Safe & Secure' }
  ];

  const reasons = [
    {
      icon: Heart,
      title: 'Passionate Local Experts',
      description: 'Our guides are born in the mountains, carrying generations of wisdom and stories that bring each destination to life.'
    },
    {
      icon: Shield,
      title: 'Your Safety, Our Priority',
      description: 'With comprehensive insurance, emergency protocols, and experienced team members, we ensure your journey is worry-free.'
    },
    {
      icon: Globe,
      title: 'Authentic Cultural Immersion',
      description: 'We connect you with local communities, traditional ceremonies, and hidden gems that typical tourists never experience.'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'From the moment you book until you return home, our dedicated team is available round the clock for any assistance.'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sky-blue to-sky-blue-dark rounded-full mb-4">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-3xl font-serif font-bold text-gray-900 mb-6">
              Our Story Begins in the Mountains
            </h3>
            <div className="space-y-4 text-gray-600">
              <p>
                Born from a deep love for the Himalayas and its people, Zeo Tourism started as a dream 
                to share the transformative power of these sacred peaks with the world.
              </p>
              <p>
                Our founders, themselves children of the mountains, witnessed countless travelers 
                seeking authentic experiences but finding only commercialized tours. They knew there 
                was a better way – a way that honors both the traveler's journey and the local heritage.
              </p>
              <p>
                Today, we're proud to be Nepal's most trusted travel partner, but our mission remains 
                unchanged: to create journeys that touch hearts, challenge spirits, and leave both 
                travelers and communities better than before.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 bg-gradient-to-r from-sunrise-orange to-sunrise-orange-light text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Learn Our Full Story
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1523365280197-f1783db9fe62?q=80&w=500"
                alt="Mountain guide"
                className="rounded-2xl shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=500"
                alt="Trekking group"
                className="rounded-2xl shadow-lg mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=500"
                alt="Cultural experience"
                className="rounded-2xl shadow-lg -mt-4"
              />
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=500"
                alt="Mountain views"
                className="rounded-2xl shadow-lg mt-4"
              />
            </div>
            {/* Floating Badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white rounded-full shadow-xl p-4"
            >
              <Award className="w-12 h-12 text-gold-500" />
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-semibold whitespace-nowrap">
                Excellence Award
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Why Choose Us Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
        >
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sky-blue to-sky-blue-dark rounded-full mb-4">
                <reason.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{reason.title}</h4>
              <p className="text-gray-600 text-sm">{reason.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials */}
        <div className="mb-20">
          <motion.h3
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-serif font-bold text-center text-gray-900 mb-12"
          >
            Stories from Our Travelers
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-lg p-6 relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-sky-blue/20" />
                
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-3"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <p className="text-gray-600 mb-3">{testimonial.text}</p>
                
                <p className="text-sm text-sky-blue font-medium">{testimonial.tour}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center bg-gradient-to-r from-sky-blue to-sky-blue-dark rounded-3xl p-12 text-white"
        >
          <h3 className="text-3xl font-serif font-bold mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of travelers who've discovered the magic of the Himalayas with us. 
            Your adventure of a lifetime awaits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-sky-blue-dark px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Planning
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Download Brochure
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
