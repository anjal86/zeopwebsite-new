import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageHeader from '../components/PageHeader/PageHeader';
import TourCard from '../components/Tours/TourCard';
import EmptyState from '../components/UI/EmptyState';
import type { Tour } from '../components/Tours/TourCard';

const ActivityDetail: React.FC = () => {
  const { activityName } = useParams<{ activityName: string }>();
  
  // Activity data
  const activityData: Record<string, any> = {
    trekking: {
      name: 'Trekking',
      image: 'https://images.unsplash.com/photo-1523459178261-028135da2714?q=80&w=2068',
    },
    mountaineering: {
      name: 'Mountaineering',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070',
    },
    adventure: {
      name: 'Adventure Sports',
      image: 'https://images.unsplash.com/photo-1540882082344-b273b04e2c2f?q=80&w=2070',
    },
    'jungle-safari': {
      name: 'Jungle Safari',
      image: 'https://images.unsplash.com/photo-1558799401-1dcba79e728e?q=80&w=2072',
    },
    cultural: {
      name: 'Cultural Tours',
      image: 'https://images.unsplash.com/photo-1565537714828-9bbde8c42c3f?q=80&w=2070',
    },
    pilgrimage: {
      name: 'Pilgrimage',
      image: 'https://images.unsplash.com/photo-1601999109497-ba1c7b6e0cfb?q=80&w=2070',
    },
    meditation: {
      name: 'Meditation & Healing',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
    },
    volunteering: {
      name: 'Volunteering',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
    }
  };

  // Sample tours for each activity
  const activityTours: Record<string, Tour[]> = {
    trekking: [
      {
        id: 101,
        title: 'Everest Base Camp Trek',
        category: 'Trekking',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2070',
        price: 1899,
        duration: '16 days',
        groupSize: '2-10',
        difficulty: 'Challenging',
        rating: 4.9,
        reviews: 324,
        highlights: ['Everest Base Camp', 'Kala Patthar', 'Sherpa Culture'],
        location: 'Everest, Nepal',
        description: 'Trek to the base of the world\'s highest mountain through Sherpa villages.',
        inclusions: ['Accommodation', 'Meals', 'Guide', 'Permits'],
        bestTime: 'Oct-Dec, Mar-May'
      }
    ],
    mountaineering: [
      {
        id: 102,
        title: 'Island Peak Climbing',
        category: 'Mountaineering',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2070',
        price: 2499,
        duration: '19 days',
        groupSize: '2-6',
        difficulty: 'Challenging',
        rating: 4.7,
        reviews: 89,
        highlights: ['Island Peak Summit', 'Technical Climbing', 'Everest Views'],
        location: 'Everest, Nepal',
        description: 'Technical mountaineering expedition to Island Peak with stunning Himalayan views.',
        inclusions: ['Accommodation', 'Meals', 'Guide', 'Equipment', 'Permits'],
        bestTime: 'Oct-Dec, Mar-May'
      }
    ],
    adventure: [
      {
        id: 103,
        title: 'Pokhara Adventure Package',
        category: 'Adventure',
        image: 'https://images.unsplash.com/photo-1540882082344-b273b04e2c2f?q=80&w=2070',
        price: 599,
        duration: '5 days',
        groupSize: '2-12',
        difficulty: 'Moderate',
        rating: 4.8,
        reviews: 156,
        highlights: ['Paragliding', 'White Water Rafting', 'Bungee Jump'],
        location: 'Pokhara, Nepal',
        description: 'Ultimate adventure package with paragliding, rafting, and extreme sports.',
        inclusions: ['Accommodation', 'Activities', 'Guide', 'Equipment'],
        bestTime: 'Oct-Apr'
      }
    ],
    'jungle-safari': [
      {
        id: 104,
        title: 'Chitwan Jungle Safari',
        category: 'Wildlife',
        image: 'https://images.unsplash.com/photo-1558799401-1dcba79e728e?q=80&w=2072',
        price: 399,
        duration: '3 days',
        groupSize: '2-12',
        difficulty: 'Easy',
        rating: 4.6,
        reviews: 178,
        highlights: ['Rhino Spotting', 'Elephant Safari', 'Bird Watching'],
        location: 'Chitwan, Nepal',
        description: 'Wildlife safari adventure in Nepal\'s premier national park.',
        inclusions: ['Accommodation', 'Meals', 'Safari Activities', 'Guide'],
        bestTime: 'Oct-Mar'
      }
    ],
    cultural: [
      {
        id: 105,
        title: 'Kathmandu Heritage Tour',
        category: 'Cultural',
        image: 'https://images.unsplash.com/photo-1565537714828-9bbde8c42c3f?q=80&w=2070',
        price: 199,
        duration: '2 days',
        groupSize: '2-20',
        difficulty: 'Easy',
        rating: 4.5,
        reviews: 234,
        highlights: ['Durbar Square', 'Swayambhunath', 'Pashupatinath'],
        location: 'Kathmandu, Nepal',
        description: 'Discover the rich cultural heritage of Nepal\'s capital city.',
        inclusions: ['Guide', 'Entrance Fees', 'Transportation'],
        bestTime: 'Year Round'
      }
    ],
    pilgrimage: [
      {
        id: 106,
        title: 'Kailash Mansarovar Pilgrimage',
        category: 'Pilgrimage',
        image: 'https://images.unsplash.com/photo-1601999109497-ba1c7b6e0cfb?q=80&w=2070',
        price: 2999,
        duration: '15 days',
        groupSize: '2-15',
        difficulty: 'Moderate',
        rating: 4.9,
        reviews: 67,
        highlights: ['Mount Kailash', 'Lake Mansarovar', 'Sacred Kora'],
        location: 'Tibet',
        description: 'Sacred pilgrimage to the holy mountain and pristine lake.',
        inclusions: ['Accommodation', 'Meals', 'Guide', 'Permits', 'Transportation'],
        bestTime: 'May-Sep'
      }
    ],
    meditation: [
      {
        id: 107,
        title: 'Himalayan Meditation Retreat',
        category: 'Wellness',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
        price: 799,
        duration: '7 days',
        groupSize: '2-10',
        difficulty: 'Easy',
        rating: 4.8,
        reviews: 92,
        highlights: ['Daily Meditation', 'Yoga Sessions', 'Mountain Views'],
        location: 'Pokhara, Nepal',
        description: 'Peaceful meditation and wellness retreat in the Himalayas.',
        inclusions: ['Accommodation', 'Meals', 'Meditation Sessions', 'Yoga'],
        bestTime: 'Year Round'
      }
    ],
    volunteering: [
      {
        id: 108,
        title: 'Community Development Project',
        category: 'Volunteering',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
        price: 499,
        duration: '10 days',
        groupSize: '2-8',
        difficulty: 'Easy',
        rating: 4.7,
        reviews: 45,
        highlights: ['School Building', 'Community Work', 'Cultural Exchange'],
        location: 'Rural Nepal',
        description: 'Meaningful volunteering experience helping local communities.',
        inclusions: ['Accommodation', 'Meals', 'Project Materials', 'Guide'],
        bestTime: 'Oct-Apr'
      }
    ]
  };

  const activity = activityName ? activityData[activityName] : null;
  const tours = activityName ? activityTours[activityName] || [] : [];

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Activity not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-detail-page">
      <PageHeader
        title={activity.name}
        subtitle={`Discover amazing ${activity.name.toLowerCase()} experiences`}
        breadcrumb={`Activities > ${activity.name}`}
        backgroundImage={activity.image}
      />

      {/* Available Tours */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="section-container">
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
              title={`No ${activity.name} Tours Available`}
              message={`We're currently working on adding exciting ${activity.name.toLowerCase()} experiences. Check back soon or contact us to create a custom ${activity.name.toLowerCase()} adventure.`}
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

export default ActivityDetail;