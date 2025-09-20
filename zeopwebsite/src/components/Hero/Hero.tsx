import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, ChevronLeft, ChevronRight, MapPin, Volume2, VolumeX } from 'lucide-react';
import { useSliders } from '../../hooks/useApi';

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [videoErrors, setVideoErrors] = useState<Set<string>>(new Set());
  const [preloadedVideos, setPreloadedVideos] = useState<Set<string>>(new Set());
  
  // Fetch sliders from API
  const { data: slides, loading, error } = useSliders();

  // Preload videos for faster loading
  useEffect(() => {
    if (!slides || slides.length === 0) return;

    const preloadVideos = async () => {
      slides.forEach((slide) => {
        if (slide.video && !preloadedVideos.has(slide.video)) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.muted = true;
          video.playsInline = true;
          
          const videoUrl = slide.video.startsWith('http')
            ? slide.video
            : `${window.location.protocol}//${window.location.host}${slide.video}`;
          
          video.src = videoUrl;
          
          video.addEventListener('loadedmetadata', () => {
            const videoUrl = slide.video;
            if (videoUrl) {
              setPreloadedVideos(prev => new Set([...prev, videoUrl]));
            }
          });
          
          video.addEventListener('error', () => {
            const videoUrl = slide.video;
            if (videoUrl) {
              setVideoErrors(prev => new Set([...prev, videoUrl]));
            }
          });
          
          // Start preloading
          video.load();
        }
      });
    };

    // Start preloading after a short delay to not block initial render
    const timer = setTimeout(preloadVideos, 500);
    return () => clearTimeout(timer);
  }, [slides, preloadedVideos]);

  // Enhanced Parallax scroll effects - All hooks must be at the top level
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 200]);
  const contentY = useTransform(scrollY, [0, 600], [0, -100]);
  const overlayOpacity = useTransform(scrollY, [0, 400], [0.6, 0.95]);
  const cloud1Y = useTransform(scrollY, [0, 800], [0, -150]);
  const cloud2Y = useTransform(scrollY, [0, 700], [0, -120]);
  const cloud3Y = useTransform(scrollY, [0, 600], [0, -90]);
  const cloud4Y = useTransform(scrollY, [0, 500], [0, -60]);
  const titleY = useTransform(scrollY, [0, 400], [0, -80]);
  const subtitleY = useTransform(scrollY, [0, 400], [0, -60]);
  const buttonY = useTransform(scrollY, [0, 400], [0, -40]);
  const locationY = useTransform(scrollY, [0, 400], [0, -70]);
  const indicatorsY = useTransform(scrollY, [0, 300], [0, -30]);
  const scrollIndicatorY = useTransform(scrollY, [0, 200], [0, -20]);
  const patternOpacity = useTransform(scrollY, [0, 300], [0.2, 0.05]);
  const backgroundScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  
  // Pre-create particle transforms to avoid conditional hooks
  const particle1Y = useTransform(scrollY, [0, 800], [0, -50]);
  const particle2Y = useTransform(scrollY, [0, 800], [0, -60]);
  const particle3Y = useTransform(scrollY, [0, 800], [0, -70]);
  const particle4Y = useTransform(scrollY, [0, 800], [0, -80]);
  const particle5Y = useTransform(scrollY, [0, 800], [0, -90]);
  const particle6Y = useTransform(scrollY, [0, 800], [0, -100]);
  const particle7Y = useTransform(scrollY, [0, 800], [0, -110]);
  const particle8Y = useTransform(scrollY, [0, 800], [0, -120]);
  
  // Shape transform variables removed

  // Pre-create array of particle transforms
  const particleTransforms = [particle1Y, particle2Y, particle3Y, particle4Y, particle5Y, particle6Y, particle7Y, particle8Y];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Enable user interaction on any click/touch
    const enableInteraction = () => setUserInteracted(true);
    document.addEventListener('click', enableInteraction);
    document.addEventListener('touchstart', enableInteraction);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('click', enableInteraction);
      document.removeEventListener('touchstart', enableInteraction);
    };
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

  // Navigation functions
  const goToPrevSlide = () => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNextSlide = () => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Touch/swipe handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setUserInteracted(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextSlide();
    } else if (isRightSwipe) {
      goToPrevSlide();
    }
  };

  // Handle mute/unmute functionality
  const toggleMute = () => {
    setIsMuted(!isMuted);
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      video.muted = !isMuted;
    });
  };

  // Update video mute state when isMuted changes
  useEffect(() => {
    const videos = document.querySelectorAll('video');
    videos.forEach((video) => {
      video.muted = isMuted;
    });
  }, [isMuted]);

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
        <div className="text-white">Loading...</div>
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
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden bg-black pt-16 md:pt-0"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Slider with Parallax */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isMobile ? 0.3 : 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          <motion.div 
            className="relative w-full h-full"
            style={{ scale: backgroundScale }}
          >
            {slides[currentSlide].video && !videoErrors.has(slides[currentSlide].video) ? (
              <video
                key={`video-${currentSlide}-${slides[currentSlide].id}`}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay={!isMobile || userInteracted}
                muted
                loop
                playsInline
                controls={false}
                preload="none"
                onLoadedData={(e) => {
                  const video = e.target as HTMLVideoElement;
                  if (slides[currentSlide].video_start_time) {
                    video.currentTime = slides[currentSlide].video_start_time;
                  }
                  if (isMobile && userInteracted) {
                    video.play().catch(() => {});
                  }
                }}
                onError={() => {
                  const videoUrl = slides[currentSlide].video;
                  if (videoUrl) {
                    setVideoErrors(prev => new Set([...prev, videoUrl]));
                  }
                }}
              >
                <source
                  src={slides[currentSlide].video.startsWith('http') ? slides[currentSlide].video : `${window.location.protocol}//${window.location.host}${slides[currentSlide].video}`}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={
                  !slides[currentSlide].image || slides[currentSlide].image === ''
                    ? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&h=1080&fit=crop'
                    : slides[currentSlide].image.startsWith('blob:') || slides[currentSlide].image.startsWith('http')
                      ? slides[currentSlide].image
                      : `${window.location.protocol}//${window.location.host}${slides[currentSlide].image}`
                }
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to default image if current image fails
                  const img = e.target as HTMLImageElement;
                  if (img.src !== 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&h=1080&fit=crop') {
                    img.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&h=1080&fit=crop';
                  }
                }}
              />
            )}
            {/* Gradient Overlay with Parallax */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" 
              style={{ opacity: overlayOpacity }}
            />
            
            {/* Pattern Overlay with Parallax */}
            <motion.div 
              className="absolute inset-0 pattern-overlay" 
              style={{ opacity: patternOpacity }}
            />
          </motion.div>
        </motion.div>
        
      </AnimatePresence>

      {/* Enhanced Floating Elements with Parallax - Disabled on mobile for performance */}
      {!isMobile && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ x: [0, 100, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-0 w-96 h-32 bg-white/5 rounded-full blur-3xl"
            style={{ y: cloud1Y }}
          />
          <motion.div
            animate={{ x: [0, -100, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-40 right-0 w-96 h-32 bg-white/5 rounded-full blur-3xl"
            style={{ y: cloud2Y }}
          />
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, -20, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-60 left-1/4 w-64 h-24 bg-white/3 rounded-full blur-2xl"
            style={{ y: cloud3Y }}
          />
          <motion.div
            animate={{ x: [0, -30, 0], y: [0, 15, 0] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-40 right-1/4 w-80 h-28 bg-white/4 rounded-full blur-3xl"
            style={{ y: cloud4Y }}
          />
        </div>
      )}

      {/* Hero Content with Parallax */}
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ y: contentY }}
      >
        <div className="w-full h-full flex items-center justify-center px-4 sm:px-6 pt-20 md:pt-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              variants={staggerChildren}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="text-center max-w-6xl mx-auto w-full"
            >
              {/* Location Badge with Parallax */}
              <motion.div
                variants={textVariants}
                className="w-full flex justify-center mb-6"
                style={{ y: locationY }}
              >
                <div className="inline-flex items-center glass px-4 py-2 rounded-full">
                  <MapPin className="w-4 h-4 text-sky-blue mr-2" />
                  <span className="text-white text-sm font-medium">
                    {slides[currentSlide].location || 'Nepal'}
                  </span>
                </div>
              </motion.div>

              {/* Main Title with Parallax */}
              <motion.h1
                variants={textVariants}
                className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight text-center px-2"
                style={{ y: titleY }}
              >
                {slides[currentSlide].title}
              </motion.h1>

              {/* Subtitle with Parallax */}
              <motion.p
                variants={textVariants}
                className="text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 md:mb-10 font-light text-center max-w-3xl mx-auto px-2"
                style={{ y: subtitleY }}
              >
                {slides[currentSlide].subtitle || ''}
              </motion.p>

              {/* CTA Button with Parallax */}
              {slides[currentSlide].show_button && (
                <motion.div
                  variants={textVariants}
                  className="w-full flex justify-center"
                  style={{ y: buttonY }}
                >
                  <motion.a
                    href={slides[currentSlide].button_url || '#tours'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-6 sm:px-8 py-3 sm:py-4 rounded-full text-white font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 min-w-[180px] sm:min-w-[200px] inline-block text-center ${
                      slides[currentSlide].button_style === 'secondary'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                        : slides[currentSlide].button_style === 'outline'
                        ? 'border-2 border-white bg-transparent hover:bg-white hover:text-gray-900'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600'
                    }`}
                  >
                    {slides[currentSlide].button_text || 'Explore Adventures'}
                  </motion.a>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation Arrows */}
      {slides && slides.length > 1 && (
        <>
          {/* Previous Arrow */}
          <motion.button
            onClick={goToPrevSlide}
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 glass p-2 sm:p-3 rounded-full text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 group flex items-center justify-center"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-sky-blue transition-colors duration-300" />
          </motion.button>

          {/* Next Arrow */}
          <motion.button
            onClick={goToNextSlide}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.9 }}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 glass p-2 sm:p-3 rounded-full text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20 group flex items-center justify-center"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:text-sky-blue transition-colors duration-300" />
          </motion.button>
        </>
      )}

      {/* Slide Indicators with Parallax */}
      <motion.div
        className="absolute bottom-6 sm:bottom-8 md:bottom-10 w-full z-20"
        style={{ y: indicatorsY }}
      >
        <div className="w-full flex justify-center items-center">
          <div className="flex space-x-2 sm:space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-6 sm:w-8 md:w-12 h-1.5 sm:h-2 bg-sky-blue'
                    : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/70'
                } rounded-full`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator with Enhanced Parallax */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-16 sm:bottom-20 md:bottom-24 w-full z-20"
        style={{ y: scrollIndicatorY }}
      >
        <div className="w-full flex justify-center items-center">
          <div className="text-white">
            <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
          </div>
        </div>
      </motion.div>

      {/* Mute/Unmute Button - Only show when there's a video */}
      {slides && slides[currentSlide]?.video && (
        <motion.div
          className="absolute bottom-4 left-4 z-30"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <motion.button
            onClick={toggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="glass p-2 sm:p-3 rounded-full text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-md border border-white/20"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Additional Parallax Layers for Depth */}
      {!isMobile && (
        <>
          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                style={{
                  left: `${10 + i * 12}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  y: particleTransforms[i]
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2]
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3
                }}
              />
            ))}
          </div>

          {/* Geometric Shapes section removed */}
        </>
      )}
    </section>
  );
};

export default Hero;