import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookingService } from '../../../services/booking.service';
import { Booking } from '../../../models/user.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';

@Component({
  selector: 'app-user-bookings',
  standalone: true,
  imports: [CommonModule, RouterModule, LoadingSpinnerComponent, ErrorMessageComponent],
  template: `
    <div class="bookings-container">
      <h2>My Bookings</h2>
      
      <div *ngIf="loading" class="loading-container">
        <app-loading-spinner message="Loading your bookings..."></app-loading-spinner>
      </div>
      
      <div *ngIf="error" class="error-container">
        <app-error-message [message]="error"></app-error-message>
      </div>
      
      <div *ngIf="!loading && !error && bookings.length === 0" class="no-bookings">
        <p>You haven't made any bookings yet.</p>
        <a routerLink="/tours" class="btn-primary">Explore Tours</a>
      </div>
      
      <div *ngIf="!loading && !error && bookings.length > 0" class="bookings-list">
        <div *ngFor="let booking of bookings" class="booking-card">
          <div class="booking-header">
            <h3>{{ booking.tourName }}</h3>
            <span class="booking-status" [ngClass]="booking.status.toLowerCase()">
              {{ booking.status }}
            </span>
          </div>
          
          <div class="booking-details">
            <div class="detail-item">
              <span class="label">Booking ID:</span>
              <span class="value">{{ booking.id }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date:</span>
              <span class="value">{{ booking.tourDate | date:'mediumDate' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Participants:</span>
              <span class="value">{{ booking.participants }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Total Price:</span>
              <span class="value">{{ booking.totalPrice | currency:booking.currency }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Payment Status:</span>
              <span class="value payment-status" [ngClass]="booking.paymentStatus.toLowerCase()">
                {{ booking.paymentStatus }}
              </span>
            </div>
          </div>
          
          <div class="booking-actions">
            <button *ngIf="booking.status === 'CONFIRMED'" class="btn-secondary" (click)="cancelBooking(booking.id)">
              Cancel Booking
            </button>
            <a [routerLink]="['/tours', booking.tourId]" class="btn-primary">View Tour</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      h2 {
        margin-bottom: 2rem;
        color: #333;
      }
    }
    
    .loading-container, .error-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }
    
    .no-bookings {
      text-align: center;
      padding: 3rem;
      background: #f9f9f9;
      border-radius: 8px;
      
      p {
        margin-bottom: 1.5rem;
        color: #666;
      }
    }
    
    .bookings-list {
      display: grid;
      gap: 1.5rem;
    }
    
    .booking-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 1.5rem;
      
      .booking-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        
        h3 {
          margin: 0;
          color: #333;
        }
        
        .booking-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
          
          &.confirmed {
            background: #e8f5e9;
            color: #2e7d32;
          }
          
          &.pending {
            background: #fff3e0;
            color: #ef6c00;
          }
          
          &.cancelled {
            background: #ffebee;
            color: #c62828;
          }
          
          &.completed {
            background: #e3f2fd;
            color: #1565c0;
          }
        }
      }
      
      .booking-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin-bottom: 1.5rem;
        
        .detail-item {
          display: flex;
          flex-direction: column;
          
          .label {
            font-size: 0.875rem;
            color: #666;
            margin-bottom: 0.25rem;
          }
          
          .value {
            font-weight: 500;
            color: #333;
            
            &.payment-status {
              &.paid {
                color: #2e7d32;
              }
              
              &.pending {
                color: #ef6c00;
              }
              
              &.refunded {
                color: #1565c0;
              }
              
              &.failed {
                color: #c62828;
              }
            }
          }
        }
      }
      
      .booking-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
      }
    }
    
    .btn-primary, .btn-secondary {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .btn-primary {
      background: #1976d2;
      color: white;
      border: none;
      
      &:hover {
        background: #1565c0;
      }
    }
    
    .btn-secondary {
      background: transparent;
      color: #f44336;
      border: 1px solid #f44336;
      
      &:hover {
        background: #ffebee;
      }
    }
  `]
})
export class UserBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;
  error = '';

  constructor(private bookingService: BookingService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading = true;
    this.error = '';
    
    this.bookingService.getUserBookings().subscribe({
      next: (bookings) => {
        this.bookings = bookings;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load your bookings. Please try again later.';
        this.loading = false;
        console.error('Error loading bookings:', error);
      }
    });
  }

  cancelBooking(bookingId: string): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.bookingService.cancelBooking(bookingId).subscribe({
        next: () => {
          this.loadBookings();
        },
        error: (error) => {
          this.error = 'Failed to cancel booking. Please try again later.';
          console.error('Error canceling booking:', error);
        }
      });
    }
  }
} 