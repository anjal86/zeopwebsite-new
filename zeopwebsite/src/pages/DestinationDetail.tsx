import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader/PageHeader';
import TourCard from '../components/Tours/TourCard';
import EmptyState from '../components/UI/EmptyState';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { useDestinations, useTours } from '../hooks/useApi';

const DestinationDetail: React.FC = () => {
  const { destinationName } = useParams<{ destinationName: string }>();
  
  // Fetch destination data from regular destinations API (not content destinations)
  const { data: destinations } = useDestinations();
  const { data: allTours } = useTours();
  
  // Legacy destination data for fallback (can be removed once all destinations are in the new system)
  const legacyDestinationData: Record<string, any> = {
    annapurna: {
      name: 'Annapurna Region',
      country: 'Nepal',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=2070',
      description: 'The Annapurna region is one of Nepal\'s most popular trekking destinations, offering incredible diversity in landscapes, cultures, and experiences. From subtropical forests to high alpine meadows, this region provides some of the most spectacular mountain views in the world.',
      location: 'Central Nepal',
      duration: '5-21 days',
      difficulty: 'All levels',
      rating: 4.8
    },
    everest: {
      name: 'Everest Region',
      country: 'Nepal',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070',
      description: 'Home to the world\'s highest peak, the Everest region offers legendary trekking experiences through Sherpa villages, ancient monasteries, and breathtaking mountain vistas. This iconic destination attracts adventurers from around the globe.',
      location: 'Eastern Nepal',
      duration: '12-21 days',
      difficulty: 'Moderate to Challenging',
      rating: 4.9
    },
    langtang: {
      name: 'Langtang Region',
      country: 'Nepal',
      image: 'https://images.unsplash.com/photo-1586523969132-b25453ec8ff5?q=80&w=2070',
      description: 'Known as the "Valley of Glaciers," Langtang offers pristine mountain beauty with rich Tibetan culture. This region provides excellent trekking opportunities with stunning views of snow-capped peaks and traditional villages.',
      location: 'Northern Nepal',
      duration: '7-14 days',
      difficulty: 'Easy to Moderate',
      rating: 4.7
    },
    manaslu: {
      name: 'Manaslu Region',
      country: 'Nepal',
      image: 'https://images.unsplash.com/photo-1571401835393-8c5f35328320?q=80&w=2074',
      description: 'The Manaslu region offers off-the-beaten-path trekking experiences around the world\'s eighth highest mountain. This remote area provides authentic cultural encounters and pristine mountain wilderness.',
      location: 'Western Nepal',
      duration: '14-18 days',
      difficulty: 'Challenging',
      rating: 4.6
    },
    pokhara: {
      name: 'Pokhara Region',
      country: 'Nepal',
      image: 'https://images.unsplash.com/photo-1540882082344-b273b04e2c2f?q=80&w=2070',
      description: 'Pokhara is Nepal\'s adventure capital, offering stunning lakeside views, paragliding, and easy access to the Annapurna range. This beautiful city combines natural beauty with modern amenities.',
      location: 'Western Nepal',
      duration: '3-10 days',
      difficulty: 'Easy to Moderate',
      rating: 4.8
    },
    kathmandu: {
      name: 'Kathmandu Valley',
      country: 'Nepal',
      image: 'https://images.unsplash.com/photo-1565537714828-9bbde8c42c3f?q=80&w=2070',
      description: 'The cultural heart of Nepal, Kathmandu Valley is home to ancient temples, palaces, and vibrant markets. This UNESCO World Heritage site offers rich history, art, and traditional architecture.',
      location: 'Central Nepal',
      duration: '2-7 days',
      difficulty: 'Easy',
      rating: 4.5
    },
    chitwan: {
      name: 'Chitwan Region',
      country: 'Nepal',
      image: 'https://images.unsplash.com/photo-1558799401-1dcba79e728e?q=80&w=2072',
      description: 'Chitwan National Park offers incredible wildlife experiences including rhino spotting, elephant safaris, and bird watching. This lowland region provides a perfect contrast to Nepal\'s mountain destinations.',
      location: 'Southern Nepal',
      duration: '2-5 days',
      difficulty: 'Easy',
      rating: 4.6
    },
    dolpo: {
      name: 'Dolpo Region',
      country: 'Nepal',
      image: 'https://images.unsplash.com/photo-1600298881974-6be191ceeda1?q=80&w=2070',
      description: 'Remote and mystical, Dolpo offers one of Nepal\'s most authentic Tibetan Buddhist cultural experiences. This restricted area provides pristine wilderness and ancient traditions.',
      location: 'Northwestern Nepal',
      duration: '18-25 days',
      difficulty: 'Very Challenging',
      rating: 4.9
    },
    tibet: {
      name: 'Tibet',
      country: 'Tibet',
      image: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=2070',
      description: 'The "Roof of the World" offers spiritual journeys through ancient monasteries, sacred lakes, and towering peaks. Tibet provides profound cultural and spiritual experiences.',
      location: 'Tibet Autonomous Region',
      duration: '7-15 days',
      difficulty: 'Moderate to Challenging',
      rating: 4.8
    },
    bhutan: {
      name: 'Bhutan',
      country: 'Bhutan',
      image: 'https://images.unsplash.com/photo-1605640840605-14ac1855827b?q=80&w=2070',
      description: 'The Last Shangri-La, Bhutan offers pristine culture, stunning monasteries, and Himalayan views. This carbon-negative kingdom focuses on Gross National Happiness over GDP.',
      location: 'Eastern Himalayas',
      duration: '5-12 days',
      difficulty: 'Easy to Moderate',
      rating: 4.9
    },
    india: {
      name: 'India',
      country: 'India',
      image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071',
      description: 'Incredible India offers diversity from the Himalayas to beaches, ancient temples to modern cities. Experience rich culture, delicious cuisine, and warm hospitality.',
      location: 'South Asia',
      duration: '7-21 days',
      difficulty: 'All levels',
      rating: 4.7
    },
    thailand: {
      name: 'Thailand',
      country: 'Thailand',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=2070',
      description: 'The Land of Smiles offers tropical paradise with stunning islands, rich culture, and delicious cuisine. Thailand combines beautiful beaches with cultural experiences.',
      location: 'Southeast Asia',
      duration: '5-14 days',
      difficulty: 'Easy',
      rating: 4.8
    },
    maldives: {
      name: 'Maldives',
      country: 'Maldives',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
      description: 'Tropical paradise with crystal clear waters and luxury overwater resorts. The Maldives offers the ultimate beach vacation with world-class diving and relaxation.',
      location: 'Indian Ocean',
      duration: '3-10 days',
      difficulty: 'Easy',
      rating: 4.9
    },
    'sri-lanka': {
      name: 'Sri Lanka',
      country: 'Sri Lanka',
      image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?q=80&w=2070',
      description: 'The Pearl of the Indian Ocean offers rich culture, ancient temples, beautiful beaches, and diverse wildlife. Sri Lanka combines history, nature, and hospitality.',
      location: 'Indian Ocean',
      duration: '5-12 days',
      difficulty: 'Easy to Moderate',
      rating: 4.6
    }
  };

  // Find the destination by name from the destinations list
  const destination = destinations?.find(dest => {
    const destName = dest.name.toLowerCase();
    const paramName = destinationName?.toLowerCase();
    
    return destName === paramName ||
           dest.href === `/destinations/${destinationName}` ||
           destName.includes(paramName || '') ||
           (paramName && destName.replace(/\s+/g, '-') === paramName);
  });
  
  // Fallback to legacy data if destination not found in new system
  const legacyDestination = destinationName ? legacyDestinationData[destinationName] : null;
  const finalDestination = destination || legacyDestination;

  // Get tours that match this destination by location
  const tours = allTours?.filter(tour => {
    if (!tour.location || !destinationName) return false;
    
    const tourLocation = tour.location.toLowerCase();
    const destName = destinationName.toLowerCase();
    const destTitle = (finalDestination?.title || finalDestination?.name || '').toLowerCase();
    
    // Match by various location patterns
    return tourLocation.includes(destName) ||
           tourLocation.includes(destTitle) ||
           (destName === 'annapurna' && (tourLocation.includes('annapurna') || tourLocation.includes('abc'))) ||
           (destName === 'everest' && (tourLocation.includes('everest') || tourLocation.includes('ebc'))) ||
           (destName === 'langtang' && tourLocation.includes('langtang')) ||
           (destName === 'chitwan' && tourLocation.includes('chitwan')) ||
           (destName === 'pokhara' && tourLocation.includes('pokhara')) ||
           (destName === 'kathmandu' && tourLocation.includes('kathmandu')) ||
           (destName === 'manaslu' && tourLocation.includes('manaslu'));
  }) || [];

  // Loading state
  if (!destinations || !allTours) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error state - if destination not found
  if (!destination && !destinationName) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Destination parameter is missing" />
      </div>
    );
  }


  if (!finalDestination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h1>
          <Link to="/destinations" className="text-blue-600 hover:underline">
            Back to Destinations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="destination-detail-page">
      <PageHeader
        title={finalDestination.title || finalDestination.name}
        subtitle={`Discover the beauty and culture of ${finalDestination.title || finalDestination.name}`}
        breadcrumb={`Destinations > ${finalDestination.title || finalDestination.name}`}
        backgroundImage={finalDestination.image}
      />


      {/* Available Tours */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="section-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Available Tours in {finalDestination.title || finalDestination.name}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated tours and experiences in this amazing destination
            </p>
          </div>
          
          {tours.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {tours.map((tour, index) => (
                <motion.div
                  key={tour.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <EmptyState
              type="tours"
              title={`No Tours Available in ${finalDestination.title || finalDestination.name}`}
              message={`We're currently working on adding amazing tours to ${finalDestination.title || finalDestination.name}. Check back soon or contact us to create a custom itinerary for this destination.`}
              actionText="Contact Us"
              onAction={() => window.location.href = '/contact'}
              className="py-12"
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default DestinationDetail;