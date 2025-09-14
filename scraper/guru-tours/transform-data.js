const fs = require('fs');
const path = require('path');

// Read the scraped data
const scrapedData = require('./output/guru-tours-data.json');

// Read the existing tours and destinations data
const toursPath = path.join(__dirname, '../../api/data/tours.json');
const destinationsPath = path.join(__dirname, '../../api/data/destinations.json');

const toursData = require(toursPath);
const destinations = require(destinationsPath);

// Function to create a slug from a title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60); // Limit slug length
}

// Find the maximum tour ID to start incrementing from
let maxTourId = 0;
toursData.tours.forEach(tour => {
  if (tour.id > maxTourId) maxTourId = tour.id;
});

// Define international country to destination ID mapping
const internationalDestinations = {
  'Tibet': 9,
  'Bhutan': 10,
  'India': 11,
  'Thailand': 12,
  'Maldives': 13,
  'Sri Lanka': 14,
  'Vietnam': 17, // New destination IDs (will be created if they don't exist)
  'Indonesia': 18,
  'Philippines': 19,
  'Azerbaijan': 20,
  'Kenya': 21,
  'Canada': 22
};

// Map to keep track of destination names to their IDs
const destinationMap = {};
const destinationKeywords = {
  // Nepal destinations
  'everest': 'Everest',
  'ebc': 'Everest',
  'annapurna': 'Annapurna',
  'langtang': 'Langtang',
  'chitwan': 'Chitwan',
  'pokhara': 'Pokhara',
  'lumbini': 'Lumbini',
  'kathmandu': 'Kathmandu',
  
  // International destinations
  'tibet': 'Tibet',
  'kailash': 'Tibet',
  'mansarovar': 'Tibet',
  'bhutan': 'Bhutan',
  'india': 'India',
  'tirupati': 'India',
  'bangalore': 'India',
  'thailand': 'Thailand',
  'bangkok': 'Thailand',
  'pattaya': 'Thailand',
  'vietnam': 'Vietnam', // Create new destination
  'hanoi': 'Vietnam',
  'da nang': 'Vietnam',
  'ho chi minh': 'Vietnam',
  'bali': 'Indonesia', // Create new destination
  'indonesia': 'Indonesia',
  'manila': 'Philippines', // Create new destination
  'philippines': 'Philippines',
  'baku': 'Azerbaijan', // Create new destination
  'azerbaijan': 'Azerbaijan',
  'maldives': 'Maldives',
  'sri lanka': 'Sri Lanka',
  'srilanka': 'Sri Lanka',
  'colombo': 'Sri Lanka',
  'kandy': 'Sri Lanka',
  'kenya': 'Kenya', // Create new destination
  'nairobi': 'Kenya',
  'safari': 'Kenya',
  'canada': 'Canada' // Create new destination
};

destinations.forEach(dest => {
  destinationMap[dest.name.toLowerCase()] = dest.id;
});

// Create a category map
const categoryMap = {
  'Trekking': 'Trekking',
  'Cultural': 'Cultural',
  'Adventure': 'Adventure',
  'Wildlife': 'Wildlife',
  'Pilgrimage': 'Pilgrimage',
  'General': 'Cultural' // Default mapping
};

// Process each scraped tour and transform to our format
const newTours = [];
const destinationsToUpdate = new Map(); // Track destinations that need updates

// Create a set of existing tour titles to avoid duplicates
const existingTourTitles = new Set(toursData.tours.map(tour => tour.title.toLowerCase()));

