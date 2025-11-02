const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'zeo-tourism-admin-secret-key-2024';

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:3000',
      'https://zeotourism.com',
      'http://zeotourism.com',
      'https://www.zeotourism.com',
      'http://www.zeotourism.com',
      'https://zeo.brandspire.com.np',
      'http://zeo.brandspire.com.np'
    ];
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // For development, allow any localhost origin
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log('Allowing development origin:', origin);
      return callback(null, true);
    }
    
    console.log('CORS blocked origin:', origin);
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Range', 'Cache-Control', 'X-Requested-With', 'Accept', 'Accept-Encoding'],
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length', 'Content-Type']
}));
app.use(morgan('combined'));
app.use(express.json());

// Create uploads directory structure if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
const slidersDir = path.join(uploadsDir, 'sliders');
const imagesDir = path.join(slidersDir, 'images');
const videosDir = path.join(slidersDir, 'videos');
const kailashGalleryDir = path.join(uploadsDir, 'kailash-gallery');

// Create all necessary directories
[uploadsDir, slidersDir, imagesDir, videosDir, kailashGalleryDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Serve uploaded files statically with proper headers for video streaming
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(uploadsDir, req.path);
  
  // Set CORS headers for all uploads
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://zeotourism.com',
    'http://zeotourism.com',
    'https://www.zeotourism.com',
    'http://www.zeotourism.com',
    'https://zeo.brandspire.com.np',
    'http://zeo.brandspire.com.np'
  ];
  
  if (allowedOrigins.includes(origin)) {
    res.set({
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Accept, Accept-Encoding, Cache-Control',
      'Cross-Origin-Resource-Policy': 'cross-origin'
    });
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    const stat = fs.statSync(filePath);
    
    // Set proper headers for video streaming
    if (req.path.includes('.mp4') || req.path.includes('.webm') || req.path.includes('.mov')) {
      res.set({
        'Accept-Ranges': 'bytes',
        'Content-Type': 'video/mp4',
        'Cache-Control': 'public, max-age=31536000',
        'Content-Length': stat.size.toString()
      });
      
      // Handle range requests for video streaming
      const range = req.headers.range;
      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;
        
        res.set({
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Content-Length': chunksize.toString()
        });
        res.status(206);
        
        const stream = fs.createReadStream(filePath, { start, end });
        stream.pipe(res);
        return;
      }
    } else if (req.path.includes('.jpg') || req.path.includes('.jpeg') || req.path.includes('.png') || req.path.includes('.webp')) {
      res.set({
        'Content-Type': req.path.includes('.webp') ? 'image/webp' : req.path.includes('.png') ? 'image/png' : 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000'
      });
    }
    
    // File exists, serve it normally
    express.static(uploadsDir)(req, res, next);
  } else {
    // File doesn't exist, serve a placeholder image
    const placeholder = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==',
      'base64'
    );
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=3600');
    res.send(placeholder);
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Determine destination based on file type
    let uploadPath;
    if (file.mimetype.startsWith('image/')) {
      uploadPath = imagesDir;
    } else if (file.mimetype.startsWith('video/')) {
      uploadPath = videosDir;
    } else {
      return cb(new Error('Invalid file type. Only images and videos are allowed.'));
    }
    
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}_${sanitizedName}`;
    cb(null, filename);
  }
});

// File filter to only allow images and videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit for very large videos (will be compressed)
  }
});

// Compression functions
const compressImage = async (inputPath, outputPath, quality = 85) => {
  try {
    await sharp(inputPath)
      .jpeg({ quality, progressive: true })
      .png({ compressionLevel: 6, progressive: true })
      .webp({ quality, effort: 4 })
      .toFile(outputPath);
    
    // Delete original file if compression was successful
    if (fs.existsSync(outputPath) && inputPath !== outputPath) {
      fs.unlinkSync(inputPath);
    }
    
    return outputPath;
  } catch (error) {
    console.error('Image compression error:', error);
    // If compression fails, return original path
    return inputPath;
  }
};

const compressVideo = (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .videoBitrate('2000k') // Increased for better quality
      .audioBitrate('128k')
      .format('mp4')
      .size('1920x1080') // Ensure consistent resolution
      .outputOptions([
        '-preset medium', // Better compression
        '-crf 20', // Higher quality (lower CRF)
        '-movflags +faststart', // Optimize for web streaming
        '-pix_fmt yuv420p', // Ensure compatibility
        '-profile:v baseline', // Better browser compatibility
        '-level 3.0' // Compatibility level
      ])
      .on('progress', (progress) => {
        console.log(`Video compression progress: ${Math.round(progress.percent || 0)}%`);
      })
      .on('end', () => {
        console.log('Video compression completed successfully');
        // Delete original file if compression was successful
        if (fs.existsSync(outputPath) && inputPath !== outputPath) {
          fs.unlinkSync(inputPath);
        }
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Video compression error:', err);
        // If compression fails, return original path
        resolve(inputPath);
      })
      .save(outputPath);
  });
};

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

// Save data to JSON files
const saveData = (filename, data) => {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error saving ${filename}:`, error);
    return false;
  }
};

// Load tour details from individual files
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

// Load all data
let toursData = loadData('tours.json');
let destinationsData = loadData('destinations.json');
let activitiesData = loadData('activities.json');
let slidersData = loadData('sliders.json');
let usersData = loadData('users.json');
let contactData = loadData('contact.json');
let testimonialsData = loadData('testimonials.json');
let logoData = loadData('logos.json');
let enquiriesData = loadData('enquiries.json');
let kailashGalleryData = loadData('kailash-gallery.json');
let tourDetails = loadTourDetails();

// Extract arrays from the loaded data
let tours = toursData.tours || toursData || [];
let destinations = destinationsData.destinations || destinationsData || [];
let activities = activitiesData.activities || activitiesData || [];
let sliders = slidersData.sliders || slidersData || [];
let users = usersData.users || usersData || [];
let contact = contactData || {};
let testimonials = testimonialsData.testimonials || testimonialsData || [];
let enquiries = enquiriesData || {};
let logos = logoData.logos || logoData || {
  header: '/src/assets/zeo-logo.png',
  footer: '/src/assets/zeo-logo-white.png',
  lastUpdated: new Date().toISOString()
};
let kailashGallery = kailashGalleryData || {
  gallery: [],
  metadata: {
    totalPhotos: 0,
    lastUpdated: new Date().toISOString(),
    pageTitle: 'Kailash Mansarovar',
    pageSubtitle: 'Sacred Journey Gallery'
  }
};

// Helper functions
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Zeo Tourism API is running successfully!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    server: 'json-mode',
    database: 'JSON Files'
  });
});

