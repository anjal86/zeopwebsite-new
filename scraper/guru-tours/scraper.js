/**
 * Scraper module for gurutravelsltd.com
 * 
 * This module contains functions to scrape tour data from the gurutravelsltd.com website.
 */

const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const axios = require('axios');

// Base URLs for the website
const BASE_URL = 'https://gurutravelsltd.com';

// Multiple potential tour page URLs to try
const POTENTIAL_TOUR_URLS = [
  `${BASE_URL}/package/list`,
  `${BASE_URL}/holiday-packages`,
  `${BASE_URL}/domestic-packages`,
  `${BASE_URL}/tour-destination`
];

// Headers to mimic a browser request
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache'
};

/**
 * Scrapes all tour URLs from various potential tour pages
 * @returns {Promise<string[]>} Array of tour URLs
 */
async function scrapeTourUrls() {
  console.log('Scraping tour URLs using multiple methods...');
  
  // We'll collect URLs from multiple methods
  let allTourUrls = new Set();
  let successfulMethod = false;
  
  // Method 1: Puppeteer browser automation
  try {
    console.log('Attempting to scrape with Puppeteer...');
    // Launch headless browser with more options for stability
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      timeout: 60000
    });
    
    const page = await browser.newPage();
    await page.setUserAgent(BROWSER_HEADERS['User-Agent']);
    
    // Try each potential tour page
    for (const tourPage of POTENTIAL_TOUR_URLS) {
      try {
        console.log(`Navigating to ${tourPage}...`);
        await page.goto(tourPage, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        
        console.log('Page loaded, looking for tour links');
        
        // Extract all links using a very general approach
        const pageUrls = await page.evaluate(() => {
          const urls = [];
          // Get all links
          const links = Array.from(document.querySelectorAll('a'));
          
          links.forEach(link => {
            if (link.href) {
              urls.push({
                url: link.href,
                text: link.textContent.trim(),
                hasImage: link.querySelector('img') !== null
              });
            }
          });
          
          return urls;
        });
        
        // Filter for potential tour URLs with intelligent pattern matching
        const tourUrlsFromPage = pageUrls.filter(link => {
          const url = link.url.toLowerCase();
          const text = link.text.toLowerCase();
          
          // Match by URL pattern
          const urlPatterns = ['/tour/', '/package/', '/trip/', '/destination/', '/holiday/', '/trek/', '/adventure/'];
          const hasUrlPattern = urlPatterns.some(pattern => url.includes(pattern));
          
          // Match by text content that suggests a tour
          const textPatterns = ['day', 'tour', 'trek', 'package', 'trip', 'adventure', 'nepal', 'everest', 'annapurna'];
          const hasTextPattern = textPatterns.some(pattern => text.includes(pattern));
          
          // Links with images are more likely to be tour cards
          const hasImage = link.hasImage;
          
          return (hasUrlPattern || hasTextPattern) && !url.includes('#') && !url.endsWith('.pdf');
        }).map(link => link.url);
        
        console.log(`Found ${tourUrlsFromPage.length} potential tour URLs on ${tourPage}`);
        
        // Add to our collection
        tourUrlsFromPage.forEach(url => allTourUrls.add(url));
        
        if (tourUrlsFromPage.length > 0) {
          successfulMethod = true;
        }
      } catch (pageError) {
        console.error(`Error exploring ${tourPage}:`, pageError.message);
        // Continue to the next potential page
      }
    }
    
    await browser.close();
    
  } catch (puppeteerError) {
    console.error('Puppeteer method failed:', puppeteerError.message);
  }
  
  // Method 2: Direct HTTP requests using Axios as fallback
  if (!successfulMethod || allTourUrls.size === 0) {
    console.log('Attempting to scrape with direct HTTP requests...');
    
    try {
      for (const tourPage of POTENTIAL_TOUR_URLS) {
        try {
          console.log(`Making HTTP request to ${tourPage}...`);
          
          // Make direct HTTP request
          const response = await axios.get(tourPage, {
            headers: BROWSER_HEADERS,
            timeout: 30000
          });
          
          if (response.status === 200) {
            // Use cheerio to parse the HTML
            const $ = cheerio.load(response.data);
            
            // Find all links
            const links = $('a');
            console.log(`Found ${links.length} links on the page`);
            
            // Extract and filter URLs
            links.each((_, element) => {
              const href = $(element).attr('href');
              const text = $(element).text().trim().toLowerCase();
              const hasImage = $(element).find('img').length > 0;
              
              if (href) {
                let fullUrl = href;
                // Handle relative URLs
                if (href.startsWith('/')) {
                  fullUrl = `${BASE_URL}${href}`;
                } else if (!href.startsWith('http')) {
                  fullUrl = `${BASE_URL}/${href}`;
                }
                
                // Apply same filtering as in puppeteer method
                const url = fullUrl.toLowerCase();
                
                // Match by URL pattern
                const urlPatterns = ['/tour/', '/package/', '/trip/', '/destination/', '/holiday/', '/trek/', '/adventure/'];
                const hasUrlPattern = urlPatterns.some(pattern => url.includes(pattern));
                
                // Match by text content
                const textPatterns = ['day', 'tour', 'trek', 'package', 'trip', 'adventure', 'nepal', 'everest', 'annapurna'];
                const hasTextPattern = textPatterns.some(pattern => text.includes(pattern));
                
                if ((hasUrlPattern || hasTextPattern || hasImage) && !url.includes('#') && !url.endsWith('.pdf')) {
                  allTourUrls.add(fullUrl);
                }
              }
            });
            
            console.log(`After filtering, found ${allTourUrls.size} total tour URLs`);
            
            if (allTourUrls.size > 0) {
              successfulMethod = true;
            }
          }
        } catch (pageError) {
          console.error(`HTTP request to ${tourPage} failed:`, pageError.message);
          // Continue to next URL
        }
      }
    } catch (axiosError) {
      console.error('Direct HTTP request method failed:', axiosError.message);
    }
  }
  
  // Convert Set to Array and ensure URLs are unique and valid
  const finalTourUrls = [...allTourUrls].filter(url => {
    // Basic URL validation
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  });
  
  console.log(`Final result: found ${finalTourUrls.length} unique tour URLs`);
  
  if (finalTourUrls.length === 0) {
    console.warn('Warning: No tour URLs found with any method. The website structure might have changed.');
  }
  
  return finalTourUrls;
}

