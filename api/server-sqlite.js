const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { dbHelpers } = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

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

// Routes

// Get all destinations
app.get('/api/destinations', (req, res) => {
  try {
    const destinations = dbHelpers.getAllDestinations();
    res.json(convertBooleans(destinations));
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get destination by slug
app.get('/api/destinations/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const destination = dbHelpers.getDestinationBySlug(slug);
    
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
app.get('/api/destinations/:slug/tours', (req, res) => {
  try {
    const { slug } = req.params;
    const destination = dbHelpers.getDestinationBySlug(slug);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    const tours = dbHelpers.getToursByDestination(destination.id);
    res.json(convertBooleans(tours));
  } catch (error) {
    console.error('Error fetching tours by destination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all activities
app.get('/api/activities', (req, res) => {
  try {
    const activities = dbHelpers.getAllActivities();
    res.json(convertBooleans(activities));
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity by slug
app.get('/api/activities/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const activity = dbHelpers.getActivityBySlug(slug);
    
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
app.get('/api/activities/:slug/tours', (req, res) => {
  try {
    const { slug } = req.params;
    const activity = dbHelpers.getActivityBySlug(slug);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    const tours = dbHelpers.getToursByActivity(activity.id);
    res.json(convertBooleans(tours));
  } catch (error) {
    console.error('Error fetching tours by activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tours
app.get('/api/tours', (req, res) => {
  try {
    const { search, destination, activity, limit } = req.query;
    let tours;

    if (search) {
      tours = dbHelpers.searchTours(search);
    } else if (destination) {
      const dest = dbHelpers.getDestinationBySlug(destination);
      if (dest) {
        tours = dbHelpers.getToursByDestination(dest.id);
      } else {
        tours = [];
      }
    } else if (activity) {
      const act = dbHelpers.getActivityBySlug(activity);
      if (act) {
        tours = dbHelpers.getToursByActivity(act.id);
      } else {
        tours = [];
      }
    } else {
      tours = dbHelpers.getAllTours();
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
app.get('/api/tours/:id', (req, res) => {
  try {
    const { id } = req.params;
    const tourId = parseInt(id);
    
    if (isNaN(tourId)) {
      return res.status(400).json({ error: 'Invalid tour ID' });
    }
    
    const tour = dbHelpers.getTourById(tourId);
    
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
app.get('/api/search', (req, res) => {
  try {
    const { q, type } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    let results = {};

    if (!type || type === 'tours') {
      results.tours = dbHelpers.searchTours(q);
    }

    if (!type || type === 'destinations') {
      const destinations = dbHelpers.getAllDestinations();
      results.destinations = destinations.filter(dest => 
        dest.name.toLowerCase().includes(q.toLowerCase()) ||
        dest.description.toLowerCase().includes(q.toLowerCase()) ||
        dest.country.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (!type || type === 'activities') {
      const activities = dbHelpers.getAllActivities();
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
app.get('/api/featured', (req, res) => {
  try {
    const destinations = dbHelpers.getAllDestinations().filter(d => d.featured);
    const activities = dbHelpers.getAllActivities().filter(a => a.featured);
    const tours = dbHelpers.getAllTours().filter(t => t.featured);

    res.json(convertBooleans({
      destinations: destinations.slice(0, 6),
      activities: activities.slice(0, 6),
      tours: tours.slice(0, 6)
    }));
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'SQLite',
    version: '1.0.0'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SQLite API Server running on http://localhost:${PORT}`);
  console.log(`📊 Database: SQLite with better-sqlite3`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;