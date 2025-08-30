import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, Phone, Mail, MapPin, Calendar, LogIn
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
}

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      label: 'Activities',
      href: '/activities'
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
      {/* Enhanced Top Info Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isScrolled ? 0 : 1, y: isScrolled ? -20 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 bg-gradient-to-r from-primary/95 to-primary-dark/95 backdrop-blur-md text-white text-xs py-3 z-40 border-b border-white/10"
      >
        <div className="section-container">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <motion.a
                href="mailto:info@zeotourism.com"
                whileHover={{ scale: 1.05 }}
                className="flex items-center hover:text-secondary transition-colors duration-300"
              >
                <Mail className="w-3 h-3 mr-2" />
                <span className="hidden sm:inline font-medium">info@zeotourism.com</span>
              </motion.a>
              <motion.a
                href="tel:+9779851234567"
                whileHover={{ scale: 1.05 }}
                className="flex items-center hover:text-secondary transition-colors duration-300"
              >
                <Phone className="w-3 h-3 mr-2" />
                <span className="hidden sm:inline font-medium">+977 985-123-4567</span>
              </motion.a>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-2 text-secondary" />
                <span className="font-medium">Kathmandu, Nepal</span>
              </div>
              {/* Login Text in Top Bar */}
              <Link to="/admin/login">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center hover:text-secondary transition-colors duration-300 cursor-pointer"
                >
                  <LogIn className="w-3 h-3 mr-2" />
                  <span className="font-medium text-xs">Login</span>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Main Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed left-0 right-0 z-50"
        style={{
          top: isScrolled ? '0px' : 'calc(12px + 0.75rem + 16px)',
          marginLeft: isScrolled ? '0px' : window.innerWidth < 768 ? '16px' : '64px',
          marginRight: isScrolled ? '0px' : window.innerWidth < 768 ? '16px' : '64px',
          borderRadius: isScrolled ? '0px' : '0px 0px 16px 16px',
          backgroundColor: 'rgb(255, 255, 255)',
          boxShadow: isScrolled
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderBottom: isScrolled ? '1px solid rgb(243, 244, 246)' : 'none',
          transition: 'all 0.3s ease-out'
        }}
      >
        <div
          className="transition-all duration-300 ease-out"
          style={{
            paddingLeft: isScrolled ? 'max(1rem, calc(50% - 720px))' : '24px',
            paddingRight: isScrolled ? 'max(1rem, calc(50% - 720px))' : '24px',
            minHeight: '60px'
          }}
        >
          <div className="flex items-center justify-between h-15 py-3">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" onClick={handleNavClick}>
                <img
                  src="/logo/zeo-logo.png"
                  alt="Zeo Tourism Logo"
                  className="h-10 w-auto drop-shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden min-[1280px]:flex items-center space-x-0">
              {navItems.map((item) => (
                <motion.div
                  key={item.label}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.href}
                    onClick={handleNavClick}
                    className={`font-medium transition-all duration-300 relative py-2 px-3 whitespace-nowrap text-sm ${
                      isActiveRoute(item.href)
                        ? 'text-primary'
                        : 'text-gray-700 hover:text-primary'
                    } ${item.label === 'Kailash Mansarovar' ? 'text-secondary font-semibold' : ''}`}
                  >
                    {item.label}
                    {isActiveRoute(item.href) && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute -bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden min-[1280px]:flex items-center flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-secondary via-secondary-light to-secondary px-4 py-2 rounded-full text-white font-semibold hover:shadow-2xl transition-all duration-300 flex items-center gap-2 relative overflow-hidden group whitespace-nowrap text-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-secondary-light to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Calendar className="w-4 h-4 relative z-10" />
                <span className="relative z-10">Plan Your Trip</span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/30 rounded-full animate-ping"></div>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="max-[1279px]:flex hidden p-1.5 rounded-lg transition-all duration-300 text-gray-900 hover:bg-gray-100 flex-shrink-0"
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
              className="max-[1279px]:block hidden border-t bg-white border-gray-200"
            >
              <div className="section-container py-6">
                <nav className="space-y-1">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ x: 5 }}
                    >
                      <Link
                        to={item.href}
                        onClick={handleNavClick}
                        className={`block py-3 px-4 font-medium transition-all duration-300 ${
                          isActiveRoute(item.href)
                            ? 'text-primary'
                            : 'text-gray-900 hover:text-primary'
                        } ${item.label === 'Kailash Mansarovar' ? 'text-secondary font-semibold' : ''}`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                
                {/* Mobile Contact & CTA */}
                <div className="mt-6 pt-6 border-t space-y-3 border-gray-200">
                  <div className="flex items-center justify-center gap-2 py-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">+977 985-123-4567</span>
                  </div>
                  
                  {/* Mobile Plan Your Trip Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-gradient-to-r from-secondary to-secondary-light px-6 py-3 rounded-full text-white font-semibold hover:shadow-lg transition-all duration-300 w-full flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Plan Your Trip
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navigation;
