import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TourCategory, TourDifficulty } from '../../../models/tour.model';

interface FilterTag {
  key: string;
  label: string;
  value: string | number | boolean;
}

@Component({
  selector: 'app-tour-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="tour-search-container">
      <h2 class="section-title">Find Your Perfect Tour</h2>
      
      <form [formGroup]="searchForm" (ngSubmit)="onSubmit()" class="search-form">
        <div class="form-row">
          <div class="form-group">
            <label for="destination">Destination</label>
            <input 
              type="text" 
              id="destination" 
              formControlName="destination" 
              placeholder="Where do you want to go?"
              class="form-control">
          </div>
          
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" formControlName="category" class="form-control">
              <option value="">All Categories</option>
              <option *ngFor="let category of categories" [value]="category">
                {{category | titlecase}}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="difficulty">Difficulty</label>
            <select id="difficulty" formControlName="difficulty" class="form-control">
              <option value="">All Difficulties</option>
              <option *ngFor="let difficulty of difficulties" [value]="difficulty">
                {{difficulty | titlecase}}
              </option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="minPrice">Min Price</label>
            <input 
              type="number" 
              id="minPrice" 
              formControlName="minPrice" 
              placeholder="Min price"
              class="form-control">
          </div>
          
          <div class="form-group">
            <label for="maxPrice">Max Price</label>
            <input 
              type="number" 
              id="maxPrice" 
              formControlName="maxPrice" 
              placeholder="Max price"
              class="form-control">
          </div>
          
          <div class="form-group">
            <label for="duration">Duration (days)</label>
            <select id="duration" formControlName="duration" class="form-control">
              <option value="">Any Duration</option>
              <option value="1-3">1-3 days</option>
              <option value="4-7">4-7 days</option>
              <option value="8-14">8-14 days</option>
              <option value="15+">15+ days</option>
            </select>
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="groupSize">Group Size</label>
            <select id="groupSize" formControlName="groupSize" class="form-control">
              <option value="">Any Group Size</option>
              <option value="1-4">1-4 people</option>
              <option value="5-10">5-10 people</option>
              <option value="11-20">11-20 people</option>
              <option value="20+">20+ people</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="sortBy">Sort By</label>
            <select id="sortBy" formControlName="sortBy" class="form-control">
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="duration">Duration</option>
            </select>
          </div>
          
          <div class="form-group search-button-container">
            <button type="submit" class="search-button" [disabled]="searchForm.invalid">
              <i class="fas fa-search"></i> Search Tours
            </button>
          </div>
        </div>
        
        <div class="advanced-search-toggle" (click)="toggleAdvancedSearch()">
          {{ showAdvancedSearch ? 'Hide' : 'Show' }} Advanced Options
          <i class="fas" [ngClass]="{'fa-chevron-up': showAdvancedSearch, 'fa-chevron-down': !showAdvancedSearch}"></i>
        </div>
        
        <div class="advanced-search-options" *ngIf="showAdvancedSearch">
          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Start Date</label>
              <input 
                type="date" 
                id="startDate" 
                formControlName="startDate" 
                class="form-control">
            </div>
            
            <div class="form-group">
              <label for="endDate">End Date</label>
              <input 
                type="date" 
                id="endDate" 
                formControlName="endDate" 
                class="form-control">
            </div>
            
            <div class="form-group">
              <label for="rating">Minimum Rating</label>
              <select id="rating" formControlName="rating" class="form-control">
                <option value="">Any Rating</option>
                <option value="3">3+ Stars</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="hasDiscount">
                Special Offers Only
              </label>
            </div>
            
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isPopular">
                Popular Tours Only
              </label>
            </div>
            
            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" formControlName="isNew">
                New Tours Only
              </label>
            </div>
          </div>
        </div>
      </form>
      
      <div class="search-tags" *ngIf="hasActiveFilters">
        <span class="tag" *ngFor="let filter of activeFilters">
          {{ filter.label }}: {{ filter.value }}
          <i class="fas fa-times" (click)="removeFilter(filter.key)"></i>
        </span>
        <button class="clear-all" (click)="clearAllFilters()">Clear All</button>
      </div>
    </div>
  `,
  styleUrls: ['./tour-search.component.scss']
})
export class TourSearchComponent implements OnInit {
  @Output() search = new EventEmitter<any>();
  
  searchForm: FormGroup;
  showAdvancedSearch = false;
  activeFilters: FilterTag[] = [];
  
  categories: string[] = Object.values(TourCategory);
  difficulties: string[] = Object.values(TourDifficulty);
  
  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      destination: [''],
      category: [''],
      difficulty: [''],
      minPrice: [null],
      maxPrice: [null],
      duration: [null],
      groupSize: [null],
      sortBy: ['popularity'],
      startDate: [''],
      endDate: [''],
      rating: [''],
      hasDiscount: [false],
      isPopular: [false],
      isNew: [false]
    });
  }
  
  ngOnInit(): void {
    // Subscribe to form changes to update active filters
    this.searchForm.valueChanges.subscribe(() => {
      this.updateActiveFilters();
    });
  }
  
  onSubmit(): void {
    if (this.searchForm.valid) {
      const searchParams = this.searchForm.value;
      this.search.emit(searchParams);
    }
  }
  
  toggleAdvancedSearch(): void {
    this.showAdvancedSearch = !this.showAdvancedSearch;
  }
  
  updateActiveFilters(): void {
    this.activeFilters = [];
    const formValue = this.searchForm.value;
    
    if (formValue.destination) {
      this.activeFilters.push({
        key: 'destination',
        label: 'Destination',
        value: formValue.destination
      });
    }
    
    if (formValue.category) {
      this.activeFilters.push({
        key: 'category',
        label: 'Category',
        value: this.getCategoryLabel(formValue.category)
      });
    }
    
    if (formValue.difficulty) {
      this.activeFilters.push({
        key: 'difficulty',
        label: 'Difficulty',
        value: this.getDifficultyLabel(formValue.difficulty)
      });
    }
    
    if (formValue.minPrice || formValue.maxPrice) {
      this.activeFilters.push({
        key: 'price',
        label: 'Price Range',
        value: `${formValue.minPrice || 0} - ${formValue.maxPrice || '∞'}`
      });
    }
    
    if (formValue.duration) {
      this.activeFilters.push({
        key: 'duration',
        label: 'Duration',
        value: `${formValue.duration} days`
      });
    }
    
    if (formValue.groupSize) {
      this.activeFilters.push({
        key: 'groupSize',
        label: 'Group Size',
        value: `${formValue.groupSize} people`
      });
    }
    
    if (formValue.rating) {
      this.activeFilters.push({
        key: 'rating',
        label: 'Rating',
        value: formValue.rating + '+ Stars'
      });
    }
    
    if (formValue.hasDiscount) {
      this.activeFilters.push({
        key: 'hasDiscount',
        label: 'Special Offers',
        value: true
      });
    }
    
    if (formValue.isPopular) {
      this.activeFilters.push({
        key: 'isPopular',
        label: 'Popular Tours',
        value: true
      });
    }
    
    if (formValue.isNew) {
      this.activeFilters.push({
        key: 'isNew',
        label: 'New Tours',
        value: true
      });
    }
  }
  
  get hasActiveFilters(): boolean {
    return this.activeFilters.length > 0;
  }
  
  removeFilter(key: string): void {
    if (key === 'price') {
      this.searchForm.patchValue({
        minPrice: null,
        maxPrice: null
      });
    } else {
      this.searchForm.patchValue({
        [key]: key === 'isPopular' || key === 'hasDiscount' ? false : ''
      });
    }
    this.onSubmit();
  }
  
  clearAllFilters(): void {
    this.searchForm.reset({
      sortBy: 'popularity',
      hasDiscount: false,
      isPopular: false,
      isNew: false
    });
    this.onSubmit();
  }
  
  private getCategoryLabel(category: TourCategory): string {
    const labels: { [key: string]: string } = {
      SAFARI: 'Safari',
      BEACH: 'Beach',
      CULTURAL: 'Cultural',
      ADVENTURE: 'Adventure'
    };
    return labels[category] || category;
  }
  
  private getDifficultyLabel(difficulty: TourDifficulty): string {
    const labels: { [key: string]: string } = {
      EASY: 'Easy',
      MODERATE: 'Moderate',
      CHALLENGING: 'Challenging'
    };
    return labels[difficulty] || difficulty;
  }
} 