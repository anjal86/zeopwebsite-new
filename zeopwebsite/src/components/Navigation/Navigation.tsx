import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Phone, MessageCircle
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useContact } from '../../hooks/useApi';
import { useLogos } from '../../hooks/useLogos';
import ContactModal from '../UI/ContactModal';
import headerLogo from '../../assets/zeo-logo.png';

interface NavItem {
  label: string;
  href: string;
}

const Navigation: React.FC = () => {
  const { data: contactInfo } = useContact();
  const { logos } = useLogos();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: 'Home',
      href: '/'
    },
    {
      label: 'Destinations',
      href: '/destinations'
    },
    {
      label: 'Tours',
      href: '/tours'
    },
    {
      label: 'Kailash Mansarovar',
      href: '/kailash-mansarovar'
    },
    {
      label: 'About',
      href: '/about'
    },
    {
      label: 'Contact',
      href: '/contact'
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname === href) return true;
    return false;
  };



  return (
    <>
      {/* Simplified Main Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-b ${isScrolled
          ? 'bg-white border-gray-200'
          : 'bg-white border-gray-100'
          }`}
      >
        <div className={`transition-all duration-300 ease-out ${isScrolled ? 'px-4 lg:px-8' : 'px-6'
          }`}>
          <div className="flex items-center justify-between h-20 py-2">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" onClick={handleNavClick}>
                <img
                  src={logos?.header || headerLogo}
                  alt="Zeo Tourism Logo"
                  className="h-10 xl:h-12 2xl:h-16 w-auto hover:scale-105 transition-transform duration-300 cursor-pointer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = headerLogo;
                  }}
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center space-x-0">
              {navItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    onClick={handleNavClick}
                    className={`font-semibold transition-all duration-300 relative py-2.5 xl:px-3 2xl:px-5 rounded-none xl:text-sm 2xl:text-base group whitespace-nowrap ${isActiveRoute(item.href)
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50/80'
                      } ${item.label === 'Kailash Mansarovar' ? 'text-secondary-dark !bg-secondary/10 hover:!bg-secondary/20' : ''}`}
                  >
                    {item.label}
                    {isActiveRoute(item.href) && !(item.label === 'Kailash Mansarovar') && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-primary rounded-none"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons & WhatsApp */}
            <div className="hidden xl:flex items-center xl:space-x-3 2xl:space-x-5">
              {/* WhatsApp Link - Redesigned as Pill */}
              <motion.a
                href={`https://wa.me/${contactInfo?.contact?.phone?.whatsapp?.replace(/[^0-9]/g, '') || '9779705246799'}`}
                target="_blank"
                rel="noopener noreferrer"
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5 xl:gap-2 2xl:gap-3 xl:px-3 2xl:px-5 py-2 rounded-none border border-green-100/50 hover:border-green-200/50 transition-all duration-300 group xl:h-10 2xl:h-11"
              >
                <div className="bg-green-500 p-1.5 rounded-none text-white group-hover:scale-110 transition-all duration-300">
                  <FaWhatsapp className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold xl:text-sm 2xl:text-base text-gray-700 group-hover:text-green-600 transition-colors duration-300 whitespace-nowrap">
                  {contactInfo?.contact?.phone?.whatsapp || '+9779705246799'}
                </span>
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowContactModal(true)}
                className="bg-secondary xl:px-4 2xl:px-7 py-2 rounded-none text-white font-bold transition-all duration-300 flex items-center gap-2 relative overflow-hidden group xl:h-10 2xl:h-11 ring-2 ring-secondary/10 ring-offset-1 whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10 xl:text-sm 2xl:text-base">Enquire Now</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="xl:hidden flex p-2 rounded-lg transition-all duration-300 text-gray-900 hover:bg-gray-100 flex-shrink-0"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="block border-t bg-white border-gray-200"
            >
              <div className="px-4 py-6">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to={item.href}
                        onClick={handleNavClick}
                        className={`block py-3.5 px-5 font-bold transition-all duration-300 rounded-none ${isActiveRoute(item.href)
                          ? 'text-primary bg-primary/5 shadow-sm'
                          : 'text-gray-800 hover:text-primary hover:bg-gray-50'
                          } ${item.label === 'Kailash Mansarovar' ? 'text-secondary-dark !bg-secondary/10' : ''}`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile Contact & CTA */}
                <div className="mt-8 pt-8 border-t space-y-4 border-gray-100">
                  <div className="grid grid-cols-2 gap-3">
                    <motion.a
                      href={`tel:${contactInfo?.contact?.phone?.primary?.replace(/[^0-9+]/g, '') || '+9779851234567'}`}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-none bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all duration-300 border border-gray-100"
                    >
                      <Phone className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold whitespace-nowrap">Call Us</span>
                    </motion.a>

                    <motion.a
                      href={`https://wa.me/${contactInfo?.contact?.phone?.whatsapp?.replace(/[^0-9]/g, '') || '9779705246799'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center justify-center gap-2 py-3.5 rounded-none bg-green-50 text-green-700 hover:bg-green-100 transition-all duration-300 border border-green-100"
                    >
                      <FaWhatsapp className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-bold whitespace-nowrap">WhatsApp</span>
                    </motion.a>
                  </div>

                  {/* Mobile Enquire Now Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowContactModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-secondary via-secondary/95 to-secondary-dark px-6 py-4 rounded-none text-white font-bold shadow-xl shadow-secondary/10 hover:shadow-secondary/20 transition-all duration-300 w-full flex items-center justify-center gap-2 border border-secondary/20"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Enquire Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Contact Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </>
  );
};

export default Navigation;
