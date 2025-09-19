
# Dynamic Destination Implementation Plan
## Technical Implementation Guide for Nepal Tourism Website

### Overview

This document provides the detailed technical implementation plan for transforming the current hardcoded destination system into a comprehensive, dynamic destination management system that covers most of Nepal's tourism destinations.

---

## 1. Current System Analysis

### 1.1 Current Limitations
- **Hardcoded Destinations**: Only 22 destinations (8 Nepal + 14 International)
- **Manual Mapping**: Tours manually assigned to destinations
- **Limited Coverage**: Missing many important Nepal regions
- **Static Structure**: No hierarchical relationships
- **No Auto-Classification**: New tours require manual destination assignment

### 1.2 Current Destination Data Structure
```javascript
// Current destination structure (from destinations.json)
{
  "id": 1,
  "name": "Annapurna",
  "country": "Nepal",
  "image": "/uploads/destinations/annapurna/annapurna.JPG",
  "tourCount": 3,
  "href": "/destinations/annapurna",
  "type": "nepal",
  "description": "Discover the beauty and culture of Annapurna in Nepal.",
  "highlights": ["Annapurna Circuit", "Annapurna Base Camp"],
  "bestTime": "Mar-May, Sep-Nov",
  "altitude": "3,210m",
  "difficulty": "Moderate to Challenging",
  "relatedTours": [2, 11, 35],
  "relatedActivities": [1]
}
```

---

## 2. New Dynamic System Architecture

### 2.1 Enhanced Destination Schema

```javascript
const enhancedDestinationSchema = {
  // Basic Information
  id: 'auto-generated-uuid',
  name: 'string', // Display name
  slug: 'string', // URL-friendly identifier
  nameNepali: 'string', // Nepali name
  aliases: ['string'], // Alternative names/spellings
  
  // Geographic Classification
  type: 'mountain|hill|terai|international',
  region: 'string', // Primary region (Everest, Annapurna, etc.)
  subRegion: 'string', // Sub-region within main region
  province: 'string', // Nepal's 7 provinces
  district: 'string', // 77 districts of Nepal
  municipality: 'string', // Local administrative unit
  
  // Geographic Data
  coordinates: {
    lat: 'number',
    lng: 'number',
    accuracy: 'string' // 'exact|approximate|region'
  },
  altitude: {
    min: 'number', // Minimum altitude in meters
    max: 'number', // Maximum altitude in meters
    average: 'number' // Average altitude
  },
  area: 'number', // Area in square kilometers
  
  // Tourism Information
  category: 'trekking|cultural|wildlife|pilgrimage|adventure|leisure',
  difficulty: 'easy|moderate|challenging|extreme',
  bestTime: {
    peak: ['month'], // Peak season months
    good: ['month'], // Good season months
    avoid: ['month'] // Months to avoid
  },
  duration: {
    min: 'number', // Minimum days needed
    max: 'number', // Maximum days typically spent
    recommended: 'number' // Recommended duration
  },
  
  // Content
  description: 'string',
  descriptionNepali: 'string',
  highlights: ['string'],
  activities: ['string'],
  attractions: ['string'],
  culturalSignificance: 'string',
  
  // Media
  images: [{
    url: 'string',
    caption: 'string',
    alt: 'string',
    isPrimary: 'boolean'
  }],
  videos: ['string'],
  
  // Relationships
  parentDestination: 'destination_id', // Parent in hierarchy
  childDestinations: ['destination_id'], // Children in hierarchy
  relatedDestinations: ['destination_id'], // Related/similar destinations
  nearbyDestinations: ['destination_id'], // Geographically close
  routeDestinations: ['destination_id'], // On same trekking route
  
  // Tourism Data
  relatedTours: ['tour_id'],
  relatedActivities: ['activity_id'],
  tourCount: 'number', // Calculated field
  averageRating: 'number', // Calculated from tour ratings
  priceRange: {
    min: 'number',
    max: 'number',
    currency: 'string'
  },
  
  // Practical Information
  accessibility: 'string', // How to reach
  permits: ['string'], // Required permits
  restrictions: ['string'], // Any restrictions
  facilities: ['string'], // Available facilities
  accommodation: ['string'], // Types of accommodation
  
  // SEO & Marketing
  metaTitle: 'string',
  metaDescription: 'string',
  keywords: ['string'],
  featured: 'boolean',
  priority: 'number', // Display priority
  
  // System Fields
  isActive: 'boolean',
  isGenerated: 'boolean', // Auto-generated vs manually created
  confidence: 'number', // Classification confidence (0-1)
  lastVerified: 'timestamp',
  createdAt: 'timestamp',
  updatedAt: 'timestamp',
  createdBy: 'user_id',
  updatedBy: 'user_id'
};
```

