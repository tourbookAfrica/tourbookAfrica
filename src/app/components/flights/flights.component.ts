import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, tap, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Flight, Airport, FlightService, Airline, FlightSearchParams } from '../../services/flight.service';

interface PassengerCounts {
  adults: number;
  children: number;
  infants: number;
}

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule]
})
export class FlightsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('departureInput') departureInput!: ElementRef;
  @ViewChild('arrivalInput') arrivalInput!: ElementRef;
  
  private destroy$ = new Subject<void>();
  
  flightForm: FormGroup;
  submitted = false;
  loading = false;
  searchPerformed = false;
  
  tripType: 'roundTrip' | 'oneWay' | 'multiCity' = 'roundTrip';
  cabinClass: 'economy' | 'premium' | 'business' | 'first' = 'economy';
  passengers: PassengerCounts = {
    adults: 1,
    children: 0,
    infants: 0
  };
  
  showDepartureDropdown = false;
  showArrivalDropdown = false;
  showPassengerDropdown = false;
  
  availableAirports: Airport[] = [];
  filteredAirports: Airport[] = [];

  airlines: Airline[] = [];

  flights: Flight[] = [];
  filteredFlights: Flight[] = [];
  
  sortOption: 'price' | 'duration' | 'departureTime' | 'arrivalTime' = 'price';
  filterOptions = {
    stops: [0, 1, 2],
    selectedStops: [] as number[],
    priceRange: [0, 1000] as [number, number],
    selectedAirlines: [] as string[]
  };
  
  selectedAirline = '';
  selectedStops = -1;
  
  availableAirlines: (Airline & { selected: boolean })[] = [];
  error: string | null = null;
  
  selectedDepartureAirport: Airport | null = null;
  selectedArrivalAirport: Airport | null = null;
  
  constructor(
    private fb: FormBuilder,
    private flightService: FlightService
  ) {
    this.flightForm = this.fb.group({
      departure: ['', Validators.required],
      arrival: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: [''],
      passengers: this.fb.group({
        adults: [1, [Validators.required, Validators.min(1)]],
        children: [0, [Validators.min(0)]],
        infants: [0, [Validators.min(0)]]
      }),
      class: ['economy']
    });

    // Watch for trip type changes
    this.flightForm.get('tripType')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        const returnDateControl = this.flightForm.get('returnDate');
        if (type === 'oneWay') {
          returnDateControl?.clearValidators();
        } else {
          returnDateControl?.setValidators(Validators.required);
        }
        returnDateControl?.updateValueAndValidity();
      });
  }

  ngOnInit(): void {
    this.initForm();
    this.loadAirlines();
    this.loadAirports();
    
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
    // Setup airport search autocomplete
    this.setupAirportAutocomplete();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm(): void {
    this.flightForm.patchValue({
      tripType: this.tripType,
      cabinClass: this.cabinClass
    });
  }

  setupAirportAutocomplete(): void {
    // From airport autocomplete
    fromEvent<InputEvent>(this.departureInput.nativeElement, 'input').pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.showDepartureDropdown = true;
      }),
      filter((e: InputEvent) => (e.target as HTMLInputElement).value.length > 2),
      tap((e: InputEvent) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase();
        this.filterAirports(query, 'departure');
      })
    ).subscribe();

    // To airport autocomplete
    fromEvent<InputEvent>(this.arrivalInput.nativeElement, 'input').pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.showArrivalDropdown = true;
      }),
      filter((e: InputEvent) => (e.target as HTMLInputElement).value.length > 2),
      tap((e: InputEvent) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase();
        this.filterAirports(query, 'arrival');
      })
    ).subscribe();
  }

  // Convenience getter for easy access to form fields
  get f() { return this.flightForm.controls; }

  setTripType(type: 'roundTrip' | 'oneWay' | 'multiCity'): void {
    this.tripType = type;
    this.flightForm.patchValue({ tripType: type });
  }

  filterAirports(searchTerm: string, type: 'departure' | 'arrival'): void {
    this.flightService.searchAirports(searchTerm).subscribe({
      next: (airports) => {
        this.filteredAirports = airports;
        if (type === 'departure') {
          this.showDepartureDropdown = true;
        } else {
          this.showArrivalDropdown = true;
        }
      },
      error: (error) => {
        console.error('Error searching airports:', error);
      }
    });
  }

  onAirportSelect(airport: Airport, type: 'departure' | 'arrival'): void {
    if (type === 'departure') {
      this.selectedDepartureAirport = airport;
      this.flightForm.patchValue({ departure: `${airport.city} (${airport.code})` });
      this.showDepartureDropdown = false;
    } else {
      this.selectedArrivalAirport = airport;
      this.flightForm.patchValue({ arrival: `${airport.city} (${airport.code})` });
      this.showArrivalDropdown = false;
    }
  }

  onPassengerCountChange(type: keyof PassengerCounts, action: 'increase' | 'decrease'): void {
    const currentCount = this.passengers[type];
    if (action === 'increase') {
      if (type === 'infants' && currentCount >= this.passengers.adults) {
        return; // Cannot have more infants than adults
      }
      this.passengers[type]++;
    } else if (action === 'decrease' && currentCount > 0) {
      this.passengers[type]--;
    }
    this.flightForm.patchValue({ passengers: this.passengers });
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.flightForm.invalid) {
      return;
    }

    this.loading = true;

    // Simulate API call to search flights
    setTimeout(() => {
      this.searchFlights();
      this.loading = false;
      this.searchPerformed = true;
    }, 1500);
  }

  searchFlights(): void {
    if (this.flightForm.valid) {
      this.loading = true;
      this.error = null;
      this.flights = [];

      const searchParams: FlightSearchParams = {
        origin: this.flightForm.get('departure')?.value,
        destination: this.flightForm.get('arrival')?.value,
        departureDate: this.flightForm.get('departureDate')?.value,
        returnDate: this.flightForm.get('returnDate')?.value,
        passengers: this.flightForm.get('passengers')?.value,
        class: this.flightForm.get('class')?.value,
        stops: this.filterOptions.selectedStops,
        airlines: this.filterOptions.selectedAirlines
      };

      this.flightService.searchFlights(searchParams)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (flights) => {
            this.flights = flights;
            this.loading = false;
          },
          error: (error) => {
            this.error = 'Failed to search flights. Please try again.';
            console.error('Error searching flights:', error);
            this.loading = false;
          }
        });
    }
  }

  filterFlights(): void {
    let filtered = [...this.flights];

    // Apply airline filter
    if (this.selectedAirline) {
      filtered = filtered.filter(flight => flight.airline.code === this.selectedAirline);
    }

    // Apply stops filter
    if (this.selectedStops !== -1) {
      filtered = filtered.filter(flight => flight.stops === this.selectedStops);
    }

    // Apply price filter
    filtered = filtered.filter(flight => flight.price <= this.filterOptions.priceRange[1]);

    this.filteredFlights = filtered;
  }

  sortFlights(): void {
    switch(this.sortOption) {
      case 'price':
        this.filteredFlights.sort((a, b) => a.price - b.price);
        break;
      case 'duration':
        this.filteredFlights.sort((a, b) => {
          const durationA = this.durationToMinutes(a.duration);
          const durationB = this.durationToMinutes(b.duration);
          return durationA - durationB;
        });
        break;
      case 'departureTime':
        this.filteredFlights.sort((a, b) => {
          const timeA = this.timeToMinutes(a.departureTime);
          const timeB = this.timeToMinutes(b.departureTime);
          return timeA - timeB;
        });
        break;
      case 'arrivalTime':
        this.filteredFlights.sort((a, b) => {
          const timeA = this.timeToMinutes(a.arrivalTime);
          const timeB = this.timeToMinutes(b.arrivalTime);
          return timeA - timeB;
        });
        break;
    }
  }

  durationToMinutes(duration: string): number {
    const parts = duration.split(' ');
    const hours = parseInt(parts[0].replace('h', ''));
    const minutes = parseInt(parts[1].replace('m', ''));
    return hours * 60 + minutes;
  }

  timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  changeSortOption(option: 'price' | 'duration' | 'departureTime' | 'arrivalTime'): void {
    this.sortOption = option;
    this.sortFlights();
  }

  toggleAirlineFilter(airline: Airline & { selected: boolean }): void {
    airline.selected = !airline.selected;
    this.filterOptions.selectedAirlines = this.availableAirlines
      .filter(a => a.selected)
      .map(a => a.code);
    this.filterFlights();
  }

  resetFilters(): void {
    // Reset airline filter
    this.selectedAirline = '';
    
    // Reset stops filter
    this.selectedStops = -1;
    
    // Reset price range
    this.filterOptions.priceRange = [0, 1000];
    
    // Reset and apply filters
    this.filteredFlights = [...this.flights];
    this.sortFlights();
  }

  formatPassengerCount(): string {
    const total = this.passengers.adults + this.passengers.children + this.passengers.infants;
    return `${total} Passenger${total !== 1 ? 's' : ''}`;
  }

  formatCabinClass(): string {
    return this.cabinClass.charAt(0).toUpperCase() + this.cabinClass.slice(1);
  }

  getStopsLabel(stops: number): string {
    if (stops === 0) return 'Direct';
    return stops === 1 ? '1 Stop' : `${stops} Stops`;
  }

  bookFlight(flight: Flight): void {
    console.log('Booking flight:', flight);
    // In a real application, this would navigate to a booking page
    // or open a booking modal
    alert(`Flight ${flight.id} selected for booking. This would navigate to the booking page in a real application.`);
  }

  private loadAirlines(): void {
    this.loading = true;
    this.error = null;
    this.flightService.getAirlines()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (airlines) => {
          this.airlines = airlines;
          this.availableAirlines = airlines.map(airline => ({
            ...airline,
            selected: false
          }));
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load airlines. Please try again.';
          console.error('Error loading airlines:', err);
          this.loading = false;
        }
      });
  }

  incrementPassenger(type: keyof PassengerCounts): void {
    const control = this.flightForm.get(`passengers.${type}`);
    if (control) {
      const currentValue = control.value;
      control.setValue(currentValue + 1);
    }
  }

  decrementPassenger(type: keyof PassengerCounts): void {
    const control = this.flightForm.get(`passengers.${type}`);
    if (control) {
      const currentValue = control.value;
      if (currentValue > (type === 'adults' ? 1 : 0)) {
        control.setValue(currentValue - 1);
      }
    }
  }

  isStopSelected(stop: number): boolean {
    return this.filterOptions.selectedStops.includes(stop);
  }

  toggleStop(stop: number): void {
    const index = this.filterOptions.selectedStops.indexOf(stop);
    if (index === -1) {
      this.filterOptions.selectedStops.push(stop);
    } else {
      this.filterOptions.selectedStops.splice(index, 1);
    }
    this.searchFlights();
  }

  toggleAirline(airline: Airline): void {
    const index = this.filterOptions.selectedAirlines.indexOf(airline.name);
    if (index === -1) {
      this.filterOptions.selectedAirlines.push(airline.name);
    } else {
      this.filterOptions.selectedAirlines.splice(index, 1);
    }
    this.searchFlights();
  }

  isAirlineSelected(airline: Airline): boolean {
    return this.filterOptions.selectedAirlines.includes(airline.name);
  }

  updateMaxPrice(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filterOptions.priceRange[1] = parseInt(input.value, 10);
    this.searchFlights();
  }

  loadAirports(): void {
    this.flightService.getAllAirports().subscribe({
      next: (airports) => {
        this.availableAirports = airports;
      },
      error: (error) => {
        this.error = 'Failed to load airports. Please try again later.';
        console.error('Error loading airports:', error);
      }
    });
  }

  getAirportDisplay(airport: Airport): string {
    return `${airport.city} (${airport.code})`;
  }
} 