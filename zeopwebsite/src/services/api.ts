// API service for fetching data from REST API with mobile optimization
const getApiBaseUrl = (): string => {
  // Check if we're in production (deployed)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Use the same domain as the frontend for production
    return `${window.location.protocol}//${window.location.host}/api`;
  }
  
  // Development environment - use relative URL to leverage Vite proxy
  return '/api';
};

const getImageBaseUrl = (): string => {
  // Check if we're in production (deployed)
  if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Use the same domain as the frontend for production
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Development environment - use relative URL to leverage Vite proxy
  return '';
};

const API_BASE_URL = getApiBaseUrl();
const IMAGE_BASE_URL = getImageBaseUrl();

export interface Tour {
  id: number;
  title: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  duration: string;
  group_size: string; // SQLite uses group_size instead of groupSize
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  rating: number;
  reviews: number;
  highlights: string[];
  featured?: boolean;
  discount?: number;
  location: string;
  description: string;
  inclusions: string[];
  best_time: string; // SQLite uses best_time instead of bestTime
  // Additional SQLite fields
  slug?: string;
  destination_id?: number;
  destination_name?: string;
  destination_slug?: string;
  created_at?: string;
  updated_at?: string;
  activities?: Activity[];
  gallery?: string[];
}

export interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  tourCount?: number; // Optional since SQLite doesn't have this field
  href?: string; // Optional since SQLite doesn't have this field
  type?: 'nepal' | 'international'; // Optional since SQLite doesn't have this field
  description: string;
  highlights?: string[]; // Optional since SQLite doesn't have this field
  bestTime?: string; // Optional since SQLite doesn't have this field
  altitude?: string; // Optional since SQLite doesn't have this field
  difficulty: string;
  // SQLite fields
  slug: string;
  location: string;
  duration: string;
  rating: number;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Activity {
  id: number;
  name: string;
  image: string;
  tourCount?: number; // Optional since SQLite doesn't have this field
  href?: string; // Optional since SQLite doesn't have this field
  type?: 'adventure' | 'cultural'; // Optional since SQLite doesn't have this field
  description?: string;
  highlights?: string[]; // Optional since SQLite doesn't have this field
  difficulty?: string; // Optional since SQLite doesn't have this field
  bestTime?: string; // Optional since SQLite doesn't have this field
  duration?: string; // Optional since SQLite doesn't have this field
  popularDestinations?: string[]; // Optional since SQLite doesn't have this field
  // SQLite fields
  slug: string;
  icon?: string;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Slider {
  id: number;
  title: string;
  subtitle?: string;
  location?: string;
  image: string;
  video?: string;
  order_index: number;
  is_active: boolean;
  button_text?: string;
  button_url?: string;
  button_style?: 'primary' | 'secondary' | 'outline';
  show_button?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Contact {
  company: {
    name: string;
    tagline: string;
    description: string;
  };
  contact: {
    phone: {
      primary: string;
      secondary: string;
      display: string;
    };
    email: {
      primary: string;
      booking: string;
      admin: string;
      support: string;
    };
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      postal_code: string;
      full: string;
    };
    location: {
      coordinates: {
        latitude: number;
        longitude: number;
      };
      timezone: string;
      display: string;
    };
  };
  business: {
    hours: {
      monday: string;
      tuesday: string;
      wednesday: string;
      thursday: string;
      friday: string;
      saturday: string;
      sunday: string;
      display: string;
    };
    support: {
      availability: string;
      emergency: string;
      response_time: string;
    };
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    linkedin: string;
    whatsapp: string;
  };
  legal: {
    registration: string;
    tax_id: string;
    established: string;
    certifications: string[];
  };
}

export interface Testimonial {
  id: number;
  name: string;
  email: string;
  country: string;
  tour: string;
  rating: number;
  title: string;
  message: string;
  image: string;
  date: string;
  is_featured: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Blog {
  title: string;
  slug: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  featured: boolean;
  image: string;
  excerpt: string;
  reading_time: string;
  content: string;
  filename: string;
  seo?: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  user_id: number;
  tour_id: number;
  booking_date: string;
  travel_date: string;
  participants: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

// Enhanced Destination interface for content-based destinations
export interface ContentDestination {
  title: string;
  slug: string;
  country: string;
  region: string;
  featured: boolean;
  difficulty: string;
  best_time: string;
  altitude: string;
  duration: string;
  image: string;
  gallery: string[];
  highlights: string[];
  activities: string[];
  accommodation: string[];
  transportation: string[];
  permits_required: string[];
  weather: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
  content: string;
  filename: string;
  seo?: {
    meta_title: string;
    meta_description: string;
    keywords: string[];
  };
}

// Mobile detection utility
const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Helper function to convert relative image URLs to full URLs
const convertImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // If it starts with /uploads/, convert to full URL
  if (imageUrl.startsWith('/uploads/')) {
    return `${IMAGE_BASE_URL}${imageUrl}`;
  }
  
  // If it doesn't start with /, add it
  if (!imageUrl.startsWith('/')) {
    return `${IMAGE_BASE_URL}/uploads/${imageUrl}`;
  }
  
  // Default case - prepend IMAGE_BASE_URL
  return `${IMAGE_BASE_URL}${imageUrl}`;
};

// Helper function to convert tour data with proper image URLs
const convertTourImageUrls = (tour: Tour): Tour => {
  return {
    ...tour,
    image: convertImageUrl(tour.image),
    // Convert gallery images if they exist
    ...(tour.gallery && {
      gallery: tour.gallery.map((img: string) => convertImageUrl(img))
    })
  };
};

// Enhanced API call helper with mobile optimizations and retry logic
const apiCall = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for mobile

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🌐 API Call: ${url}`);
    
    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache',
        ...(isMobileDevice() && { 'X-Mobile-Request': 'true' })
      },
      signal: controller.signal,
      ...options
    };

    const response = await fetch(url, defaultOptions);
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText} for ${url}`);
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`✅ API Success: ${url}`, result);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`⏰ API Timeout: ${endpoint}`);
        throw new Error('Request timeout - please check your connection');
      }
      console.error(`🚨 API Error: ${endpoint}`, error.message);
      throw error;
    }
    
    console.error(`🚨 Unknown API Error: ${endpoint}`, error);
    throw new Error('Unknown API error occurred');
  }
};

