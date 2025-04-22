import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TourListComponent } from './components/tour-list/tour-list.component';
import { TourDetailsComponent } from './components/tour-details/tour-details.component';
import { TourBookingComponent } from './components/tour-booking/tour-booking.component';
import { TourSearchComponent } from './components/tour-search/tour-search.component';
import { TourReviewsComponent } from './components/tour-reviews/tour-reviews.component';
import { TourItineraryComponent } from './components/tour-itinerary/tour-itinerary.component';
import { TourGalleryComponent } from './components/tour-gallery/tour-gallery.component';

const routes: Routes = [
  {
    path: '',
    component: TourListComponent
  },
  {
    path: 'search',
    component: TourSearchComponent
  },
  {
    path: ':id',
    component: TourDetailsComponent,
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      {
        path: 'overview',
        component: TourItineraryComponent
      },
      {
        path: 'gallery',
        component: TourGalleryComponent
      },
      {
        path: 'reviews',
        component: TourReviewsComponent
      },
      {
        path: 'book',
        component: TourBookingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ToursRoutingModule { }
