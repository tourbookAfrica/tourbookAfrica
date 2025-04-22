import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CarService } from '../../services/car.service';
import { Car, CarSearchParams, CarFilter } from '../../models/car.model';
import { Destination } from '../../models/destination.model';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-car-rentals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './car-rentals.component.html',
  styleUrls: ['./car-rentals.component.scss']
})
export class CarRentalsComponent implements OnInit, OnDestroy {
  carSearchForm: FormGroup;
  cars: Car[] = [];
  filteredCars: Car[] = [];
  destinations: Destination[] = [];
  pickupSuggestions: Destination[] = [];
  dropoffSuggestions: Destination[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  itemsPerPage = 9;
  totalItems = 0;
  today = new Date().toISOString().split('T')[0];
  private destroy$ = new Subject<void>();
  
  // Filter options
  carTypes = ['SUV', 'Sedan', 'Luxury', 'Compact', 'Van'];
  transmissions = ['Automatic', 'Manual'];
  features = ['GPS', 'Bluetooth', 'Air Conditioning', '4x4', 'Child Seat'];
  
  filters: CarFilter = {
    priceRange: { min: 0, max: 1000 },
    carType: [],
    transmission: [],
    features: [],
    rating: 0
  };

  constructor(
    private fb: FormBuilder,
    private carService: CarService
  ) {
    this.carSearchForm = this.fb.group({
      pickupLocation: ['', Validators.required],
      dropoffLocation: ['', Validators.required],
      pickupDate: ['', Validators.required],
      pickupTime: ['', Validators.required],
      dropoffDate: ['', Validators.required],
      dropoffTime: ['', Validators.required],
      driverAge: [25, [Validators.required, Validators.min(21), Validators.max(99)]]
    });
  }

  ngOnInit(): void {
    this.loadDestinations();
    this.setupLocationAutocomplete();
    this.loadCars();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDestinations(): void {
    this.carService.getDestinations().subscribe({
      next: (destinations: Destination[]) => {
        this.destinations = destinations;
      },
      error: (error: Error) => {
        console.error('Error loading destinations:', error);
        this.error = 'Failed to load destinations. Please try again later.';
      }
    });
  }

  private setupLocationAutocomplete(): void {
    // Setup autocomplete for pickup location
    this.carSearchForm.get('pickupLocation')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => this.searchLocations(term))
      )
      .subscribe(results => {
        this.pickupSuggestions = results;
      });

    // Setup autocomplete for dropoff location
    this.carSearchForm.get('dropoffLocation')?.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => this.searchLocations(term))
      )
      .subscribe(results => {
        this.dropoffSuggestions = results;
      });
  }

  private searchLocations(term: string): Observable<Destination[]> {
    if (!term) return of([]);
    return this.carService.searchDestinations(term);
  }

  selectPickupLocation(destination: Destination): void {
    this.carSearchForm.patchValue({
      pickupLocation: destination.name
    });
    this.pickupSuggestions = [];
  }

  selectDropoffLocation(destination: Destination): void {
    this.carSearchForm.patchValue({
      dropoffLocation: destination.name
    });
    this.dropoffSuggestions = [];
  }

  loadCars(): void {
    this.loading = true;
    const searchParams: CarSearchParams = {
      pickupLocation: this.carSearchForm.value.pickupLocation,
      dropoffLocation: this.carSearchForm.value.dropoffLocation,
      pickupDate: this.carSearchForm.value.pickupDate,
      pickupTime: this.carSearchForm.value.pickupTime,
      dropoffDate: this.carSearchForm.value.dropoffDate,
      dropoffTime: this.carSearchForm.value.dropoffTime,
      driverAge: this.carSearchForm.value.driverAge,
      page: this.currentPage,
      limit: this.itemsPerPage,
      filters: this.filters
    };

    this.carService.searchCars(searchParams).pipe(
      catchError(error => {
        console.error('Error searching cars:', error);
        this.error = 'Failed to search cars. Please try again later.';
        this.loading = false;
        return of({ cars: [], total: 0 });
      })
    ).subscribe(response => {
      this.cars = response.cars;
      this.filteredCars = response.cars;
      this.totalItems = response.total;
      this.loading = false;
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCars();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCars();
  }

  onSubmit(): void {
    if (this.carSearchForm.valid) {
      this.currentPage = 1;
      this.loadCars();
    } else {
      this.carSearchForm.markAllAsTouched();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
} 