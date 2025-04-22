import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  title: string;
  location: string;
}

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GalleryComponent implements OnInit {
  images: GalleryImage[] = [
    {
      id: 1,
      src: 'assets/images/gallery/wildlife-1.jpg',
      alt: 'Lions in Masai Mara',
      category: 'wildlife',
      title: 'Pride of Lions',
      location: 'Masai Mara, Kenya'
    },
    {
      id: 2,
      src: 'assets/images/gallery/landscape-1.jpg',
      alt: 'Mount Kilimanjaro',
      category: 'landscape',
      title: 'Mount Kilimanjaro',
      location: 'Tanzania'
    },
    {
      id: 3,
      src: 'assets/images/gallery/culture-1.jpg',
      alt: 'Maasai Warriors',
      category: 'culture',
      title: 'Maasai Warriors',
      location: 'Serengeti, Tanzania'
    },
    {
      id: 4,
      src: 'assets/images/gallery/wildlife-2.jpg',
      alt: 'Elephants at Sunset',
      category: 'wildlife',
      title: 'Elephant Family',
      location: 'Amboseli, Kenya'
    },
    {
      id: 5,
      src: 'assets/images/gallery/landscape-2.jpg',
      alt: 'Ngorongoro Crater',
      category: 'landscape',
      title: 'Ngorongoro Crater',
      location: 'Tanzania'
    },
    {
      id: 6,
      src: 'assets/images/gallery/culture-2.jpg',
      alt: 'Traditional Dance',
      category: 'culture',
      title: 'Traditional Dance',
      location: 'Zanzibar, Tanzania'
    },
    {
      id: 7,
      src: 'assets/images/gallery/wildlife-3.jpg',
      alt: 'Giraffes at Sunrise',
      category: 'wildlife',
      title: 'Giraffe Family',
      location: 'Nairobi National Park, Kenya'
    },
    {
      id: 8,
      src: 'assets/images/gallery/landscape-3.jpg',
      alt: 'Meru National Park',
      category: 'landscape',
      title: 'Meru Savanna',
      location: 'Meru National Park, Kenya'
    },
    {
      id: 9,
      src: 'assets/images/gallery/culture-3.jpg',
      alt: 'Local Market',
      category: 'culture',
      title: 'Vibrant Market',
      location: 'Stone Town, Zanzibar'
    }
  ];

  categories = ['all', 'wildlife', 'landscape', 'culture'];
  selectedCategory = 'all';
  selectedImage: GalleryImage | null = null;

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      });
    }
  }

  filterImages(category: string): void {
    this.selectedCategory = category;
  }

  get filteredImages(): GalleryImage[] {
    return this.selectedCategory === 'all'
      ? this.images
      : this.images.filter(img => img.category === this.selectedCategory);
  }

  openImage(image: GalleryImage): void {
    this.selectedImage = image;
  }

  closeImage(): void {
    this.selectedImage = null;
  }

  nextImage(): void {
    if (!this.selectedImage) return;
    
    const currentIndex = this.filteredImages.findIndex(img => img.id === this.selectedImage?.id);
    const nextIndex = (currentIndex + 1) % this.filteredImages.length;
    this.selectedImage = this.filteredImages[nextIndex];
  }

  previousImage(): void {
    if (!this.selectedImage) return;
    
    const currentIndex = this.filteredImages.findIndex(img => img.id === this.selectedImage?.id);
    const previousIndex = currentIndex === 0 ? this.filteredImages.length - 1 : currentIndex - 1;
    this.selectedImage = this.filteredImages[previousIndex];
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (!this.selectedImage) return;

    switch (event.key) {
      case 'ArrowLeft':
        this.previousImage();
        break;
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'Escape':
        this.closeImage();
        break;
    }
  }
} 