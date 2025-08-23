import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, MapPin, Calendar, Users } from 'lucide-react';
import { useSliders } from '../../hooks/useApi';
import LoadingSpinner from '../UI/LoadingSpinner';
import type { Slider } from '../../services/api';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Fetch sliders from API
  const { data: slides, loading, error } = useSliders();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    const currentSlideData = slides[currentSlide];
    const duration = currentSlideData.video ? 40000 : 10000; // 40s for video, 10s for photos
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearInterval(interval);
  }, [slides, currentSlide]);

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: {
        duration: 0.5
      }
    }
  };

  const staggerChildren = {
    visible: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Loading state
  if (loading) {
    return (
      <section id="home" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-24 bg-black">
        <LoadingSpinner size="lg" className="text-white" />
      </section>
    );
  }

  // Error state
  if (error || !slides || slides.length === 0) {
    return (
      <section id="home" className="relative min-h-screen w-full overflow-hidden flex items-center justify-center pt-24 bg-black">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Experience Nepal</h1>
          <p className="text-xl">Immerse yourself in the beauty of Nepal</p>
        </div>
      </section>
    );
  }

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden flex items-center pt-24 bg-black">
      {/* Background Slider */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isMobile ? 0.3 : 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            {slides[currentSlide].video ? (
              <video
                key={slides[currentSlide].video}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  width: '110vw',
                  height: '100vh',
                  minWidth: '110%',
                  minHeight: '100%',
                  transform: 'scale(1.1)',
                  transformOrigin: 'center center',
                  left: '-5vw'
                }}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                controls={false}
                disablePictureInPicture
                disableRemotePlayback
                onLoadStart={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.muted = true;
                  video.play().catch(() => {
                    // Fallback: try playing after user interaction
                    const playOnInteraction = () => {
                      video.currentTime = 30;
                      video.play().catch(console.error);
                      document.removeEventListener('touchstart', playOnInteraction);
                      document.removeEventListener('click', playOnInteraction);
                    };
                    document.addEventListener('touchstart', playOnInteraction, { once: true });
                    document.addEventListener('click', playOnInteraction, { once: true });
                  });
                }}
                onLoadedMetadata={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.currentTime = 30; // Start at 30 seconds
                }}
              >
                <source src={slides[currentSlide].video} type="video/mp4" />
              </video>
            ) : (
              <img
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
              />
            )}
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
            
            {/* Pattern Overlay */}
            <div className="absolute inset-0 pattern-overlay opacity-20" />
          </div>
        </motion.div>
        
      </AnimatePresence>

      {/* Floating Clouds Animation - Disabled on mobile for performance */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-0 w-96 h-32 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -100, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-40 right-0 w-96 h-32 bg-white/5 rounded-full blur-3xl"
          />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 w-full flex items-center justify-center py-20">
        <div className="section-container text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-4xl mx-auto"
            >
              {/* Location Badge */}
              <motion.div
                variants={textVariants}
                className="inline-flex items-center glass px-4 py-2 rounded-full mb-6"
              >
                <MapPin className="w-4 h-4 text-sky-blue mr-2" />
                <span className="text-white text-sm font-medium">
                  {slides[currentSlide].location || 'Nepal'}
                </span>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                variants={textVariants}
                className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight"
              >
                {slides[currentSlide].title}
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={textVariants}
                className="text-xl md:text-2xl text-white/90 mb-10 font-light"
              >
                {slides[currentSlide].subtitle || ''}
              </motion.p>

              {/* CTA Button */}
              <motion.div
                variants={textVariants}
                className="flex justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-sunrise-orange to-sunrise-orange-light px-8 py-4 rounded-full text-white font-semibold text-lg hover:shadow-2xl transition-all duration-300 min-w-[200px]"
                >
                  Explore Adventures
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide
                ? 'w-12 h-2 bg-sky-blue'
                : 'w-2 h-2 bg-white/50 hover:bg-white/70'
            } rounded-full`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-white z-20"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>


    </section>
  );
};

export default Hero;
