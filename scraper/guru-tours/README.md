# Guru Travels Tour Scraper

This is a web scraper designed to extract tour data from the [Guru Travels Ltd](https://gurutravelsltd.com) website for use in the Zeo Tourism website.

## Features

- Scrapes all tour packages from gurutravelsltd.com
- Extracts detailed information including:
  - Tour title
  - Duration
  - Price
  - Description
  - Itinerary details
  - Images
  - Destination information
  - Difficulty level
- Cleans and normalizes data for Zeo Tourism website compatibility
- Exports data to JSON format

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository (if not already done)
2. Navigate to the scraper directory:

```bash
cd zeopwebsite-new/scraper/guru-tours
```

3. Install dependencies:

```bash
npm install
```

## Usage

To run the scraper:

```bash
npm start
```

This will:
1. Scrape all tour packages from gurutravelsltd.com
2. Process and clean the data
3. Save the results to `output/guru-tours-data.json`

## Output Format

The scraper produces a JSON file with an array of tour objects. Each tour object contains:

```json
{
  "title": "Tour Title",
  "url": "https://gurutravelsltd.com/tour/tour-slug",
  "duration": "10 Days",
  "durationDays": 10,
  "price": "$1,500 USD",
  "priceAmount": 1500,
  "priceCurrency": "$",
  "description": "Detailed tour description...",
  "itinerary": [
    {
      "day": 1,
      "title": "Day 1: Arrival",
      "description": "Day 1 details..."
    },
    // More days...
  ],
  "images": [
    "https://gurutravelsltd.com/images/tour1.jpg",
    // More images...
  ],
  "destination": "Nepal",
  "difficulty": "Moderate",
  "category": "Trekking",
  "formattedPrice": "$1,500",
  "excerpt": "Brief description...",
  "slug": "tour-title",
  "scrapedAt": "2025-09-14T08:00:00.000Z"
}
```

## Importing to Zeo Tourism

The generated JSON file can be imported into the Zeo Tourism API using the following steps:

1. Copy the output file to a location accessible by the API
2. Use the import endpoint to load the data:

```bash
curl -X POST -H "Content-Type: application/json" -d @output/guru-tours-data.json http://localhost:3000/api/admin/import/tours
```

## Project Structure

- `index.js` - Main entry point
- `scraper.js` - Core scraping functionality
- `utils.js` - Helper functions for data processing
- `output/` - Directory for scraped data output

## Customization

If the structure of the Guru Travels website changes, you may need to update the selectors in the `scraper.js` file. Look for the `scrapeTourUrls` and `scrapeTourDetails` functions.