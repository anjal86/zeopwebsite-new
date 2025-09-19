const fs = require('fs');
const path = require('path');

// Load scraped data
const scrapedData = JSON.parse(fs.readFileSync(path.join(__dirname, '../scraper/guru-tours/output/guru-tours-data.json'), 'utf8'));

// Filter out invalid entries and transform to proper tour format
const validTours = scrapedData
  .filter(item => 
    item.title && 
    item.title !== "Guru Travels Limited | #1st Public Limited Travel in Nepal" &&
    item.title !== "Inbound/Domestic and International Holiday Packages." &&
    item.priceAmount > 0 &&
    item.slug &&
    !item.title.includes("Experience Everest Base Camp During Dashain") &&
    !item.title.includes("Langtang Valley Trek – The Hidden Gem")
  )
  .map((item, index) => ({
    id: index + 5, // Start from ID 5 to avoid conflicts with existing tours
    slug: item.slug,
    title: item.title,
    category: item.category === 'General' ? 'Cultural' : item.category,
    description: item.excerpt || item.description || `Experience ${item.title} with professional guides and comprehensive services.`,
    location: item.destination || 'Nepal',
    price: item.priceAmount,
    duration: item.durationDays ? `${item.durationDays} days` : (item.duration || '10 days'),
    group_size: "2-12 people",
    difficulty: item.difficulty || (item.category === 'Trekking' ? 'Moderate' : 'Easy'),
    rating: 4.0 + Math.random() * 1.0, // Random rating between 4.0-5.0
    reviews: Math.floor(Math.random() * 200) + 50, // Random reviews between 50-250
    best_time: "March-May, September-November",
    featured: Math.random() > 0.7, // 30% chance of being featured
    listed: true, // All scraped tours should be listed by default
    image: item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
    gallery: item.images || [],
    highlights: item.highlights || [
      "Professional guide service",
      "Comprehensive itinerary",
      "Cultural experience",
      "Scenic beauty"
    ],
    inclusions: [
      "Airport transfers",
      "Accommodation",
      "Experienced guide",
      "All meals during tour",
      "Permits and fees",
      "Transportation"
    ],
    exclusions: [
      "International flights",
      "Nepal visa fees",
      "Personal expenses",
      "Travel insurance",
      "Tips for guide"
    ],
    activities: [
      {
        name: item.category === 'Trekking' ? 'Trekking' : 'Cultural Experience',
        description: `Experience ${item.category.toLowerCase()} activities`
      }
    ],
    itinerary: item.itinerary || [],
    what_to_bring: [
      "Comfortable walking shoes",
      "Weather appropriate clothing",
      "Personal medications",
      "Camera",
      "Sunglasses and sunscreen"
    ],
    fitness_requirements: item.category === 'Trekking' ? "Good physical fitness required." : "Basic fitness level sufficient.",
    altitude_profile: {
      max_altitude: item.category === 'Trekking' ? "High altitude" : "Low altitude",
      acclimatization_days: item.category === 'Trekking' ? 1 : 0,
      difficulty_level: item.difficulty || 'Moderate'
    },
    booking_info: {
      advance_booking: "7 days recommended",
      group_discounts: "Available for 6+ people",
      cancellation_policy: "Free cancellation up to 7 days before departure"
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

// Load existing tours
const existingToursData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/tours.json'), 'utf8'));

// Combine existing tours with new scraped tours
const allTours = [...existingToursData, ...validTours];

// Save the combined tours data
fs.writeFileSync(
  path.join(__dirname, 'data/tours.json'), 
  JSON.stringify(allTours, null, 2)
);

console.log(`✅ Successfully imported ${validTours.length} tours from scraped data`);
console.log(`📊 Total tours now: ${allTours.length}`);
console.log('🔄 Please restart the server to load the new data');