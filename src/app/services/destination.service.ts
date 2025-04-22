import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Destination {
  id: number;
  name: string;
  country: string;
  slug: string;
  description: string;
  imageUrl: string;
  rating: number;
  price?: number;
  duration: string;
  locations: number;
  groupSize: string;
  isFavorite: boolean;
  delay: number;
}

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private apiUrl = `${environment.apiUrl}/destinations`;
  private cache: Destination[] | null = null;
  private favorites = new Set<number>();

  constructor(private http: HttpClient) {
    // Load favorites from localStorage on service initialization
    this.loadFavorites();
  }

  /**
   * Get all destinations with optional filtering
   */
  getDestinations(filters?: {
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    duration?: string;
  }): Observable<Destination[]> {
    // If we have cached data and no filters, return it immediately
    if (this.cache && !filters) {
      return of(this.cache);
    }

    // In a real app, this would be an HTTP request
    // For now, we'll simulate an API call with a delay
    return this.http.get<Destination[]>(this.apiUrl).pipe(
      delay(800), // Simulate network delay
      map(destinations => this.applyFilters(destinations, filters)),
      tap(destinations => {
        // Update cache if no filters are applied
        if (!filters) {
          this.cache = destinations;
        }
      }),
      catchError(error => {
        console.error('Error fetching destinations:', error);
        // Return fallback data in case of error
        return of(this.getFallbackData());
      })
    );
  }

  /**
   * Get a single destination by ID
   */
  getDestinationById(id: number): Observable<Destination> {
    // In a real app, this would be an HTTP request
    return this.http.get<Destination>(`${this.apiUrl}/${id}`).pipe(
      delay(500), // Simulate network delay
      catchError(error => {
        console.error(`Error fetching destination with ID ${id}:`, error);
        // Find in fallback data
        const fallbackDestination = this.getFallbackData().find(d => d.id === id);
        if (fallbackDestination) {
          return of(fallbackDestination);
        }
        return throwError(() => new Error(`Destination with ID ${id} not found`));
      })
    );
  }

  /**
   * Toggle favorite status for a destination
   */
  toggleFavorite(destinationId: number): Observable<boolean> {
    const isFavorite = this.favorites.has(destinationId);
    
    if (isFavorite) {
      this.favorites.delete(destinationId);
    } else {
      this.favorites.add(destinationId);
    }
    
    // Save to localStorage
    this.saveFavorites();
    
    // In a real app, this would be an HTTP request to update the server
    return of(!isFavorite).pipe(delay(300));
  }

  /**
   * Check if a destination is favorited
   */
  isFavorite(destinationId: number): boolean {
    return this.favorites.has(destinationId);
  }

  /**
   * Get all favorite destinations
   */
  getFavorites(): Observable<Destination[]> {
    if (this.cache) {
      return of(this.cache.filter(d => this.favorites.has(d.id)));
    }
    
    return this.getDestinations().pipe(
      map(destinations => destinations.filter(d => this.favorites.has(d.id)))
    );
  }

  /**
   * Apply filters to destinations
   */
  private applyFilters(destinations: Destination[], filters?: {
    country?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    duration?: string;
  }): Destination[] {
    if (!filters) return destinations;
    
    return destinations.filter((destination: Destination) => {
      if (filters.country && destination.country.toLowerCase() !== filters.country.toLowerCase()) {
        return false;
      }
      
      if (filters.minPrice && destination.price && destination.price < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice && destination.price && destination.price > filters.maxPrice) {
        return false;
      }
      
      if (filters.minRating && destination.rating < filters.minRating) {
        return false;
      }
      
      if (filters.duration && !destination.duration.toLowerCase().includes(filters.duration.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }

  /**
   * Load favorites from localStorage
   */
  private loadFavorites(): void {
    try {
      const storedFavorites = localStorage.getItem('favoriteDestinations');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        if (Array.isArray(parsedFavorites)) {
          this.favorites = new Set(parsedFavorites);
        }
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
      this.favorites = new Set();
    }
  }

  /**
   * Save favorites to localStorage
   */
  private saveFavorites(): void {
    try {
      localStorage.setItem('favoriteDestinations', JSON.stringify([...this.favorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  /**
   * Get fallback data in case of API failure
   */
  private getFallbackData(): Destination[] {
    return [
      {
        id: 1,
        name: 'Bwindi Impenetrable Forest',
        country: 'Uganda',
        slug: 'bwindi-impenetrable-forest',
        description: 'Home to half of the world\'s remaining mountain gorilla population, offering unforgettable trekking experiences.',
        imageUrl: 'assets/images/destinations/bwindi.jpg',
        rating: 4.9,
        price: 699,
        duration: '3-5 Days',
        locations: 4,
        groupSize: 'Max 8',
        isFavorite: this.favorites.has(1),
        delay: 100
      },
      {
        id: 2,
        name: 'Serengeti National Park',
        country: 'Tanzania',
        slug: 'serengeti-national-park',
        description: 'Witness the Great Migration and explore the endless plains teeming with wildlife.',
        imageUrl: 'assets/images/destinations/serengeti.jpg',
        rating: 4.8,
        price: 799,
        duration: '4-7 Days',
        locations: 6,
        groupSize: 'Max 6',
        isFavorite: this.favorites.has(2),
        delay: 200
      },
      {
        id: 3,
        name: 'Masai Mara',
        country: 'Kenya',
        slug: 'masai-mara',
        description: 'Experience incredible wildlife viewing and authentic cultural encounters with the Maasai people.',
        imageUrl: 'assets/images/destinations/masai-mara.jpg',
        rating: 4.7,
        price: 749,
        duration: '3-6 Days',
        locations: 5,
        groupSize: 'Max 8',
        isFavorite: this.favorites.has(3),
        delay: 300
      },
      {
        id: 4,
        name: 'Victoria Falls',
        country: 'Zimbabwe/Zambia',
        slug: 'victoria-falls',
        description: 'Marvel at the world\'s largest waterfall and enjoy thrilling activities in this adventure capital.',
        imageUrl: 'assets/images/destinations/victoria-falls.jpg',
        rating: 4.8,
        price: 599,
        duration: '2-4 Days',
        locations: 3,
        groupSize: 'Max 10',
        isFavorite: this.favorites.has(4),
        delay: 400
      },
      {
        id: 5,
        name: 'Zanzibar Archipelago',
        country: 'Tanzania',
        slug: 'zanzibar',
        description: 'Relax on pristine beaches, explore historic Stone Town, and enjoy water activities in this tropical paradise.',
        imageUrl: 'assets/images/destinations/zanzibar.jpg',
        rating: 4.6,
        price: 649,
        duration: '5-10 Days',
        locations: 7,
        groupSize: 'Max 12',
        isFavorite: this.favorites.has(5),
        delay: 500
      },
      {
        id: 6,
        name: 'Murchison Falls',
        country: 'Uganda',
        slug: 'murchison-falls',
        description: 'Discover Uganda\'s largest national park with the mighty Nile River and spectacular waterfall.',
        imageUrl: 'assets/images/destinations/murchison-falls.jpg',
        rating: 4.7,
        price: 549,
        duration: '2-4 Days',
        locations: 4,
        groupSize: 'Max 8',
        isFavorite: this.favorites.has(6),
        delay: 600
      }
    ];
  }
}
