const Database = require('better-sqlite3');
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'travel.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const createTables = () => {
  // Destinations table
  const createDestinationsTable = `
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      country TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      duration TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      rating REAL NOT NULL,
      featured BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Activities table
  const createActivitiesTable = `
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT NOT NULL,
      icon TEXT,
      featured BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Tours table
  const createToursTable = `
    CREATE TABLE IF NOT EXISTS tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      price REAL NOT NULL,
      duration TEXT NOT NULL,
      group_size TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      rating REAL NOT NULL,
      reviews INTEGER DEFAULT 0,
      location TEXT NOT NULL,
      best_time TEXT NOT NULL,
      featured BOOLEAN DEFAULT 0,
      destination_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (destination_id) REFERENCES destinations (id) ON DELETE SET NULL
    )
  `;

  // Tour highlights table (one-to-many relationship)
  const createTourHighlightsTable = `
    CREATE TABLE IF NOT EXISTS tour_highlights (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tour_id INTEGER NOT NULL,
      highlight TEXT NOT NULL,
      FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
    )
  `;

  // Tour inclusions table (one-to-many relationship)
  const createTourInclusionsTable = `
    CREATE TABLE IF NOT EXISTS tour_inclusions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tour_id INTEGER NOT NULL,
      inclusion TEXT NOT NULL,
      FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
    )
  `;

  // Tour activities junction table (many-to-many relationship)
  const createTourActivitiesTable = `
    CREATE TABLE IF NOT EXISTS tour_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tour_id INTEGER NOT NULL,
      activity_id INTEGER NOT NULL,
      FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE,
      FOREIGN KEY (activity_id) REFERENCES activities (id) ON DELETE CASCADE,
      UNIQUE(tour_id, activity_id)
    )
  `;

  // Related tours junction table (many-to-many self-referencing)
  const createRelatedToursTable = `
    CREATE TABLE IF NOT EXISTS related_tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tour_id INTEGER NOT NULL,
      related_tour_id INTEGER NOT NULL,
      FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE,
      FOREIGN KEY (related_tour_id) REFERENCES tours (id) ON DELETE CASCADE,
      UNIQUE(tour_id, related_tour_id)
    )
  `;

  // Sliders table
  const createSlidersTable = `
    CREATE TABLE IF NOT EXISTS sliders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      location TEXT,
      image TEXT NOT NULL,
      video TEXT,
      order_index INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  // Execute table creation
  db.exec(createDestinationsTable);
  db.exec(createActivitiesTable);
  db.exec(createToursTable);
  db.exec(createTourHighlightsTable);
  db.exec(createTourInclusionsTable);
  db.exec(createTourActivitiesTable);
  db.exec(createRelatedToursTable);
  db.exec(createSlidersTable);

  console.log('Database tables created successfully');
};

// Initialize database
const initializeDatabase = () => {
  try {
    createTables();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Database helper functions
const dbHelpers = {
  // Destinations
  getAllDestinations: () => {
    return db.prepare('SELECT * FROM destinations ORDER BY name').all();
  },

  getDestinationBySlug: (slug) => {
    return db.prepare('SELECT * FROM destinations WHERE slug = ?').get(slug);
  },

  getDestinationById: (id) => {
    return db.prepare('SELECT * FROM destinations WHERE id = ?').get(id);
  },

  // Activities
  getAllActivities: () => {
    return db.prepare('SELECT * FROM activities ORDER BY name').all();
  },

  getActivityBySlug: (slug) => {
    return db.prepare('SELECT * FROM activities WHERE slug = ?').get(slug);
  },

  getActivityById: (id) => {
    return db.prepare('SELECT * FROM activities WHERE id = ?').get(id);
  },

  // Tours
  getAllTours: () => {
    const tours = db.prepare(`
      SELECT t.*, d.name as destination_name, d.slug as destination_slug
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      ORDER BY t.featured DESC, t.rating DESC
    `).all();

    // Get highlights and inclusions for each tour
    return tours.map(tour => ({
      ...tour,
      highlights: db.prepare('SELECT highlight FROM tour_highlights WHERE tour_id = ?').all(tour.id).map(h => h.highlight),
      inclusions: db.prepare('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?').all(tour.id).map(i => i.inclusion),
      activities: db.prepare(`
        SELECT a.* FROM activities a
        JOIN tour_activities ta ON a.id = ta.activity_id
        WHERE ta.tour_id = ?
      `).all(tour.id)
    }));
  },

  getTourById: (id) => {
    const tour = db.prepare(`
      SELECT t.*, d.name as destination_name, d.slug as destination_slug
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      WHERE t.id = ?
    `).get(id);

    if (!tour) return null;

    return {
      ...tour,
      highlights: db.prepare('SELECT highlight FROM tour_highlights WHERE tour_id = ?').all(tour.id).map(h => h.highlight),
      inclusions: db.prepare('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?').all(tour.id).map(i => i.inclusion),
      activities: db.prepare(`
        SELECT a.* FROM activities a
        JOIN tour_activities ta ON a.id = ta.activity_id
        WHERE ta.tour_id = ?
      `).all(tour.id)
    };
  },

  getToursByDestination: (destinationId) => {
    const tours = db.prepare(`
      SELECT t.*, d.name as destination_name, d.slug as destination_slug
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      WHERE t.destination_id = ?
      ORDER BY t.featured DESC, t.rating DESC
    `).all(destinationId);

    return tours.map(tour => ({
      ...tour,
      highlights: db.prepare('SELECT highlight FROM tour_highlights WHERE tour_id = ?').all(tour.id).map(h => h.highlight),
      inclusions: db.prepare('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?').all(tour.id).map(i => i.inclusion),
      activities: db.prepare(`
        SELECT a.* FROM activities a
        JOIN tour_activities ta ON a.id = ta.activity_id
        WHERE ta.tour_id = ?
      `).all(tour.id)
    }));
  },

  getToursByActivity: (activityId) => {
    const tours = db.prepare(`
      SELECT t.*, d.name as destination_name, d.slug as destination_slug
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      JOIN tour_activities ta ON t.id = ta.tour_id
      WHERE ta.activity_id = ?
      ORDER BY t.featured DESC, t.rating DESC
    `).all(activityId);

    return tours.map(tour => ({
      ...tour,
      highlights: db.prepare('SELECT highlight FROM tour_highlights WHERE tour_id = ?').all(tour.id).map(h => h.highlight),
      inclusions: db.prepare('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?').all(tour.id).map(i => i.inclusion),
      activities: db.prepare(`
        SELECT a.* FROM activities a
        JOIN tour_activities ta ON a.id = ta.activity_id
        WHERE ta.tour_id = ?
      `).all(tour.id)
    }));
  },

  // Search functionality
  searchTours: (query) => {
    const searchQuery = `%${query}%`;
    const tours = db.prepare(`
      SELECT t.*, d.name as destination_name, d.slug as destination_slug
      FROM tours t
      LEFT JOIN destinations d ON t.destination_id = d.id
      WHERE t.title LIKE ? OR t.description LIKE ? OR t.location LIKE ? OR d.name LIKE ?
      ORDER BY t.featured DESC, t.rating DESC
    `).all(searchQuery, searchQuery, searchQuery, searchQuery);

    return tours.map(tour => ({
      ...tour,
      highlights: db.prepare('SELECT highlight FROM tour_highlights WHERE tour_id = ?').all(tour.id).map(h => h.highlight),
      inclusions: db.prepare('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?').all(tour.id).map(i => i.inclusion),
      activities: db.prepare(`
        SELECT a.* FROM activities a
        JOIN tour_activities ta ON a.id = ta.activity_id
        WHERE ta.tour_id = ?
      `).all(tour.id)
    }));
  },

  // Sliders
  getAllSliders: () => {
    return db.prepare('SELECT * FROM sliders WHERE is_active = 1 ORDER BY order_index ASC, id ASC').all();
  },

  getSliderById: (id) => {
    return db.prepare('SELECT * FROM sliders WHERE id = ?').get(id);
  },

  insertSlider: (slider) => {
    const stmt = db.prepare(`
      INSERT INTO sliders (title, subtitle, location, image, video, order_index, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      slider.title,
      slider.subtitle || '',
      slider.location || '',
      slider.image,
      slider.video || null,
      slider.order_index || 0,
      slider.is_active !== undefined ? slider.is_active : 1
    );
  },

  // Insert functions
  insertDestination: (destination) => {
    const stmt = db.prepare(`
      INSERT INTO destinations (name, slug, country, location, description, image, duration, difficulty, rating, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      destination.name,
      destination.slug,
      destination.country,
      destination.location,
      destination.description,
      destination.image,
      destination.duration,
      destination.difficulty,
      destination.rating,
      destination.featured || 0
    );
  },

  insertActivity: (activity) => {
    const stmt = db.prepare(`
      INSERT INTO activities (name, slug, description, image, icon, featured)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    return stmt.run(
      activity.name,
      activity.slug,
      activity.description || '',
      activity.image,
      activity.icon || '',
      activity.featured || 0
    );
  },

  insertTour: (tour) => {
    const transaction = db.transaction(() => {
      // Insert tour
      const tourStmt = db.prepare(`
        INSERT INTO tours (title, slug, category, description, image, price, duration, group_size, difficulty, rating, reviews, location, best_time, featured, destination_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = tourStmt.run(
        tour.title,
        tour.slug,
        tour.category,
        tour.description,
        tour.image,
        tour.price,
        tour.duration,
        tour.group_size,
        tour.difficulty,
        tour.rating,
        tour.reviews || 0,
        tour.location,
        tour.best_time,
        tour.featured || 0,
        tour.destination_id || null
      );

      const tourId = result.lastInsertRowid;

      // Insert highlights
      if (tour.highlights && tour.highlights.length > 0) {
        const highlightStmt = db.prepare('INSERT INTO tour_highlights (tour_id, highlight) VALUES (?, ?)');
        tour.highlights.forEach(highlight => {
          highlightStmt.run(tourId, highlight);
        });
      }

      // Insert inclusions
      if (tour.inclusions && tour.inclusions.length > 0) {
        const inclusionStmt = db.prepare('INSERT INTO tour_inclusions (tour_id, inclusion) VALUES (?, ?)');
        tour.inclusions.forEach(inclusion => {
          inclusionStmt.run(tourId, inclusion);
        });
      }

      // Insert tour-activity relationships
      if (tour.activity_ids && tour.activity_ids.length > 0) {
        const activityStmt = db.prepare('INSERT INTO tour_activities (tour_id, activity_id) VALUES (?, ?)');
        tour.activity_ids.forEach(activityId => {
          activityStmt.run(tourId, activityId);
        });
      }

      return { ...result, tourId };
    });

    return transaction();
  }
};

module.exports = {
  db,
  initializeDatabase,
  dbHelpers
};