const fs = require('fs');
const path = require('path');

// Load current tours data
const toursData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/tours.json'), 'utf8'));

// Ensure tour-details directory exists
const tourDetailsDir = path.join(__dirname, 'data/tour-details');
if (!fs.existsSync(tourDetailsDir)) {
  fs.mkdirSync(tourDetailsDir, { recursive: true });
}

let createdFiles = 0;
let updatedFiles = 0;

// Process each tour
toursData.forEach(tour => {
  if (!tour.slug) {
    console.log(`⚠️  Skipping tour without slug: ${tour.title}`);
    return;
  }

  const filename = `${tour.slug}.json`;
  const filePath = path.join(tourDetailsDir, filename);
  
  // Check if file already exists
  const fileExists = fs.existsSync(filePath);
  
  if (fileExists) {
    // Update existing file with any new data
    try {
      const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const mergedData = {
        ...existingData,
        ...tour,
        updated_at: new Date().toISOString()
      };
      
      fs.writeFileSync(filePath, JSON.stringify(mergedData, null, 2));
      updatedFiles++;
      console.log(`✅ Updated: ${filename}`);
    } catch (error) {
      console.error(`❌ Error updating ${filename}:`, error.message);
    }
  } else {
    // Create new file
    try {
      const tourData = {
        ...tour,
        created_at: tour.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      fs.writeFileSync(filePath, JSON.stringify(tourData, null, 2));
      createdFiles++;
      console.log(`🆕 Created: ${filename}`);
    } catch (error) {
      console.error(`❌ Error creating ${filename}:`, error.message);
    }
  }
});

// Create a backup of the original tours.json
const backupPath = path.join(__dirname, 'data/tours-backup.json');
fs.writeFileSync(backupPath, JSON.stringify(toursData, null, 2));

// Clear the main tours.json file since we're now using individual files
fs.writeFileSync(path.join(__dirname, 'data/tours.json'), JSON.stringify([], null, 2));

console.log('\n📊 Summary:');
console.log(`🆕 Created files: ${createdFiles}`);
console.log(`✅ Updated files: ${updatedFiles}`);
console.log(`📁 Total tours processed: ${toursData.length}`);
console.log(`💾 Backup created: tours-backup.json`);
console.log(`🗑️  Main tours.json cleared (now using individual files)`);
console.log('\n🔄 Please restart the server to use the new file structure');