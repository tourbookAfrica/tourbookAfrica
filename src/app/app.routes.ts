import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TourListComponent } from './tours/components/tour-list/tour-list.component';
import { TourDetailsComponent } from './tours/components/tour-details/tour-details.component';
import { TourSearchComponent } from './tours/components/tour-search/tour-search.component';
import { TourBookingComponent } from './tours/components/tour-booking/tour-booking.component';
import { TourReviewsComponent } from './tours/components/tour-reviews/tour-reviews.component';
import { TourItineraryComponent } from './tours/components/tour-itinerary/tour-itinerary.component';
import { TourGalleryComponent } from './tours/components/tour-gallery/tour-gallery.component';
import { CarRentalsComponent } from './components/car-rentals/car-rentals.component';
import { FlightsComponent } from './components/flights/flights.component';
import { HotelsComponent } from './components/hotels/hotels.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UserBookingsComponent } from './components/user-profile/user-bookings/user-bookings.component';
import { UserReviewsComponent } from './components/user-profile/user-reviews/user-reviews.component';
import { UserSettingsComponent } from './components/user-profile/user-settings/user-settings.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tours', component: TourListComponent },
  { path: 'tours/search', component: TourSearchComponent },
  { 
    path: 'tours/:id', 
    component: TourDetailsComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: TourItineraryComponent },
      { path: 'gallery', component: TourGalleryComponent },
      { path: 'reviews', component: TourReviewsComponent },
      { path: 'book', component: TourBookingComponent }
    ]
  },
  { path: 'car-rentals', component: CarRentalsComponent },
  { path: 'flights', component: FlightsComponent },
  { path: 'hotels', component: HotelsComponent },
  { 
    path: 'profile', 
    component: UserProfileComponent,
    children: [
      { path: '', redirectTo: 'bookings', pathMatch: 'full' },
      { path: 'bookings', component: UserBookingsComponent },
      { path: 'reviews', component: UserReviewsComponent },
      { path: 'settings', component: UserSettingsComponent }
    ]
  },
  { path: '**', component: NotFoundComponent }
];
