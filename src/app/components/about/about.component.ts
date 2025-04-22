import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TestimonialsComponent } from '../home/testimonials/testimonials.component';
import { NewsletterComponent } from '../home/newsletter/newsletter.component';
import { Navigation as SwiperNavigation, Autoplay as SwiperAutoplay, EffectFade as SwiperEffectFade, Pagination as SwiperPagination } from 'swiper/modules';
import { Subject, fromEvent, Subscription } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { Swiper } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

interface TeamMember {
  name: string;
  position: string;
  bio: string;
  image: string;
  social: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  expertise: string[];
  achievements: string[];
}

interface Partner {
  name: string;
  logo: string;
  description: string;
  url: string;
}

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  image: string;
}

interface Stat {
  value: number;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TestimonialsComponent,
    NewsletterComponent
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private partnersSwiper: Swiper | null = null;
  private timelineSwiper: Swiper | null = null;
  private scrollSubscription: Subscription = new Subscription();
  private teamMemberEventListeners: { element: Element; type: string; listener: EventListener }[] = [];
  
  // Team members data
  teamMembers: TeamMember[] = [
    {
      name: 'James Mwangi',
      position: 'Founder & CEO',
      bio: 'Wildlife photographer and conservation expert with over 20 years of experience across Africa.',
      image: 'assets/images/team/team-1.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/'
      },
      expertise: ['Wildlife Photography', 'Conservation', 'Tourism Management'],
      achievements: ['National Geographic Photographer', 'Conservation Award 2019', 'Tourism Excellence 2020']
    },
    {
      name: 'Sarah Omondi',
      position: 'Operations Director',
      bio: 'Tourism management specialist with a passion for sustainable travel and community development.',
      image: 'assets/images/team/team-2.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/'
      },
      expertise: ['Tourism Management', 'Sustainable Travel', 'Community Development'],
      achievements: ['Sustainable Tourism Award 2021', 'Community Impact Recognition 2020']
    },
    {
      name: 'David Kamau',
      position: 'Lead Safari Guide',
      bio: 'Certified safari guide with extensive knowledge of African wildlife and ecosystems.',
      image: 'assets/images/team/team-3.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/'
      },
      expertise: ['Wildlife Tracking', 'Bird Watching', 'Cultural Tours'],
      achievements: ['Best Guide Award 2022', 'Wildlife Expert Certification']
    },
    {
      name: 'Grace Akinyi',
      position: 'Marketing Director',
      bio: 'Digital marketing specialist focused on promoting African tourism and conservation efforts.',
      image: 'assets/images/team/team-4.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/'
      },
      expertise: ['Digital Marketing', 'Content Strategy', 'Brand Development'],
      achievements: ['Marketing Excellence Award 2021', 'Social Media Innovation 2020']
    },
    {
      name: 'John Otieno',
      position: 'Conservation Manager',
      bio: 'Wildlife biologist dedicated to protecting endangered species and their habitats.',
      image: 'assets/images/team/team-5.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/'
      },
      expertise: ['Wildlife Biology', 'Habitat Conservation', 'Research'],
      achievements: ['Conservation Leadership Award 2021', 'Research Grant Recipient']
    },
    {
      name: 'Mary Wanjiku',
      position: 'Customer Experience Manager',
      bio: 'Passionate about creating memorable travel experiences and ensuring guest satisfaction.',
      image: 'assets/images/team/team-6.jpg',
      social: {
        linkedin: 'https://linkedin.com/',
        twitter: 'https://twitter.com/',
        instagram: 'https://instagram.com/'
      },
      expertise: ['Customer Service', 'Travel Planning', 'Guest Relations'],
      achievements: ['Customer Satisfaction Excellence 2022', 'Service Innovation Award']
    }
  ];

  // Partners data
  partners: Partner[] = [
    {
      name: 'Kenya Wildlife Service',
      logo: 'assets/images/partners/partner-1.png',
      description: 'National wildlife conservation authority',
      url: 'https://www.kws.go.ke'
    },
    {
      name: 'Tanzania National Parks',
      logo: 'assets/images/partners/partner-2.png',
      description: 'Tanzania\'s national parks authority',
      url: 'https://www.tanzaniaparks.go.tz'
    },
    {
      name: 'African Conservation Foundation',
      logo: 'assets/images/partners/partner-3.png',
      description: 'Non-profit conservation organization',
      url: 'https://www.africanconservation.org'
    },
    {
      name: 'Sustainable Travel International',
      logo: 'assets/images/partners/partner-4.png',
      description: 'Global sustainable tourism certification',
      url: 'https://sustainabletravel.org'
    },
    {
      name: 'African Tourism Board',
      logo: 'assets/images/partners/partner-5.png',
      description: 'Pan-African tourism organization',
      url: 'https://www.africantourismboard.com'
    },
    {
      name: 'Wildlife Conservation Society',
      logo: 'assets/images/partners/partner-6.png',
      description: 'Global wildlife conservation organization',
      url: 'https://www.wcs.org'
    }
  ];

  // Company timeline
  timelineEvents: TimelineEvent[] = [
    {
      year: '2008',
      title: 'The Beginning',
      description: 'African Trails was founded by James Mwangi and Sarah Omondi with a vision to share Africa\'s beauty while preserving it.',
      image: 'assets/images/timeline/timeline-1.jpg'
    },
    {
      year: '2010',
      title: 'First Conservation Project',
      description: 'Launched our first wildlife conservation initiative in partnership with local communities.',
      image: 'assets/images/timeline/timeline-2.jpg'
    },
    {
      year: '2012',
      title: 'Expansion to Tanzania',
      description: 'Extended operations to Tanzania, offering cross-border safari experiences.',
      image: 'assets/images/timeline/timeline-3.jpg'
    },
    {
      year: '2015',
      title: 'Community Empowerment Program',
      description: 'Established programs to support local communities through tourism revenue sharing.',
      image: 'assets/images/timeline/timeline-4.jpg'
    },
    {
      year: '2018',
      title: '10th Anniversary',
      description: 'Celebrated 10 years of creating unforgettable African experiences and supporting conservation.',
      image: 'assets/images/timeline/timeline-5.jpg'
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched virtual safari experiences during global travel restrictions.',
      image: 'assets/images/timeline/timeline-6.jpg'
    },
    {
      year: '2023',
      title: 'Today',
      description: 'Operating across 12 African countries with over 50 team members and 15,000+ happy travelers.',
      image: 'assets/images/timeline/timeline-7.jpg'
    }
  ];

  // Stats for animation
  stats: Stat[] = [
    { value: 15000, label: 'Happy Travelers', icon: 'bi-people-fill' },
    { value: 12, label: 'Countries', icon: 'bi-globe' },
    { value: 15, label: 'Years Experience', icon: 'bi-calendar-check' },
    { value: 8, label: 'Awards', icon: 'bi-trophy' },
    { value: 50, label: 'Expert Guides', icon: 'bi-person-badge' },
    { value: 25, label: 'Conservation Projects', icon: 'bi-tree' }
  ];

  animatedStats: Stat[] = this.stats.map(stat => ({ ...stat, value: 0 }));
  isStatsVisible = false;
  activeValueCard: number | null = null;

  constructor(private elementRef: ElementRef) { }

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

    // Set up scroll listener for parallax effect
    this.scrollSubscription = fromEvent(window, 'scroll')
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(10)
      )
      .subscribe(() => {
        this.updateParallax();
        this.checkStatsVisibility();
      });
  }

  ngAfterViewInit(): void {
    this.initPartnersSwiper();
    this.initTimelineSwiper();
    this.initParallax();
    this.initTeamHoverEffects();
    this.checkStatsVisibility();
  }

  ngOnDestroy(): void {
    if (this.partnersSwiper) {
      this.partnersSwiper.destroy();
    }
    if (this.timelineSwiper) {
      this.timelineSwiper.destroy();
    }
    if (this.scrollSubscription) {
      this.scrollSubscription.unsubscribe();
    }
    
    // Clean up team member event listeners
    if (this.teamMemberEventListeners) {
      this.teamMemberEventListeners.forEach(({ element, type, listener }) => {
        element.removeEventListener(type, listener);
      });
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initPartnersSwiper(): void {
    const swiperElement = document.querySelector('.partners-slider .swiper') as HTMLElement;
    if (swiperElement) {
      this.partnersSwiper = new Swiper(swiperElement, {
        modules: [SwiperNavigation, SwiperAutoplay, SwiperEffectFade, SwiperPagination],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }
      });
    }
  }

  private initTimelineSwiper(): void {
    const swiperElement = document.querySelector('.timeline-slider .swiper') as HTMLElement;
    if (swiperElement) {
      this.timelineSwiper = new Swiper(swiperElement, {
        modules: [SwiperNavigation, SwiperAutoplay, SwiperEffectFade, SwiperPagination],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        effect: 'fade',
        fadeEffect: {
          crossFade: true
        },
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.timeline-slider .swiper-pagination',
          clickable: true,
        }
      });
    }
  }

  private checkStatsVisibility(): void {
    const statsSection = document.querySelector('.stats-section');
    if (statsSection && !this.isStatsVisible) {
      const rect = statsSection.getBoundingClientRect();
      const isVisible = (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
        rect.bottom >= 0
      );
      
      if (isVisible) {
        this.isStatsVisible = true;
        this.animateCounters();
      }
    }
  }

  private animateCounters(): void {
    const duration = 2000; // Animation duration in milliseconds
    const steps = 60; // Number of steps in the animation
    const interval = duration / steps;

    // Animate each stat
    this.stats.forEach((stat, index) => {
      let current = 0;
      const increment = stat.value / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          this.animatedStats[index].value = stat.value;
          clearInterval(timer);
        } else {
          this.animatedStats[index].value = Math.floor(current);
        }
      }, interval);
    });
  }

  private updateParallax(): void {
    const parallaxElements = document.querySelectorAll('.parallax');
    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-speed') || '0.5';
      const yPos = -(window.pageYOffset * parseFloat(speed));
      (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
    });
  }

  private initParallax(): void {
    this.updateParallax();
  }

  private initTeamHoverEffects(): void {
    const teamMembers = document.querySelectorAll('.team-member');
    const eventListeners: { element: Element; type: string; listener: EventListener }[] = [];
    
    teamMembers.forEach(member => {
      const mouseEnterListener = () => member.classList.add('hover');
      const mouseLeaveListener = () => member.classList.remove('hover');
      
      member.addEventListener('mouseenter', mouseEnterListener);
      member.addEventListener('mouseleave', mouseLeaveListener);
      
      eventListeners.push(
        { element: member, type: 'mouseenter', listener: mouseEnterListener },
        { element: member, type: 'mouseleave', listener: mouseLeaveListener }
      );
    });
    
    // Store event listeners for cleanup
    this.teamMemberEventListeners = eventListeners;
  }

  openTeamMemberDetails(member: TeamMember): void {
    // Implementation for opening team member details
    console.log('Opening details for:', member.name);
    // In a real implementation, you would use a modal service or component
  }

  navigateToPartner(partner: Partner): void {
    window.open(partner.url, '_blank');
  }

  openTimelineModal(): void {
    // Implementation for opening timeline modal
    console.log('Opening timeline modal');
    // In a real implementation, you would use a modal service or component
  }

  setActiveValueCard(index: number | null): void {
    this.activeValueCard = index;
  }

  refreshAOS(): void {
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.refresh();
    }
  }
}
