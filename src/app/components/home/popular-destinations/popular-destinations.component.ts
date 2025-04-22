import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DestinationService, Destination } from '../../../services/destination.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-popular-destinations',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './popular-destinations.component.html',
  styleUrls: ['./popular-destinations.component.css']
})
export class PopularDestinationsComponent implements OnInit, OnDestroy {
  destinations: Destination[] = [];
  filteredDestinations: Destination[] = [];
  isLoading = true;
  error = false;
  errorMessage = '';
  
  // Filter options
  countries: string[] = [];
  selectedCountry = '';
  priceRange = { min: 0, max: 1000 };
  minRating = 0;
  selectedDuration = '';
  
  // Sort options
  sortOptions = [
    { value: 'rating', label: 'Rating (High to Low)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'name', label: 'Name (A-Z)' }
  ];
  selectedSort = 'rating';
  
  // Image loading states
  imageLoadingStates: Record<number, boolean> = {};
  
  private destroy$ = new Subject<void>();

  constructor(private destinationService: DestinationService) { }

  ngOnInit(): void {
    this.loadDestinations();
    
    // Initialize animations if AOS is available
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load destinations from the service
   */
  loadDestinations(): void {
    this.isLoading = true;
    this.error = false;
    
    this.destinationService.getDestinations()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.destinations = data;
          this.filteredDestinations = [...data];
          this.extractCountries();
          this.applyFilters();
          this.initializeImageLoadingStates();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading destinations:', err);
          this.error = true;
          this.errorMessage = 'Failed to load destinations. Please try again later.';
          this.isLoading = false;
        }
      });
  }

  /**
   * Extract unique countries from destinations
   */
  private extractCountries(): void {
    this.countries = [...new Set(this.destinations.map(d => d.country))].sort();
  }

  /**
   * Initialize loading states for all images
   */
  private initializeImageLoadingStates(): void {
    this.destinations.forEach(dest => {
      this.imageLoadingStates[dest.id] = true;
    });
  }

  /**
   * Apply all filters and sorting
   */
  applyFilters(): void {
    let filtered = [...this.destinations];
    
    // Apply country filter
    if (this.selectedCountry) {
      filtered = filtered.filter(d => d.country === this.selectedCountry);
    }
    
    // Apply price range filter
    filtered = filtered.filter(d => {
      if (!d.price) return false;
      return d.price >= this.priceRange.min && d.price <= this.priceRange.max;
    });
    
    // Apply rating filter
    if (this.minRating > 0) {
      filtered = filtered.filter(d => d.rating >= this.minRating);
    }
    
    // Apply duration filter
    if (this.selectedDuration) {
      filtered = filtered.filter(d => d.duration.includes(this.selectedDuration));
    }
    
    // Apply sorting
    filtered = this.sortDestinations(filtered);
    
    this.filteredDestinations = filtered;
  }

  /**
   * Sort destinations based on selected option
   */
  private sortDestinations(destinations: Destination[]): Destination[] {
    switch (this.selectedSort) {
      case 'rating':
        return destinations.sort((a, b) => b.rating - a.rating);
      case 'price-asc':
        return destinations.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-desc':
        return destinations.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'name':
        return destinations.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return destinations;
    }
  }

  /**
   * Toggle favorite status for a destination
   */
  toggleFavorite(destination: Destination, event: Event): void {
    event.stopPropagation(); // Prevent card click when toggling favorite
    
    this.destinationService.toggleFavorite(destination.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (isFavorite) => {
          destination.isFavorite = isFavorite;
        },
        error: (err) => {
          console.error('Error toggling favorite:', err);
        }
      });
  }

  /**
   * Reset all filters
   */
  resetFilters(): void {
    this.selectedCountry = '';
    this.priceRange = { min: 0, max: 1000 };
    this.minRating = 0;
    this.selectedDuration = '';
    this.selectedSort = 'rating';
    this.applyFilters();
  }

  /**
   * Handle image loading error
   */
  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/images/placeholder.jpg';
      img.alt = 'Placeholder image';
    }
  }

  /**
   * Handle image load event
   */
  onImageLoad(destinationId: number): void {
    this.imageLoadingStates[destinationId] = false;
  }

  /**
   * Handle image error event
   */
  onImageError(destinationId: number): void {
    this.imageLoadingStates[destinationId] = false;
    console.error(`Error loading image for destination ID: ${destinationId}`);
  }

  /**
   * Get favorite icon class based on favorite status
   */
  getFavoriteIconClass(isFavorite: boolean): string {
    return isFavorite ? 'fas fa-heart' : 'far fa-heart';
  }

  /**
   * Format price with currency symbol
   */
  formatPrice(price: number): string {
    return `From $${price}`;
  }

  /**
   * Format duration with appropriate label
   */
  formatDuration(duration: string): string {
    return duration;
  }

  /**
   * Format group size with appropriate label
   */
  formatGroupSize(size: string): string {
    return size;
  }
} 