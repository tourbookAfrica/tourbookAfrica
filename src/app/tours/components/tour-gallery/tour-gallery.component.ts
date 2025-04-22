import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tour } from '../../../models/tour.model';

interface GalleryImage {
  id: number;
  url: string;
  caption?: string;
  thumbnailUrl?: string;
}

@Component({
  selector: 'app-tour-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tour-gallery-container">
      <h2 class="section-title">Photo Gallery</h2>
      
      <div class="gallery-grid" *ngIf="images.length > 0">
        <div class="gallery-item" *ngFor="let image of images; let i = index" (click)="openLightbox(i)">
          <img [src]="image.thumbnailUrl || image.url" [alt]="image.caption || 'Gallery image'" class="gallery-thumbnail">
          <div class="image-caption" *ngIf="image.caption">{{ image.caption }}</div>
        </div>
      </div>
      
      <div class="no-images" *ngIf="images.length === 0">
        <p>No images available for this tour.</p>
      </div>
      
      <!-- Lightbox -->
      <div class="lightbox" *ngIf="lightboxOpen" (click)="closeLightbox()">
        <div class="lightbox-content" (click)="$event.stopPropagation()">
          <button class="close-btn" (click)="closeLightbox()">&times;</button>
          <button class="nav-btn prev-btn" (click)="prevImage()" *ngIf="images.length > 1">&lt;</button>
          <button class="nav-btn next-btn" (click)="nextImage()" *ngIf="images.length > 1">&gt;</button>
          
          <div class="lightbox-image-container">
            <img [src]="images[currentImageIndex].url" [alt]="images[currentImageIndex].caption || 'Gallery image'" class="lightbox-image">
            <div class="lightbox-caption" *ngIf="images[currentImageIndex].caption">
              {{ images[currentImageIndex].caption }}
            </div>
          </div>
          
          <div class="lightbox-thumbnails" *ngIf="images.length > 1">
            <div 
              class="lightbox-thumbnail" 
              *ngFor="let image of images; let i = index" 
              [class.active]="i === currentImageIndex"
              (click)="setCurrentImage(i)">
              <img [src]="image.thumbnailUrl || image.url" [alt]="image.caption || 'Thumbnail'">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./tour-gallery.component.scss']
})
export class TourGalleryComponent implements OnInit {
  @Input() tour: Tour | null = null;
  
  images: GalleryImage[] = [];
  lightboxOpen = false;
  currentImageIndex = 0;
  
  constructor() { }
  
  ngOnInit(): void {
    this.loadGalleryImages();
  }
  
  loadGalleryImages(): void {
    // Mock data - in a real app, this would come from an API
    if (this.tour) {
      this.images = [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          caption: 'Serengeti National Park'
        },
        {
          id: 2,
          url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          caption: 'Lion in the wild'
        },
        {
          id: 3,
          url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          caption: 'Elephant family'
        },
        {
          id: 4,
          url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          caption: 'Giraffe at sunset'
        },
        {
          id: 5,
          url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          caption: 'Zebra crossing'
        },
        {
          id: 6,
          url: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
          caption: 'African sunset'
        }
      ];
    }
  }
  
  openLightbox(index: number): void {
    this.currentImageIndex = index;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  }
  
  closeLightbox(): void {
    this.lightboxOpen = false;
    document.body.style.overflow = ''; // Restore scrolling
  }
  
  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }
  
  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }
  
  setCurrentImage(index: number): void {
    this.currentImageIndex = index;
  }
} 