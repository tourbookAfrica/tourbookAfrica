import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Tour, TourSearchParams, TourSearchResponse, TourCategory, TourDifficulty } from '../models/tour.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  private apiUrl = `${environment.apiUrl}/tours`;

  constructor(private http: HttpClient) {}

  searchTours(params: TourSearchParams): Observable<TourSearchResponse> {
    // Simulated API call response, replace with actual HTTP request when backend is ready
    return of({
      tours: [
        {
          id: '1',
          name: 'Serengeti Safari Adventure',
          description: 'Experience the wild beauty of Serengeti National Park with our expert guides.',
          duration: 5,
          price: 1200,
          currency: 'USD',
          images: [
            '/assets/images/tours/serengeti-1.jpg',
            '/assets/images/tours/serengeti-2.jpg',
            '/assets/images/tours/serengeti-3.jpg'
          ],
          destination: 'Serengeti National Park',
          startLocation: 'Arusha',
          endLocation: 'Arusha',
          maxParticipants: 12,
          currentParticipants: 8,
          rating: 4.8,
          reviews: 156,
          included: [
            'Professional guide',
            'Transportation',
            'Accommodation',
            'Meals',
            'Park fees'
          ],
          excluded: [
            'Flights',
            'Travel insurance',
            'Personal expenses'
          ],
          itinerary: [
            {
              day: 1,
              title: 'Arrival in Arusha',
              description: 'Welcome to Tanzania! Transfer to your hotel in Arusha.',
              meals: ['Dinner'],
              accommodation: 'Arusha Hotel',
              activities: ['Airport pickup', 'Welcome briefing']
            },
            {
              day: 2,
              title: 'Serengeti National Park',
              description: 'Early morning drive to Serengeti National Park.',
              meals: ['Breakfast', 'Lunch', 'Dinner'],
              accommodation: 'Serengeti Safari Camp',
              activities: ['Game drive', 'Wildlife viewing']
            }
          ],
          dates: [
            {
              startDate: new Date('2024-06-01'),
              endDate: new Date('2024-06-05'),
              price: 1200,
              availableSpots: 4,
              isAvailable: true
            }
          ],
          category: TourCategory.SAFARI,
          difficulty: TourDifficulty.MODERATE,
          isPopular: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      total: 1,
      page: params.page || 1,
      limit: params.limit || 9,
      totalPages: 1
    });
  }

  getTourById(id: string): Observable<Tour> {
    // Simulated API call response, replace with actual HTTP request when backend is ready
    return of({
      id: '1',
      name: 'Serengeti Safari Adventure',
      description: 'Experience the wild beauty of Serengeti National Park with our expert guides.',
      duration: 5,
      price: 1200,
      currency: 'USD',
      images: [
        '/assets/images/tours/serengeti-1.jpg',
        '/assets/images/tours/serengeti-2.jpg',
        '/assets/images/tours/serengeti-3.jpg'
      ],
      destination: 'Serengeti National Park',
      startLocation: 'Arusha',
      endLocation: 'Arusha',
      maxParticipants: 12,
      currentParticipants: 8,
      rating: 4.8,
      reviews: 156,
      included: [
        'Professional guide',
        'Transportation',
        'Accommodation',
        'Meals',
        'Park fees'
      ],
      excluded: [
        'Flights',
        'Travel insurance',
        'Personal expenses'
      ],
      itinerary: [
        {
          day: 1,
          title: 'Arrival in Arusha',
          description: 'Welcome to Tanzania! Transfer to your hotel in Arusha.',
          meals: ['Dinner'],
          accommodation: 'Arusha Hotel',
          activities: ['Airport pickup', 'Welcome briefing']
        },
        {
          day: 2,
          title: 'Serengeti National Park',
          description: 'Early morning drive to Serengeti National Park.',
          meals: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: 'Serengeti Safari Camp',
          activities: ['Game drive', 'Wildlife viewing']
        }
      ],
      dates: [
        {
          startDate: new Date('2024-06-01'),
          endDate: new Date('2024-06-05'),
          price: 1200,
          availableSpots: 4,
          isAvailable: true
        }
      ],
      category: TourCategory.SAFARI,
      difficulty: TourDifficulty.MODERATE,
      isPopular: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}