/**
 * Scrapes details from a single tour page
 * @param {string} url - URL of the tour page
 * @returns {Promise<Object>} Tour data
 */
async function scrapeTourDetails(url) {
  console.log(`Scraping tour details from ${url}`);
  
  try {
    // Make request with proper headers
    const response = await axios.get(url, {
      headers: BROWSER_HEADERS,
      timeout: 30000
    });
    
    const $ = cheerio.load(response.data);
    
    // Initialize tour data with default values
    const tourData = {
      title: '',
      url,
      duration: '',
      price: '',
      description: '',
      itinerary: [],
      images: [],
      destination: '',
      difficulty: '',
      highlights: [],
      scrapedAt: new Date().toISOString()
    };
    
    // Use more comprehensive selectors for title
    const titleSelectors = [
      '.tour-title', '.package-title', '.trip-title',
      'h1', '.entry-title', '.page-title', '.main-title',
      'article h1', 'main h1', '.content h1'
    ];
    
    // Try each selector until we find a match
    for (const selector of titleSelectors) {
      const titleText = $(selector).first().text().trim();
      if (titleText) {
        tourData.title = titleText;
        break;
      }
    }
    
    // If still no title, try meta data
    if (!tourData.title) {
      const metaTitle = $('meta[property="og:title"]').attr('content') ||
                        $('meta[name="title"]').attr('content') ||
                        $('title').text();
      
      if (metaTitle) {
        tourData.title = metaTitle.replace(' - Guru Travels', '').replace(' | Guru Travels', '').trim();
      }
    }
    
    // More comprehensive selectors for duration
    const durationSelectors = [
      '.tour-duration', '.trip-duration', '.duration',
      '.tour-length', '.package-duration', '[class*="duration"]',
      '.tour-info .duration', 'span:contains("Duration")', 'li:contains("Duration")'
    ];
    
    for (const selector of durationSelectors) {
      const durationText = $(selector).first().text().trim();
      if (durationText) {
        tourData.duration = durationText.replace('Duration:', '').trim();
        break;
      }
    }
    
    // If no duration found, try to find in any text that mentions days
    if (!tourData.duration) {
      const durationRegex = /(\d+)\s*(day|days|nights)/i;
      const bodyText = $('body').text();
      const durationMatch = bodyText.match(durationRegex);
      
      if (durationMatch) {
        tourData.duration = `${durationMatch[1]} ${durationMatch[2]}`;
      }
    }
    
    // More comprehensive selectors for price
    const priceSelectors = [
      '.tour-price', '.package-price', '.price',
      '.cost', '.rate', '.fee', '[class*="price"]',
      'strong:contains("$")', 'strong:contains("USD")', 'span:contains("Price")'
    ];
    
    for (const selector of priceSelectors) {
      const priceEls = $(selector);
      priceEls.each((_, el) => {
        const text = $(el).text().trim();
        if (text.match(/[\$£€₹]|USD|NPR|usd|npr/)) {
          tourData.price = text;
          return false; // Break the loop
        }
      });
      
      if (tourData.price) break;
    }
    
    // If no price found, try to find in any text that mentions price
    if (!tourData.price) {
      const priceRegex = /([\$£€₹]\s*[\d,]+(\.\d+)?)|(\d+\s*(USD|NPR))/i;
      const bodyText = $('body').text();
      const priceMatch = bodyText.match(priceRegex);
      
      if (priceMatch) {
        tourData.price = priceMatch[0];
      }
    }
    
    // More comprehensive selectors for description
    const descriptionSelectors = [
      '.tour-description', '.package-description', '.description',
      '.overview', '.summary', '.content p',
      'article p', '.tour-detail p', '[class*="description"]'
    ];
    
    for (const selector of descriptionSelectors) {
      const descriptionEl = $(selector).first();
      if (descriptionEl.length) {
        tourData.description = descriptionEl.text().trim();
        break;
      }
    }
    
    // If no description, try meta description
    if (!tourData.description) {
      const metaDesc = $('meta[property="og:description"]').attr('content') ||
                      $('meta[name="description"]').attr('content');
      
      if (metaDesc) {
        tourData.description = metaDesc;
      } else {
        // Combine first few paragraphs as description
        const paragraphs = [];
        $('p').slice(0, 3).each((_, el) => {
          const text = $(el).text().trim();
          if (text.length > 30) paragraphs.push(text);
        });
        
        if (paragraphs.length > 0) {
          tourData.description = paragraphs.join(' ');
        }
      }
    }
    
    // More adaptive itinerary extraction
    const itineraryContainerSelectors = [
      '.itinerary', '.day-by-day', '.tour-itinerary',
      '#itinerary', '[class*="itinerary"]', '.accordion'
    ];
    
    let itineraryFound = false;
    
    for (const containerSelector of itineraryContainerSelectors) {
      if (itineraryFound) break;
      
      const itineraryContainer = $(containerSelector);
      if (itineraryContainer.length > 0) {
        // Try to find day items within the container
        const dayItemSelectors = [
          '.day-item', '.itinerary-day', '.itinerary-item',
          '.accordion-item', '.card', 'li', '[class*="day"]'
        ];
        
        for (const daySelector of dayItemSelectors) {
          const dayItems = itineraryContainer.find(daySelector);
          
          if (dayItems.length > 0) {
            dayItems.each((i, el) => {
              const dayEl = $(el);
              let dayTitle = dayEl.find('.day-title, h3, h4, strong').first().text().trim();
              
              // If no title found, try to extract from the item itself
              if (!dayTitle) {
                const text = dayEl.text().trim();
                const dayMatch = text.match(/day\s*\d+|day\s*[a-z]+/i);
                if (dayMatch) {
                  dayTitle = dayMatch[0];
                } else {
                  dayTitle = `Day ${i + 1}`;
                }
              }
              
              let dayDescription = dayEl.find('.day-description, p, .content').text().trim();
              
              // If no description found, use all text except the title
              if (!dayDescription) {
                dayDescription = dayEl.text().replace(dayTitle, '').trim();
              }
              
              tourData.itinerary.push({
                day: i + 1,
                title: dayTitle,
                description: dayDescription
              });
            });
            
            itineraryFound = true;
            break;
          }
        }
      }
    }
    
    // Enhanced image extraction
    const imageContainerSelectors = [
      '.tour-gallery', '.package-gallery', '.slider',
      '.gallery', '.carousel', '[class*="gallery"]'
    ];
    
    let imagesFound = false;
    
    for (const containerSelector of imageContainerSelectors) {
      if (imagesFound) break;
      
      const container = $(containerSelector);
      if (container.length > 0) {
        container.find('img').each((_, el) => {
          // Check multiple attributes where image URL might be stored
          const srcAttrs = ['src', 'data-src', 'data-original', 'data-lazy-src'];
          
          for (const attr of srcAttrs) {
            const src = $(el).attr(attr);
            if (src) {
              // Skip tiny images, icons, and non-image files
              if (src.includes('icon') || src.includes('logo') || src.endsWith('.svg')) {
                continue;
              }
              
              // Convert relative URLs to absolute
              let imageUrl = src;
              if (src.startsWith('/')) {
                imageUrl = `${BASE_URL}${src}`;
              } else if (!src.startsWith('http')) {
                imageUrl = `${BASE_URL}/${src}`;
              }
              
              // Add if not already in the array
              if (!tourData.images.includes(imageUrl)) {
                tourData.images.push(imageUrl);
              }
              
              break;
            }
          }
        });
        
        if (tourData.images.length > 0) {
          imagesFound = true;
        }
      }
    }
    
    // If no images found in containers, look for any images
    if (!imagesFound) {
      $('img').each((_, el) => {
        // Only include reasonably sized images (likely to be tour photos, not icons)
        const width = parseInt($(el).attr('width') || '0', 10);
        const height = parseInt($(el).attr('height') || '0', 10);
        
        if (width > 100 || height > 100 || (!width && !height)) {
          const src = $(el).attr('src');
          if (src) {
            // Convert relative URLs to absolute
            let imageUrl = src;
            if (src.startsWith('/')) {
              imageUrl = `${BASE_URL}${src}`;
            } else if (!src.startsWith('http')) {
              imageUrl = `${BASE_URL}/${src}`;
            }
            
            // Add if not already in the array
            if (!tourData.images.includes(imageUrl)) {
              tourData.images.push(imageUrl);
            }
          }
        }
      });
    }
    
    // Try to get the featured image if still no images
    if (tourData.images.length === 0) {
      const featuredImage = $('meta[property="og:image"]').attr('content');
      if (featuredImage) {
        tourData.images.push(featuredImage);
      }
    }
    
    // More comprehensive selectors for destination
    const destinationSelectors = [
      '.tour-destination', '.destination', '.location',
      '[class*="destination"]', 'span:contains("Location:")'
    ];
    
    for (const selector of destinationSelectors) {
      const destinationText = $(selector).first().text().trim();
      if (destinationText) {
        tourData.destination = destinationText.replace('Location:', '').trim();
        break;
      }
    }
    
    // If no destination found, try to extract from title
    if (!tourData.destination) {
      const nepalDestinations = [
        'Everest', 'Annapurna', 'Langtang', 'Pokhara', 'Chitwan',
        'Kathmandu', 'Lumbini', 'Nagarkot', 'Bhaktapur', 'Patan'
      ];
      
      for (const destination of nepalDestinations) {
        if (tourData.title.includes(destination)) {
          tourData.destination = destination;
          break;
        }
      }
      
      // Default to Nepal if no specific destination found
      if (!tourData.destination) {
        tourData.destination = 'Nepal';
      }
    }
    
    // More comprehensive selectors for difficulty
    const difficultySelectors = [
      '.difficulty-level', '.tour-difficulty', '.grade',
      '[class*="difficulty"]', 'span:contains("Difficulty:")'
    ];
    
    for (const selector of difficultySelectors) {
      const difficultyText = $(selector).first().text().trim();
      if (difficultyText) {
        tourData.difficulty = difficultyText.replace('Difficulty:', '').trim();
        break;
      }
    }
    
    // Generate slug from title
    if (tourData.title) {
      tourData.slug = tourData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    
    // Parse duration to get number of days if possible
    if (tourData.duration) {
      const daysMatch = tourData.duration.match(/(\d+)\s*days?/i);
      if (daysMatch) {
        tourData.durationDays = parseInt(daysMatch[1], 10);
      }
    }
    
    // Clean description - remove extra whitespace
    if (tourData.description) {
      tourData.description = tourData.description.replace(/\s+/g, ' ').trim();
      
      // Generate a short excerpt
      tourData.excerpt = tourData.description.length > 200
        ? tourData.description.substring(0, 197) + '...'
        : tourData.description;
    }
    
    console.log(`Successfully extracted tour data: ${tourData.title}`);
    return tourData;
    
  } catch (error) {
    console.error(`Error scraping tour details from ${url}:`, error);
    
    // Try one more time with a different approach using direct HTML access
    try {
      console.log(`Trying alternative approach for ${url}...`);
      const response = await axios.get(url, {
        headers: { ...BROWSER_HEADERS, 'Accept-Encoding': 'identity' },
        timeout: 45000
      });
      
      // Parse with a more lenient approach
      const $ = cheerio.load(response.data, { decodeEntities: false });
      
      // Create minimal tour data with available information
      const title = $('h1').first().text().trim() || $('title').text().trim();
      const description = $('meta[name="description"]').attr('content') || '';
      
      // Extract the first few images
      const images = [];
      $('img').slice(0, 5).each((_, el) => {
        const src = $(el).attr('src');
        if (src && !src.includes('logo') && !src.includes('icon')) {
          images.push(src.startsWith('http') ? src : `${BASE_URL}${src}`);
        }
      });
      
      return {
        title,
        url,
        description,
        images,
        destination: 'Nepal',
        scrapedAt: new Date().toISOString(),
        recoveryAttempt: true
      };
    } catch (secondError) {
      console.error(`Second attempt also failed for ${url}:`, secondError);
      
      // Return partial data with error flag
      return {
        url,
        error: true,
        errorMessage: error.message,
        scrapedAt: new Date().toISOString()
      };
    }
  }
}

/**
 * Scrapes all tours from the website
 * @returns {Promise<Array>} Array of tour data objects
 */
async function scrapeAllTours() {
  try {
    // Get all tour URLs
    const tourUrls = await scrapeTourUrls();
    
    // Scrape details for each tour
    const tours = [];
    for (const url of tourUrls) {
      try {
        const tourData = await scrapeTourDetails(url);
        tours.push(tourData);
        
        // Small delay to avoid overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing tour ${url}:`, error);
        tours.push({ url, error: true, errorMessage: error.message });
      }
    }
    
    return tours;
  } catch (error) {
    console.error('Error in scrapeAllTours:', error);
    throw error;
  }
}

module.exports = {
  scrapeTourUrls,
  scrapeTourDetails,
  scrapeAllTours
};