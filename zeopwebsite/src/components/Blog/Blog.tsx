import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  featured?: boolean;
}

const Blog: React.FC = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'Essential Guide to Everest Base Camp Trek',
      excerpt: 'Everything you need to know before embarking on the journey of a lifetime to the base of the world\'s highest mountain.',
      image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2070',
      author: 'Pemba Sherpa',
      date: 'March 15, 2024',
      readTime: '8 min read',
      category: 'Trekking Tips',
      featured: true
    },
    {
      id: 2,
      title: 'Sacred Journey: Understanding Kailash Mansarovar',
      excerpt: 'Discover the spiritual significance and practical aspects of this holy pilgrimage that attracts thousands each year.',
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=2070',
      author: 'Tenzin Norbu',
      date: 'March 10, 2024',
      readTime: '6 min read',
      category: 'Spiritual Journeys'
    },
    {
      id: 3,
      title: 'Best Time to Visit Nepal: A Seasonal Guide',
      excerpt: 'From clear mountain views to vibrant festivals, learn when to plan your Nepal adventure for the best experience.',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070',
      author: 'Maya Gurung',
      date: 'March 5, 2024',
      readTime: '5 min read',
      category: 'Travel Planning'
    },
    {
      id: 4,
      title: 'Altitude Sickness: Prevention and Management',
      excerpt: 'Expert advice on recognizing, preventing, and dealing with altitude sickness during high-altitude treks.',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070',
      author: 'Dr. Ang Dorje',
      date: 'February 28, 2024',
      readTime: '7 min read',
      category: 'Health & Safety'
    }
  ];

  return (
    <section id="blog" className="py-20 bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-earth-green/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-sky-blue/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-earth-green mr-2" />
            <span className="text-earth-green font-semibold text-lg">Travel Inspirations</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Stories & <span className="text-gradient">Insights</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dive into travel guides, tips, and inspiring stories from the mountains to help you plan your perfect adventure
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            {blogPosts.filter(post => post.featured).map(post => (
              <motion.article
                key={post.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
              >
                <div className="relative h-96 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  
                  {/* Featured Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="bg-gradient-to-r from-sunrise-orange to-sunrise-orange-light text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Featured Article
                    </span>
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                        {post.category}
                      </span>
                      <span className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif font-bold mb-3">
                      {post.title}
                    </h3>
                    <p className="text-white/90 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center text-sm">
                          <User className="w-4 h-4 mr-1" />
                          {post.author}
                        </span>
                        <span className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {post.date}
                        </span>
                      </div>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center text-white font-semibold group/btn"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Recent Posts */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">
              Recent Articles
            </h3>
            {blogPosts.filter(post => !post.featured).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ x: 10 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex">
                  <div className="w-1/3 relative overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <span className="text-xs text-earth-green font-semibold">
                      {post.category}
                    </span>
                    <h4 className="text-lg font-semibold text-gray-900 mt-1 mb-2 line-clamp-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center text-xs text-gray-500 space-x-3">
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {post.author}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* View All Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-earth-green to-earth-green-light text-white py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              View All Articles
            </motion.button>
          </motion.div>
        </div>

        {/* Newsletter Subscription */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-gradient-to-r from-earth-green to-earth-green-light rounded-3xl p-12 text-white text-center"
        >
          <h3 className="text-3xl font-serif font-bold mb-4">
            Get Travel Inspiration Delivered
          </h3>
          <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
            Subscribe to our newsletter for exclusive travel tips, destination guides, and special offers
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:bg-white/30 transition-all duration-300"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-earth-green px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Subscribe
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Blog;
