const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Load data from JSON files
const loadData = (filename) => {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return [];
  }
};

// Load all data
let tours = loadData('tours.json');
let destinations = loadData('destinations.json');
let activities = loadData('activities.json');

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Tours API Routes
app.get('/api/tours', async (req, res) => {
  await delay(300); // Simulate network delay
  
  const { category, location, search, featured } = req.query;
  let filteredTours = [...tours];

  // Filter by featured
  if (featured === 'true') {
    filteredTours = filteredTours.filter(tour => tour.featured);
  }

  // Filter by category
  if (category) {
    filteredTours = filteredTours.filter(tour => 
      tour.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Filter by location
  if (location) {
    filteredTours = filteredTours.filter(tour => 
      tour.location.toLowerCase() === location.toLowerCase()
    );
  }

  // Search filter
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredTours = filteredTours.filter(tour =>
      tour.title.toLowerCase().includes(searchTerm) ||
      tour.description.toLowerCase().includes(searchTerm) ||
      tour.location.toLowerCase().includes(searchTerm) ||
      tour.category.toLowerCase().includes(searchTerm) ||
      tour.highlights.some(h => h.toLowerCase().includes(searchTerm))
    );
  }

  res.json({
    success: true,
    data: filteredTours,
    total: filteredTours.length
  });
});

app.get('/api/tours/:id', async (req, res) => {
  await delay(200);
  
  const tourId = parseInt(req.params.id);
  const tour = tours.find(t => t.id === tourId);
  
  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found'
    });
  }
  
  // Include related data
  const relatedDestination = destinations.find(d => d.id === tour.destinationId);
  const relatedActivities = activities.filter(a => tour.activityIds?.includes(a.id));
  const relatedTours = tours.filter(t => tour.relatedTours?.includes(t.id));
  
  res.json({
    success: true,
    data: {
      ...tour,
      destination: relatedDestination,
      activities: relatedActivities,
      relatedTours: relatedTours
    }
  });
});

// Get tours by destination
app.get('/api/tours/destination/:destinationId', async (req, res) => {
  await delay(300);
  
  const destinationId = parseInt(req.params.destinationId);
  const filteredTours = tours.filter(tour => tour.destinationId === destinationId);
  
  res.json({
    success: true,
    data: filteredTours,
    total: filteredTours.length
  });
});

// Get tours by activity
app.get('/api/tours/activity/:activityId', async (req, res) => {
  await delay(300);
  
  const activityId = parseInt(req.params.activityId);
  const filteredTours = tours.filter(tour => tour.activityIds?.includes(activityId));
  
  res.json({
    success: true,
    data: filteredTours,
    total: filteredTours.length
  });
});

// Destinations API Routes
app.get('/api/destinations', async (req, res) => {
  await delay(300);
  
  const { type } = req.query;
  let filteredDestinations = [...destinations];

  // Filter by type
  if (type) {
    filteredDestinations = filteredDestinations.filter(dest => dest.type === type);
  }

  res.json({
    success: true,
    data: filteredDestinations,
    total: filteredDestinations.length
  });
});

app.get('/api/destinations/:id', async (req, res) => {
  await delay(200);
  
  const destId = parseInt(req.params.id);
  const destination = destinations.find(d => d.id === destId);
  
  if (!destination) {
    return res.status(404).json({
      success: false,
      message: 'Destination not found'
    });
  }
  
  // Include related data
  const relatedTours = tours.filter(t => destination.relatedTours?.includes(t.id));
  const relatedActivities = activities.filter(a => destination.relatedActivities?.includes(a.id));
  
  res.json({
    success: true,
    data: {
      ...destination,
      tours: relatedTours,
      activities: relatedActivities
    }
  });
});

app.get('/api/destinations/name/:name', async (req, res) => {
  await delay(200);
  
  const name = req.params.name.toLowerCase();
  const destination = destinations.find(d => 
    d.name.toLowerCase() === name || 
    d.name.toLowerCase().replace(/\s+/g, '-') === name
  );
  
  if (!destination) {
    return res.status(404).json({
      success: false,
      message: 'Destination not found'
    });
  }
  
  res.json({
    success: true,
    data: destination
  });
});

