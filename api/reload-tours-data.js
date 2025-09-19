const fs = require('fs');
const path = require('path');

// Function to load tour details from individual files (same as in server.js)
const loadTourDetails = () => {
  const tourDetailsDir = path.join(__dirname, 'data', 'tour-details');
  const tourDetails = [];
  
  try {
    const files = fs.readdirSync(tourDetailsDir);
    files.forEach(file => {
      if (file.endsWith('.json')) {
        try {
          const filePath = path.join(tourDetailsDir, file);
          const data = fs.readFileSync(filePath, 'utf8');
          const tourDetail = JSON.parse(data);
          tourDetails.push(tourDetail);
        } catch (error) {
          console.error(`Error loading tour detail file ${file}:`, error);
        }
      }
    });
  } catch (error) {
    console.error('Error reading tour-details directory:', error);
  }
  
  return tourDetails;
};

// Load and display current tour data
const tourDetails = loadTourDetails();

console.log('🔄 Current tour data from individual files:');
console.log(`📊 Total tours found: ${tourDetails.length}`);
console.log('\n📋 Tours list:');
tourDetails.forEach((tour, index) => {
  console.log(`${index + 1}. ${tour.title} (ID: ${tour.id}, Slug: ${tour.slug}, Listed: ${tour.listed ?? true})`);
});

console.log('\n✅ Tour data loaded successfully from individual files');
console.log('🔄 The server needs to be restarted to pick up this data');

// Create a simple endpoint test
const testTour = tourDetails.find(t => t.slug === 'everest-base-camp-trek');
if (testTour) {
  console.log('\n🎯 Test tour found:');
  console.log(`   Title: ${testTour.title}`);
  console.log(`   ID: ${testTour.id}`);
  console.log(`   Slug: ${testTour.slug}`);
  console.log(`   Listed: ${testTour.listed ?? true}`);
} else {
  console.log('\n❌ Test tour (everest-base-camp-trek) not found');
}