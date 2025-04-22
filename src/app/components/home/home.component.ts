import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { PopularDestinationsComponent } from './popular-destinations/popular-destinations.component';
import { FeaturedPackagesComponent } from './featured-packages/featured-packages.component';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { NewsletterComponent } from './newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeroSectionComponent,
    PopularDestinationsComponent,
    FeaturedPackagesComponent,
    TestimonialsComponent,
    NewsletterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit {
  constructor() {
    // Initialize any required services or dependencies here
  }

  ngOnInit(): void {
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

  ngAfterViewInit(): void {
    // Initialize counter animation for stats
    this.initCounters();
  }

  private initCounters(): void {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // The lower the slower
    
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count')!;
      let count = 0;
      
      const updateCount = () => {
        const increment = target / speed;
        
        if (count < target) {
          count += increment;
          counter.textContent = Math.ceil(count).toString();
          setTimeout(updateCount, 1);
        } else {
          counter.textContent = target.toString();
        }
      };
      
      updateCount();
    });
  }
}