// Activities API Routes
app.get('/api/activities', async (req, res) => {
  await delay(300);
  
  const { type } = req.query;
  let filteredActivities = [...activities];

  // Filter by type
  if (type) {
    filteredActivities = filteredActivities.filter(activity => activity.type === type);
  }

  res.json({
    success: true,
    data: filteredActivities,
    total: filteredActivities.length
  });
});

app.get('/api/activities/:id', async (req, res) => {
  await delay(200);
  
  const activityId = parseInt(req.params.id);
  const activity = activities.find(a => a.id === activityId);
  
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  // Include related data
  const relatedTours = tours.filter(t => activity.relatedTours?.includes(t.id));
  const relatedDestinations = destinations.filter(d => activity.relatedDestinations?.includes(d.id));
  
  res.json({
    success: true,
    data: {
      ...activity,
      tours: relatedTours,
      destinations: relatedDestinations
    }
  });
});

app.get('/api/activities/name/:name', async (req, res) => {
  await delay(200);
  
  const name = req.params.name.toLowerCase();
  const activity = activities.find(a => 
    a.name.toLowerCase() === name || 
    a.name.toLowerCase().replace(/\s+/g, '-') === name ||
    a.name.toLowerCase().replace(/\s&\s/g, '-') === name
  );
  
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  res.json({
    success: true,
    data: activity
  });
});

// Get activities by destination
app.get('/api/activities/destination/:destinationId', async (req, res) => {
  await delay(300);
  
  const destinationId = parseInt(req.params.destinationId);
  const destination = destinations.find(d => d.id === destinationId);
  
  if (!destination) {
    return res.status(404).json({
      success: false,
      message: 'Destination not found'
    });
  }
  
  const filteredActivities = activities.filter(activity =>
    destination.relatedActivities?.includes(activity.id)
  );
  
  res.json({
    success: true,
    data: filteredActivities,
    total: filteredActivities.length
  });
});

// Get destinations by activity
app.get('/api/destinations/activity/:activityId', async (req, res) => {
  await delay(300);
  
  const activityId = parseInt(req.params.activityId);
  const activity = activities.find(a => a.id === activityId);
  
  if (!activity) {
    return res.status(404).json({
      success: false,
      message: 'Activity not found'
    });
  }
  
  const filteredDestinations = destinations.filter(destination =>
    activity.relatedDestinations?.includes(destination.id)
  );
  
  res.json({
    success: true,
    data: filteredDestinations,
    total: filteredDestinations.length
  });
});

// Search API Route
app.get('/api/search', async (req, res) => {
  await delay(500);
  
  const { q: query } = req.query;
  
  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const searchTerm = query.toLowerCase();
  
  // Search tours
  const searchedTours = tours.filter(tour =>
    tour.title.toLowerCase().includes(searchTerm) ||
    tour.description.toLowerCase().includes(searchTerm) ||
    tour.location.toLowerCase().includes(searchTerm) ||
    tour.category.toLowerCase().includes(searchTerm) ||
    tour.highlights.some(h => h.toLowerCase().includes(searchTerm))
  );
  
  // Search destinations
  const searchedDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm) ||
    dest.country.toLowerCase().includes(searchTerm) ||
    dest.description.toLowerCase().includes(searchTerm)
  );
  
  // Search activities
  const searchedActivities = activities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm) ||
    activity.description.toLowerCase().includes(searchTerm) ||
    activity.highlights.some(h => h.toLowerCase().includes(searchTerm))
  );
  
  res.json({
    success: true,
    data: {
      tours: searchedTours,
      destinations: searchedDestinations,
      activities: searchedActivities
    },
    total: {
      tours: searchedTours.length,
      destinations: searchedDestinations.length,
      activities: searchedActivities.length
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗺️  Tours: http://localhost:${PORT}/api/tours`);
  console.log(`🏔️  Destinations: http://localhost:${PORT}/api/destinations`);
  console.log(`🎯 Activities: http://localhost:${PORT}/api/activities`);
});

module.exports = app;