### 2.2 Destination Classification System

```javascript
const destinationClassificationSystem = {
  // Primary Keywords for Major Regions
  primaryRegions: {
    everest: {
      keywords: ['everest', 'ebc', 'base camp', 'khumbu', 'sagarmatha', 'solu', 'solukhumbu'],
      subRegions: {
        khumbu: ['namche', 'lukla', 'tengboche', 'dingboche', 'lobuche', 'gorak shep'],
        gokyo: ['gokyo', 'cho la', 'renjo la', 'ngozumpa'],
        thame: ['thame', 'thamo', 'khumjung', 'khunde'],
        island_peak: ['island peak', 'imja tse', 'chhukung']
      },
      province: 'Koshi',
      district: 'Solukhumbu',
      type: 'mountain',
      difficulty: 'challenging',
      altitude: { min: 2800, max: 5364 }
    },
    
    annapurna: {
      keywords: ['annapurna', 'abc', 'circuit', 'sanctuary', 'dhaulagiri'],
      subRegions: {
        sanctuary: ['annapurna base camp', 'abc', 'machhapuchhre', 'sanctuary'],
        circuit: ['thorong la', 'manang', 'muktinath', 'jomsom', 'kagbeni'],
        poon_hill: ['poon hill', 'ghorepani', 'tadapani', 'ghandruk'],
        mustang: ['upper mustang', 'lo manthang', 'charang', 'ghami'],
        tilicho: ['tilicho lake', 'tilicho base camp', 'khangsar']
      },
      province: 'Gandaki',
      district: 'Kaski|Manang|Mustang|Myagdi',
      type: 'mountain',
      difficulty: 'moderate',
      altitude: { min: 800, max: 4130 }
    },
    
    langtang: {
      keywords: ['langtang', 'kyanjin', 'gosaikunda', 'helambu', 'tamang'],
      subRegions: {
        valley: ['kyanjin gompa', 'langtang village', 'lama hotel'],
        gosaikunda: ['gosaikunda', 'laurebina', 'ghopte'],
        helambu: ['helambu', 'tarke ghyang', 'sermathang', 'melamchi'],
        tamang_heritage: ['tamang heritage', 'gatlang', 'tatopani', 'thuman']
      },
      province: 'Bagmati',
      district: 'Rasuwa|Sindhupalchok',
      type: 'mountain',
      difficulty: 'moderate',
      altitude: { min: 1500, max: 4380 }
    },
    
    manaslu: {
      keywords: ['manaslu', 'larkya', 'tsum', 'samagaon', 'restricted'],
      subRegions: {
        circuit: ['larkya la', 'samagaon', 'samdo', 'dharamsala'],
        tsum_valley: ['tsum valley', 'mu gompa', 'rachen gompa', 'chhokang paro']
      },
      province: 'Gandaki',
      district: 'Gorkha',
      type: 'mountain',
      difficulty: 'challenging',
      altitude: { min: 700, max: 5106 }
    },
    
    kathmandu_valley: {
      keywords: ['kathmandu', 'patan', 'bhaktapur', 'valley', 'durbar'],
      subRegions: {
        kathmandu: ['kathmandu', 'swayambhunath', 'boudhanath', 'pashupatinath'],
        patan: ['patan', 'lalitpur', 'golden temple', 'krishna temple'],
        bhaktapur: ['bhaktapur', 'bhadgaon', 'nyatapola', 'dattatreya'],
        surrounding_hills: ['nagarkot', 'dhulikhel', 'chisapani', 'shivapuri']
      },
      province: 'Bagmati',
      district: 'Kathmandu|Lalitpur|Bhaktapur',
      type: 'hill',
      difficulty: 'easy',
      altitude: { min: 1300, max: 2175 }
    },
    
    pokhara: {
      keywords: ['pokhara', 'phewa', 'sarangkot', 'paragliding', 'lakeside'],
      subRegions: {
        city: ['phewa lake', 'lakeside', 'dam side', 'world peace pagoda'],
        hills: ['sarangkot', 'dhampus', 'australian camp', 'kaskikot'],
        adventure: ['paragliding', 'bungee', 'zip line', 'ultralight']
      },
      province: 'Gandaki',
      district: 'Kaski',
      type: 'hill',
      difficulty: 'easy',
      altitude: { min: 822, max: 1592 }
    },
    
    chitwan: {
      keywords: ['chitwan', 'safari', 'rhino', 'tiger', 'elephant', 'tharu'],
      subRegions: {
        national_park: ['chitwan national park', 'sauraha', 'bharatpur'],
        cultural: ['tharu village', 'tharu culture', 'cultural program']
      },
      province: 'Bagmati',
      district: 'Chitwan',
      type: 'terai',
      difficulty: 'easy',
      altitude: { min: 150, max: 815 }
    },
    
    lumbini: {
      keywords: ['lumbini', 'buddha', 'kapilvastu', 'tilaurakot', 'pilgrimage'],
      subRegions: {
        sacred_garden: ['maya devi temple', 'sacred garden', 'ashoka pillar'],
        monasteries: ['international monasteries', 'world peace pagoda'],
        kapilvastu: ['tilaurakot', 'kudan', 'gotihawa', 'niglihawa']
      },
      province: 'Lumbini',
      district: 'Rupandehi|Kapilvastu',
      type: 'terai',
      difficulty: 'easy',
      altitude: { min: 150, max: 200 }
    }
  },
  
  // Activity-based Classification
  activityKeywords: {
    trekking: ['trek', 'trekking', 'hiking', 'walk', 'trail', 'route', 'circuit'],
    cultural: ['culture', 'heritage', 'temple', 'monastery', 'durbar', 'festival'],
    wildlife: ['safari', 'wildlife', 'jungle', 'national park', 'rhino', 'tiger', 'elephant'],
    pilgrimage: ['pilgrimage', 'religious', 'sacred', 'holy', 'temple', 'monastery'],
    adventure: ['adventure', 'climbing', 'mountaineering', 'paragliding', 'rafting', 'bungee'],
    leisure: ['leisure', 'relaxation', 'resort', 'spa', 'lake', 'scenic']
  },
  
  // Difficulty Keywords
  difficultyKeywords: {
    easy: ['easy', 'beginner', 'family', 'leisure', 'gentle', 'comfortable'],
    moderate: ['moderate', 'intermediate', 'regular', 'standard', 'medium'],
    challenging: ['challenging', 'difficult', 'strenuous', 'demanding', 'tough'],
    extreme: ['extreme', 'expert', 'technical', 'expedition', 'advanced']
  }
};
```

