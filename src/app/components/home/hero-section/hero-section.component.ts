import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

// Add NodeJS types
declare global {
  interface Window {
    AOS: {
      init: (config: {
        duration: number;
        easing: string;
        once: boolean;
        disable: boolean;
      }) => void;
      refresh: () => void;
    };
  }
}

interface Slide {
  id: number;
  image: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  searchTitle: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonLink: string;
}

interface SearchTab {
  id: string;
  title: string;
  icon: string;
  searchTitle: string;
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchSection') searchSection!: ElementRef<HTMLElement>;
  @ViewChild('heroSection') heroSection!: ElementRef<HTMLElement>;
  
  private destroy$ = new Subject<void>();
  private slideInterval: ReturnType<typeof setInterval> | null = null;
  private scrollTimeout: ReturnType<typeof setTimeout> | null = null;

  slides: Slide[] = [
    {
      id: 1,
      image: 'assets/images/hero/slide1.jpg',
      imageUrl: 'assets/images/hero/slide1.jpg',
      title: 'Discover Africa\'s Hidden Gems',
      subtitle: 'Experience the magic of Africa with our curated tours',
      searchTitle: 'Where to?',
      primaryButtonText: 'Explore Tours',
      secondaryButtonText: 'Learn More',
      primaryButtonLink: '/tours',
      secondaryButtonLink: '/about'
    },
    {
      id: 2,
      image: 'assets/images/hero/slide2.jpg',
      imageUrl: 'assets/images/hero/slide2.jpg',
      title: 'Luxury Safari Adventures',
      subtitle: 'Immerse yourself in the wild beauty of Africa',
      searchTitle: 'Where to?',
      primaryButtonText: 'Book Safari',
      secondaryButtonText: 'View Packages',
      primaryButtonLink: '/safaris',
      secondaryButtonLink: '/packages'
    },
    {
      id: 3,
      image: 'assets/images/hero/slide3.jpg',
      imageUrl: 'assets/images/hero/slide3.jpg',
      title: 'Cultural Experiences',
      subtitle: 'Connect with local communities and traditions',
      searchTitle: 'Where to?',
      primaryButtonText: 'Discover Culture',
      secondaryButtonText: 'Plan Your Trip',
      primaryButtonLink: '/experiences',
      secondaryButtonLink: '/plan'
    }
  ];

  searchTabs: SearchTab[] = [
    { id: 'all', title: 'Search All', icon: 'fas fa-search', searchTitle: 'Where to?' },
    { id: 'hotels', title: 'Hotels', icon: 'fas fa-hotel', searchTitle: 'Stay somewhere great' },
    { id: 'activities', title: 'Things to Do', icon: 'fas fa-camera', searchTitle: 'Do something fun' },
    { id: 'restaurants', title: 'Restaurants', icon: 'fas fa-utensils', searchTitle: 'Find something to eat' },
    { id: 'flights', title: 'Flights', icon: 'fas fa-plane', searchTitle: 'Find the best flight' },
    { id: 'rentals', title: 'Vacation Rentals', icon: 'fas fa-home', searchTitle: 'Explore places to rent' }
  ];

  currentSlideIndex = 0;
  currentSlide: Slide;
  slideActive = false;
  isSearchBarFixed = false;
  lastScrollPosition = 0;
  searchBarOffset = 0;

  activeTab = 'all';
  searchTitle = 'Where to?';
  searchForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.currentSlide = this.slides[0];
  }

  ngOnInit(): void {
    this.startSlideShow();
    this.initializeSearchForm();
    this.checkScrollPosition();
    this.setupSmoothScroll();
    this.initializeAOS();
  }

  ngAfterViewInit(): void {
    this.calculateSearchBarOffset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopSlideShow();
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

  private setupSmoothScroll(): void {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = (link as HTMLAnchorElement).getAttribute('href');
        if (targetId) {
          const targetElement = document.querySelector(targetId);
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  private calculateSearchBarOffset(): void {
    if (this.searchSection?.nativeElement && this.heroSection?.nativeElement) {
      const navbarHeight = 70;
      this.searchBarOffset = this.searchSection.nativeElement.offsetTop - navbarHeight;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = setTimeout(() => {
      if (typeof window !== 'undefined' && window.AOS) {
        window.AOS.refresh();
      }
      this.handleScroll();
    }, 150);
  }

  private handleScroll(): void {
    if (typeof window === 'undefined') return;

    const scrollPosition = window.scrollY;
    const heroHeight = this.heroSection?.nativeElement?.offsetHeight || 0;
    const searchSection = this.searchSection?.nativeElement;

    if (searchSection) {
      if (scrollPosition > heroHeight * 0.5) {
        searchSection.classList.add('fixed');
      } else {
        searchSection.classList.remove('fixed');
      }
    }
  }

  private checkScrollPosition(): void {
    if (this.searchSection?.nativeElement) {
      const searchSectionTop = this.searchSection.nativeElement.getBoundingClientRect().top;
      this.isSearchBarFixed = searchSectionTop <= 0;
    }
  }

  private initializeSearchForm(): void {
    this.searchForm = this.fb.group({
      query: ['', Validators.required],
      location: [''],
      checkIn: [''],
      checkOut: [''],
      guests: [1, [Validators.required, Validators.min(1)]],
      rooms: [1, [Validators.required, Validators.min(1)]]
    });
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
    const tab = this.searchTabs.find(t => t.id === tabId);
    if (tab) {
      this.searchTitle = tab.searchTitle;
    }
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      const searchParams = this.searchForm.value;
      const route = this.getSearchRoute();
      this.router.navigate([route], { queryParams: searchParams });
    }
  }

  private getSearchRoute(): string {
    switch (this.activeTab) {
      case 'hotels':
        return '/hotels';
      case 'activities':
        return '/activities';
      case 'restaurants':
        return '/restaurants';
      case 'flights':
        return '/flights';
      case 'rentals':
        return '/rentals';
      default:
        return '/search';
    }
  }

  private startSlideShow(): void {
    this.slideActive = true;
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  private stopSlideShow(): void {
    this.slideActive = false;
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  nextSlide(): void {
    this.slideActive = false;
    setTimeout(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
      this.currentSlide = this.slides[this.currentSlideIndex];
      this.slideActive = true;
    }, 500);
  }

  prevSlide(): void {
    this.slideActive = false;
    setTimeout(() => {
      this.currentSlideIndex = (this.currentSlideIndex - 1 + this.slides.length) % this.slides.length;
      this.currentSlide = this.slides[this.currentSlideIndex];
      this.slideActive = true;
    }, 500);
  }

  goToSlide(index: number): void {
    if (index < 0 || index >= this.slides.length) return;
    
    this.slideActive = false;
    setTimeout(() => {
      this.currentSlideIndex = index;
      this.currentSlide = this.slides[this.currentSlideIndex];
      this.slideActive = true;
    }, 500);
  }

  private initializeAOS(): void {
    if (typeof window !== 'undefined' && 'AOS' in window) {
      setTimeout(() => {
        window.AOS.init({
          duration: 1000,
          easing: 'ease-in-out',
          once: true,
          disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
      }, 0);
    }
  }
} 