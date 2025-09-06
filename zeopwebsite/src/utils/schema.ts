// Schema.org structured data utilities for SEO

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Zeo Tourism",
  url: "https://zeotourism.com",
  logo: "https://zeotourism.com/logo/zeo-logo.png",
  description: "Leading Nepal travel agency specializing in customized tour packages, cultural holidays, adventure travel, and spiritual journeys. Expert-guided experiences across Nepal and beyond.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Thamel, Kathmandu",
    addressLocality: "Kathmandu",
    addressRegion: "Bagmati Province",
    postalCode: "44600",
    addressCountry: "NP"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+977-985-123-4567",
    email: "info@zeotourism.com",
    contactType: "customer service",
    availableLanguage: ["English", "Nepali", "Hindi"]
  },
  sameAs: [
    "https://www.facebook.com/zeotourism",
    "https://www.instagram.com/zeotourism",
    "https://www.tripadvisor.com/zeotourism"
  ],
  foundingDate: "2000-01-01",
  serviceType: [
    "Tour Packages",
    "Holiday Planning",
    "Cultural Tours",
    "Adventure Tours",
    "Spiritual Journeys",
    "Luxury Travel"
  ]
});

export const createWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Zeo Tourism",
  url: "https://zeotourism.com",
  description: "Discover Nepal with expert-guided adventures, cultural tours, and spiritual journeys. 25+ years of experience in travel planning.",
  publisher: {
    "@type": "Organization",
    name: "Zeo Tourism",
    logo: "https://zeotourism.com/logo/zeo-logo.png"
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://zeotourism.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});

export const createBreadcrumbSchema = (breadcrumbs: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: crumb.url
  }))
});

export const createArticleSchema = (article: {
  title: string;
  description: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
  image: string;
  url: string;
  category: string;
  tags: string[];
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  description: article.description,
  image: article.image,
  author: {
    "@type": "Person",
    name: article.author
  },
  publisher: {
    "@type": "Organization",
    name: "Zeo Tourism",
    logo: {
      "@type": "ImageObject",
      url: "https://zeotourism.com/logo/zeo-logo.png"
    }
  },
  datePublished: article.publishDate,
  dateModified: article.modifiedDate || article.publishDate,
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": article.url
  },
  articleSection: article.category,
  keywords: article.tags.join(", ")
});

export const createLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://zeotourism.com/#organization",
  name: "Zeo Tourism",
  image: [
    "https://zeotourism.com/images/office-exterior.jpg",
    "https://zeotourism.com/logo/zeo-logo.png"
  ],
  url: "https://zeotourism.com",
  telephone: "+977-985-123-4567",
  email: "info@zeotourism.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Thamel, Kathmandu",
    addressLocality: "Kathmandu",
    addressRegion: "Bagmati Province",
    postalCode: "44600",
    addressCountry: "NP"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 27.7172,
    longitude: 85.3240
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00"
    }
  ],
  sameAs: [
    "https://www.facebook.com/zeotourism",
    "https://www.instagram.com/zeotourism",
    "https://www.tripadvisor.com/zeotourism"
  ],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    reviewCount: 1247
  }
});