const { dbHelpers, initializeDatabase } = require('./database');

// Slider data from Hero component
const slidersData = [
  {
    id: 1,
    title: 'Experience Nepal',
    subtitle: 'Immerse yourself in the beauty of Nepal',
    location: 'Nepal Himalayas',
    image: 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?q=80&w=2069',
    video: '/video/slider video.mp4',
    order_index: 1,
    is_active: 1
  },
  {
    id: 2,
    title: 'Journey Beyond Ordinary',
    subtitle: 'Discover the mystical peaks of the Himalayas',
    location: 'Mount Everest, Nepal',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070',
    video: null,
    order_index: 2,
    is_active: 1
  },
  {
    id: 3,
    title: 'Cultural Immersion',
    subtitle: 'Explore ancient temples and vibrant traditions',
    location: 'Kathmandu Valley, Nepal',
    image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?q=80&w=2070',
    video: null,
    order_index: 3,
    is_active: 1
  }
];

const migrateSliders = async () => {
  try {
    console.log('🚀 Starting slider migration...');
    
    // Initialize database (creates tables if they don't exist)
    initializeDatabase();
    
    // Check if sliders already exist
    const existingSliders = dbHelpers.getAllSliders();
    if (existingSliders.length > 0) {
      console.log('⚠️  Sliders already exist in database. Skipping migration.');
      console.log(`Found ${existingSliders.length} existing sliders.`);
      return;
    }
    
    console.log(`📊 Migrating ${slidersData.length} sliders...`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const slider of slidersData) {
      try {
        const result = dbHelpers.insertSlider({
          title: slider.title,
          subtitle: slider.subtitle,
          location: slider.location,
          image: slider.image,
          video: slider.video,
          order_index: slider.order_index,
          is_active: slider.is_active
        });
        
        console.log(`✅ Migrated slider: ${slider.title} (ID: ${result.lastInsertRowid})`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating slider "${slider.title}":`, error.message);
        errorCount++;
      }
    }
    
    console.log('\n📈 Migration Summary:');
    console.log(`✅ Successfully migrated: ${successCount} sliders`);
    if (errorCount > 0) {
      console.log(`❌ Failed to migrate: ${errorCount} sliders`);
    }
    
    // Verify migration
    const migratedSliders = dbHelpers.getAllSliders();
    console.log(`🔍 Verification: Found ${migratedSliders.length} sliders in database`);
    
    console.log('\n🎉 Slider migration completed successfully!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateSliders()
    .then(() => {
      console.log('Migration process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateSliders };