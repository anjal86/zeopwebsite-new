const { initializeDatabase, dbHelpers } = require('./database');
const fs = require('fs');
const path = require('path');

// Helper function to create slug from name
const createSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Migration function
const migrateData = async () => {
  try {
    console.log('Starting data migration...');
    
    // Initialize database
    initializeDatabase();

    // Read JSON files
    const destinationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/destinations.json'), 'utf8'));
    const activitiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/activities.json'), 'utf8'));
    const toursData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/tours.json'), 'utf8'));

    console.log('JSON files loaded successfully');

    // Migrate destinations
    console.log('Migrating destinations...');
    const destinationMap = new Map(); // To map old IDs to new IDs
    
    for (const dest of destinationsData) {
      const destinationData = {
        name: dest.name,
        slug: dest.href ? dest.href.replace('/destinations/', '') : createSlug(dest.name),
        country: dest.country,
        location: dest.country, // Use country as location since location field doesn't exist
        description: dest.description,
        image: dest.image,
        duration: dest.bestTime || 'Year Round', // Map bestTime to duration
        difficulty: dest.difficulty,
        rating: 4.5, // Default rating since it's not in JSON
        featured: dest.tourCount > 10 ? 1 : 0 // Convert boolean to integer
      };

      const result = dbHelpers.insertDestination(destinationData);
      destinationMap.set(dest.id, result.lastInsertRowid);
      console.log(`Inserted destination: ${dest.name}`);
    }

    // Migrate activities
    console.log('Migrating activities...');
    const activityMap = new Map(); // To map old IDs to new IDs
    
    for (const activity of activitiesData) {
      const activityData = {
        name: activity.name,
        slug: activity.slug || createSlug(activity.name),
        description: activity.description || '',
        image: activity.image,
        icon: activity.icon || '',
        featured: activity.featured ? 1 : 0 // Convert boolean to integer
      };

      const result = dbHelpers.insertActivity(activityData);
      activityMap.set(activity.id, result.lastInsertRowid);
      console.log(`Inserted activity: ${activity.name}`);
    }

    // Migrate tours
    console.log('Migrating tours...');
    
    for (const tour of toursData) {
      // Map destination ID
      let destinationId = null;
      if (tour.destinationId) {
        destinationId = destinationMap.get(tour.destinationId);
      }

      // Map activity IDs
      let activityIds = [];
      if (tour.activityIds && Array.isArray(tour.activityIds)) {
        activityIds = tour.activityIds
          .map(id => activityMap.get(id))
          .filter(id => id !== undefined);
      }

      const tourData = {
        title: tour.title,
        slug: tour.slug || createSlug(tour.title),
        category: tour.category,
        description: tour.description,
        image: tour.image,
        price: tour.price,
        duration: tour.duration,
        group_size: tour.groupSize || tour.group_size || '2-12',
        difficulty: tour.difficulty,
        rating: tour.rating,
        reviews: tour.reviews || 0,
        location: tour.location,
        best_time: tour.bestTime || tour.best_time || 'Year Round',
        featured: tour.featured ? 1 : 0, // Convert boolean to integer
        destination_id: destinationId,
        highlights: tour.highlights || [],
        inclusions: tour.inclusions || [],
        activity_ids: activityIds
      };

      const result = dbHelpers.insertTour(tourData);
      console.log(`Inserted tour: ${tour.title}`);
    }

    console.log('Data migration completed successfully!');
    
    // Verify migration
    const destinations = dbHelpers.getAllDestinations();
    const activities = dbHelpers.getAllActivities();
    const tours = dbHelpers.getAllTours();
    
    console.log(`\nMigration Summary:`);
    console.log(`- Destinations: ${destinations.length}`);
    console.log(`- Activities: ${activities.length}`);
    console.log(`- Tours: ${tours.length}`);

  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData };