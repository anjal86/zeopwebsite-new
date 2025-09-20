import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Heart, ExternalLink } from 'lucide-react';
import { useContact } from '../../hooks/useApi';
import { useLogos } from '../../hooks/useLogos';

const Footer: React.FC = () => {
  const { data: contactInfo } = useContact();
  const { logos } = useLogos();
  const footerLinks = {
    destinations: [
      { name: 'Everest Base Camp', href: '/tours/everest-base-camp-trek' },
      { name: 'Kailash Mansarovar', href: '/kailash-mansarovar' },
      { name: 'Annapurna Circuit', href: '/tours/annapurna-circuit-trek' },
      { name: 'All Destinations', href: '/destinations' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Tours', href: '/tours' },
      { name: 'Contact', href: '/contact' }
    ],
    support: [
      { name: 'Trip Planning', href: '/trip-planning' },
      { name: 'Activities', href: '/activities' },
      { name: 'Help Center', href: '/contact' }
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
        <div className="py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link to="/" className="flex items-center mb-4 hover:opacity-80 transition-opacity">
                  <img
                    src={logos?.footer || "/src/assets/zeo-logo-white.png"}
                    alt="Zeo Tourism Logo"
                    className="h-10 w-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/src/assets/zeo-logo-white.png";
                    }}
                  />
                </Link>
                <p className="text-gray-400 mb-6 max-w-sm text-sm">
                  Your trusted partner for Nepal tours and spiritual journeys since 2000.
                </p>
                
                {/* Contact Info */}
                <div className="space-y-2 mb-6">
                  <a href={`tel:${contactInfo?.contact.phone.primary || '+9779851234567'}`} className="flex items-center text-gray-400 hover:text-sky-blue transition-colors text-sm">
                    <Phone className="w-4 h-4 mr-2" />
                    {contactInfo?.contact.phone.primary || '+977 985 123 4567'}
                  </a>
                  <a href={`mailto:${contactInfo?.contact.email.primary || 'info@zeotourism.com'}`} className="flex items-center text-gray-400 hover:text-sky-blue transition-colors text-sm">
                    <Mail className="w-4 h-4 mr-2" />
                    {contactInfo?.contact.email.primary || 'info@zeotourism.com'}
                  </a>
                  <div className="flex items-center text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {contactInfo?.contact.address.full || 'Thamel, Kathmandu, Nepal'}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-3">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-sky-blue transition-all duration-300"
                    >
                      <social.icon className="w-4 h-4" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Popular Destinations */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-lg font-semibold mb-4">Popular Tours</h4>
                <ul className="space-y-2">
                  {footerLinks.destinations.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-sky-blue transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
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
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-sky-blue transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
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
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-sky-blue transition-colors duration-300 text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 {contactInfo?.company.name || 'Zeo Tourism'}. All rights reserved. | Crafted with{' '}
              <Heart className="w-4 h-4 inline text-red-500 fill-current" /> in Nepal
            </p>
            <div className="flex items-center text-gray-400 text-sm">
              <span>Developed by</span>
              <a
                href="https://brandspire.com.np/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center ml-2 hover:text-sky-blue transition-colors group"
              >
                <img
                  src="https://www.google.com/s2/favicons?domain=brandspire.com.np&sz=16"
                  alt="Brandspire Favicon"
                  className="w-4 h-4 mr-2"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    // Try alternative favicon URLs
                    if (img.src.includes('google.com')) {
                      img.src = 'https://brandspire.com.np/favicon.ico';
                    } else if (img.src.includes('favicon.ico')) {
                      img.src = 'https://brandspire.com.np/assets/favicon.png';
                    } else {
                      // Create a simple icon as final fallback
                      img.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'w-4 h-4 mr-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-sm flex items-center justify-center flex-shrink-0';
                      fallback.innerHTML = '<span class="text-white text-xs font-bold">B</span>';
                      img.parentNode?.insertBefore(fallback, img);
                    }
                  }}
                />
                <span className="font-medium">Brandspire Creatives</span>
                <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
