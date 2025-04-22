import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Booking, BookingStatus, PaymentStatus } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  getUserBookings(): Observable<Booking[]> {
    // TODO: Replace with actual API call when backend is ready
    return of([
      {
        id: '1',
        userId: 'user1',
        tourId: '1',
        tourName: 'Serengeti Safari Adventure',
        tourDate: new Date('2024-06-01'),
        participants: 2,
        totalPrice: 2400,
        currency: 'USD',
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
        specialRequests: 'Vegetarian meals',
        createdAt: new Date('2024-04-15'),
        updatedAt: new Date('2024-04-15')
      },
      {
        id: '2',
        userId: 'user1',
        tourId: '2',
        tourName: 'Mount Kilimanjaro Trek',
        tourDate: new Date('2024-07-01'),
        participants: 1,
        totalPrice: 2000,
        currency: 'USD',
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        createdAt: new Date('2024-04-20'),
        updatedAt: new Date('2024-04-20')
      }
    ]);
  }

  getBookingById(id: string): Observable<Booking> {
    // TODO: Replace with actual API call when backend is ready
    return of({
      id: '1',
      userId: 'user1',
      tourId: '1',
      tourName: 'Serengeti Safari Adventure',
      tourDate: new Date('2024-06-01'),
      participants: 2,
      totalPrice: 2400,
      currency: 'USD',
      status: BookingStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      specialRequests: 'Vegetarian meals',
      createdAt: new Date('2024-04-15'),
      updatedAt: new Date('2024-04-15')
    });
  }

  createBooking(bookingData: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, bookingData);
  }

  cancelBooking(id: string): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}/cancel`, {});
  }

  updateBooking(id: string, bookingData: Partial<Booking>): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}`, bookingData);
  }
}
