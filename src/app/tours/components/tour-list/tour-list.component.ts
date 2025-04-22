import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TourService } from '../../../services/tour.service';
import { Tour, TourCategory, TourDifficulty, TourSearchParams } from '../../../models/tour.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="tour-list-container">
      <div class="filters">
        <div class="filter-group">
          <label for="category">Category:</label>
          <select id="category" [(ngModel)]="selectedCategory" (change)="onCategoryChange($event.target.value)">
            <option value="all">All Categories</option>
            <option *ngFor="let category of categories" [value]="category">
              {{category | titlecase}}
            </option>
          </select>
        </div>

        <div class="filter-group">
          <label for="difficulty">Difficulty:</label>
          <select id="difficulty" [(ngModel)]="selectedDifficulty" (change)="onDifficultyChange($event.target.value)">
            <option value="all">All Difficulties</option>
            <option *ngFor="let difficulty of difficulties" [value]="difficulty">
              {{difficulty | titlecase}}
            </option>
          </select>
        </div>
      </div>

      <div class="tours-grid" *ngIf="!loading && !error">
        <div class="tour-card" *ngFor="let tour of tours">
          <img [src]="tour.imageUrl" [alt]="tour.name" class="tour-image">
          <div class="tour-content">
            <h3>{{tour.name}}</h3>
            <p class="location">{{tour.location}}</p>
            <p class="description">{{tour.description}}</p>
            <div class="tour-details">
              <span class="duration">{{tour.duration}} days</span>
              <span class="price">{{tour.price | currency:tour.currency}}</span>
              <div class="rating">
                <span class="stars">{{getFullStars(tour.rating)}}{{getEmptyStars(tour.rating)}}</span>
                <span class="review-count">({{tour.reviews}} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="loading" *ngIf="loading">
        <p>Loading tours...</p>
      </div>

      <div class="error" *ngIf="error">
        <p>{{error}}</p>
        <button (click)="loadTours()">Try Again</button>
      </div>
    </div>
  `,
  styleUrls: ['./tour-list.component.scss']
})
export class TourListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  loading = false;
  error = '';
  selectedCategory: TourCategory | 'all' = 'all';
  selectedDifficulty: TourDifficulty | 'all' = 'all';

  categories: (TourCategory | 'all')[] = ['all', TourCategory.SAFARI, TourCategory.BEACH, TourCategory.CULTURAL, TourCategory.ADVENTURE];
  difficulties: (TourDifficulty | 'all')[] = ['all', TourDifficulty.EASY, TourDifficulty.MODERATE, TourDifficulty.CHALLENGING];

  constructor(private tourService: TourService) {}

  ngOnInit(): void {
    this.loadTours();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadTours(): void {
    this.loading = true;
    this.error = '';

    const params: TourSearchParams = {
      category: this.selectedCategory === 'all' ? undefined : this.selectedCategory,
      difficulty: this.selectedDifficulty === 'all' ? undefined : this.selectedDifficulty
    };

    this.tourService.searchTours(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.tours = response.tours;
          this.filteredTours = this.tours;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load tours. Please try again.';
          console.error('Error loading tours:', error);
          this.loading = false;
        }
      });
  }

  onCategoryChange(category: TourCategory | 'all'): void {
    this.selectedCategory = category;
    this.loadTours();
  }

  onDifficultyChange(difficulty: TourDifficulty | 'all'): void {
    this.selectedDifficulty = difficulty;
    this.loadTours();
  }

  // Helper methods for star ratings
  getFullStars(rating: number): string {
    return '★'.repeat(Math.floor(rating));
  }

  getEmptyStars(rating: number): string {
    return '☆'.repeat(5 - Math.floor(rating));
  }
} 