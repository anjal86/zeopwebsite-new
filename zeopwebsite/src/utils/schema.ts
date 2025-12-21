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
    "https://x.com/zeotourism",
    "https://www.youtube.com/@zeotourism",
    "https://www.linkedin.com/company/zeotourism",
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
  "@id": "https://zeotourism.com/#website",
  name: "Zeo Tourism",
  url: "https://zeotourism.com",
  description: "Discover Nepal with expert-guided adventures, cultural tours, and spiritual journeys. 25+ years of experience in travel planning.",
  publisher: {
    "@type": "Organization",
    "@id": "https://zeotourism.com/#organization"
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
  "@type": "BlogPosting",
  "@id": `${article.url}#article`,
  headline: article.title,
  description: article.description,
  image: article.image,
  author: {
    "@type": "Person",
    name: article.author
  },
  publisher: {
    "@type": "Organization",
    "@id": "https://zeotourism.com/#organization"
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

export const createProductSchema = (tour: {
  name: string;
  description: string;
  image: string;
  url: string;
  price: number;
  currency: string;
  category: string;
  ratingValue?: number;
  reviewCount?: number;
}) => ({
  "@context": "https://schema.org",
  "@type": "Trip",
  "@id": `${tour.url}#trip`,
  name: tour.name,
  description: tour.description,
  image: tour.image,
  url: tour.url,
  offers: {
    "@type": "Offer",
    price: tour.price,
    priceCurrency: tour.currency,
    availability: "https://schema.org/InStock",
    url: tour.url
  },
  itinerary: {
    "@type": "ItemList",
    numberOfItems: 1
  },
  provider: {
    "@type": "Organization",
    "@id": "https://zeotourism.com/#organization"
  },
  ...(tour.ratingValue && {
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: tour.ratingValue,
      reviewCount: tour.reviewCount || 10
    }
  })
});

export const createBlogListSchema = (posts: Array<{ title: string; url: string; date: string }>) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Zeo Tourism Blog",
  itemListElement: posts.map((post, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: post.url,
    name: post.title
  }))
});

export const createTravelAgencySchema = () => ({
  "@context": "https://schema.org",
  "@type": "TravelAgency",
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
    "https://x.com/zeotourism",
    "https://www.youtube.com/@zeotourism",
    "https://www.linkedin.com/company/zeotourism",
    "https://www.tripadvisor.com/zeotourism"
  ],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: 4.9,
    reviewCount: 1247
  }
});