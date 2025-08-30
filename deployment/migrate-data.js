const fs = require('fs');
const path = require('path');
const { dbHelpers } = require('./database');

const loadJSONData = () => {
  try {
    const destinationsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'destinations.json'), 'utf8'));
    const activitiesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'activities.json'), 'utf8'));
    const toursData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tours.json'), 'utf8'));
    
    return { destinationsData, activitiesData, toursData };
  } catch (error) {
    console.error('Error loading JSON data:', error);
    return { destinationsData: [], activitiesData: [], toursData: [] };
  }
};

const migrateData = async () => {
  console.log('Starting data migration...');
  
  try {
    const { destinationsData, activitiesData, toursData } = loadJSONData();
    
    console.log(`Loaded ${destinationsData.length} destinations`);
    console.log(`Loaded ${activitiesData.length} activities`);
    console.log(`Loaded ${toursData.length} tours`);

    // Migrate destinations
    let destinationCount = 0;
    for (const destination of destinationsData) {
      try {
        await dbHelpers.insertDestination(destination);
        destinationCount++;
      } catch (error) {
        console.error(`Error inserting destination ${destination.name}:`, error.message);
      }
    }

    // Migrate activities
    let activityCount = 0;
    for (const activity of activitiesData) {
      try {
        await dbHelpers.insertActivity(activity);
        activityCount++;
      } catch (error) {
        console.error(`Error inserting activity ${activity.name}:`, error.message);
      }
    }

    // Migrate tours
    let tourCount = 0;
    for (const tour of toursData) {
      try {
        // Find destination ID if destination is specified
        if (tour.destination) {
          const destination = destinationsData.find(d => d.name === tour.destination);
          if (destination) {
            tour.destination_id = destination.id;
          }
        }

        // Convert activities to activity IDs
        if (tour.activities && Array.isArray(tour.activities)) {
          tour.activity_ids = tour.activities.map(activityName => {
            const activity = activitiesData.find(a => a.name === activityName);
            return activity ? activity.id : null;
          }).filter(id => id !== null);
        }

        await dbHelpers.insertTour(tour);
        tourCount++;
      } catch (error) {
        console.error(`Error inserting tour ${tour.title}:`, error.message);
      }
    }

    console.log('\nMigration Summary:');
    console.log(`- Destinations: ${destinationCount}/${destinationsData.length}`);
    console.log(`- Activities: ${activityCount}/${activitiesData.length}`);
    console.log(`- Tours: ${tourCount}/${toursData.length}`);
    console.log('\nData migration completed successfully!');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run migration if called directly
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('Migration process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };