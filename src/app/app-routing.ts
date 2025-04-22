import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { PackagesComponent } from './components/packages/packages.component';
import { DestinationsComponent } from './components/destinations/destinations.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { FaqComponent } from './components/faq/faq.component';

// Create a placeholder component for routes that don't have components yet
@Component({
  selector: 'app-placeholder',
  template: '<div class="container mt-5"><h2>Coming Soon</h2><p>This page is under construction.</p></div>'
})
class PlaceholderComponent {}

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    data: { title: 'Home | African Trails', animation: 'HomePage' }
  },
  { 
    path: 'about', 
    component: AboutComponent,
    data: { title: 'About Us | African Trails', animation: 'AboutPage' }
  },
  { 
    path: 'contact', 
    component: ContactComponent,
    data: { title: 'Contact Us | African Trails', animation: 'ContactPage' }
  },
  { 
    path: 'safaris', 
    component: PackagesComponent,
    data: { title: 'Safaris | African Trails', animation: 'SafarisPage' }
  },
  { 
    path: 'safaris/:id', 
    component: PlaceholderComponent,
    data: { title: 'Safari Details | African Trails', animation: 'SafariDetailPage' }
  },
  { 
    path: 'destinations', 
    component: DestinationsComponent,
    data: { title: 'Destinations | African Trails', animation: 'DestinationsPage' }
  },
  { 
    path: 'destinations/:id', 
    component: PlaceholderComponent,
    data: { title: 'Destination Details | African Trails', animation: 'DestinationDetailPage' }
  },
  { 
    path: 'gallery', 
    component: GalleryComponent,
    data: { title: 'Gallery | African Trails', animation: 'GalleryPage' }
  },
  { 
    path: 'faq', 
    component: FaqComponent,
    data: { title: 'FAQ | African Trails', animation: 'FaqPage' }
  },
  { 
    path: 'blog', 
    component: PlaceholderComponent,
    data: { title: 'Blog | African Trails', animation: 'BlogPage' }
  },
  { 
    path: 'blog/:id', 
    component: PlaceholderComponent,
    data: { title: 'Blog Post | African Trails', animation: 'BlogPostPage' }
  },
  { 
    path: 'booking', 
    component: PlaceholderComponent,
    data: { title: 'Book Your Safari | African Trails', animation: 'BookingPage' }
  },
  { 
    path: '**', 
    component: PlaceholderComponent,
    data: { title: 'Page Not Found | African Trails', animation: 'NotFoundPage' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 70], // [x, y] - adjust scroll offset
    initialNavigation: 'enabledBlocking' // Ensures initial navigation is completed before rendering
  })],
  exports: [RouterModule],
  declarations: [PlaceholderComponent] // Declare the placeholder component
})
export class AppRoutingModule { } 