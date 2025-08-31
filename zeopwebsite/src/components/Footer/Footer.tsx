import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mountain, Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useContact } from '../../hooks/useApi';

const Footer: React.FC = () => {
  const { data: contactInfo } = useContact();
  const footerLinks = {
    destinations: [
      { name: 'Everest Base Camp', href: '#' },
      { name: 'Kailash Mansarovar', href: '#' },
      { name: 'Annapurna Circuit', href: '#' },
      { name: 'Kathmandu Valley', href: '#' },
      { name: 'Langtang Valley', href: '#' },
      { name: 'Pokhara', href: '#' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '#' },
      { name: 'Testimonials', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '/contact' }
    ],
    support: [
      { name: 'Travel Insurance', href: '#' },
      { name: 'Visa Information', href: '#' },
      { name: 'Packing List', href: '#' },
      { name: 'Health & Safety', href: '#' },
      { name: 'FAQs', href: '#' },
      { name: 'Terms & Conditions', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: contactInfo?.social.facebook || '#', label: 'Facebook' },
    { icon: Instagram, href: contactInfo?.social.instagram || '#', label: 'Instagram' },
    { icon: Twitter, href: contactInfo?.social.twitter || '#', label: 'Twitter' },
    { icon: Youtube, href: contactInfo?.social.youtube || '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link to="/" className="flex items-center mb-4 hover:opacity-80 transition-opacity">
                  <img
                    src="/logo/zeo-logo-white.png"
                    alt="Zeo Tourism Logo"
                    className="h-12 w-auto"
                  />
                </Link>
                <p className="text-gray-400 mb-6 max-w-sm">
                  {contactInfo?.company.description || 'Your trusted partner for authentic Himalayan adventures. Creating memories that last a lifetime since 2009.'}
                </p>
                
                {/* Contact Info */}
                <div className="space-y-3 mb-6">
                  <a href={`tel:${contactInfo?.contact.phone.primary || '+9779851234567'}`} className="flex items-center text-gray-400 hover:text-sky-blue transition-colors">
                    <Phone className="w-4 h-4 mr-2" />
                    {contactInfo?.contact.phone.display || '+977 985 123 4567'}
                  </a>
                  <a href={`mailto:${contactInfo?.contact.email.primary || 'info@zeotourism.com'}`} className="flex items-center text-gray-400 hover:text-sky-blue transition-colors">
                    <Mail className="w-4 h-4 mr-2" />
                    {contactInfo?.contact.email.primary || 'info@zeotourism.com'}
                  </a>
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    {contactInfo?.contact.address.full || 'Thamel, Kathmandu, Nepal'}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-blue transition-all duration-300"
                    >
                      <social.icon className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Destinations Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-lg font-semibold mb-4">Popular Destinations</h4>
                <ul className="space-y-2">
                  {footerLinks.destinations.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-sky-blue transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Company Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-lg font-semibold mb-4">Company</h4>
                <ul className="space-y-2">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      {link.href.startsWith('/') ? (
                        <Link
                          to={link.href}
                          className="text-gray-400 hover:text-sky-blue transition-colors duration-300 text-sm"
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          className="text-gray-400 hover:text-sky-blue transition-colors duration-300 text-sm"
                        >
                          {link.name}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* Support Links */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h4 className="text-lg font-semibold mb-4">Support</h4>
                <ul className="space-y-2">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-sky-blue transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-8 border-t border-gray-800"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Get the latest travel tips and exclusive offers delivered to your inbox</p>
            </div>
            <form className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-sky-blue transition-all duration-300"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-sky-blue to-sky-blue-dark px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 {contactInfo?.company.name || 'Zeo Tourism'}. All rights reserved. | Crafted with{' '}
              <Heart className="w-4 h-4 inline text-red-500 fill-current" /> in Nepal
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-sky-blue transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-blue transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-sky-blue transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