// ==================== AUTHENTICATION API ====================

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // For demo purposes, use hardcoded admin credentials
    const adminEmail = 'admin@zeotourism.com';
    const adminPassword = 'admin123';

    if (email === adminEmail && password === adminPassword) {
      const user = {
        id: 1,
        name: 'Admin User',
        email: adminEmail,
        isAdmin: true
      };

      const token = jwt.sign(
        { id: user.id, email: user.email, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== SLIDERS API ====================

// Get all active sliders (public endpoint)
app.get('/api/sliders', async (req, res) => {
  try {
    await delay(200);
    const activeSliders = sliders
      .filter(slider => slider.is_active)
      .sort((a, b) => a.order_index - b.order_index);
    res.json(activeSliders);
  } catch (error) {
    console.error('Error fetching sliders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all sliders including inactive ones (admin endpoint)
app.get('/api/admin/sliders', authenticateToken, async (req, res) => {
  try {
    await delay(200);
    const sortedSliders = sliders.sort((a, b) => a.order_index - b.order_index);
    res.json(sortedSliders);
  } catch (error) {
    console.error('Error fetching admin sliders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create new slider with file upload
app.post('/api/admin/sliders', authenticateToken, (req, res) => {
  upload.single('mediaFile')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    try {
      console.log('Creating new slider...');
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
      
      const sliderData = JSON.parse(req.body.sliderData || '{}');
      const file = req.file;
      
      console.log('Parsed slider data:', sliderData);
      
      // Build the slider object
      const newSlider = {
        id: Math.max(...sliders.map(s => s.id), 0) + 1,
        title: sliderData.title || '',
        subtitle: sliderData.subtitle || '',
        location: sliderData.location || '',
        image: sliderData.image || '',
        video: sliderData.video || '',
        order_index: sliderData.order_index || 1,
        is_active: sliderData.is_active !== undefined ? sliderData.is_active : true,
        button_text: sliderData.button_text || '',
        button_url: sliderData.button_url || '',
        button_style: sliderData.button_style || 'primary',
        show_button: sliderData.show_button !== undefined ? sliderData.show_button : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // If a file was uploaded, compress and update the appropriate field
      if (file) {
        console.log('Processing uploaded file:', file.filename);
        let processedFilePath = file.path;
        
        if (file.mimetype.startsWith('image/')) {
          // Compress image
          const compressedFileName = `compressed_${file.filename}`;
          const compressedPath = path.join(path.dirname(file.path), compressedFileName);
          
          console.log('Compressing image...');
          processedFilePath = await compressImage(file.path, compressedPath, 85);
          
          const relativePath = path.relative(uploadsDir, processedFilePath).replace(/\\/g, '/');
          const fileUrl = `/uploads/${relativePath}`;
          
          newSlider.image = fileUrl;
          newSlider.video = ''; // Clear video if image is uploaded
          
          console.log('Image compressed and saved:', fileUrl);
        } else if (file.mimetype.startsWith('video/')) {
          // Compress video
          const compressedFileName = `compressed_${path.parse(file.filename).name}.mp4`;
          const compressedPath = path.join(path.dirname(file.path), compressedFileName);
          
          console.log('Compressing video...');
          processedFilePath = await compressVideo(file.path, compressedPath);
          
          const relativePath = path.relative(uploadsDir, processedFilePath).replace(/\\/g, '/');
          const fileUrl = `/uploads/${relativePath}`;
          
          newSlider.video = fileUrl;
          // Keep existing image as thumbnail or use a default
          if (!newSlider.image) {
            newSlider.image = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&h=1080&fit=crop';
          }
          
          console.log('Video compressed and saved:', fileUrl);
        }
      }
      
      console.log('Final slider object:', newSlider);
      
      sliders.push(newSlider);
      const saved = saveData('sliders.json', sliders);
      
      if (!saved) {
        throw new Error('Failed to save slider data to file');
      }
      
      console.log('Slider created successfully');
      res.status(201).json(newSlider);
    } catch (error) {
      console.error('Error creating slider:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
});

// Admin: Update slider with file upload
app.put('/api/admin/sliders/:id', authenticateToken, (req, res) => {
  upload.single('mediaFile')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    try {
      console.log('Updating slider with ID:', req.params.id);
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
      
      const { id } = req.params;
      const updateData = JSON.parse(req.body.sliderData || '{}');
      const file = req.file;
      const sliderIndex = sliders.findIndex(s => s.id === parseInt(id));
      
      if (sliderIndex === -1) {
        return res.status(404).json({ error: 'Slider not found' });
      }
      
      const existingSlider = sliders[sliderIndex];
      
      // If a new file was uploaded, compress and handle it
      if (file) {
        console.log('Processing uploaded file for update:', file.filename);
        let processedFilePath = file.path;
        
        // Delete old file if it exists and is a local upload
        if (file.mimetype.startsWith('image/') && existingSlider.image && existingSlider.image.startsWith('/uploads/')) {
          const oldImagePath = path.join(__dirname, existingSlider.image);
          if (fs.existsSync(oldImagePath)) {
            console.log('Deleting old image:', oldImagePath);
            fs.unlinkSync(oldImagePath);
          }
        } else if (file.mimetype.startsWith('video/') && existingSlider.video && existingSlider.video.startsWith('/uploads/')) {
          const oldVideoPath = path.join(__dirname, existingSlider.video);
          if (fs.existsSync(oldVideoPath)) {
            console.log('Deleting old video:', oldVideoPath);
            fs.unlinkSync(oldVideoPath);
          }
        }
        
        if (file.mimetype.startsWith('image/')) {
          // Compress image
          const compressedFileName = `compressed_${file.filename}`;
          const compressedPath = path.join(path.dirname(file.path), compressedFileName);
          
          console.log('Compressing image for update...');
          processedFilePath = await compressImage(file.path, compressedPath, 85);
          
          const relativePath = path.relative(uploadsDir, processedFilePath).replace(/\\/g, '/');
          const fileUrl = `/uploads/${relativePath}`;
          
          updateData.image = fileUrl;
          updateData.video = ''; // Clear video if image is uploaded
          
          console.log('Image compressed and updated:', fileUrl);
        } else if (file.mimetype.startsWith('video/')) {
          // Compress video
          const compressedFileName = `compressed_${path.parse(file.filename).name}.mp4`;
          const compressedPath = path.join(path.dirname(file.path), compressedFileName);
          
          console.log('Compressing video for update...');
          processedFilePath = await compressVideo(file.path, compressedPath);
          
          const relativePath = path.relative(uploadsDir, processedFilePath).replace(/\\/g, '/');
          const fileUrl = `/uploads/${relativePath}`;
          
          updateData.video = fileUrl;
          // Keep existing image as thumbnail if not provided
          if (!updateData.image) {
            updateData.image = existingSlider.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&h=1080&fit=crop';
          }
          
          console.log('Video compressed and updated:', fileUrl);
        }
      }
      
      sliders[sliderIndex] = {
        ...existingSlider,
        ...updateData,
        updated_at: new Date().toISOString()
      };
      
      console.log('Updated slider:', sliders[sliderIndex]);
      
      const saved = saveData('sliders.json', sliders);
      if (!saved) {
        throw new Error('Failed to save slider data to file');
      }
      
      console.log('Slider updated successfully');
      res.json(sliders[sliderIndex]);
    } catch (error) {
      console.error('Error updating slider:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
});

// Admin: Delete slider
app.delete('/api/admin/sliders/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const sliderIndex = sliders.findIndex(s => s.id === parseInt(id));
    
    if (sliderIndex === -1) {
      return res.status(404).json({ error: 'Slider not found' });
    }
    
    const slider = sliders[sliderIndex];
    
    // Delete associated files if they are local uploads
    if (slider.image && slider.image.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, slider.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    if (slider.video && slider.video.startsWith('/uploads/')) {
      const videoPath = path.join(__dirname, slider.video);
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }
    
    sliders.splice(sliderIndex, 1);
    saveData('sliders.json', sliders);
    
    res.json({ message: 'Slider deleted successfully' });
  } catch (error) {
    console.error('Error deleting slider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to update destination relationships when tour relationships change
const updateDestinationRelationships = (tourId, newPrimaryDestId, newSecondaryDestIds = [], oldPrimaryDestId = null, oldSecondaryDestIds = []) => {
  // Remove tour from all old destinations
  const allOldDestIds = [oldPrimaryDestId, ...oldSecondaryDestIds].filter(Boolean);
  allOldDestIds.forEach(destId => {
    const destIndex = destinations.findIndex(d => d.id === destId);
    if (destIndex !== -1) {
      const relatedTours = destinations[destIndex].relatedTours || [];
      destinations[destIndex].relatedTours = relatedTours.filter(id => id !== tourId);
    }
  });

  // Add tour to all new destinations (primary + secondary)
  const allNewDestIds = [newPrimaryDestId, ...newSecondaryDestIds].filter(Boolean);
  allNewDestIds.forEach(destId => {
    const destIndex = destinations.findIndex(d => d.id === destId);
    if (destIndex !== -1) {
      const relatedTours = destinations[destIndex].relatedTours || [];
      if (!relatedTours.includes(tourId)) {
        destinations[destIndex].relatedTours = [...relatedTours, tourId];
      }
    }
  });

  // Save updated destinations
  saveData('destinations.json', destinations);
};

// ==================== TOURS API ====================

// Get all tours (merge basic tours with detailed tours)
app.get('/api/tours', async (req, res) => {
  await delay(300);
  
  const { category, location, search, featured } = req.query;
  
  // Merge basic tours with detailed tours, prioritizing detailed tours
  const allTours = [...tourDetails];
  
  // Add basic tours that don't have detailed versions
  tours.forEach(basicTour => {
    const hasDetailedVersion = tourDetails.some(detailedTour => detailedTour.id === basicTour.id);
    if (!hasDetailedVersion) {
      allTours.push(basicTour);
    }
  });

  // Filter out unlisted tours (only show tours where listed is true or undefined)
  let filteredTours = allTours.filter(tour => tour.listed !== false);

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
      (tour.highlights && tour.highlights.some(h => h.toLowerCase().includes(searchTerm)))
    );
  }

  res.json(filteredTours);
});

// Admin: Get all tours with pagination and admin-specific features
app.get('/api/admin/tours', authenticateToken, async (req, res) => {
  try {
    console.log('Admin tours request:', req.query);
    
    const { page = 1, limit = 20, search, destination } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    // Merge basic tours with detailed tours, prioritizing detailed tours
    const allTours = [...tourDetails];
    
    // Add basic tours that don't have detailed versions
    tours.forEach(basicTour => {
      const hasDetailedVersion = tourDetails.some(detailedTour => detailedTour.id === basicTour.id);
      if (!hasDetailedVersion) {
        allTours.push(basicTour);
      }
    });
    
    let filteredTours = [...allTours];
    
    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredTours = filteredTours.filter(tour =>
        tour.title.toLowerCase().includes(searchTerm) ||
        tour.description.toLowerCase().includes(searchTerm) ||
        tour.location.toLowerCase().includes(searchTerm) ||
        tour.category.toLowerCase().includes(searchTerm) ||
        (tour.highlights && tour.highlights.some(h => h.toLowerCase().includes(searchTerm)))
      );
    }
    
    // Destination filter
    if (destination) {
      filteredTours = filteredTours.filter(tour =>
        tour.location.toLowerCase().includes(destination.toLowerCase()) ||
        (tour.destination_name && tour.destination_name.toLowerCase().includes(destination.toLowerCase()))
      );
    }
    
    // Sort by ID descending (newest first)
    filteredTours.sort((a, b) => b.id - a.id);
    
    // Calculate pagination
    const totalItems = filteredTours.length;
    const totalPages = Math.ceil(totalItems / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    // Apply pagination
    const paginatedTours = filteredTours.slice(startIndex, endIndex);
    
    console.log(`Returning ${paginatedTours.length} tours out of ${totalItems} total`);
    
    res.json({
      tours: paginatedTours,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching admin tours:', error);
    res.status(500).json({ error: 'Failed to fetch tours' });
  }
});

// Admin: Create new tour with relationship management
app.post('/api/admin/tours', authenticateToken, async (req, res) => {
  try {
    console.log('Creating new tour with relationships...');
    console.log('Request body:', req.body);
    
    const tourData = req.body;
    const newTour = {
      ...tourData,
      id: Math.max(...tours.map(t => t.id), ...tourDetails.map(t => t.id), 0) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to tours array
    tourDetails.push(newTour);
    
    // Update destination relationships
    if (newTour.primary_destination_id || (newTour.secondary_destination_ids && newTour.secondary_destination_ids.length > 0)) {
      updateDestinationRelationships(
        newTour.id,
        newTour.primary_destination_id,
        newTour.secondary_destination_ids || []
      );
    }
    
    // Save tour data to both the detailed file and the main tours array
    const updatedTour = tourDetails[tourIndex];
    const detailFilename = path.join('tour-details', `${updatedTour.slug}.json`);
    const savedDetail = saveData(detailFilename, updatedTour);

    // Also update the main tours.json file
    const mainTourIndex = tours.findIndex(t => t.id === updatedTour.id);
    if (mainTourIndex !== -1) {
      tours[mainTourIndex] = { ...tours[mainTourIndex], ...updatedTour }; // Update existing
    } else {
      tours.push(updatedTour); // Or add if it's a new tour somehow
    }
    const savedMain = saveData('tours.json', { tours });

    if (!savedDetail || !savedMain) {
      throw new Error('Failed to save tour data to file');
    }
    
    console.log('Tour created successfully with relationships');
    res.status(201).json(newTour);
  } catch (error) {
    console.error('Error creating tour:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Admin: Update tour with relationship management
app.put('/api/admin/tours/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Updating tour with relationships...');
    console.log('Request body:', req.body);
    
    const { id } = req.params;
    const tourData = req.body;
    
    // Find tour in both arrays
    const tourIndex = tours.findIndex(t => t.id === parseInt(id));
    const tourDetailIndex = tourDetails.findIndex(t => t.id === parseInt(id));
    
    if (tourIndex === -1) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    const existingTour = tours[tourIndex];
    const oldPrimaryDestId = existingTour.primary_destination_id || existingTour.destination_id || null;
    const oldSecondaryDestIds = existingTour.secondary_destination_ids || [];
    const newPrimaryDestId = tourData.primary_destination_id || null;
    const newSecondaryDestIds = tourData.secondary_destination_ids || [];
    
    // Update tour data in main tours array
    const updatedTour = {
      ...existingTour,
      ...tourData,
      updated_at: new Date().toISOString()
    };
    
    tours[tourIndex] = updatedTour;
    
    // Update tour details array if it exists
    if (tourDetailIndex !== -1) {
      tourDetails[tourDetailIndex] = updatedTour;
    }
    
    // Update destination relationships
    updateDestinationRelationships(
      parseInt(id),
      newPrimaryDestId,
      newSecondaryDestIds,
      oldPrimaryDestId,
      oldSecondaryDestIds
    );
    
    // Save to both the individual tour-detail file and main tours.json
    const detailFilename = path.join('tour-details', `${updatedTour.slug}.json`);
    const savedDetail = saveData(detailFilename, updatedTour);
    const savedMain = saveData('tours.json', { tours });
    
    if (!savedDetail || !savedMain) {
      throw new Error('Failed to save tour data to file');
    }
    
    console.log('Tour updated successfully with relationships');
    res.json(updatedTour);
  } catch (error) {
    console.error('Error updating tour:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Admin: Delete tour with relationship cleanup
app.delete('/api/admin/tours/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Deleting tour with relationships...');
    
    const { id } = req.params;
    const tourIndex = tourDetails.findIndex(t => t.id === parseInt(id));
    
    if (tourIndex === -1) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    const tour = tourDetails[tourIndex];
    const primaryDestId = tour.primary_destination_id || tour.destination_id || null;
    const secondaryDestIds = tour.secondary_destination_ids || [];
    
    // Remove tour from arrays
    tourDetails.splice(tourIndex, 1);
    
    // Clean up destination relationships
    updateDestinationRelationships(
      parseInt(id),
      null, // no new primary destination
      [], // no new secondary destinations
      primaryDestId, // old primary destination to remove
      secondaryDestIds // old secondary destinations to remove
    );
    
    // Save tour data
    const saved = saveData('tours.json', { tours: tourDetails });
    if (!saved) {
      throw new Error('Failed to save tour data to file');
    }
    
    console.log('Tour deleted successfully with relationship cleanup');
    res.json({ message: 'Tour deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Admin: Update tour listing status
app.patch('/api/admin/tours/:id/listing', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { listed } = req.body;
    
    // Validate input
    if (typeof listed !== 'boolean') {
      return res.status(400).json({ error: 'Listed status must be a boolean value' });
    }
    
    // Find tour in tourDetails array
    const tourIndex = tourDetails.findIndex(t => t.id === parseInt(id));
    
    if (tourIndex === -1) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    // Update the listing status
    tourDetails[tourIndex].listed = listed;
    
    // Save the updated data
    const saved = saveData('tours.json', { tours: tourDetails });
    if (!saved) {
      throw new Error('Failed to save tour data to file');
    }
    
    console.log(`Tour ${id} listing status updated to: ${listed}`);
    res.json(tourDetails[tourIndex]);
  } catch (error) {
    console.error('Error updating tour listing status:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Get tour by slug (admin endpoint with authentication)
app.get('/api/admin/tours/slug/:slug', authenticateToken, async (req, res) => {
  await delay(200);
  
  const { slug } = req.params;
  const tour = tourDetails.find(t => t.slug === slug);
  
  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found'
    });
  }
  
  res.json(tour);
});

// Get tour by ID (check detailed tours first, then basic tours)
app.get('/api/tours/:id', async (req, res) => {
  await delay(200);
  
  const tourId = parseInt(req.params.id);
  
  // First check detailed tours
  let tour = tourDetails.find(t => t.id === tourId);
  
  // If not found, check basic tours
  if (!tour) {
    tour = tours.find(t => t.id === tourId);
  }
  
  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found'
    });
  }
  
  // Check if tour is listed (public access should only see listed tours)
  if (tour.listed === false) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found'
    });
  }
  
  res.json(tour);
});

// Get tour by slug (for detailed tours)
app.get('/api/tours/slug/:slug', async (req, res) => {
  await delay(200);
  
  const { slug } = req.params;
  const tour = tourDetails.find(t => t.slug === slug);
  
  if (!tour) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found'
    });
  }
  
  // Check if tour is listed (public access should only see listed tours)
  if (tour.listed === false) {
    return res.status(404).json({
      success: false,
      message: 'Tour not found'
    });
  }
  
  res.json(tour);
});

// ==================== DESTINATIONS API ====================

// Get all destinations
app.get('/api/destinations', async (req, res) => {
  await delay(300);
  
  const { country } = req.query;
  let filteredDestinations = [...destinations];

  // Calculate dynamic tour counts based on actual relationships
  filteredDestinations = filteredDestinations.map(dest => ({
    ...dest,
    tourCount: (dest.relatedTours || []).length
  }));

  // Filter by country
  if (country) {
    filteredDestinations = filteredDestinations.filter(dest =>
      dest.country.toLowerCase() === country.toLowerCase()
    );
  }

  res.json(filteredDestinations);
});

// Get destination by slug
app.get('/api/destinations/:slug', async (req, res) => {
  await delay(200);
  
  const slug = req.params.slug;
  const destination = destinations.find(d => d.slug === slug);
  
  if (!destination) {
    return res.status(404).json({
      success: false,
      message: 'Destination not found'
    });
  }
  
  res.json(destination);
});

// ==================== ACTIVITIES API ====================

// Get all activities
app.get('/api/activities', async (req, res) => {
  await delay(300);
  
  const { type } = req.query;
  let filteredActivities = [...activities];

  // Filter by type
  if (type) {
    filteredActivities = filteredActivities.filter(activity => activity.type === type);
  }

  res.json(filteredActivities);
});

// Get activity by ID
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
  
  res.json(activity);
});

// ==================== ADMIN DESTINATIONS API ====================

// Admin: Get all destinations (including inactive ones)
app.get('/api/admin/destinations', authenticateToken, async (req, res) => {
  try {
    await delay(200);
    res.json(destinations);
  } catch (error) {
    console.error('Error fetching admin destinations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get single destination by identifier (slug or ID)
app.get('/api/admin/destinations/:identifier', authenticateToken, async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by slug first, then by ID
    let destination = destinations.find(d => d.slug === identifier);
    if (!destination) {
      destination = destinations.find(d => d.id === parseInt(identifier));
    }
    
    if (!destination) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Create new destination
app.post('/api/admin/destinations', authenticateToken, async (req, res) => {
  try {
    console.log('Creating new destination...');
    console.log('Request body:', req.body);
    
    const { slug, title, country, region, image, featured, listed, description } = req.body;
    
    // Validate required fields
    if (!slug || !title || !country) {
      return res.status(400).json({ error: 'Slug, title, and country are required' });
    }
    
    // Check if destination with this slug already exists
    const existingDestination = destinations.find(d => d.slug === slug);
    if (existingDestination) {
      return res.status(400).json({ error: 'A destination with this slug already exists' });
    }
    
    const newDestination = {
      id: Math.max(...destinations.map(d => d.id), 0) + 1,
      name: title,
      slug: slug,
      title: title,
      country: country,
      region: region || '',
      image: image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
      featured: featured || false,
      listed: listed !== false, // Default to true unless explicitly set to false
      tourCount: 0,
      href: `/destinations/${slug}`,
      type: country.toLowerCase() === 'nepal' ? 'nepal' : 'international',
      description: description || `Discover the beauty and culture of ${title} in ${country}.`,
      highlights: [],
      bestTime: 'Year-round',
      altitude: 'Varies',
      difficulty: 'Easy to Moderate',
      relatedTours: [],
      relatedActivities: []
    };
    
    destinations.push(newDestination);
    const saved = saveData('destinations.json', destinations);
    
    if (!saved) {
      throw new Error('Failed to save destination data to file');
    }
    
    console.log('Destination created successfully');
    res.status(201).json(newDestination);
  } catch (error) {
    console.error('Error creating destination:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Admin: Update destination (supports both slug and ID)
app.put('/api/admin/destinations/:identifier', authenticateToken, async (req, res) => {
  try {
    console.log('Updating destination with identifier:', req.params.identifier);
    console.log('Request body:', req.body);
    
    const { identifier } = req.params;
    const { title, country, region, image, featured, listed, description } = req.body;
    
    // Try to find by slug first, then by ID
    let destinationIndex = destinations.findIndex(d => d.slug === identifier);
    if (destinationIndex === -1) {
      destinationIndex = destinations.findIndex(d => d.id === parseInt(identifier));
    }
    
    if (destinationIndex === -1) {
      return res.status(404).json({ error: 'Destination not found' });
    }
    
    const existingDestination = destinations[destinationIndex];
    
    // Update the destination with explicit image URL update
    const updatedDestination = {
      ...existingDestination,
      name: title || existingDestination.name,
      title: title || existingDestination.title,
      country: country || existingDestination.country,
      region: region !== undefined ? region : existingDestination.region,
      image: image || existingDestination.image, // This should be the new uploaded image URL
      featured: featured !== undefined ? featured : existingDestination.featured,
      listed: listed !== undefined ? listed : existingDestination.listed,
      type: country ? (country.toLowerCase() === 'nepal' ? 'nepal' : 'international') : existingDestination.type,
      description: description || (title ? `Discover the beauty and culture of ${title} in ${country || existingDestination.country}.` : existingDestination.description)
    };
    
    destinations[destinationIndex] = updatedDestination;
    
    const saved = saveData('destinations.json', destinations);
    if (!saved) {
      throw new Error('Failed to save destination data to file');
    }
    
    console.log('Destination updated successfully with new image:', updatedDestination.image);
    res.json(updatedDestination);
  } catch (error) {
    console.error('Error updating destination:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Admin: Delete destination (supports both slug and ID)
app.delete('/api/admin/destinations/:identifier', authenticateToken, async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Validate identifier
    if (!identifier || identifier.trim() === '' || identifier === 'undefined' || identifier === 'null') {
      console.error('Invalid destination identifier received:', identifier);
      return res.status(400).json({ error: 'Invalid destination identifier provided' });
    }
    
    // Log the deletion attempt for debugging
    console.log('Attempting to delete destination with identifier:', identifier);
    console.log('Available destinations:', destinations.map(d => ({ id: d.id, slug: d.slug, name: d.name })));
    
    // Try to find by slug first, then by ID
    let destinationIndex = destinations.findIndex(d => d.slug === identifier);
    if (destinationIndex === -1) {
      // Only try to parse as integer if it looks like a number
      const numericId = parseInt(identifier);
      if (!isNaN(numericId)) {
        destinationIndex = destinations.findIndex(d => d.id === numericId);
      }
    }
    
    if (destinationIndex === -1) {
      console.error('Destination not found:', {
        identifier,
        availableDestinations: destinations.map(d => ({ id: d.id, slug: d.slug, name: d.name }))
      });
      return res.status(404).json({ 
        error: 'Destination not found',
        message: `No destination found with identifier "${identifier}". Please check if the destination exists.`
      });
    }
    
    const destinationToDelete = destinations[destinationIndex];
    console.log('Found destination to delete:', destinationToDelete);
    
    destinations.splice(destinationIndex, 1);
    const saved = saveData('destinations.json', destinations);
    
    if (!saved) {
      throw new Error('Failed to save destination data to file');
    }
    
    console.log('Successfully deleted destination:', destinationToDelete.name || destinationToDelete.title);
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    console.error('Error deleting destination:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== ADMIN ENQUIRIES API ====================

// Admin: Get all enquiries
app.get('/api/admin/enquiries', authenticateToken, async (req, res) => {
  try {
    await delay(200);
    res.json(enquiries.enquiries || []);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Get single enquiry by ID
app.get('/api/admin/enquiries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = enquiries.enquiries.find(e => e.id === parseInt(id));
    
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    
    res.json(enquiry);
  } catch (error) {
    console.error('Error fetching enquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update enquiry (for notes, assignment, etc.)
app.put('/api/admin/enquiries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { assigned_to, notes, responded_at } = req.body;
    
    const enquiryIndex = enquiries.enquiries.findIndex(e => e.id === parseInt(id));
    if (enquiryIndex === -1) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    
    const updatedEnquiry = {
      ...enquiries.enquiries[enquiryIndex],
      assigned_to: assigned_to !== undefined ? assigned_to : enquiries.enquiries[enquiryIndex].assigned_to,
      notes: notes !== undefined ? notes : enquiries.enquiries[enquiryIndex].notes,
      responded_at: responded_at !== undefined ? responded_at : enquiries.enquiries[enquiryIndex].responded_at,
      updated_at: new Date().toISOString()
    };
    
    enquiries.enquiries[enquiryIndex] = updatedEnquiry;
    
    const saved = saveData('enquiries.json', enquiries);
    if (!saved) {
      throw new Error('Failed to save enquiry data to file');
    }
    
    res.json(updatedEnquiry);
  } catch (error) {
    console.error('Error updating enquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Delete enquiry
app.delete('/api/admin/enquiries/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const enquiryIndex = enquiries.enquiries.findIndex(e => e.id === parseInt(id));
    if (enquiryIndex === -1) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }
    
    enquiries.enquiries.splice(enquiryIndex, 1);
    const saved = saveData('enquiries.json', enquiries);
    
    if (!saved) {
      throw new Error('Failed to save enquiry data to file');
    }
    
    res.json({ message: 'Enquiry deleted successfully' });
  } catch (error) {
    console.error('Error deleting enquiry:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== FILE UPLOAD API ====================

// Admin: Upload file endpoint
app.post('/api/admin/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    console.log('Upload request received:', {
      hasFile: !!req.file,
      body: req.body,
      headers: {
        'content-type': req.headers['content-type'],
        'authorization': req.headers['authorization'] ? 'Bearer [REDACTED]' : 'None'
      }
    });

    if (!req.file) {
      console.error('No file uploaded in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const destinationSlug = req.body.destinationSlug || 'destination';
    const file = req.file;
    
    console.log(`Uploading file for destination: ${destinationSlug}`, {
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      tempPath: file.path
    });
    
    // Create destination-specific directory with clean slug
    const cleanSlug = destinationSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const destinationDir = path.join(uploadsDir, 'destinations', cleanSlug);
    
    console.log(`Creating directory: ${destinationDir}`);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
      console.log(`Created directory: ${destinationDir}`);
    }
    
    // Delete any existing files for this destination to keep directory clean
    try {
      const existingFiles = fs.readdirSync(destinationDir);
      existingFiles.forEach(existingFile => {
        if (existingFile.startsWith(cleanSlug)) {
          const oldFilePath = path.join(destinationDir, existingFile);
          fs.unlinkSync(oldFilePath);
          console.log(`Deleted old file: ${oldFilePath}`);
        }
      });
    } catch (error) {
      console.log('No existing files to delete or error cleaning up:', error.message);
    }
    
    // Generate simple filename with destination name and timestamp to avoid caching issues
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const filename = `${cleanSlug}_${timestamp}${fileExtension}`;
    const finalPath = path.join(destinationDir, filename);
    
    console.log(`Moving file from ${file.path} to ${finalPath}`);
    
    // Move file to final location
    try {
      fs.renameSync(file.path, finalPath);
      console.log(`File moved successfully to: ${finalPath}`);
    } catch (moveError) {
      console.error('Error moving file:', moveError);
      throw new Error(`Failed to move uploaded file: ${moveError.message}`);
    }
    
    // Return the URL path
    const relativePath = path.relative(uploadsDir, finalPath).replace(/\\/g, '/');
    const fileUrl = `/uploads/${relativePath}`;
    
    console.log(`File uploaded successfully: ${fileUrl}`);
    
    res.json({
      success: true,
      url: fileUrl,
      filename: filename,
      destination: cleanSlug
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    
    // Clean up temp file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('Cleaned up temp file:', req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// ==================== DESTINATIONS UPLOAD API ====================

// Destination-specific upload endpoint
app.post('/api/admin/uploads/destinations', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const destinationSlug = req.body.destinationSlug || 'destination';
    const file = req.file;
    
    console.log(`Uploading file for destination: ${destinationSlug}`);
    
    // Create destination-specific directory with clean slug
    const cleanSlug = destinationSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    const destinationDir = path.join(uploadsDir, 'destinations', cleanSlug);
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
      console.log(`Created directory: ${destinationDir}`);
    }
    
    // Delete any existing files for this destination to keep directory clean
    try {
      const existingFiles = fs.readdirSync(destinationDir);
      existingFiles.forEach(existingFile => {
        if (existingFile.startsWith(cleanSlug)) {
          const oldFilePath = path.join(destinationDir, existingFile);
          fs.unlinkSync(oldFilePath);
          console.log(`Deleted old file: ${oldFilePath}`);
        }
      });
    } catch (error) {
      console.log('No existing files to delete or error cleaning up:', error.message);
    }
    
    // Generate simple filename with destination name and timestamp to avoid caching issues
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    const filename = `${cleanSlug}_${timestamp}${fileExtension}`;
    const finalPath = path.join(destinationDir, filename);
    
    // Move file to final location
    fs.renameSync(file.path, finalPath);
    
    // Return the URL path
    const relativePath = path.relative(uploadsDir, finalPath).replace(/\\/g, '/');
    const fileUrl = `/uploads/${relativePath}`;
    
    console.log(`File uploaded successfully: ${fileUrl}`);
    
    res.json({
      success: true,
      url: fileUrl,
      path: fileUrl,
      filename: filename,
      destination: cleanSlug
    });
  } catch (error) {
    console.error('Error uploading destination file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== CONTACT API ====================

// Get contact information
app.get('/api/contact', async (req, res) => {
  try {
    await delay(200);
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update contact information
app.put('/api/admin/contact', authenticateToken, async (req, res) => {
  try {
    console.log('Updating contact information...');
    console.log('Request body:', req.body);
    
    const updatedContact = req.body;
    
    // Validate required fields
    if (!updatedContact.company?.name || !updatedContact.contact?.email?.primary) {
      return res.status(400).json({ error: 'Company name and primary email are required' });
    }
    
    // Update the contact data
    contact = updatedContact;
    
    // Save to file
    const saved = saveData('contact.json', contact);
    if (!saved) {
      throw new Error('Failed to save contact data to file');
    }
    
    console.log('Contact information updated successfully');
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact information:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// ==================== TESTIMONIALS API ====================

// Get all approved testimonials (public endpoint)
app.get('/api/testimonials', async (req, res) => {
  try {
    await delay(200);
    const { featured, limit } = req.query;
    
    let filteredTestimonials = testimonials.filter(testimonial => testimonial.is_approved);
    
    // Filter by featured if requested
    if (featured === 'true') {
      filteredTestimonials = filteredTestimonials.filter(testimonial => testimonial.is_featured);
    }
    
    // Sort by date (newest first)
    filteredTestimonials.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    // Limit results if specified
    if (limit) {
      const limitNum = parseInt(limit);
      if (!isNaN(limitNum) && limitNum > 0) {
        filteredTestimonials = filteredTestimonials.slice(0, limitNum);
      }
    }
    
    res.json(filteredTestimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get testimonial by ID (public endpoint)
app.get('/api/testimonials/:id', async (req, res) => {
  try {
    await delay(200);
    const testimonialId = parseInt(req.params.id);
    const testimonial = testimonials.find(t => t.id === testimonialId && t.is_approved);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.json(testimonial);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit new testimonial (public endpoint)
app.post('/api/testimonials', async (req, res) => {
  try {
    console.log('Submitting new testimonial...');
    console.log('Request body:', req.body);
    
    const { name, email, country, tour, rating, title, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !tour || !rating || !title || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const newTestimonial = {
      id: Math.max(...testimonials.map(t => t.id), 0) + 1,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      country: country?.trim() || '',
      tour: tour.trim(),
      rating: parseInt(rating),
      title: title.trim(),
      message: message.trim(),
      image: '', // Will be set by admin if needed
      date: new Date().toISOString().split('T')[0],
      is_featured: false,
      is_approved: false, // Requires admin approval
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    testimonials.push(newTestimonial);
    const saved = saveData('testimonials.json', testimonials);
    
    if (!saved) {
      throw new Error('Failed to save testimonial data to file');
    }
    
    console.log('Testimonial submitted successfully');
    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully. It will be reviewed before being published.',
      testimonial: newTestimonial
    });
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// ==================== ADMIN TESTIMONIALS API ====================

// Admin: Get all testimonials (including unapproved ones)
app.get('/api/admin/testimonials', authenticateToken, async (req, res) => {
  try {
    await delay(200);
    const { status } = req.query;
    
    let filteredTestimonials = [...testimonials];
    
    // Filter by approval status if requested
    if (status === 'approved') {
      filteredTestimonials = filteredTestimonials.filter(t => t.is_approved);
    } else if (status === 'pending') {
      filteredTestimonials = filteredTestimonials.filter(t => !t.is_approved);
    }
    
    // Sort by date (newest first)
    filteredTestimonials.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    
    res.json(filteredTestimonials);
  } catch (error) {
    console.error('Error fetching admin testimonials:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update testimonial
app.put('/api/admin/testimonials/:id', authenticateToken, async (req, res) => {
  try {
    console.log('Updating testimonial with ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const { id } = req.params;
    const updateData = req.body;
    const testimonialIndex = testimonials.findIndex(t => t.id === parseInt(id));
    
    if (testimonialIndex === -1) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    const existingTestimonial = testimonials[testimonialIndex];
    
    // Update testimonial data
    testimonials[testimonialIndex] = {
      ...existingTestimonial,
      ...updateData,
      updated_at: new Date().toISOString()
    };
    
    const saved = saveData('testimonials.json', testimonials);
    if (!saved) {
      throw new Error('Failed to save testimonial data to file');
    }
    
    console.log('Testimonial updated successfully');
    res.json(testimonials[testimonialIndex]);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Admin: Delete testimonial
app.delete('/api/admin/testimonials/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialIndex = testimonials.findIndex(t => t.id === parseInt(id));
    
    if (testimonialIndex === -1) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    testimonials.splice(testimonialIndex, 1);
    const saved = saveData('testimonials.json', testimonials);
    
    if (!saved) {
      throw new Error('Failed to save testimonial data to file');
    }
    
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Approve testimonial
app.patch('/api/admin/testimonials/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialIndex = testimonials.findIndex(t => t.id === parseInt(id));
    
    if (testimonialIndex === -1) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    testimonials[testimonialIndex].is_approved = true;
    testimonials[testimonialIndex].updated_at = new Date().toISOString();
    
    const saved = saveData('testimonials.json', testimonials);
    if (!saved) {
      throw new Error('Failed to save testimonial data to file');
    }
    
    res.json({
      success: true,
      message: 'Testimonial approved successfully',
      testimonial: testimonials[testimonialIndex]
    });
  } catch (error) {
    console.error('Error approving testimonial:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Toggle featured status
app.patch('/api/admin/testimonials/:id/featured', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const testimonialIndex = testimonials.findIndex(t => t.id === parseInt(id));
    
    if (testimonialIndex === -1) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }
    
    testimonials[testimonialIndex].is_featured = !testimonials[testimonialIndex].is_featured;
    testimonials[testimonialIndex].updated_at = new Date().toISOString();
    
    const saved = saveData('testimonials.json', testimonials);
    if (!saved) {
      throw new Error('Failed to save testimonial data to file');
    }
    
    res.json({
      success: true,
      message: `Testimonial ${testimonials[testimonialIndex].is_featured ? 'featured' : 'unfeatured'} successfully`,
      testimonial: testimonials[testimonialIndex]
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== LOGOS API ====================

// Get logos (public endpoint)
app.get('/api/logos', async (req, res) => {
  try {
    await delay(100);
    res.json(logos);
  } catch (error) {
    console.error('Error fetching logos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== ADMIN LOGOS API ====================

// Admin: Get all logos
app.get('/api/admin/logos', authenticateToken, async (req, res) => {
  try {
    await delay(100);
    res.json(logos);
  } catch (error) {
    console.error('Error fetching admin logos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Upload logo with file upload
app.post('/api/admin/logos/upload', authenticateToken, (req, res) => {
  upload.single('logo')(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    
    try {
      console.log('Uploading logo...');
      console.log('Request body:', req.body);
      console.log('Uploaded file:', req.file);
      
      const { type } = req.body;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: 'No logo file uploaded' });
      }
      
      if (!type) {
        return res.status(400).json({ error: 'Logo type is required' });
      }
      
      if (!['header', 'footer'].includes(type)) {
        return res.status(400).json({ error: 'Invalid logo type' });
      }
      
      // Create logos directory
      const logosDir = path.join(uploadsDir, 'logos');
      if (!fs.existsSync(logosDir)) {
        fs.mkdirSync(logosDir, { recursive: true });
      }
      
      // Delete old logo file if it exists and is a local upload
      const oldLogoPath = logos[type];
      if (oldLogoPath && oldLogoPath.startsWith('/uploads/')) {
        const oldFilePath = path.join(__dirname, oldLogoPath);
        if (fs.existsSync(oldFilePath)) {
          console.log('Deleting old logo:', oldFilePath);
          fs.unlinkSync(oldFilePath);
        }
      }
      
      // Generate filename
      const timestamp = Date.now();
      const fileExtension = path.extname(file.originalname);
      const filename = `${type}_${timestamp}${fileExtension}`;
      const finalPath = path.join(logosDir, filename);
      
      // Compress and save image
      console.log('Compressing logo image...');
      const processedFilePath = await compressImage(file.path, finalPath, 90);
      
      const relativePath = path.relative(uploadsDir, processedFilePath).replace(/\\/g, '/');
      const fileUrl = `/uploads/${relativePath}`;
      
      // Update logos object
      logos[type] = fileUrl;
      logos.lastUpdated = new Date().toISOString();
      
      // Save to file
      const saved = saveData('logos.json', logos);
      if (!saved) {
        throw new Error('Failed to save logo data to file');
      }
      
      console.log(`Logo uploaded successfully: ${type} -> ${fileUrl}`);
      res.json({
        success: true,
        message: `${type} logo uploaded successfully`,
        logo: {
          type,
          url: fileUrl
        },
        logos: logos
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });
});

// Admin: Update logo URLs (for external URLs)
app.put('/api/admin/logos', authenticateToken, async (req, res) => {
  try {
    console.log('Updating logo URLs...');
    console.log('Request body:', req.body);
    
    const { header, footer } = req.body;
    
    if (header) {
      logos.header = header;
    }
    
    if (footer) {
      logos.footer = footer;
    }
    
    logos.lastUpdated = new Date().toISOString();
    
    const saved = saveData('logos.json', logos);
    if (!saved) {
      throw new Error('Failed to save logo data to file');
    }
    
    console.log('Logo URLs updated successfully');
    res.json({
      success: true,
      message: 'Logo URLs updated successfully',
      logos: logos
    });
  } catch (error) {
    console.error('Error updating logo URLs:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Admin: Reset logo to default
app.delete('/api/admin/logos/:type', authenticateToken, async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['header', 'footer'].includes(type)) {
      return res.status(400).json({ error: 'Invalid logo type' });
    }
    
    // Delete uploaded file if it exists
    const logoPath = logos[type];
    if (logoPath && logoPath.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, logoPath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('Deleted logo file:', filePath);
      }
    }
    
    // Reset to default
    const defaults = {
      header: '/src/assets/zeo-logo.png',
      footer: '/src/assets/zeo-logo-white.png'
    };
    
    logos[type] = defaults[type];
    logos.lastUpdated = new Date().toISOString();
    
    const saved = saveData('logos.json', logos);
    if (!saved) {
      throw new Error('Failed to save logo data to file');
    }
    
    res.json({
      success: true,
      message: `${type} logo reset to default`,
      logos: logos
    });
  } catch (error) {
    console.error('Error resetting logo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== KAILASH GALLERY ENDPOINTS ====================

// GET /api/kailash-gallery - Public endpoint for gallery
app.get('/api/kailash-gallery', async (req, res) => {
  try {
    // Filter only active photos and sort by order
    const activePhotos = kailashGallery.gallery
      .filter(photo => photo.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({
      success: true,
      gallery: activePhotos,
      metadata: kailashGallery.metadata
    });
  } catch (error) {
    console.error('Error fetching Kailash Gallery:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/admin/kailash-gallery - Admin endpoint for gallery management
app.get('/api/admin/kailash-gallery', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Sort by order, then by uploadedAt (newest first)
    const sortedPhotos = [...kailashGallery.gallery].sort((a, b) => {
      if (a.order !== b.order) {
        return (a.order || 999) - (b.order || 999);
      }
      return new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0);
    });

    const paginatedPhotos = sortedPhotos.slice(startIndex, endIndex);

    res.json({
      success: true,
      gallery: paginatedPhotos,
      metadata: {
        ...kailashGallery.metadata,
        totalPhotos: kailashGallery.gallery.length,
        currentPage: page,
        totalPages: Math.ceil(kailashGallery.gallery.length / limit),
        hasNextPage: endIndex < kailashGallery.gallery.length,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching admin Kailash Gallery:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/admin/kailash-gallery - Upload new photo
app.post('/api/admin/kailash-gallery', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const { title, alt, gridSpan, order, isActive } = req.body;
    
    // Generate unique filename
    const timestamp = Date.now();
    const originalName = path.parse(req.file.originalname).name;
    const extension = path.extname(req.file.originalname);
    const filename = `kailash-${timestamp}-${originalName}${extension}`;
    
    const inputPath = req.file.path;
    const outputPath = path.join(kailashGalleryDir, filename);

    // Compress and save image
    await compressImage(inputPath, outputPath, 85);
    
    // Remove temporary file
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    // Create new photo object
    const newPhoto = {
      id: timestamp.toString(),
      title: title || 'Kailash Gallery Photo',
      image: `/uploads/kailash-gallery/${filename}`,
      alt: alt || title || 'Kailash Gallery Photo',
      gridSpan: parseInt(gridSpan) || 1,
      order: parseInt(order) || kailashGallery.gallery.length,
      isActive: isActive !== 'false',
      uploadedAt: new Date().toISOString()
    };

    // Add to gallery
    kailashGallery.gallery.push(newPhoto);
    kailashGallery.metadata.totalPhotos = kailashGallery.gallery.length;
    kailashGallery.metadata.lastUpdated = new Date().toISOString();

    // Save to file
    saveData('kailash-gallery.json', kailashGallery);

    res.json({
      success: true,
      message: 'Photo uploaded successfully',
      photo: newPhoto,
      metadata: kailashGallery.metadata
    });

  } catch (error) {
    console.error('Error uploading Kailash Gallery photo:', error);
    
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});

// DELETE /api/admin/kailash-gallery/:id - Delete photo
app.delete('/api/admin/kailash-gallery/:id', authenticateToken, async (req, res) => {
  try {
    const photoId = req.params.id;
    const photoIndex = kailashGallery.gallery.findIndex(photo => photo.id === photoId);

    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Photo not found' });
    }

    const photo = kailashGallery.gallery[photoIndex];
    
    // Delete physical file
    if (photo.image) {
      const imagePath = path.join(__dirname, photo.image.replace('/uploads/', 'uploads/'));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Remove from gallery
    kailashGallery.gallery.splice(photoIndex, 1);
    kailashGallery.metadata.totalPhotos = kailashGallery.gallery.length;
    kailashGallery.metadata.lastUpdated = new Date().toISOString();

    // Save to file
    saveData('kailash-gallery.json', kailashGallery);

    res.json({
      success: true,
      message: 'Photo deleted successfully',
      metadata: kailashGallery.metadata
    });

  } catch (error) {
    console.error('Error deleting Kailash Gallery photo:', error);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// DELETE /api/admin/tours/:tourId/gallery/:filename - Delete individual gallery image
app.delete('/api/admin/tours/:tourId/gallery/:filename', authenticateToken, async (req, res) => {
  try {
    const { tourId, filename } = req.params;
    console.log(`Deleting gallery image: ${filename} from tour: ${tourId}`);
    
    // Find the tour
    const tourIndex = tourDetails.findIndex(t => t.id === parseInt(tourId));
    if (tourIndex === -1) {
      return res.status(404).json({ error: 'Tour not found' });
    }
    
    const tour = tourDetails[tourIndex];
    
    // Remove the image from the gallery array
    if (tour.gallery && Array.isArray(tour.gallery)) {
      const imageUrl = `/uploads/tours/${filename}`;
      const updatedGallery = tour.gallery.filter(img => !img.includes(filename));
      
      // Update the tour data
      tourDetails[tourIndex] = {
        ...tour,
        gallery: updatedGallery,
        updated_at: new Date().toISOString()
      };
      
      // Persist the updated tour detail to its specific file
      const detailFilename = path.join('tour-details', `${tour.slug}.json`);
      const saved = saveData(detailFilename, tourDetails[tourIndex]);
      if (!saved) {
        throw new Error('Failed to save tour detail');
      }
    }
    
    // Delete the physical file
    const filePath = path.join(__dirname, 'uploads', 'tours', filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    }
    
    res.json({ 
      message: 'Gallery image deleted successfully',
      filename: filename,
      tourId: tourId
    });
    
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    res.status(500).json({ error: 'Failed to delete gallery image' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    database: 'JSON Files'
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
  console.log(`🚀 Zeo Tourism API Server started`);
  console.log(`📊 Port: ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🗄️ Database: JSON Files`);
  console.log(`🔐 Admin Login: POST /api/auth/login`);
  console.log(`📊 Tours: http://localhost:${PORT}/api/tours`);
  console.log(`🏔️ Destinations: http://localhost:${PORT}/api/destinations`);
  console.log(`🎯 Activities: http://localhost:${PORT}/api/activities`);
  console.log(`🖼️ Sliders: http://localhost:${PORT}/api/sliders`);
  console.log(`💬 Testimonials: http://localhost:${PORT}/api/testimonials`);
});

module.exports = app;