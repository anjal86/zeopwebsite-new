// API service for fetching data from REST API
const API_BASE_URL = 'http://localhost:3001/api';

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
  created_at?: string;
  updated_at?: string;
}

// Helper function for API calls
const apiCall = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  const result = await response.json();
  return result;
};

// Tours API
export const toursApi = {
  // Get all tours
  async getAll(): Promise<Tour[]> {
    return apiCall<Tour[]>('/tours');
  },

  // Get tour by ID
  async getById(id: number): Promise<Tour | null> {
    try {
      return await apiCall<Tour>(`/tours/${id}`);
    } catch (error) {
      return null;
    }
  },

  // Get featured tours
  async getFeatured(): Promise<Tour[]> {
    return apiCall<Tour[]>('/tours?featured=true');
  },

  // Get tours by category
  async getByCategory(category: string): Promise<Tour[]> {
    return apiCall<Tour[]>(`/tours?category=${encodeURIComponent(category)}`);
  },

  // Get tours by location
  async getByLocation(location: string): Promise<Tour[]> {
    return apiCall<Tour[]>(`/tours?location=${encodeURIComponent(location)}`);
  },

  // Search tours
  async search(query: string): Promise<Tour[]> {
    return apiCall<Tour[]>(`/tours?search=${encodeURIComponent(query)}`);
  }
};

// Destinations API
export const destinationsApi = {
  // Get all destinations
  async getAll(): Promise<Destination[]> {
    return apiCall<Destination[]>('/destinations');
  },

  // Get destination by ID
  async getById(id: number): Promise<Destination | null> {
    try {
      return await apiCall<Destination>(`/destinations/${id}`);
    } catch (error) {
      return null;
    }
  },

  // Get destinations by type
  async getByType(type: 'nepal' | 'international'): Promise<Destination[]> {
    return apiCall<Destination[]>(`/destinations?type=${type}`);
  },

  // Get destination by name
  async getByName(name: string): Promise<Destination | null> {
    try {
      return await apiCall<Destination>(`/destinations/name/${encodeURIComponent(name)}`);
    } catch (error) {
      return null;
    }
  }
};

// Activities API
export const activitiesApi = {
  // Get all activities
  async getAll(): Promise<Activity[]> {
    return apiCall<Activity[]>('/activities');
  },

  // Get activity by ID
  async getById(id: number): Promise<Activity | null> {
    try {
      return await apiCall<Activity>(`/activities/${id}`);
    } catch (error) {
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
    return apiCall<Slider[]>('/sliders');
  },

  // Get slider by ID
  async getById(id: number): Promise<Slider | null> {
    try {
      return await apiCall<Slider>(`/sliders/${id}`);
    } catch (error) {
      return null;
    }
  }
};

// Export default API object
const api = {
  tours: toursApi,
  destinations: destinationsApi,
  activities: activitiesApi,
  search: searchApi,
  sliders: slidersApi
};

export default api;