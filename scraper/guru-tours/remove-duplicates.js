const fs = require('fs');
const path = require('path');

// Read the tours data
const toursPath = path.join(__dirname, '../../api/data/tours.json');
const destinationsPath = path.join(__dirname, '../../api/data/destinations.json');

const toursData = require(toursPath);
const destinations = require(destinationsPath);

console.log(`Original tours count: ${toursData.tours.length}`);

// Remove duplicates by keeping only the first occurrence of each title
const seenTitles = new Set();
const uniqueTours = [];
const removedTourIds = [];

toursData.tours.forEach(tour => {
  const titleLower = tour.title.toLowerCase();
  if (!seenTitles.has(titleLower)) {
    seenTitles.add(titleLower);
    uniqueTours.push(tour);
  } else {
    removedTourIds.push(tour.id);
    console.log(`Removing duplicate: ID ${tour.id} - ${tour.title}`);
  }
});

console.log(`Unique tours count: ${uniqueTours.length}`);
console.log(`Removed duplicates: ${removedTourIds.length}`);

// Update tours data
toursData.tours = uniqueTours;

// Update destinations to remove references to deleted tour IDs
const updatedDestinations = destinations.map(dest => {
  if (dest.relatedTours && dest.relatedTours.length > 0) {
    const originalCount = dest.relatedTours.length;
    dest.relatedTours = dest.relatedTours.filter(tourId => !removedTourIds.includes(tourId));
    dest.tourCount = dest.relatedTours.length;
    
    if (originalCount !== dest.relatedTours.length) {
      console.log(`Updated ${dest.name}: ${originalCount} -> ${dest.tourCount} tours`);
    }
  }
  return dest;
});

// Write updated data back to files
fs.writeFileSync(toursPath, JSON.stringify(toursData, null, 2));
fs.writeFileSync(destinationsPath, JSON.stringify(updatedDestinations, null, 2));

console.log('\n✅ Successfully removed duplicate tours and updated destinations');
console.log(`Final tours count: ${toursData.tours.length}`);