### 2.3 Auto-Classification Algorithm

```javascript
class DestinationClassifier {
  constructor(classificationSystem) {
    this.system = classificationSystem;
  }
  
  classifyTour(tour) {
    const text = this.prepareText(tour);
    const scores = this.calculateScores(text);
    const classification = this.determineClassification(scores);
    
    return {
      destination: classification.destination,
      confidence: classification.confidence,
      alternativeDestinations: classification.alternatives,
      suggestedNewDestination: classification.newDestination
    };
  }
  
  prepareText(tour) {
    return [
      tour.title,
      tour.description,
      tour.location,
      tour.highlights?.join(' '),
      tour.activities?.map(a => a.name).join(' ')
    ].filter(Boolean).join(' ').toLowerCase();
  }
  
  calculateScores(text) {
    const scores = {};
    
    // Score primary regions
    for (const [region, data] of Object.entries(this.system.primaryRegions)) {
      let score = 0;
      
      // Main keywords
      data.keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          score += keyword.split(' ').length * 10; // Higher weight for main keywords
        }
      });
      
      // Sub-region keywords
      for (const [subRegion, keywords] of Object.entries(data.subRegions)) {
        keywords.forEach(keyword => {
          if (text.includes(keyword)) {
            score += keyword.split(' ').length * 15; // Even higher for specific locations
            scores[`${region}_${subRegion}`] = score;
          }
        });
      }
      
      if (score > 0) {
        scores[region] = score;
      }
    }
    
    return scores;
  }
  
  determineClassification(scores) {
    if (Object.keys(scores).length === 0) {
      return {
        destination: null,
        confidence: 0,
        alternatives: [],
        newDestination: true
      };
    }
    
    // Sort by score
    const sortedScores = Object.entries(scores)
      .sort(([,a], [,b]) => b - a);
    
    const [bestMatch, bestScore] = sortedScores[0];
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const confidence = bestScore / totalScore;
    
    return {
      destination: bestMatch,
      confidence: confidence,
      alternatives: sortedScores.slice(1, 4).map(([dest]) => dest),
      newDestination: confidence < 0.6 // Suggest new destination if confidence is low
    };
  }
  
  generateDestination(classification, tour) {
    const regionData = this.system.primaryRegions[classification.destination];
    if (!regionData) return null;
    
    return {
      name: this.extractDestinationName(tour, classification),
      slug: this.generateSlug(tour, classification),
      type: regionData.type,
      region: classification.destination,
      province: regionData.province,
      district: regionData.district,
      difficulty: this.classifyDifficulty(tour),
      category: this.classifyActivity(tour),
      altitude: this.estimateAltitude(tour, regionData),
      description: this.generateDescription(tour, classification),
      isGenerated: true,
      confidence: classification.confidence
    };
  }
  
  extractDestinationName(tour, classification) {
    // Extract specific location name from tour title
    const title = tour.title.toLowerCase();
    const region = classification.destination;
    
    // Look for specific location patterns
    const patterns = [
      /(\w+)\s+base\s+camp/,
      /(\w+)\s+trek/,
      /(\w+)\s+circuit/,
      /(\w+)\s+valley/,
      /(\w+)\s+region/,
      /(\w+)\s+area/
    ];
    
    for (const pattern of patterns) {
      const match = title.match(pattern);
      if (match) {
        return this.capitalizeWords(match[1]);
      }
    }
    
    // Fallback to region name
    return this.capitalizeWords(region);
  }
  
  generateSlug(tour, classification) {
    const name = this.extractDestinationName(tour, classification);
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  classifyDifficulty(tour) {
    const text = tour.title + ' ' + tour.description;
    
    for (const [difficulty, keywords] of Object.entries(this.system.difficultyKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return difficulty;
      }
    }
    
    // Default based on altitude or duration
    if (tour.altitude && parseInt(tour.altitude) > 4000) return 'challenging';
    if (tour.duration && parseInt(tour.duration) > 14) return 'challenging';
    return 'moderate';
  }
  
  classifyActivity(tour) {
    const text = tour.title + ' ' + tour.description + ' ' + tour.category;
    
    for (const [activity, keywords] of Object.entries(this.system.activityKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        return activity;
      }
    }
    
    return 'trekking'; // Default
  }
  
  capitalizeWords(str) {
    return str.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
```

