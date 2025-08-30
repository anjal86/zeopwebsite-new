const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database connection
const dbPath = path.join(__dirname, 'travel.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
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

    // Tour highlights table
    const createTourHighlightsTable = `
      CREATE TABLE IF NOT EXISTS tour_highlights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tour_id INTEGER NOT NULL,
        highlight TEXT NOT NULL,
        FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
      )
    `;

    // Tour inclusions table
    const createTourInclusionsTable = `
      CREATE TABLE IF NOT EXISTS tour_inclusions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tour_id INTEGER NOT NULL,
        inclusion TEXT NOT NULL,
        FOREIGN KEY (tour_id) REFERENCES tours (id) ON DELETE CASCADE
      )
    `;

    // Tour activities junction table
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

    // Execute table creation in sequence
    db.serialize(() => {
      db.run(createDestinationsTable);
      db.run(createActivitiesTable);
      db.run(createToursTable);
      db.run(createTourHighlightsTable);
      db.run(createTourInclusionsTable);
      db.run(createTourActivitiesTable);
      db.run(createSlidersTable, (err) => {
        if (err) {
          console.error('Error creating tables:', err);
          reject(err);
        } else {
          console.log('Database tables created successfully');
          resolve();
        }
      });
    });
  });
};

// Initialize database
const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    createTables()
      .then(() => {
        console.log('Database initialized successfully');
        resolve();
      })
      .catch((error) => {
        console.error('Error initializing database:', error);
        reject(error);
      });
  });
};

