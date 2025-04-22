import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { SuccessMessageComponent } from './components/success-message/success-message.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { RatingComponent } from './components/rating/rating.component';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery.component';
import { PriceDisplayComponent } from './components/price-display/price-display.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { ParticipantCounterComponent } from './components/participant-counter/participant-counter.component';

// Directives
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { ScrollTrackerDirective } from './directives/scroll-tracker.directive';
import { ImageLazyLoadDirective } from './directives/image-lazy-load.directive';

// Pipes
import { DurationPipe } from './pipes/duration.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { CurrencyPipe } from './pipes/currency.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

const components = [
  LoadingSpinnerComponent,
  ErrorMessageComponent,
  SuccessMessageComponent,
  PaginationComponent,
  RatingComponent,
  ImageGalleryComponent,
  PriceDisplayComponent,
  DateRangePickerComponent,
  ParticipantCounterComponent
];

const directives = [
  ClickOutsideDirective,
  ScrollTrackerDirective,
  ImageLazyLoadDirective
];

const pipes = [
  DurationPipe,
  DateFormatPipe,
  CurrencyPipe,
  TruncatePipe,
  SafeHtmlPipe
];

@NgModule({
  declarations: [
    ...components,
    ...directives,
    ...pipes
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ...components,
    ...directives,
    ...pipes
  ]
})
export class SharedModule { }