---

## 3. Implementation Steps

### 3.1 Phase 1: Database Migration & Setup

#### Step 1: Create New Destination Schema
```sql
-- Create enhanced destinations table
CREATE TABLE destinations_v2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  name_nepali VARCHAR(255),
  aliases TEXT[],
  
  -- Geographic Classification
  type VARCHAR(50) NOT NULL,
  region VARCHAR(100),
  sub_region VARCHAR(100),
  province VARCHAR(100),
  district VARCHAR(100),
  municipality VARCHAR(100),
  
  -- Geographic Data
  coordinates JSONB,
  altitude JSONB,
  area DECIMAL,
  
  -- Tourism Information
  category VARCHAR(50),
  difficulty VARCHAR(50),
  best_time JSONB,
  duration JSONB,
  
  -- Content
  description TEXT,
  description_nepali TEXT,
  highlights TEXT[],
  activities TEXT[],
  attractions TEXT[],
  cultural_significance TEXT,
  
  -- Media
  images JSONB,
  videos TEXT[],
  
  -- Relationships
  parent_destination UUID REFERENCES destinations_v2(id),
  child_destinations UUID[],
  related_destinations UUID[],
  nearby_destinations UUID[],
  route_destinations UUID[],
  
  -- Tourism Data
  related_tours INTEGER[],
  related_activities INTEGER[],
  tour_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  price_range JSONB,
  
  -- Practical Information
  accessibility TEXT,
  permits TEXT[],
  restrictions TEXT[],
  facilities TEXT[],
  accommodation TEXT[],
  
  -- SEO & Marketing
  meta_title VARCHAR(255),
  meta_description TEXT,
  keywords TEXT[],
  featured BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  
  -- System Fields
  is_active BOOLEAN DEFAULT TRUE,
  is_generated BOOLEAN DEFAULT FALSE,
  confidence DECIMAL(3,2),
  last_verified TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);

-- Create indexes for performance
CREATE INDEX idx_destinations_v2_type ON destinations_v2(type);
CREATE INDEX idx_destinations_v2_region ON destinations_v2(region);
CREATE INDEX idx_destinations_v2_province ON destinations_v2(province);
CREATE INDEX idx_destinations_v2_slug ON destinations_v2(slug);
CREATE INDEX idx_destinations_v2_featured ON destinations_v2(featured);
CREATE INDEX idx_destinations_v2_active ON destinations_v2(is_active);
```

