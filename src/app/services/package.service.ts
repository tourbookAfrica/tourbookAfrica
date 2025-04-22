import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface TourPackage {
  id: number;
  name: string;
  destinations: string[];
  duration: string;
  price: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; description: string }[];
  images: string[];
  maxGroupSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class PackageService {
  private packages: TourPackage[] = [];

  constructor() {
    // Initialize with mock data
    this.packages = this.getMockPackages();
  }

  getPackages(): Observable<TourPackage[]> {
    return of(this.packages).pipe(delay(500));
  }

  getPackageById(id: number): Observable<TourPackage | undefined> {
    const pkg = this.packages.find(p => p.id === id);
    return of(pkg).pipe(delay(300));
  }

  private getMockPackages(): TourPackage[] {
    return [
      {
        id: 1,
        name: 'East African Safari Adventure',
        destinations: ['Kenya', 'Tanzania', 'Uganda'],
        duration: '14 Days',
        price: 3999,
        inclusions: [
          'All accommodations',
          'Transportation',
          'Guide services',
          'Park fees'
        ],
        exclusions: [
          'International flights',
          'Travel insurance',
          'Personal expenses'
        ],
        itinerary: [
          { day: 1, description: 'Arrival in Nairobi' },
          { day: 2, description: 'Masai Mara Game Drive' }
        ],
        images: ['assets/images/packages/east-african-safari.jpg'],
        maxGroupSize: 12
      }
      // Add more mock packages as needed
    ];
  }
}