// Retry wrapper for critical API calls
const apiCallWithRetry = async <T>(endpoint: string, maxRetries: number = 3): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall<T>(endpoint);
    } catch (error) {
      lastError = error as Error;
      console.warn(`🔄 API Retry ${attempt}/${maxRetries} for ${endpoint}:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

// Tours API
export const toursApi = {
  // Get all tours
  async getAll(): Promise<Tour[]> {
    const tours = await apiCallWithRetry<Tour[]>('/tours');
    return tours.map(convertTourImageUrls);
  },

  // Get tour by ID
  async getById(id: number): Promise<Tour | null> {
    try {
      const tour = await apiCall<Tour>(`/tours/${id}`);
      return tour ? convertTourImageUrls(tour) : null;
    } catch (error) {
      console.warn(`Tour ${id} not found:`, error);
      return null;
    }
  },


  // Get tours by category
  async getByCategory(category: string): Promise<Tour[]> {
    const tours = await apiCall<Tour[]>(`/tours?category=${encodeURIComponent(category)}`);
    return tours.map(convertTourImageUrls);
  },

  // Get tours by location
  async getByLocation(location: string): Promise<Tour[]> {
    const tours = await apiCall<Tour[]>(`/tours?location=${encodeURIComponent(location)}`);
    return tours.map(convertTourImageUrls);
  },

  // Search tours
  async search(query: string): Promise<Tour[]> {
    const tours = await apiCall<Tour[]>(`/tours?search=${encodeURIComponent(query)}`);
    return tours.map(convertTourImageUrls);
  }
};

// Destinations API
export const destinationsApi = {
  // Get all destinations
  async getAll(): Promise<Destination[]> {
    return apiCallWithRetry<Destination[]>('/destinations');
  },

  // Get destination by ID
  async getById(id: number): Promise<Destination | null> {
    try {
      return await apiCall<Destination>(`/destinations/${id}`);
    } catch (error) {
      console.warn(`Destination ${id} not found:`, error);
      return null;
    }
  },

  // Get destination by slug
  async getBySlug(slug: string): Promise<Destination | null> {
    try {
      return await apiCall<Destination>(`/destinations/${encodeURIComponent(slug)}`);
    } catch (error) {
      console.warn(`Destination ${slug} not found:`, error);
      return null;
    }
  },

  // Get destinations by type
  async getByType(type: 'nepal' | 'international'): Promise<Destination[]> {
    return apiCall<Destination[]>(`/destinations?type=${type}`);
  },

  // Get featured destinations
  async getFeatured(): Promise<Destination[]> {
    return apiCall<Destination[]>('/destinations?featured=true');
  },

  // Get destination by name
  async getByName(name: string): Promise<Destination | null> {
    try {
      return await apiCall<Destination>(`/destinations/name/${encodeURIComponent(name)}`);
    } catch (error) {
      console.warn(`Destination ${name} not found:`, error);
      return null;
    }
  }
};

// Activities API
export const activitiesApi = {
  // Get all activities
  async getAll(): Promise<Activity[]> {
    return apiCallWithRetry<Activity[]>('/activities');
  },

  // Get activity by ID
  async getById(id: number): Promise<Activity | null> {
    try {
      return await apiCall<Activity>(`/activities/${id}`);
    } catch (error) {
      console.warn(`Activity ${id} not found:`, error);
      return null;
    }
  },

  // Get activity by slug
  async getBySlug(slug: string): Promise<Activity | null> {
    try {
      return await apiCall<Activity>(`/activities/${encodeURIComponent(slug)}`);
    } catch (error) {
      console.warn(`Activity ${slug} not found:`, error);
      return null;
    }
  },

  // Get activities by type
  async getByType(type: 'adventure' | 'cultural'): Promise<Activity[]> {
    return apiCall<Activity[]>(`/activities?type=${type}`);
  },

  // Get activity by name
  async getByName(name: string): Promise<Activity | null> {
    try {
      return await apiCall<Activity>(`/activities/name/${encodeURIComponent(name)}`);
    } catch (error) {
      console.warn(`Activity ${name} not found:`, error);
      return null;
    }
  }
};

// Combined API for search across all data types
export const searchApi = {
  async searchAll(query: string): Promise<{
    tours: Tour[];
    destinations: Destination[];
    activities: Activity[];
  }> {
    return apiCall<{
      tours: Tour[];
      destinations: Destination[];
      activities: Activity[];
    }>(`/search?q=${encodeURIComponent(query)}`);
  }
};

// Sliders API
export const slidersApi = {
  // Get all active sliders
  async getAll(): Promise<Slider[]> {
    return apiCallWithRetry<Slider[]>('/sliders');
  },

  // Get slider by ID
  async getById(id: number): Promise<Slider | null> {
    try {
      return await apiCall<Slider>(`/sliders/${id}`);
    } catch (error) {
      console.warn(`Slider ${id} not found:`, error);
      return null;
    }
  }
};

// Blogs API (New - Markdown + YAML content)
export const blogsApi = {
  // Get all blog posts
  async getAll(): Promise<Blog[]> {
    return apiCallWithRetry<Blog[]>('/blogs');
  },

  // Get blog by slug
  async getBySlug(slug: string): Promise<Blog | null> {
    try {
      return await apiCall<Blog>(`/blogs/${encodeURIComponent(slug)}`);
    } catch (error) {
      console.warn(`Blog ${slug} not found:`, error);
      return null;
    }
  },

  // Get featured blogs
  async getFeatured(): Promise<Blog[]> {
    return apiCall<Blog[]>('/blogs?featured=true');
  },

  // Get blogs by category
  async getByCategory(category: string): Promise<Blog[]> {
    return apiCall<Blog[]>(`/blogs?category=${encodeURIComponent(category)}`);
  }
};

// Users API (New - LowDB structured data)
export const usersApi = {
  // Get all users
  async getAll(): Promise<User[]> {
    return apiCallWithRetry<User[]>('/users');
  },

  // Get user by ID
  async getById(id: number): Promise<User | null> {
    try {
      return await apiCall<User>(`/users/${id}`);
    } catch (error) {
      console.warn(`User ${id} not found:`, error);
      return null;
    }
  },

  // Create new user
  async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    return apiCall<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  // Update user
  async update(id: number, userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>): Promise<User> {
    return apiCall<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }
};

// Bookings API (New - LowDB structured data)
export const bookingsApi = {
  // Get all bookings
  async getAll(): Promise<Booking[]> {
    return apiCallWithRetry<Booking[]>('/bookings');
  },

  // Get booking by ID
  async getById(id: number): Promise<Booking | null> {
    try {
      return await apiCall<Booking>(`/bookings/${id}`);
    } catch (error) {
      console.warn(`Booking ${id} not found:`, error);
      return null;
    }
  },

  // Get bookings by user ID
  async getByUserId(userId: number): Promise<Booking[]> {
    return apiCall<Booking[]>(`/bookings?user_id=${userId}`);
  },

  // Get bookings by tour ID
  async getByTourId(tourId: number): Promise<Booking[]> {
    return apiCall<Booking[]>(`/bookings?tour_id=${tourId}`);
  },

  // Create new booking
  async create(bookingData: Omit<Booking, 'id' | 'booking_date' | 'created_at' | 'updated_at'>): Promise<Booking> {
    return apiCall<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  // Update booking
  async update(id: number, bookingData: Partial<Omit<Booking, 'id' | 'booking_date' | 'created_at' | 'updated_at'>>): Promise<Booking> {
    return apiCall<Booking>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData)
    });
  }
};

// Enhanced Destinations API (Now supports content-based destinations)
export const contentDestinationsApi = {
  // Get all content-based destinations
  async getAll(): Promise<ContentDestination[]> {
    return apiCallWithRetry<ContentDestination[]>('/destinations');
  },

  // Get destination by slug
  async getBySlug(slug: string): Promise<ContentDestination | null> {
    try {
      return await apiCall<ContentDestination>(`/destinations/${encodeURIComponent(slug)}`);
    } catch (error) {
      console.warn(`Content destination ${slug} not found:`, error);
      return null;
    }
  },

  // Get featured destinations
  async getFeatured(): Promise<ContentDestination[]> {
    return apiCall<ContentDestination[]>('/destinations?featured=true');
  },

  // Get destinations by country
  async getByCountry(country: string): Promise<ContentDestination[]> {
    return apiCall<ContentDestination[]>(`/destinations?country=${encodeURIComponent(country)}`);
  }
};

// Enhanced Search API (Now includes blogs and content destinations)
export const enhancedSearchApi = {
  async searchAll(query: string): Promise<{
    tours: Tour[];
    blogs: Blog[];
    destinations: ContentDestination[];
  }> {
    return apiCall<{
      tours: Tour[];
      blogs: Blog[];
      destinations: ContentDestination[];
    }>(`/search?q=${encodeURIComponent(query)}`);
  }
};

// Enhanced Featured content API (Now includes blogs)
export const featuredApi = {
  async getAll(): Promise<{
    destinations: ContentDestination[];
    tours: Tour[];
    blogs: Blog[];
  }> {
    return apiCallWithRetry<{
      destinations: ContentDestination[];
      tours: Tour[];
      blogs: Blog[];
    }>('/featured');
  }
};

// Contact API
export const contactApi = {
  async get(): Promise<Contact> {
    return apiCallWithRetry<Contact>('/contact');
  }
};

// Testimonials API
export const testimonialsApi = {
  // Get all approved testimonials
  async getAll(): Promise<Testimonial[]> {
    return apiCallWithRetry<Testimonial[]>('/testimonials');
  },

  // Get featured testimonials
  async getFeatured(): Promise<Testimonial[]> {
    return apiCall<Testimonial[]>('/testimonials?featured=true');
  },

  // Get testimonial by ID
  async getById(id: number): Promise<Testimonial | null> {
    try {
      return await apiCall<Testimonial>(`/testimonials/${id}`);
    } catch (error) {
      console.warn(`Testimonial ${id} not found:`, error);
      return null;
    }
  },

  // Submit new testimonial (public)
  async submit(testimonialData: Omit<Testimonial, 'id' | 'date' | 'is_featured' | 'is_approved' | 'created_at' | 'updated_at'>): Promise<{
    success: boolean;
    message: string;
    testimonial: Testimonial;
  }> {
    return apiCall('/testimonials', {
      method: 'POST',
      body: JSON.stringify(testimonialData)
    });
  }
};

// Health check API
export const healthApi = {
  async check(): Promise<{
    status: string;
    timestamp: string;
    database: string;
    version: string;
    environment: string;
    mobile: boolean;
    dataLoaded: {
      destinations: number;
      activities: number;
      tours: number;
    };
  }> {
    return apiCall('/health');
  }
};

// Export default API object
const api = {
  tours: toursApi,
  destinations: destinationsApi,
  activities: activitiesApi,
  search: searchApi,
  sliders: slidersApi,
  featured: featuredApi,
  contact: contactApi,
  testimonials: testimonialsApi,
  health: healthApi,
  // New hybrid APIs
  blogs: blogsApi,
  users: usersApi,
  bookings: bookingsApi,
  contentDestinations: contentDestinationsApi,
  enhancedSearch: enhancedSearchApi
};

export default api;

// Debug helper for development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔧 API Configuration:', {
    baseUrl: API_BASE_URL,
    isMobile: isMobileDevice(),
    hostname: window.location.hostname,
    protocol: window.location.protocol
  });
}