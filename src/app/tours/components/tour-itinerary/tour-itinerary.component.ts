import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tour } from '../../../models/tour.model';

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation?: string;
  meals?: string[];
  highlights?: string[];
}

@Component({
  selector: 'app-tour-itinerary',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="tour-itinerary-container">
      <h2 class="section-title">Tour Itinerary</h2>
      
      <div class="itinerary-summary">
        <div class="summary-item">
          <i class="fas fa-calendar-alt"></i>
          <span>{{ tour?.duration }} days</span>
        </div>
        <div class="summary-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ tour?.location }}</span>
        </div>
        <div class="summary-item">
          <i class="fas fa-users"></i>
          <span>Max {{ tour?.groupSize }} people</span>
        </div>
        <div class="summary-item">
          <i class="fas fa-hiking"></i>
          <span>{{ tour?.difficulty }}</span>
        </div>
      </div>

      <div class="itinerary-days">
        <div class="day-card" *ngFor="let day of itineraryDays">
          <div class="day-header">
            <h3>Day {{ day.day }}: {{ day.title }}</h3>
          </div>
          
          <div class="day-content">
            <p class="day-description">{{ day.description }}</p>
            
            <div class="activities" *ngIf="day.activities && day.activities.length > 0">
              <h4>Activities</h4>
              <ul>
                <li *ngFor="let activity of day.activities">{{ activity }}</li>
              </ul>
            </div>
            
            <div class="accommodation" *ngIf="day.accommodation">
              <h4>Accommodation</h4>
              <p>{{ day.accommodation }}</p>
            </div>
            
            <div class="meals" *ngIf="day.meals && day.meals.length > 0">
              <h4>Meals</h4>
              <ul>
                <li *ngFor="let meal of day.meals">{{ meal }}</li>
              </ul>
            </div>
            
            <div class="highlights" *ngIf="day.highlights && day.highlights.length > 0">
              <h4>Highlights</h4>
              <ul>
                <li *ngFor="let highlight of day.highlights">{{ highlight }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./tour-itinerary.component.scss']
})
export class TourItineraryComponent implements OnInit {
  @Input() tour: Tour | null = null;
  
  itineraryDays: ItineraryDay[] = [];
  
  constructor() { }
  
  ngOnInit(): void {
    // In a real application, this would come from a service
    this.loadItinerary();
  }
  
  loadItinerary(): void {
    // Mock data - in a real app, this would come from an API
    if (this.tour) {
      this.itineraryDays = [
        {
          day: 1,
          title: 'Arrival and Welcome',
          description: 'Arrive at the destination airport and transfer to your hotel. Evening welcome dinner and briefing about the tour.',
          activities: [
            'Airport pickup',
            'Hotel check-in',
            'Welcome dinner',
            'Tour briefing'
          ],
          accommodation: 'Luxury Hotel in City Center',
          meals: ['Dinner'],
          highlights: [
            'Meet your tour guide',
            'Introduction to the local culture'
          ]
        },
        {
          day: 2,
          title: 'City Exploration',
          description: 'Full day exploring the city highlights, including historical sites, museums, and local markets.',
          activities: [
            'City tour',
            'Visit to historical sites',
            'Local market exploration',
            'Traditional lunch'
          ],
          accommodation: 'Luxury Hotel in City Center',
          meals: ['Breakfast', 'Lunch'],
          highlights: [
            'Visit to the main cathedral',
            'Traditional craft market'
          ]
        },
        {
          day: 3,
          title: 'Adventure Begins',
          description: 'Depart the city and head to the countryside for the main adventure part of the tour.',
          activities: [
            'Scenic drive to countryside',
            'Hiking through scenic trails',
            'Picnic lunch',
            'Evening relaxation'
          ],
          accommodation: 'Country Lodge',
          meals: ['Breakfast', 'Lunch', 'Dinner'],
          highlights: [
            'Scenic viewpoints',
            'Local wildlife spotting'
          ]
        }
      ];
    }
  }
} 