/**
 * Utility functions for the scraper
 */

const fs = require('fs');
const path = require('path');

/**
 * Creates a directory if it doesn't exist
 * @param {string} dirPath - Path to the directory to ensure exists
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Cleans and normalizes scraped data
 * @param {Array} tours - Array of scraped tour data
 * @returns {Array} Cleaned tour data
 */
function cleanData(tours) {
  return tours.map(tour => {
    // Skip cleaning for tours with errors
    if (tour.error) return tour;
    
    // Clean title - remove extra whitespace
    if (tour.title) {
      tour.title = tour.title.replace(/\s+/g, ' ').trim();
    }
    
    // Clean duration - extract number of days
    if (tour.duration) {
      const daysMatch = tour.duration.match(/(\d+)\s*days?/i);
      if (daysMatch) {
        tour.durationDays = parseInt(daysMatch[1], 10);
      }
    }
    
    // Clean price - extract numeric value and currency
    if (tour.price) {
      const priceMatch = tour.price.match(/([₹$€£]|USD|NPR)\s*([0-9,]+(\.\d+)?)/i);
      if (priceMatch) {
        const currency = priceMatch[1];
        const amount = priceMatch[2].replace(/,/g, '');
        
        tour.priceAmount = parseFloat(amount);
        tour.priceCurrency = currency;
      }
    }
    
    // Clean description - trim and remove extra whitespace
    if (tour.description) {
      tour.description = tour.description.replace(/\s+/g, ' ').trim();
    }
    
    // Generate slug from title
    if (tour.title) {
      tour.slug = tour.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Format for Zeo Tourism CMS compatibility
    return {
      ...tour,
      // Add additional fields needed for the CMS
      category: determineCategory(tour),
      formattedPrice: formatPrice(tour),
      // Generate excerpt from description if needed
      excerpt: tour.description ? tour.description.substring(0, 150) + '...' : ''
    };
  }).filter(tour => !tour.error); // Remove tours with errors
}

/**
 * Determines the tour category based on title and description
 * @param {Object} tour - Tour data
 * @returns {string} Category
 */
function determineCategory(tour) {
  const text = `${tour.title} ${tour.description}`.toLowerCase();
  
  if (text.includes('trek') || text.includes('hiking') || text.includes('climb')) {
    return 'Trekking';
  } else if (text.includes('cultural') || text.includes('heritage') || text.includes('historic')) {
    return 'Cultural';
  } else if (text.includes('wildlife') || text.includes('safari') || text.includes('jungle')) {
    return 'Wildlife';
  } else if (text.includes('adventure') || text.includes('rafting') || text.includes('kayak')) {
    return 'Adventure';
  } else if (text.includes('pilgrimage') || text.includes('spiritual') || text.includes('meditation')) {
    return 'Pilgrimage';
  } else {
    return 'General';
  }
}

/**
 * Formats price for display
 * @param {Object} tour - Tour data
 * @returns {string} Formatted price
 */
function formatPrice(tour) {
  if (!tour.priceAmount) return tour.price || 'Price on request';
  
  const currency = tour.priceCurrency || '$';
  const amount = tour.priceAmount.toLocaleString();
  
  return `${currency}${amount}`;
}

module.exports = {
  ensureDirectoryExists,
  cleanData
};