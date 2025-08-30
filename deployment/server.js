const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const { dbHelpers, initializeDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware with relaxed CSP for API connections
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:3001", "https://zeo.brandspire.com.np", "https://www.zeo.brandspire.com.np"]
    }
  }
}));

// CORS configuration for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://zeo.brandspire.com.np', 'https://www.zeo.brandspire.com.np']
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to convert SQLite boolean integers to actual booleans
const convertBooleans = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(convertBooleans);
  }
  
  if (obj && typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'featured' && (value === 0 || value === 1)) {
        converted[key] = Boolean(value);
      } else if (typeof value === 'object') {
        converted[key] = convertBooleans(value);
      } else {
        converted[key] = value;
      }
    }
    return converted;
  }
  
  return obj;
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'SQLite',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get all destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const destinations = await dbHelpers.getAllDestinations();
    res.json(convertBooleans(destinations));
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get destination by slug
app.get('/api/destinations/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const destination = await dbHelpers.getDestinationBySlug(slug);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(convertBooleans(destination));
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tours by destination
app.get('/api/destinations/:slug/tours', async (req, res) => {
  try {
    const { slug } = req.params;
    const destination = await dbHelpers.getDestinationBySlug(slug);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    const tours = await dbHelpers.getToursByDestination(destination.id);
    res.json(convertBooleans(tours));
  } catch (error) {
    console.error('Error fetching tours by destination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all activities
app.get('/api/activities', async (req, res) => {
  try {
    const activities = await dbHelpers.getAllActivities();
    res.json(convertBooleans(activities));
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity by slug
app.get('/api/activities/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const activity = await dbHelpers.getActivityBySlug(slug);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(convertBooleans(activity));
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tours by activity
app.get('/api/activities/:slug/tours', async (req, res) => {
  try {
    const { slug } = req.params;
    const activity = await dbHelpers.getActivityBySlug(slug);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    const tours = await dbHelpers.getToursByActivity(activity.id);
    res.json(convertBooleans(tours));
  } catch (error) {
    console.error('Error fetching tours by activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tours
app.get('/api/tours', async (req, res) => {
  try {
    const { search, destination, activity, limit } = req.query;
    let tours;

    if (search) {
      tours = await dbHelpers.searchTours(search);
    } else if (destination) {
      const dest = await dbHelpers.getDestinationBySlug(destination);
      if (dest) {
        tours = await dbHelpers.getToursByDestination(dest.id);
      } else {
        tours = [];
      }
    } else if (activity) {
      const act = await dbHelpers.getActivityBySlug(activity);
      if (act) {
        tours = await dbHelpers.getToursByActivity(act.id);
      } else {
        tours = [];
      }
    } else {
      tours = await dbHelpers.getAllTours();
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        tours = tours.slice(0, limitNum);
      }
    }

    res.json(convertBooleans(tours));
  } catch (error) {
    console.error('Error fetching tours:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tour by ID
app.get('/api/tours/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tourId = parseInt(id);
    
    if (isNaN(tourId)) {
      return res.status(400).json({ error: 'Invalid tour ID' });
    }
    
    const tour = await dbHelpers.getTourById(tourId);
    
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    res.json(convertBooleans(tour));
  } catch (error) {
    console.error('Error fetching tour:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search tours
app.get('/api/search', async (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let results = {};

    if (!type || type === 'tours') {
      results.tours = await dbHelpers.searchTours(q);
    }

    if (!type || type === 'destinations') {
      const destinations = await dbHelpers.getAllDestinations();
      results.destinations = destinations.filter(dest => 
        dest.name.toLowerCase().includes(q.toLowerCase()) ||
        dest.description.toLowerCase().includes(q.toLowerCase()) ||
        dest.country.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (!type || type === 'activities') {
      const activities = await dbHelpers.getAllActivities();
      results.activities = activities.filter(activity => 
        activity.name.toLowerCase().includes(q.toLowerCase()) ||
        (activity.description && activity.description.toLowerCase().includes(q.toLowerCase()))
      );
    }

    res.json(convertBooleans(results));
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Featured content endpoint
app.get('/api/featured', async (req, res) => {
  try {
    const destinations = await dbHelpers.getAllDestinations();
    const activities = await dbHelpers.getAllActivities();
    const tours = await dbHelpers.getAllTours();

    const featuredDestinations = destinations.filter(d => d.featured);
    const featuredActivities = activities.filter(a => a.featured);
    const featuredTours = tours.filter(t => t.featured);

    res.json(convertBooleans({
      destinations: featuredDestinations.slice(0, 6),
      activities: featuredActivities.slice(0, 6),
      tours: featuredTours.slice(0, 6)
    }));
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all sliders
app.get('/api/sliders', async (req, res) => {
  try {
    const sliders = await dbHelpers.getAllSliders();
    res.json(convertBooleans(sliders));
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get slider by ID
app.get('/api/sliders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const sliderId = parseInt(id);
    
    if (isNaN(sliderId)) {
      return res.status(400).json({ error: 'Invalid slider ID' });
    }
    
    const slider = await dbHelpers.getSliderById(sliderId);
    
    if (!slider) {
      return res.status(404).json({ error: 'Slider not found' });
    }
    
    res.json(convertBooleans(slider));
  } catch (error) {
    console.error('Error fetching slider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Serve React app for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    console.log('Database initialized successfully');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Zeo Tourism Server running on port ${PORT}`);
      console.log(`📊 Database: SQLite with sqlite3`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;