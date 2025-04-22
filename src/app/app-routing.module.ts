import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    data: { title: 'Home | African Trails' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 70]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