#### Step 2: Data Migration Script
```javascript
// migrate-destinations.js
const fs = require('fs');
const path = require('path');

class DestinationMigrator {
  constructor() {
    this.classifier = new DestinationClassifier(destinationClassificationSystem);
    this.oldDestinations = this.loadOldDestinations();
    this.tours = this.loadTours();
  }
  
  async migrate() {
    console.log('Starting destination migration...');
    
    // Step 1: Migrate existing destinations
    const migratedDestinations = await this.migrateExistingDestinations();
    
    // Step 2: Classify all tours and create new destinations
    const newDestinations = await this.classifyToursAndCreateDestinations();
    
    // Step 3: Establish relationships
    const destinationsWithRelationships = await this.establishRelationships(
      [...migratedDestinations, ...newDestinations]
    );
    
    // Step 4: Save to new format
    await this.saveDestinations(destinationsWithRelationships);
    
    console.log(`Migration completed: ${destinationsWithRelationships.length} destinations`);
    return destinationsWithRelationships;
  }
  
  async migrateExistingDestinations() {
    const migrated = [];
    
    for (const oldDest of this.oldDestinations) {
      const newDest = {
        id: this.generateUUID(),
        name: oldDest.name,
        slug: oldDest.slug || this.generateSlug(oldDest.name),
        type: oldDest.type,
        region: this.mapToNewRegion(oldDest.name),
        province: this.mapToProvince(oldDest.name),
        district: this.mapToDistrict(oldDest.name),
        category: this.inferCategory(oldDest),
        difficulty: oldDest.difficulty || 'moderate',
        description: oldDest.description,
        highlights: oldDest.highlights || [],
        images: oldDest.image ? [{ url: oldDest.image, isPrimary: true }] : [],
        related_tours: oldDest.relatedTours || [],
        tour_count: oldDest.tourCount || 0,
        featured: oldDest.featured || false,
        is_active: true,
        is_generated: false,
        confidence: 1.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      migrated.push(newDest);
    }
    
    return migrated;
  }
  
  async classifyToursAndCreateDestinations() {
    const newDestinations = [];
    const destinationMap = new Map();
    
    for (const tour of this.tours) {
      const classification = this.classifier.classifyTour(tour);
      
      if (classification.suggestedNewDestination) {
        const destKey = `${classification.destination}_${tour.id}`;
        
        if (!destinationMap.has(destKey)) {
          const newDest = this.classifier.generateDestination(classification, tour);
          if (newDest) {
            newDest.id = this.generateUUID();
            newDest.related_tours = [tour.id];
            newDest.tour_count = 1;
            newDest.created_at = new Date().toISOString();
            newDest.updated_at = new Date().toISOString();
            
            destinationMap.set(destKey, newDest);
            newDestinations.push(newDest);
          }
        } else {
          // Add tour to existing destination
          const existingDest = destinationMap.get(destKey);
          existingDest.related_tours.push(tour.id);
          existingDest.tour_count++;
        }
      }
    }
    
    return newDestinations;
  }
  
  async establishRelationships(destinations) {
    // Create parent-child relationships
    for (const dest of destinations) {
      // Find parent (broader region)
      const parent = destinations.find(d => 
        d.region === dest.region && 
        d.sub_region === null && 
        d.id !== dest.id
      );
      
      if (parent) {
        dest.parent_destination = parent.id;
        if (!parent.child_destinations) parent.child_destinations = [];
        parent.child_destinations.push(dest.id);
      }
      
      // Find related destinations (same region, similar difficulty)
      dest.related_destinations = destinations
        .filter(d => 
          d.id !== dest.id &&
          (d.region === dest.region || d.category === dest.category) &&
          Math.abs((d.priority || 0) - (dest.priority || 0)) <= 2
        )
        .slice(0, 5)
        .map(d => d.id);
      
      // Find nearby destinations (same province/district)
      dest.nearby_destinations = destinations
        .filter(d => 
          d.id !== dest.id &&
          (d.province === dest.province || d.district === dest.district)
        )
        .slice(0, 3)
        .map(d => d.id);
    }
    
    return destinations;
  }
  
  generateUUID() {
    return 'dest_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
  
  generateSlug(name) {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
}

// Run migration
const migrator = new DestinationMigrator();
migrator.migrate().then(destinations => {
  console.log('Migration completed successfully');
  console.log(`Total destinations: ${destinations.length}`);
}).catch(error => {
  console.error('Migration failed:', error);
});
```