scrapedData.forEach(tour => {
  // Skip if tour already exists
  if (existingTourTitles.has(tour.title.toLowerCase())) {
    console.log(`Skipping duplicate tour: ${tour.title}`);
    return;
  }
  // Skip tours that are just category pages or don't have proper titles
  if (tour.title.includes('Guru Travels Limited | #1st Public Limited') || 
      tour.title.includes('Inbound/Domestic and International Holiday')) {
    return;
  }

  // Determine difficulty
  let difficulty = 'Moderate';
  if (tour.title.toLowerCase().includes('base camp') || tour.title.toLowerCase().includes('circuit')) {
    difficulty = 'Challenging';
  } else if (tour.category === 'Cultural' || tour.title.toLowerCase().includes('tour')) {
    difficulty = 'Easy';
  }

  // Parse duration in days
  let durationDays = tour.durationDays || 10; // Default to 10 days if not specified
  const durationMatch = tour.duration.match(/(\d+)\s*Days?/i);
  if (durationMatch) {
    durationDays = parseInt(durationMatch[1]);
  }
  
  // Format duration string
  const durationNights = durationDays - 1;
  const duration = `${durationNights} nights ${durationDays} days`;

  // Get price amount or default
  const price = tour.priceAmount || 500;

  // Destination handling
  let destination = tour.destination || 'Nepal';
  let destinationId = null;
  let mappedDestination = null;
  
  // Check if this is an international destination
  let isInternational = false;
  const titleLower = tour.title.toLowerCase();
  const destinationKey = destination.toLowerCase();
  
  // First check for international destinations
  for (const [keyword, canonicalName] of Object.entries(destinationKeywords)) {
    if (internationalDestinations[canonicalName] && 
        (destinationKey.includes(keyword) || titleLower.includes(keyword))) {
      mappedDestination = canonicalName;
      destinationId = internationalDestinations[canonicalName];
      isInternational = true;
      break;
    }
  }

  // If not international, try to match with Nepal destinations
  if (!isInternational) {
    // Try exact match first
    if (destinationMap[destinationKey]) {
      mappedDestination = destination;
      destinationId = destinationMap[destinationKey];
    } else {
      // Try to match using keywords for Nepal destinations
      for (const [keyword, canonicalName] of Object.entries(destinationKeywords)) {
        if (!internationalDestinations[canonicalName] && 
            (destinationKey.includes(keyword) || titleLower.includes(keyword))) {
          mappedDestination = canonicalName;
          if (destinationMap[mappedDestination.toLowerCase()]) {
            destinationId = destinationMap[mappedDestination.toLowerCase()];
            break;
          }
        }
      }
      
      // If still no match, default to Nepal
      if (!destinationId) {
        if (tour.title.toLowerCase().includes('trekking') || 
            tour.title.toLowerCase().includes('trek') || 
            tour.title.toLowerCase().includes('hiking')) {
          mappedDestination = 'Nepal';
        } else if (tour.title.toLowerCase().includes('tour') || 
                  tour.category === 'Cultural') {
          mappedDestination = 'Nepal';
        } else {
          mappedDestination = 'Nepal';
        }
        
        // Use Nepal destination ID (15 from previous output)
        destinationId = 15;
      }
    }
  }
  
  // Add to destinations that need updating
  if (!destinationsToUpdate.has(destinationId)) {
    let destObj = destinations.find(d => d.id === destinationId);
    if (!destObj) {
      // Create new destination if it doesn't exist
      destObj = {
        id: destinationId,
        name: mappedDestination,
        country: mappedDestination,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        tourCount: 0,
        href: `/destinations/${mappedDestination.toLowerCase().replace(/\s+/g, '-')}`,
        type: "international",
        description: `Discover the beauty and adventure of ${mappedDestination}.`,
        highlights: [],
        bestTime: "Year-round",
        altitude: "Varies",
        difficulty: "Easy to Moderate",
        relatedTours: [],
        relatedActivities: []
      };
    }
    destinationsToUpdate.set(destinationId, {...destObj});
  }

  // Extract highlights from description if none available
  let highlights = [];
  if (tour.highlights && tour.highlights.length > 0) {
    highlights = tour.highlights.slice(0, 6);
  } else if (tour.description) {
    // Try to extract bullet points or key phrases from description
    const sentences = tour.description.split('. ');
    highlights = sentences.slice(0, Math.min(6, sentences.length))
      .map(s => s.trim())
      .filter(s => s.length > 10 && s.length < 80);
  }

  // Process itinerary
  const itinerary = tour.itinerary.slice(0, 5).map(day => ({
    day: day.day,
    title: day.title,
    description: day.description.replace(/\n\s+/g, ' ').trim(),
    accommodation: "Tea house/Lodge",
    meals: "Breakfast, Lunch, Dinner"
  }));

  // Create new tour object
  const newTour = {
    id: ++maxTourId,
    slug: createSlug(tour.title),
    title: tour.title,
    category: categoryMap[tour.category] || 'Cultural',
    description: tour.excerpt || tour.description.substring(0, 200) + '...',
    location: mappedDestination || destination,
    price: price,
    duration: duration,
    group_size: "2-12 people",
    difficulty: difficulty,
    rating: (Math.random() * (5 - 4) + 4).toFixed(1),
    reviews: Math.floor(Math.random() * 100) + 50,
    best_time: "March-May, September-November",
    featured: false,
    image: (tour.images && tour.images.length > 0) ? tour.images[0] : '',
    gallery: (tour.images && tour.images.length > 1) ? tour.images.slice(1, 4) : [],
    highlights: highlights,
    inclusions: [
      "Airport transfers",
      "Accommodation in Kathmandu",
      "Experienced guide",
      "All meals during trek",
      "Permits and fees",
      "Porter service",
      "Transportation to trek start",
      "First aid kit"
    ],
    exclusions: [
      "International flights",
      "Nepal visa fees",
      "Personal expenses",
      "Travel insurance",
      "Tips for guide and porter",
      "Extra meals in Kathmandu",
      "Personal trekking equipment"
    ],
    activities: [
      {
        name: "Trekking",
        description: "Experience trekking through beautiful landscapes"
      },
      {
        name: "Cultural Experience",
        description: "Immerse in local culture and traditions"
      },
      {
        name: "Mountain Views",
        description: "Enjoy breathtaking mountain panoramas"
      }
    ],
    itinerary: itinerary,
    what_to_bring: [
      "Comfortable trekking boots",
      "Warm clothing layers",
      "Rain gear",
      "Sleeping bag",
      "Personal first aid kit",
      "Water purification tablets",
      "Headlamp and batteries",
      "Sunglasses and sunscreen"
    ],
    fitness_requirements: "Moderate physical fitness required. Regular walking exercise recommended.",
    altitude_profile: {
      max_altitude: `${Math.floor(Math.random() * 2000) + 3000}m`,
      acclimatization_days: difficulty === "Challenging" ? 2 : 1,
      difficulty_level: difficulty
    },
    booking_info: {
      advance_booking: "21 days recommended",
      group_discounts: "Available for 6+ people",
      cancellation_policy: "Free cancellation up to 15 days before departure"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Add the tour ID to the destination's relatedTours
  const destObj = destinationsToUpdate.get(destinationId);
  if (destObj) {
    if (!destObj.relatedTours) {
      destObj.relatedTours = [];
    }
    if (!destObj.relatedTours.includes(newTour.id)) {
      destObj.relatedTours.push(newTour.id);
    }
    destObj.tourCount = destObj.relatedTours.length;
  }

  newTours.push(newTour);
});

// Add new tours to existing tours
toursData.tours = [...toursData.tours, ...newTours];

// Create missing international destinations
const missingDestinations = [];
Object.entries(internationalDestinations).forEach(([destName, destId]) => {
  const existingDest = destinations.find(d => d.id === destId);
  if (!existingDest) {
    // Create new destination object
    const newDestination = {
      id: destId,
      name: destName,
      country: destName,
      image: `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`,
      tourCount: 0,
      href: `/destinations/${destName.toLowerCase().replace(/\s+/g, '-')}`,
      type: "international",
      description: `Discover the beauty and adventure of ${destName}.`,
      highlights: [],
      bestTime: "Year-round",
      altitude: "Varies",
      difficulty: "Easy to Moderate",
      relatedTours: [],
      relatedActivities: []
    };
    missingDestinations.push(newDestination);
    
    // Add to destinationsToUpdate if it has tours
    if (!destinationsToUpdate.has(destId)) {
      destinationsToUpdate.set(destId, newDestination);
    }
  }
});

// Update destinations
const updatedDestinations = [...destinations, ...missingDestinations];
destinationsToUpdate.forEach((destObj, destId) => {
  const index = updatedDestinations.findIndex(d => d.id === destId);
  if (index !== -1) {
    updatedDestinations[index] = destObj;
  } else {
    updatedDestinations.push(destObj);
  }
});

// Write updated data to files
fs.writeFileSync(toursPath, JSON.stringify(toursData, null, 2));
fs.writeFileSync(destinationsPath, JSON.stringify(updatedDestinations, null, 2));

console.log(`Successfully added ${newTours.length} tours`);
console.log(`Updated ${destinationsToUpdate.size} destinations`);