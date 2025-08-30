const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware with mobile-friendly CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:3001", "https://zeo.brandspire.com.np", "https://www.zeo.brandspire.com.np", "ws:", "wss:"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Enhanced CORS configuration for mobile compatibility
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = process.env.NODE_ENV === 'production' 
      ? ['https://zeo.brandspire.com.np', 'https://www.zeo.brandspire.com.np']
      : ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173'];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all origins for mobile compatibility
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mobile-friendly logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Add mobile-specific headers
app.use((req, res, next) => {
  // Mobile-friendly headers
  res.header('Cache-Control', 'public, max-age=300'); // 5 minutes cache
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  // Mobile detection
  const userAgent = req.get('User-Agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  req.isMobile = isMobile;
  
  next();
});

// Serve static files from the React app build
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '1d',
  etag: true
}));

// Load JSON data with error handling
let destinations = [];
let activities = [];
let tours = [];

const loadData = () => {
  try {
    destinations = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'destinations.json'), 'utf8'));
    activities = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'activities.json'), 'utf8'));
    tours = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tours.json'), 'utf8'));
    console.log(`✅ JSON data loaded: ${destinations.length} destinations, ${activities.length} activities, ${tours.length} tours`);
  } catch (error) {
    console.error('❌ Error loading JSON data:', error);
    // Fallback empty arrays
    destinations = [];
    activities = [];
    tours = [];
  }
};

// Load data on startup
loadData();

// Helper functions
const findBySlug = (array, slug) => array.find(item => item.slug === slug);
const findById = (array, id) => array.find(item => item.id === parseInt(id));

// API Routes with mobile optimizations

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'JSON Files',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    mobile: req.isMobile,
    dataLoaded: {
      destinations: destinations.length,
      activities: activities.length,
      tours: tours.length
    }
  });
});

// Get all destinations
app.get('/api/destinations', (req, res) => {
  try {
    // Mobile optimization: limit data if needed
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    let result = destinations;
    
    if (limit && limit > 0) {
      result = destinations.slice(0, limit);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ error: 'Internal server error', mobile: req.isMobile });
  }
});

// Get destination by slug
app.get('/api/destinations/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const destination = findBySlug(destinations, slug);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tours by destination
app.get('/api/destinations/:slug/tours', (req, res) => {
  try {
    const { slug } = req.params;
    const destination = findBySlug(destinations, slug);
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    const destinationTours = tours.filter(tour => tour.destination === destination.name);
    res.json(destinationTours);
  } catch (error) {
    console.error('Error fetching tours by destination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all activities
app.get('/api/activities', (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    let result = activities;
    
    if (limit && limit > 0) {
      result = activities.slice(0, limit);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get activity by slug
app.get('/api/activities/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const activity = findBySlug(activities, slug);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tours by activity
app.get('/api/activities/:slug/tours', (req, res) => {
  try {
    const { slug } = req.params;
    const activity = findBySlug(activities, slug);
    
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    
    const activityTours = tours.filter(tour => 
      tour.activities && tour.activities.includes(activity.name)
    );
    res.json(activityTours);
  } catch (error) {
    console.error('Error fetching tours by activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tours
app.get('/api/tours', (req, res) => {
  try {
    const { search, destination, activity, limit } = req.query;
    let filteredTours = [...tours];

    if (search) {
      const searchLower = search.toLowerCase();
      filteredTours = tours.filter(tour =>
        tour.title.toLowerCase().includes(searchLower) ||
        tour.description.toLowerCase().includes(searchLower) ||
        tour.location.toLowerCase().includes(searchLower) ||
        tour.destination.toLowerCase().includes(searchLower)
      );
    } else if (destination) {
      const dest = findBySlug(destinations, destination);
      if (dest) {
        filteredTours = tours.filter(tour => tour.destination === dest.name);
      } else {
        filteredTours = [];
      }
    } else if (activity) {
      const act = findBySlug(activities, activity);
      if (act) {
        filteredTours = tours.filter(tour => 
          tour.activities && tour.activities.includes(act.name)
        );
      } else {
        filteredTours = [];
      }
    }

    // Apply limit if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredTours = filteredTours.slice(0, limitNum);
      }
    }

    res.json(filteredTours);
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
    
    const tour = findById(tours, tourId);
    
    if (!tour) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    res.json(tour);
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

    const searchLower = q.toLowerCase();
    let results = {};

    if (!type || type === 'tours') {
      results.tours = tours.filter(tour =>
        tour.title.toLowerCase().includes(searchLower) ||
        tour.description.toLowerCase().includes(searchLower) ||
        tour.location.toLowerCase().includes(searchLower) ||
        tour.destination.toLowerCase().includes(searchLower)
      );
    }

    if (!type || type === 'destinations') {
      results.destinations = destinations.filter(dest => 
        dest.name.toLowerCase().includes(searchLower) ||
        dest.description.toLowerCase().includes(searchLower) ||
        dest.country.toLowerCase().includes(searchLower)
      );
    }

    if (!type || type === 'activities') {
      results.activities = activities.filter(activity => 
        activity.name.toLowerCase().includes(searchLower) ||
        (activity.description && activity.description.toLowerCase().includes(searchLower))
      );
    }

    res.json(results);
  } catch (error) {
    console.error('Error searching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Featured content endpoint
app.get('/api/featured', (req, res) => {
  try {
    const featuredDestinations = destinations.filter(d => d.featured);
    const featuredActivities = activities.filter(a => a.featured);
    const featuredTours = tours.filter(t => t.featured);

    res.json({
      destinations: featuredDestinations.slice(0, 6),
      activities: featuredActivities.slice(0, 6),
      tours: featuredTours.slice(0, 6)
    });
  } catch (error) {
    console.error('Error fetching featured content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all sliders (mobile-optimized)
app.get('/api/sliders', (req, res) => {
  try {
    const mockSliders = [
      {
        id: 1,
        title: "Experience Nepal",
        subtitle: "Immerse yourself in the beauty of Nepal",
        location: "Nepal Himalayas",
        image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
        video: null,
        order_index: 0,
        is_active: 1
      },
      {
        id: 2,
        title: "Adventure Awaits",
        subtitle: "Discover breathtaking mountain peaks",
        location: "Everest Region",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200",
        video: null,
        order_index: 1,
        is_active: 1
      }
    ];
    
    // Mobile optimization: smaller images
    if (req.isMobile) {
      mockSliders.forEach(slider => {
        slider.image = slider.image.replace('w=1200', 'w=800');
      });
    }
    
    res.json(mockSliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get slider by ID
app.get('/api/sliders/:id', (req, res) => {
  try {
    const { id } = req.params;
    const sliderId = parseInt(id);
    
    if (isNaN(sliderId)) {
      return res.status(400).json({ error: 'Invalid slider ID' });
    }
    
    // Mock slider data
    const mockSlider = {
      id: sliderId,
      title: "Experience Nepal",
      subtitle: "Immerse yourself in the beauty of Nepal",
      location: "Nepal Himalayas",
      image: req.isMobile 
        ? "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800"
        : "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
      video: null,
      order_index: 0,
      is_active: 1
    };
    
    res.json(mockSlider);
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
  res.status(500).json({ error: 'Internal server error', mobile: req.isMobile });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Zeo Tourism Server (JSON Mode) running on port ${PORT}`);
  console.log(`📊 Database: JSON Files`);
  console.log(`📱 Mobile optimizations: Enabled`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;