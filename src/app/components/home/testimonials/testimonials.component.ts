import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
  rating: number;
  date: string;
}

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Safari Guide',
      image: 'assets/images/testimonials/testimonial-1.jpg',
      content: 'Our safari experience with African Trails was absolutely incredible! The guides were knowledgeable and passionate, and we saw all of the Big Five. A dream come true!',
      rating: 5,
      date: 'March 2023'
    },
    {
      id: 2,
      name: 'David Chen',
      role: 'Migration Explorer',
      image: 'assets/images/testimonials/testimonial-2.jpg',
      content: 'The attention to detail and personalized service was outstanding. From the luxury camps to the expert guides, everything exceeded our expectations.',
      rating: 5,
      date: 'July 2023'
    },
    {
      id: 3,
      name: 'Emma Thompson',
      role: 'Gorilla Trekker',
      image: 'assets/images/testimonials/testimonial-3.jpg',
      content: 'A perfect blend of adventure and comfort. The cultural experiences were authentic, and the wildlife sightings were spectacular. Highly recommended!',
      rating: 5,
      date: 'September 2023'
    },
    {
      id: 4,
      name: 'Michael Schmidt',
      role: 'Photographer',
      image: 'assets/images/testimonials/testimonial-4.jpg',
      content: 'The photography opportunities were amazing, and our guide knew exactly where to position us for the best shots. A photographer\'s dream safari!',
      rating: 5,
      date: 'October 2023'
    }
  ];

  filteredTestimonials: Testimonial[] = this.testimonials;

  constructor() {
    // Initialize any required services or dependencies here
  }

  ngOnInit(): void {
    this.loadTestimonials();
    
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

  loadTestimonials(): void {
    // Simulate API call delay
    setTimeout(() => {
      this.filteredTestimonials = this.testimonials;
    }, 1000);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      console.warn(`Failed to load testimonial image: ${img.src}`);
      img.src = 'assets/images/testimonials/default-avatar.jpg';
      img.alt = 'Default avatar';
    }
  }

  getStarArray(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }
} 