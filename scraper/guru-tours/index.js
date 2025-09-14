/**
 * Tour Scraper for gurutravelsltd.com
 * 
 * This script scrapes tour data from the gurutravelsltd.com website
 * and exports it to a JSON file for use in the Zeo Tourism website.
 */

const fs = require('fs');
const path = require('path');
const scraper = require('./scraper');
const { cleanData, ensureDirectoryExists } = require('./utils');

// Configuration
const OUTPUT_DIR = path.join(__dirname, 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'guru-tours-data.json');

// Main execution function
async function main() {
  try {
    console.log('Starting Guru Travels tour scraper...');
    
    // Ensure output directory exists
    ensureDirectoryExists(OUTPUT_DIR);
    
    // Scrape tour data
    console.log('Scraping tour data from gurutravelsltd.com...');
    const tours = await scraper.scrapeAllTours();
    
    console.log(`Successfully scraped ${tours.length} tours`);
    
    // Clean and process the data
    const processedData = cleanData(tours);
    
    // Write data to file
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(processedData, null, 2),
      'utf8'
    );
    
    console.log(`Tour data saved to ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('An error occurred during scraping:', error);
    process.exit(1);
  }
}

// Run the main function
main();