### 3.2 Phase 2: API Enhancement

#### Enhanced Destination API Endpoints
```javascript
// Enhanced destination routes
app.get('/api/destinations', async (req, res) => {
  const {
    type,           // mountain|hill|terai|international
    region,         // everest|annapurna|langtang|etc
    province,       // Nepal's 7 provinces
    category,       // trekking|cultural|wildlife|etc
    difficulty,     // easy|moderate|challenging|extreme
    featured,       // true|false
    search,         // text search
    minAltitude,    // minimum altitude filter
    maxAltitude,    // maximum altitude filter
    minDuration,    // minimum duration filter
    maxDuration,    // maximum duration filter
    activities,     // comma-separated activity types
    page,           // pagination
    limit,          // results per page
    sort            // name|altitude|difficulty|rating|tour_count
  } = req.query;
  
  let query = { is_active: true };
  
  // Apply filters
  if (type) query.type = type;
  if (region) query.region = region;
  if (province) query.province = province;
  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;
  if (featured) query.featured = featured === 'true';
  
  // Altitude range filter
  if (minAltitude || maxAltitude) {
    query.altitude = {};
    if (minAltitude) query.altitude.min = { $gte: parseInt(minAltitude) };
    if (maxAltitude) query.altitude.max = { $lte: parseInt(maxAltitude) };
  }
  
  // Duration filter
  if (minDuration || maxDuration) {
    query.duration = {};
    if (minDuration) query.duration.min = { $gte: parseInt(minDuration) };
    if (maxDuration) query.duration.max = { $lte: parseInt(maxDuration) };
  }
  
  // Activity filter
  if (activities) {
    const activityList = activities.split(',');
    query.activities = { $in: activityList };
  }
  
  // Text search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { highlights: { $in: [new RegExp(search, 'i')] } },
      { keywords: { $in: [new RegExp(search, 'i')] } }
    ];
  }
  
  // Execute query with pagination and sorting
  const destinations = await executeDestinationQuery(query, { page, limit, sort });
  
  res.json({
    destinations: destinations.data,
    pagination: destinations.pagination,
    filters: {
      availableTypes: await getAvailableTypes(),
      availableRegions: await getAvailableRegions(type),
      availableProvinces: await getAvailableProvinces(),
      availableCategories: await getAvailableCategories(),
      availableDifficulties: await getAvailableDifficulties(),
      altitudeRange: await getAltitudeRange(),
      durationRange: await getDurationRange()
    }
  });
});

// Get destination hierarchy
app.get('/api/destinations/hierarchy', async (req, res) => {
  const { type } = req.query;
  
  const hierarchy = await buildDestinationHierarchy(type);
  res.json(hierarchy);
});

// Get destination by slug with full details
app.get('/api/destinations/:slug', async (req, res) => {
  const { slug } = req.params;
  
  const destination = await getDestinationBySlug(slug);
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  
  // Enrich with related data
  const enrichedDestination = await enrichDestinationData(destination);
  
  res.json