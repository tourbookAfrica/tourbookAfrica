export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  nationality?: string;
  profileImage?: string;
  role: UserRole;
  preferences: UserPreferences;
  bookings: Booking[];
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
  GUIDE = 'Guide'
}

export interface UserPreferences {
  language: string;
  currency: string;
  notifications: NotificationPreferences;
  travelPreferences: TravelPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
}

export interface TravelPreferences {
  preferredDestinations: string[];
  preferredTourTypes: string[];
  dietaryRestrictions: string[];
  accessibilityNeeds: string[];
}

export interface Review {
  id: string;
  userId: string;
  tourId: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id: string;
  userId: string;
  tourId: string;
  tourDate: Date;
  participants: number;
  totalPrice: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum BookingStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  CANCELLED = 'Cancelled',
  COMPLETED = 'Completed'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  REFUNDED = 'Refunded',
  FAILED = 'Failed'
} 