// Database helper functions
const dbHelpers = {
  // Destinations
  getAllDestinations: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM destinations ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getDestinationBySlug: (slug) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM destinations WHERE slug = ?', [slug], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  getDestinationById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM destinations WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Activities
  getAllActivities: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM activities ORDER BY name', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getActivityBySlug: (slug) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM activities WHERE slug = ?', [slug], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  getActivityById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM activities WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  // Tours
  getAllTours: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, d.name as destination_name, d.slug as destination_slug
        FROM tours t
        LEFT JOIN destinations d ON t.destination_id = d.id
        ORDER BY t.featured DESC, t.rating DESC
      `;
      
      db.all(query, async (err, tours) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          // Get highlights and inclusions for each tour
          const toursWithDetails = await Promise.all(tours.map(async (tour) => {
            const highlights = await new Promise((resolve, reject) => {
              db.all('SELECT highlight FROM tour_highlights WHERE tour_id = ?', [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.highlight));
              });
            });

            const inclusions = await new Promise((resolve, reject) => {
              db.all('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?', [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.inclusion));
              });
            });

            const activities = await new Promise((resolve, reject) => {
              const actQuery = `
                SELECT a.* FROM activities a
                JOIN tour_activities ta ON a.id = ta.activity_id
                WHERE ta.tour_id = ?
              `;
              db.all(actQuery, [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
              });
            });

            return {
              ...tour,
              highlights,
              inclusions,
              activities
            };
          }));

          resolve(toursWithDetails);
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  getTourById: (id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, d.name as destination_name, d.slug as destination_slug
        FROM tours t
        LEFT JOIN destinations d ON t.destination_id = d.id
        WHERE t.id = ?
      `;
      
      db.get(query, [id], async (err, tour) => {
        if (err) {
          reject(err);
          return;
        }

        if (!tour) {
          resolve(null);
          return;
        }

        try {
          const highlights = await new Promise((resolve, reject) => {
            db.all('SELECT highlight FROM tour_highlights WHERE tour_id = ?', [tour.id], (err, rows) => {
              if (err) reject(err);
              else resolve(rows.map(r => r.highlight));
            });
          });

          const inclusions = await new Promise((resolve, reject) => {
            db.all('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?', [tour.id], (err, rows) => {
              if (err) reject(err);
              else resolve(rows.map(r => r.inclusion));
            });
          });

          const activities = await new Promise((resolve, reject) => {
            const actQuery = `
              SELECT a.* FROM activities a
              JOIN tour_activities ta ON a.id = ta.activity_id
              WHERE ta.tour_id = ?
            `;
            db.all(actQuery, [tour.id], (err, rows) => {
              if (err) reject(err);
              else resolve(rows);
            });
          });

          resolve({
            ...tour,
            highlights,
            inclusions,
            activities
          });
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  getToursByDestination: (destinationId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, d.name as destination_name, d.slug as destination_slug
        FROM tours t
        LEFT JOIN destinations d ON t.destination_id = d.id
        WHERE t.destination_id = ?
        ORDER BY t.featured DESC, t.rating DESC
      `;
      
      db.all(query, [destinationId], async (err, tours) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const toursWithDetails = await Promise.all(tours.map(async (tour) => {
            const highlights = await new Promise((resolve, reject) => {
              db.all('SELECT highlight FROM tour_highlights WHERE tour_id = ?', [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.highlight));
              });
            });

            const inclusions = await new Promise((resolve, reject) => {
              db.all('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?', [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.inclusion));
              });
            });

            const activities = await new Promise((resolve, reject) => {
              const actQuery = `
                SELECT a.* FROM activities a
                JOIN tour_activities ta ON a.id = ta.activity_id
                WHERE ta.tour_id = ?
              `;
              db.all(actQuery, [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
              });
            });

            return {
              ...tour,
              highlights,
              inclusions,
              activities
            };
          }));

          resolve(toursWithDetails);
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  getToursByActivity: (activityId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT t.*, d.name as destination_name, d.slug as destination_slug
        FROM tours t
        LEFT JOIN destinations d ON t.destination_id = d.id
        JOIN tour_activities ta ON t.id = ta.tour_id
        WHERE ta.activity_id = ?
        ORDER BY t.featured DESC, t.rating DESC
      `;
      
      db.all(query, [activityId], async (err, tours) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const toursWithDetails = await Promise.all(tours.map(async (tour) => {
            const highlights = await new Promise((resolve, reject) => {
              db.all('SELECT highlight FROM tour_highlights WHERE tour_id = ?', [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.highlight));
              });
            });

            const inclusions = await new Promise((resolve, reject) => {
              db.all('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?', [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.inclusion));
              });
            });

            const activities = await new Promise((resolve, reject) => {
              const actQuery = `
                SELECT a.* FROM activities a
                JOIN tour_activities ta ON a.id = ta.activity_id
                WHERE ta.tour_id = ?
              `;
              db.all(actQuery, [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
              });
            });

            return {
              ...tour,
              highlights,
              inclusions,
              activities
            };
          }));

          resolve(toursWithDetails);
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  // Search functionality
  searchTours: (query) => {
    return new Promise((resolve, reject) => {
      const searchQuery = `%${query}%`;
      const sql = `
        SELECT t.*, d.name as destination_name, d.slug as destination_slug
        FROM tours t
        LEFT JOIN destinations d ON t.destination_id = d.id
        WHERE t.title LIKE ? OR t.description LIKE ? OR t.location LIKE ? OR d.name LIKE ?
        ORDER BY t.featured DESC, t.rating DESC
      `;
      
      db.all(sql, [searchQuery, searchQuery, searchQuery, searchQuery], async (err, tours) => {
        if (err) {
          reject(err);
          return;
        }

        try {
          const toursWithDetails = await Promise.all(tours.map(async (tour) => {
            const highlights = await new Promise((resolve, reject) => {
              db.all('SELECT highlight FROM tour_highlights WHERE tour_id = ?', [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.highlight));
              });
            });

            const inclusions = await new Promise((resolve, reject) => {
              db.all('SELECT inclusion FROM tour_inclusions WHERE tour_id = ?', [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(r => r.inclusion));
              });
            });

            const activities = await new Promise((resolve, reject) => {
              const actQuery = `
                SELECT a.* FROM activities a
                JOIN tour_activities ta ON a.id = ta.activity_id
                WHERE ta.tour_id = ?
              `;
              db.all(actQuery, [tour.id], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
              });
            });

            return {
              ...tour,
              highlights,
              inclusions,
              activities
            };
          }));

          resolve(toursWithDetails);
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  // Sliders
  getAllSliders: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM sliders WHERE is_active = 1 ORDER BY order_index ASC, id ASC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getSliderById: (id) => {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM sliders WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },

  insertSlider: (slider) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO sliders (title, subtitle, location, image, video, order_index, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        slider.title,
        slider.subtitle || '',
        slider.location || '',
        slider.image,
        slider.video || null,
        slider.order_index || 0,
        slider.is_active !== undefined ? slider.is_active : 1,
        function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        }
      );
      
      stmt.finalize();
    });
  },

  // Insert functions
  insertDestination: (destination) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO destinations (name, slug, country, location, description, image, duration, difficulty, rating, featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        destination.name,
        destination.slug,
        destination.country,
        destination.location,
        destination.description,
        destination.image,
        destination.duration,
        destination.difficulty,
        destination.rating,
        destination.featured || 0,
        function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        }
      );
      
      stmt.finalize();
    });
  },

  insertActivity: (activity) => {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO activities (name, slug, description, image, icon, featured)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        activity.name,
        activity.slug,
        activity.description || '',
        activity.image,
        activity.icon || '',
        activity.featured || 0,
        function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        }
      );
      
      stmt.finalize();
    });
  },

  insertTour: (tour) => {
    return new Promise((resolve, reject) => {
      db.serialize(() => {
        db.run('BEGIN TRANSACTION');

        // Insert tour
        const tourStmt = db.prepare(`
          INSERT INTO tours (title, slug, category, description, image, price, duration, group_size, difficulty, rating, reviews, location, best_time, featured, destination_id)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        tourStmt.run(
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
          tour.destination_id || null,
          function(err) {
            if (err) {
              db.run('ROLLBACK');
              reject(err);
              return;
            }

            const tourId = this.lastID;

            // Insert highlights
            if (tour.highlights && tour.highlights.length > 0) {
              const highlightStmt = db.prepare('INSERT INTO tour_highlights (tour_id, highlight) VALUES (?, ?)');
              tour.highlights.forEach(highlight => {
                highlightStmt.run(tourId, highlight);
              });
              highlightStmt.finalize();
            }

            // Insert inclusions
            if (tour.inclusions && tour.inclusions.length > 0) {
              const inclusionStmt = db.prepare('INSERT INTO tour_inclusions (tour_id, inclusion) VALUES (?, ?)');
              tour.inclusions.forEach(inclusion => {
                inclusionStmt.run(tourId, inclusion);
              });
              inclusionStmt.finalize();
            }

            // Insert tour-activity relationships
            if (tour.activity_ids && tour.activity_ids.length > 0) {
              const activityStmt = db.prepare('INSERT INTO tour_activities (tour_id, activity_id) VALUES (?, ?)');
              tour.activity_ids.forEach(activityId => {
                activityStmt.run(tourId, activityId);
              });
              activityStmt.finalize();
            }

            db.run('COMMIT', (err) => {
              if (err) {
                reject(err);
              } else {
                resolve({ lastID: tourId, changes: this.changes });
              }
            });
          }
        );
        
        tourStmt.finalize();
      });
    });
  }
};

module.exports = {
  db,
  initializeDatabase,
  dbHelpers
};