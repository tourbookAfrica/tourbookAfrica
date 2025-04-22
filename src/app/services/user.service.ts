import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  preferences?: {
    favoriteDestinations: number[];
    preferredActivities: string[];
    travelStyle: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUser: User | null = null;

  constructor() {
    // Check for saved user data
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  getCurrentUser(): Observable<User | null> {
    return of(this.currentUser).pipe(delay(300));
  }

  updateUser(user: User): Observable<User> {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    return of(user).pipe(delay(300));
  }

  updatePreferences(preferences: Partial<NonNullable<User['preferences']>>): Observable<User | null> {
    if (this.currentUser) {
      const updatedPreferences = {
        favoriteDestinations: [],
        preferredActivities: [],
        travelStyle: [],
        ...(this.currentUser.preferences || {}),
        ...preferences
      };
      
      this.currentUser = {
        ...this.currentUser,
        preferences: updatedPreferences
      };
      localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
    }
    return of(this.currentUser).pipe(delay(300));
  }
}
