import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, catchError } from 'rxjs/operators';
import { Destination } from '../models/destination.model';
import { environment } from '../../environments/environment';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  stars: number;
  rating: number;
  reviewCount: number;
  price: number;
  images: string[];
  amenities: string[];
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = environment.apiUrl;

  // Mock data for development
  private mockDestinations: Destination[] = [
    {
      id: '1',
      name: 'Serengeti National Park',
      country: 'Tanzania',
      image: 'assets/images/destinations/serengeti.jpg',
      hotelCount: 45,
      description: 'Experience the great migration in one of Africa\'s most iconic safari destinations',
      coordinates: { lat: -2.3333333, lng: 34.8333333 }
    },
    {
      id: '2',
      name: 'Masai Mara',
      country: 'Kenya',
      image: 'assets/images/destinations/masai-mara.jpg',
      hotelCount: 38,
      description: 'Witness the incredible wildlife in Kenya\'s most famous game reserve',
      coordinates: { lat: -1.5, lng: 35.1166667 }
    },
    {
      id: '3',
      name: 'Cape Town',
      country: 'South Africa',
      image: 'assets/images/destinations/cape-town.jpg',
      hotelCount: 156,
      description: 'Explore the vibrant culture and stunning landscapes of the Mother City',
      coordinates: { lat: -33.9248685, lng: 18.4240553 }
    },
    {
      id: '4',
      name: 'Victoria Falls',
      country: 'Zimbabwe',
      image: 'assets/images/destinations/victoria-falls.jpg',
      hotelCount: 28,
      description: 'Stay near one of the world\'s largest waterfalls',
      coordinates: { lat: -17.9243, lng: 25.8572 }
    },
    {
      id: '5',
      name: 'Zanzibar',
      country: 'Tanzania',
      image: 'assets/images/destinations/zanzibar.jpg',
      hotelCount: 89,
      description: 'Relax on pristine beaches in this tropical paradise',
      coordinates: { lat: -6.165917, lng: 39.202641 }
    },
    {
      id: '6',
      name: 'Kruger National Park',
      country: 'South Africa',
      image: 'assets/images/destinations/kruger.jpg',
      hotelCount: 67,
      description: 'Experience luxury lodges and incredible wildlife viewing',
      coordinates: { lat: -23.9884, lng: 31.5547 }
    }
  ];

  private mockHotels: Hotel[] = [
    {
      id: '1',
      name: 'Four Seasons Safari Lodge Serengeti',
      location: 'Serengeti National Park, Tanzania',
      description: 'Experience luxury in the heart of the Serengeti with infinity pools overlooking the savannah and world-class amenities.',
      stars: 5,
      rating: 4.8,
      reviewCount: 245,
      price: 850,
      images: ['assets/images/hotels/serengeti-lodge1.jpg'],
      amenities: ['Free Wi-Fi', 'Swimming Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Airport Shuttle'],
      type: 'Lodge',
      coordinates: { lat: -2.3333333, lng: 34.8333333 }
    },
    {
      id: '2',
      name: 'Angama Mara',
      location: 'Masai Mara, Kenya',
      description: 'Suspended above the Great Rift Valley, Angama Mara offers breathtaking views and unparalleled luxury.',
      stars: 5,
      rating: 4.9,
      reviewCount: 189,
      price: 1200,
      images: ['assets/images/hotels/masai-mara-lodge1.jpg'],
      amenities: ['Free Wi-Fi', 'Swimming Pool', 'Spa', 'Restaurant', 'Free Breakfast', 'Air Conditioning'],
      type: 'Lodge',
      coordinates: { lat: -1.5, lng: 35.1166667 }
    }
  ];

  constructor(private http: HttpClient) {}

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  getDestinations(): Observable<Destination[]> {
    if (!environment.production) {
      return of(this.mockDestinations).pipe(delay(800));
    }
    return this.http.get<Destination[]>(`${this.apiUrl}/destinations`).pipe(
      catchError(this.handleError)
    );
  }

  getDestinationById(id: string): Observable<Destination> {
    if (!environment.production) {
      const destination = this.mockDestinations.find(d => d.id === id);
      if (!destination) {
        return throwError(() => new Error('Destination not found'));
      }
      return of(destination).pipe(delay(300));
    }
    return this.http.get<Destination>(`${this.apiUrl}/destinations/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  searchHotels(params: {
    destination: string;
    checkIn: string;
    checkOut: string;
    guests: {
      adults: number;
      children: number;
      rooms: number;
    };
  }): Observable<Hotel[]> {
    if (!environment.production) {
      const filteredHotels = this.mockHotels.filter(hotel => 
        hotel.location.toLowerCase().includes(params.destination.toLowerCase())
      );
      return of(filteredHotels).pipe(delay(1000));
    }
    const httpParams = new HttpParams()
      .set('destination', params.destination)
      .set('checkIn', params.checkIn)
      .set('checkOut', params.checkOut)
      .set('adults', params.guests.adults.toString())
      .set('children', params.guests.children.toString())
      .set('rooms', params.guests.rooms.toString());
    return this.http.get<Hotel[]>(`${this.apiUrl}/hotels`, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  getHotelById(id: string): Observable<Hotel> {
    if (!environment.production) {
      const hotel = this.mockHotels.find(h => h.id === id);
      if (!hotel) {
        return throwError(() => new Error('Hotel not found'));
      }
      return of(hotel).pipe(delay(300));
    }
    return this.http.get<Hotel>(`${this.apiUrl}/hotels/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
