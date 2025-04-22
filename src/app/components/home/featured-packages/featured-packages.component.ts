import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

interface Package {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  imageUrl: string;
  location: string;
  rating: number;
  reviews: number;
  type: string[];
  groupSize: number;
  isPopular: boolean;
  discount?: number;
  delay?: string;
  slug: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-featured-packages',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-packages.component.html',
  styleUrls: ['./featured-packages.component.scss']
})
export class FeaturedPackagesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  selectedCategory: 'all' | 'safari' | 'beach' | 'cultural' | 'adventure' = 'all';
  isLoading = false;
  error: boolean | null = null;
  errorMessage = 'Failed to load packages. Please try again.';
  
  packages: Package[] = [];
  activeFilter = 'all';
  imageLoadingStates: { [key: number]: boolean } = {};

  constructor() {
    // Initialize any required services or dependencies here
  }

  ngOnInit(): void {
    this.loadPackages();
    
    // Initialize AOS
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

  private loadPackages(): void {
    this.isLoading = true;
    this.error = false;
    this.errorMessage = '';

    try {
      // Simulate API call delay
      setTimeout(() => {
        this.packages = [
          {
            id: 1,
            name: 'Serengeti Safari Adventure',
            description: 'Experience the wild beauty of Serengeti National Park',
            price: 2999,
            duration: '7 days',
            imageUrl: 'assets/images/packages/serengeti.jpg',
            location: 'Tanzania',
            rating: 4.8,
            reviews: 124,
            type: ['safari', 'adventure'],
            groupSize: 12,
            isPopular: true,
            discount: 15,
            delay: '100',
            slug: 'serengeti-safari',
            isFavorite: false
          },
          {
            id: 2,
            name: 'Zanzibar Beach Retreat',
            description: 'Relax on the pristine beaches of Zanzibar',
            price: 1999,
            duration: '5 days',
            imageUrl: 'assets/images/packages/zanzibar.jpg',
            location: 'Tanzania',
            rating: 4.6,
            reviews: 89,
            type: ['beach', 'relaxation'],
            groupSize: 8,
            isPopular: true,
            delay: '200',
            slug: 'zanzibar-beach',
            isFavorite: false
          }
        ];
        this.isLoading = false;
      }, 1000);
    } catch (error) {
      this.error = true;
      this.errorMessage = 'Failed to load packages. Please try again later.';
      this.isLoading = false;
      console.error('Error loading packages:', error);
    }
  }

  filterPackages(category: 'all' | 'safari' | 'beach' | 'cultural' | 'adventure'): void {
    this.selectedCategory = category;
    this.loadPackages();
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  onImageLoad(packageId: number): void {
    this.imageLoadingStates[packageId] = true;
  }

  onImageError(packageId: number): void {
    this.imageLoadingStates[packageId] = false;
  }

  toggleFavorite(pkg: Package, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    pkg.isFavorite = !pkg.isFavorite;
  }

  getFavoriteIconClass(isFavorite: boolean): string {
    return isFavorite ? 'bi-heart-fill' : 'bi-heart';
  }
}
