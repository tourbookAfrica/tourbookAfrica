import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, fromEvent, Observable } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { FlightService, Airport, FlightSearchParams } from '../../../services/flight.service';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('originInput') originInput!: ElementRef;
  @ViewChild('destinationInput') destinationInput!: ElementRef;
  
  flightSearchForm: FormGroup;
  submitted = false;
  loading = false;
  
  // Trip type options
  tripTypes = [
    { value: 'oneWay', label: 'One Way' },
    { value: 'roundTrip', label: 'Round Trip' },
    { value: 'multiCity', label: 'Multi-City' }
  ];
  
  // Cabin class options
  cabinClasses = [
    { value: 'economy', label: 'Economy' },
    { value: 'premiumEconomy', label: 'Premium Economy' },
    { value: 'business', label: 'Business' },
    { value: 'first', label: 'First Class' }
  ];
  
  // Passenger count
  passengers = {
    adults: 1,
    children: 0,
    infants: 0
  };
  
  // Airport search results
  originAirports: Airport[] = [];
  destinationAirports: Airport[] = [];
  
  // Popular airports
  popularOrigins: Airport[] = [];
  popularDestinations: Airport[] = [];
  
  // Date picker options
  minDate = new Date();
  maxDate = new Date();
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private formBuilder: FormBuilder,
    private flightService: FlightService,
    private router: Router
  ) {
    // Set max date to 1 year from now
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
    
    this.flightSearchForm = this.formBuilder.group({
      tripType: ['roundTrip', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: ['', [Validators.required]],  // Initially required for round trips
      cabinClass: ['economy', Validators.required],
      adults: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
      children: [0, [Validators.min(0), Validators.max(8)]],
      infants: [0, [Validators.min(0), Validators.max(4)]]
    });

    // Watch for trip type changes to update returnDate validation
    this.flightSearchForm.get('tripType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(tripType => {
        const returnDateControl = this.flightSearchForm.get('returnDate');
        if (tripType === 'oneWay') {
          returnDateControl?.clearValidators();
          returnDateControl?.setValue('');
        } else {
          returnDateControl?.setValidators([Validators.required]);
        }
        returnDateControl?.updateValueAndValidity();
      });
  }
  
  ngOnInit(): void {
    // Load popular airports
    this.loadPopularAirports();
  }
  
  ngAfterViewInit(): void {
    // Set up airport search autocomplete
    this.setupAirportAutocomplete();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Convenience getter for easy access to form fields
  get f() { return this.flightSearchForm.controls; }
  
  private loadPopularAirports(): void {
    this.flightService.getPopularOrigins()
      .pipe(takeUntil(this.destroy$))
      .subscribe(airports => {
        this.popularOrigins = airports;
      });
    
    this.flightService.getPopularDestinations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(airports => {
        this.popularDestinations = airports;
      });
  }
  
  private setupAirportAutocomplete(): void {
    // Origin airport autocomplete
    const originInput$ = fromEvent<InputEvent>(this.originInput.nativeElement, 'input');
    originInput$.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((e: InputEvent): Observable<Airport[]> => 
        this.flightService.searchAirports((e.target as HTMLInputElement).value)
      )
    ).subscribe((airports: Airport[]) => {
      this.originAirports = airports;
    });
    
    // Destination airport autocomplete
    const destinationInput$ = fromEvent<InputEvent>(this.destinationInput.nativeElement, 'input');
    destinationInput$.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((e: InputEvent): Observable<Airport[]> => 
        this.flightService.searchAirports((e.target as HTMLInputElement).value)
      )
    ).subscribe((airports: Airport[]) => {
      this.destinationAirports = airports;
    });
  }
  
  onTripTypeChange(type: string): void {
    this.flightSearchForm.patchValue({ tripType: type });
  }
  
  onCabinClassChange(cabinClass: string): void {
    this.flightSearchForm.patchValue({ cabinClass: cabinClass });
  }
  
  onPassengerCountChange(type: 'adults' | 'children' | 'infants', action: 'increase' | 'decrease'): void {
    const currentCount = this.passengers[type];
    
    if (action === 'increase') {
      if (type === 'infants' && currentCount >= this.passengers.adults) {
        return; // Cannot have more infants than adults
      }
      this.passengers[type]++;
    } else if (action === 'decrease' && currentCount > 0) {
      this.passengers[type]--;
    }
    
    this.flightSearchForm.patchValue({
      adults: this.passengers.adults,
      children: this.passengers.children,
      infants: this.passengers.infants
    });
  }
  
  onAirportSelect(airport: Airport, type: 'origin' | 'destination'): void {
    this.flightSearchForm.patchValue({ [type]: airport.code });
    
    if (type === 'origin') {
      this.originAirports = [];
    } else {
      this.destinationAirports = [];
    }
  }
  
  onPopularAirportSelect(airport: Airport, type: 'origin' | 'destination'): void {
    this.flightSearchForm.patchValue({ [type]: airport.code });
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    // Stop here if form is invalid
    if (this.flightSearchForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    // Prepare search parameters
    const formValue = this.flightSearchForm.value;
    const searchParams: FlightSearchParams = {
      from: formValue.origin,
      to: formValue.destination,
      date: formValue.departureDate,
      returnDate: formValue.tripType === 'roundTrip' ? formValue.returnDate : undefined,
      passengers: formValue.adults + formValue.children + formValue.infants,
      class: formValue.cabinClass
    };
    
    // Navigate to flight results page with search parameters
    this.router.navigate(['/flights/results'], { 
      queryParams: { 
        search: JSON.stringify(searchParams)
      }
    });
  }
  
  formatPassengerCount(): string {
    const total = this.passengers.adults + this.passengers.children + this.passengers.infants;
    return `${total} Passenger${total !== 1 ? 's' : ''}`;
  }
  
  formatCabinClass(): string {
    const cabinClass = this.flightSearchForm.get('cabinClass')?.value;
    return this.cabinClasses.find(c => c.value === cabinClass)?.label || 'Economy';
  }
} 