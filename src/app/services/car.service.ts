import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Car, CarSearchParams, CarSearchResponse } from '../models/car.model';
import { Destination } from '../models/destination.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${environment.apiUrl}/cars`;

  constructor(private http: HttpClient) {}

  searchCars(params: CarSearchParams): Observable<CarSearchResponse> {
    // TODO: Replace with actual API call when backend is ready
    return of({
      cars: [
        {
          id: '1',
          name: 'Toyota Land Cruiser',
          image: '/assets/images/cars/land-cruiser.jpg',
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          features: ['4x4', 'GPS', 'Bluetooth', 'Air Conditioning'],
          rating: 4.8,
          reviews: 124,
          price: 150,
          isPopular: true,
          carType: 'SUV'
        },
        {
          id: '2',
          name: 'Jeep Wrangler',
          image: '/assets/images/cars/wrangler.jpg',
          transmission: 'Manual',
          fuelType: 'Petrol',
          seats: 5,
          features: ['4x4', 'GPS', 'Bluetooth', 'Air Conditioning', 'Child Seat'],
          rating: 4.6,
          reviews: 98,
          price: 120,
          isPopular: true,
          carType: 'SUV'
        },
        {
          id: '3',
          name: 'Toyota Camry',
          image: '/assets/images/cars/camry.jpg',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          features: ['GPS', 'Bluetooth', 'Air Conditioning'],
          rating: 4.5,
          reviews: 76,
          price: 80,
          isPopular: false,
          carType: 'Sedan'
        },
        {
          id: '4',
          name: 'Mercedes-Benz S-Class',
          image: '/assets/images/cars/s-class.jpg',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          features: ['GPS', 'Bluetooth', 'Air Conditioning', 'Leather Seats', 'Sunroof'],
          rating: 4.9,
          reviews: 112,
          price: 200,
          isPopular: true,
          carType: 'Luxury'
        },
        {
          id: '5',
          name: 'Toyota Hiace',
          image: '/assets/images/cars/hiace.jpg',
          transmission: 'Manual',
          fuelType: 'Diesel',
          seats: 12,
          features: ['Air Conditioning', 'Child Seat'],
          rating: 4.3,
          reviews: 45,
          price: 100,
          isPopular: false,
          carType: 'Van'
        },
        {
          id: '6',
          name: 'Honda Civic',
          image: '/assets/images/cars/civic.jpg',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          features: ['GPS', 'Bluetooth', 'Air Conditioning'],
          rating: 4.4,
          reviews: 67,
          price: 70,
          isPopular: false,
          carType: 'Compact'
        }
      ],
      total: 6
    });
  }

  getDestinations(): Observable<Destination[]> {
    // TODO: Replace with actual API call when backend is ready
    return of([
      {
        id: '1',
        name: 'Jomo Kenyatta International Airport',
        city: 'Nairobi',
        country: 'Kenya',
        latitude: -1.3192,
        longitude: 36.9277,
        airportCode: 'NBO'
      },
      {
        id: '2',
        name: 'Moi International Airport',
        city: 'Mombasa',
        country: 'Kenya',
        latitude: -4.0348,
        longitude: 39.5942,
        airportCode: 'MBA'
      },
      {
        id: '3',
        name: 'Kigali International Airport',
        city: 'Kigali',
        country: 'Rwanda',
        latitude: -1.9686,
        longitude: 30.1395,
        airportCode: 'KGL'
      },
      {
        id: '4',
        name: 'Entebbe International Airport',
        city: 'Entebbe',
        country: 'Uganda',
        latitude: 0.0424,
        longitude: 32.4435,
        airportCode: 'EBB'
      },
      {
        id: '5',
        name: 'Julius Nyerere International Airport',
        city: 'Dar es Salaam',
        country: 'Tanzania',
        latitude: -6.8778,
        longitude: 39.2026,
        airportCode: 'DAR'
      }
    ]);
  }

  searchDestinations(term: string): Observable<Destination[]> {
    // TODO: Replace with actual API call when backend is ready
    const allDestinations = [
      {
        id: '1',
        name: 'Jomo Kenyatta International Airport',
        city: 'Nairobi',
        country: 'Kenya',
        latitude: -1.3192,
        longitude: 36.9277,
        airportCode: 'NBO'
      },
      {
        id: '2',
        name: 'Moi International Airport',
        city: 'Mombasa',
        country: 'Kenya',
        latitude: -4.0348,
        longitude: 39.5942,
        airportCode: 'MBA'
      },
      {
        id: '3',
        name: 'Kigali International Airport',
        city: 'Kigali',
        country: 'Rwanda',
        latitude: -1.9686,
        longitude: 30.1395,
        airportCode: 'KGL'
      },
      {
        id: '4',
        name: 'Entebbe International Airport',
        city: 'Entebbe',
        country: 'Uganda',
        latitude: 0.0424,
        longitude: 32.4435,
        airportCode: 'EBB'
      },
      {
        id: '5',
        name: 'Julius Nyerere International Airport',
        city: 'Dar es Salaam',
        country: 'Tanzania',
        latitude: -6.8778,
        longitude: 39.2026,
        airportCode: 'DAR'
      },
      {
        id: '6',
        name: 'Nairobi City Center',
        city: 'Nairobi',
        country: 'Kenya',
        latitude: -1.2921,
        longitude: 36.8219
      },
      {
        id: '7',
        name: 'Mombasa City Center',
        city: 'Mombasa',
        country: 'Kenya',
        latitude: -4.0435,
        longitude: 39.6682
      },
      {
        id: '8',
        name: 'Kigali City Center',
        city: 'Kigali',
        country: 'Rwanda',
        latitude: -1.9441,
        longitude: 30.0619
      }
    ];
    
    if (!term) return of([]);
    
    const searchTerm = term.toLowerCase();
    const filteredDestinations = allDestinations.filter(dest => 
      dest.name.toLowerCase().includes(searchTerm) || 
      dest.city.toLowerCase().includes(searchTerm) || 
      dest.country.toLowerCase().includes(searchTerm) ||
      (dest.airportCode && dest.airportCode.toLowerCase().includes(searchTerm))
    );
    
    return of(filteredDestinations);
  }
} 