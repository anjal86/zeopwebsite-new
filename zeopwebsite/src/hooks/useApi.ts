import { useState, useEffect, useCallback } from 'react';
import api, { type Tour } from '../services/api';

// Generic hook for API calls with loading and error states
export function useApiCall<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  useEffect(() => {
    let isMounted = true;

    const runFetch = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiCall();
        if (isMounted) {
          setData(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    runFetch();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Tours hooks
export function useTours() {
  return useApiCall(() => api.tours.getAll());
}

export function useTour(id: number) {
  return useApiCall(() => api.tours.getById(id), [id]);
}

export function useFeaturedTours() {
  return useApiCall(() => api.tours.getFeatured());
}

export function useToursByCategory(category: string) {
  return useApiCall(() => api.tours.getByCategory(category), [category]);
}

export function useToursByLocation(location: string) {
  return useApiCall(() => api.tours.getByLocation(location), [location]);
}

export function useSearchTours(query: string) {
  return useApiCall(() => api.tours.search(query), [query]);
}

// Destinations hooks
export function useDestinations() {
  return useApiCall(() => api.destinations.getAll());
}

export function useDestination(id: number) {
  return useApiCall(() => api.destinations.getById(id), [id]);
}

export function useDestinationsByType(type: 'nepal' | 'international') {
  return useApiCall(() => api.destinations.getByType(type), [type]);
}

export function useDestinationByName(name: string) {
  return useApiCall(() => api.destinations.getByName(name), [name]);
}

// Content Destinations hooks (for Markdown + YAML destinations)
export function useContentDestinations() {
  return useApiCall(() => api.contentDestinations.getAll());
}

export function useContentDestination(slug: string) {
  return useApiCall(() => {
    // Don't make API call if slug is empty, undefined, or invalid
    if (!slug || slug.trim() === '' || slug === 'undefined' || slug === 'null') {
      return Promise.resolve(null);
    }
    return api.contentDestinations.getBySlug(slug);
  }, [slug]);
}

export function useFeaturedContentDestinations() {
  return useApiCall(() => api.contentDestinations.getFeatured());
}

export function useContentDestinationsByCountry(country: string) {
  return useApiCall(() => api.contentDestinations.getByCountry(country), [country]);
}

// Activities hooks
export function useActivities() {
  return useApiCall(() => api.activities.getAll());
}

export function useActivity(id: number) {
  return useApiCall(() => api.activities.getById(id), [id]);
}

export function useActivitiesByType(type: 'adventure' | 'cultural') {
  return useApiCall(() => api.activities.getByType(type), [type]);
}

export function useActivityByName(name: string) {
  return useApiCall(() => api.activities.getByName(name), [name]);
}

// Search hook
export function useSearchAll(query: string) {
  return useApiCall(() => api.search.searchAll(query), [query]);
}

// Sliders hooks
export function useSliders() {
  return useApiCall(() => api.sliders.getAll());
}

export function useSlider(id: number) {
  return useApiCall(() => api.sliders.getById(id), [id]);
}

// Custom hook for filtered tours with client-side filtering
export function useFilteredTours(filters: {
  search?: string;
  destination?: string;
  activity?: string;
}) {
  const { data: tours, loading, error } = useTours();
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);

  useEffect(() => {
    if (!tours) {
      setFilteredTours([]);
      return;
    }

    let filtered = [...tours];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(tour =>
        tour.title.toLowerCase().includes(searchTerm) ||
        tour.description.toLowerCase().includes(searchTerm) ||
        tour.location.toLowerCase().includes(searchTerm) ||
        tour.category.toLowerCase().includes(searchTerm) ||
        tour.highlights.some(h => h.toLowerCase().includes(searchTerm))
      );
    }

    // Apply destination filter
    if (filters.destination) {
      filtered = filtered.filter(tour =>
        tour.location.toLowerCase() === filters.destination!.toLowerCase()
      );
    }

    // Apply activity filter
    if (filters.activity) {
      const activityTerm = filters.activity.toLowerCase();
      filtered = filtered.filter(tour =>
        tour.highlights.some(h => h.toLowerCase().includes(activityTerm)) ||
        tour.category.toLowerCase().includes(activityTerm) ||
        tour.description.toLowerCase().includes(activityTerm) ||
        tour.inclusions.some(i => i.toLowerCase().includes(activityTerm))
      );
    }

    setFilteredTours(filtered);
  }, [tours, filters.search, filters.destination, filters.activity]);

  return {
    tours: filteredTours,
    allTours: tours,
    loading,
    error,
    totalCount: tours?.length || 0,
    filteredCount: filteredTours.length
  };
}
