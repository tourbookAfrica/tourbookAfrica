import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Review {
  id: number;
  tourId: number;
  tourName: string;
  tourImage: string;
  rating: number;
  comment: string;
  date: Date;
  status: 'published' | 'pending' | 'rejected';
}

@Component({
  selector: 'app-user-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="user-reviews-container">
      <h2 class="section-title">My Reviews</h2>
      
      <div class="reviews-summary">
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="summary-content">
            <h3>Average Rating</h3>
            <p class="rating">{{ averageRating }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-comment-alt"></i>
          </div>
          <div class="summary-content">
            <h3>Total Reviews</h3>
            <p class="count">{{ reviews.length }}</p>
          </div>
        </div>
        
        <div class="summary-card">
          <div class="summary-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <div class="summary-content">
            <h3>Published</h3>
            <p class="count">{{ publishedReviewsCount }}</p>
          </div>
        </div>
      </div>
      
      <div class="reviews-list">
        <div class="review-card" *ngFor="let review of reviews">
          <div class="review-header">
            <div class="tour-info">
              <img [src]="review.tourImage" [alt]="review.tourName" class="tour-image">
              <div class="tour-details">
                <h3>{{ review.tourName }}</h3>
                <p class="review-date">{{ review.date | date:'mediumDate' }}</p>
              </div>
            </div>
            <div class="review-status" [ngClass]="review.status">
              {{ review.status | titlecase }}
            </div>
          </div>
          
          <div class="review-content">
            <div class="rating-stars">
              <span *ngFor="let star of [1,2,3,4,5]" 
                    [class.filled]="star <= review.rating"
                    [class.empty]="star > review.rating">
                <i class="fas" [ngClass]="{'fa-star': star <= review.rating, 'fa-star-o': star > review.rating}"></i>
              </span>
            </div>
            
            <p class="review-comment">{{ review.comment }}</p>
          </div>
          
          <div class="review-actions">
            <button class="edit-btn" (click)="editReview(review)">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="delete-btn" (click)="deleteReview(review)">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
        
        <div class="no-reviews" *ngIf="reviews.length === 0">
          <p>You haven't written any reviews yet.</p>
          <button class="primary-btn" routerLink="/tours">Browse Tours</button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./user-reviews.component.scss']
})
export class UserReviewsComponent implements OnInit {
  reviews: Review[] = [];
  loading = false;
  error = '';
  
  constructor() { }
  
  ngOnInit(): void {
    this.loadReviews();
  }
  
  loadReviews(): void {
    this.loading = true;
    this.error = '';
    
    // Mock data - in a real app, this would come from an API
    setTimeout(() => {
      this.reviews = [
        {
          id: 1,
          tourId: 101,
          tourName: 'Serengeti Safari Adventure',
          tourImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          rating: 5,
          comment: 'Amazing experience! The wildlife viewing was incredible and our guide was very knowledgeable. Would definitely recommend this tour to anyone visiting Tanzania.',
          date: new Date('2023-05-15'),
          status: 'published'
        },
        {
          id: 2,
          tourId: 102,
          tourName: 'Zanzibar Beach Retreat',
          tourImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          rating: 4,
          comment: 'Beautiful beaches and great accommodations. The food was delicious and the staff was friendly. The only downside was that the water activities were a bit expensive.',
          date: new Date('2023-06-22'),
          status: 'published'
        },
        {
          id: 3,
          tourId: 103,
          tourName: 'Cape Town City Explorer',
          tourImage: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
          rating: 5,
          comment: 'Cape Town is a beautiful city and this tour covered all the highlights. The Table Mountain visit was the highlight of the trip. The guide was excellent and very informative.',
          date: new Date('2023-07-10'),
          status: 'pending'
        }
      ];
      this.loading = false;
    }, 1000);
  }
  
  get averageRating(): number {
    if (this.reviews.length === 0) return 0;
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / this.reviews.length) * 10) / 10;
  }
  
  get publishedReviewsCount(): number {
    return this.reviews.filter(review => review.status === 'published').length;
  }
  
  editReview(review: Review): void {
    // In a real app, this would navigate to an edit page or open a modal
    console.log('Edit review:', review);
  }
  
  deleteReview(review: Review): void {
    // In a real app, this would show a confirmation dialog and then call an API
    if (confirm('Are you sure you want to delete this review?')) {
      this.reviews = this.reviews.filter(r => r.id !== review.id);
    }
  }
} 