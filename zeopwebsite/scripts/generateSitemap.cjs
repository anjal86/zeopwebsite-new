// Build script to generate dynamic sitemap
// Run this during the build process to create sitemap.xml with current data

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://zeotourism.com';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap.xml');

// Sitemap URL class
class SitemapUrl {
  constructor(loc, lastmod, changefreq, priority) {
    this.loc = loc;
    this.lastmod = lastmod;
    this.changefreq = changefreq;
    this.priority = priority;
  }
}

// Static pages configuration
function getStaticPages() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  return [
    new SitemapUrl(`${BASE_URL}/`, currentDate, 'weekly', 1.0),
    new SitemapUrl(`${BASE_URL}/about`, currentDate, 'monthly', 0.8),
    new SitemapUrl(`${BASE_URL}/tours`, currentDate, 'weekly', 0.9),
    new SitemapUrl(`${BASE_URL}/destinations`, currentDate, 'weekly', 0.9),
    new SitemapUrl(`${BASE_URL}/activities`, currentDate, 'weekly', 0.8),
    new SitemapUrl(`${BASE_URL}/contact`, currentDate, 'monthly', 0.7),
    new SitemapUrl(`${BASE_URL}/kailash-mansarovar`, currentDate, 'monthly', 0.8)
  ];
}

// Fetch tours from local JSON files
function getTourUrls() {
  try {
    const tourDetailsDir = path.join(__dirname, '../../api/data/tour-details');
    const tourUrls = [];
    
    if (fs.existsSync(tourDetailsDir)) {
      const tourFiles = fs.readdirSync(tourDetailsDir).filter(file => file.endsWith('.json'));
      
      for (const file of tourFiles) {
        const tourData = JSON.parse(fs.readFileSync(path.join(tourDetailsDir, file), 'utf8'));
        const slug = file.replace('.json', '');
        
        tourUrls.push(new SitemapUrl(
          `${BASE_URL}/tours/${slug}`,
          tourData.updatedAt || tourData.createdAt || new Date().toISOString().split('T')[0],
          'monthly',
          getTourPriority(slug)
        ));
      }
    }
    
    return tourUrls;
  } catch (error) {
    console.error('Error fetching tours for sitemap:', error);
    return [];
  }
}

// Fetch destinations from API data
function getDestinationUrls() {
  try {
    const destinationsFile = path.join(__dirname, '../../api/data/destinations.json');
    
    if (!fs.existsSync(destinationsFile)) {
      return [];
    }
    
    const destinations = JSON.parse(fs.readFileSync(destinationsFile, 'utf8'));
    
    return destinations.map(destination => new SitemapUrl(
      `${BASE_URL}/destinations/${destination.slug || destination.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`,
      destination.updatedAt || destination.createdAt || new Date().toISOString().split('T')[0],
      'monthly',
      getDestinationPriority(destination.name)
    ));
  } catch (error) {
    console.error('Error fetching destinations for sitemap:', error);
    return [];
  }
}

// Fetch activities from API data
function getActivityUrls() {
  try {
    const activitiesFile = path.join(__dirname, '../../api/data/activities.json');
    
    if (!fs.existsSync(activitiesFile)) {
      return [];
    }
    
    const activities = JSON.parse(fs.readFileSync(activitiesFile, 'utf8'));
    
    return activities.map(activity => new SitemapUrl(
      `${BASE_URL}/activities/${activity.slug || activity.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`,
      activity.updatedAt || activity.createdAt || new Date().toISOString().split('T')[0],
      'monthly',
      0.7
    ));
  } catch (error) {
    console.error('Error fetching activities for sitemap:', error);
    return [];
  }
}

// Determine tour priority based on popularity
function getTourPriority(slug) {
  const highPriorityTours = [
    'everest-base-camp-trek',
    'annapurna-circuit-trek',
    'annapurna-base-camp-trek'
  ];
  
  const mediumPriorityTours = [
    'langtang-valley-trek',
    'chitwan-safari-adventure',
    'kathmandu-cultural-tour'
  ];

  if (highPriorityTours.includes(slug)) return 0.9;
  if (mediumPriorityTours.includes(slug)) return 0.8;
  return 0.7;
}

// Determine destination priority based on popularity
function getDestinationPriority(name) {
  const highPriorityDestinations = ['everest', 'annapurna', 'kathmandu'];
  const mediumPriorityDestinations = ['langtang', 'chitwan', 'pokhara'];
  
  const lowerName = name.toLowerCase();
  
  if (highPriorityDestinations.some(dest => lowerName.includes(dest))) return 0.8;
  if (mediumPriorityDestinations.some(dest => lowerName.includes(dest))) return 0.7;
  return 0.6;
}

// Generate complete sitemap XML
async function generateSitemap() {
  try {
    console.log('🚀 Generating dynamic sitemap...');
    
    const [staticUrls, tourUrls, destinationUrls, activityUrls] = await Promise.all([
      Promise.resolve(getStaticPages()),
      Promise.resolve(getTourUrls()),
      Promise.resolve(getDestinationUrls()),
      Promise.resolve(getActivityUrls())
    ]);

    const allUrls = [
      ...staticUrls,
      ...tourUrls,
      ...destinationUrls,
      ...activityUrls
    ];

    // Sort URLs by priority (highest first)
    allUrls.sort((a, b) => b.priority - a.priority);

    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

    const xmlUrls = allUrls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('');

    const xmlFooter = `
</urlset>`;

    const sitemapXml = xmlHeader + xmlUrls + xmlFooter;

    // Ensure the public directory exists
    const publicDir = path.dirname(OUTPUT_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Write sitemap to file
    fs.writeFileSync(OUTPUT_PATH, sitemapXml);

    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📊 Stats:`);
    console.log(`   - Total URLs: ${allUrls.length}`);
    console.log(`   - Static pages: ${staticUrls.length}`);
    console.log(`   - Tours: ${tourUrls.length}`);
    console.log(`   - Destinations: ${destinationUrls.length}`);
    console.log(`   - Activities: ${activityUrls.length}`);
    console.log(`📁 Saved to: ${OUTPUT_PATH}`);

    return sitemapXml;
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  generateSitemap()
    .then(() => {
      console.log('🎉 Sitemap generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Sitemap generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateSitemap };