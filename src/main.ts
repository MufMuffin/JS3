import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideZoneChangeDetection } from '@angular/core';

import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home.component';
import { ProductsListComponent } from './app/products-list.component';
import { ProductDetailsComponent } from './app/product-details.component';
import { ProductFormComponent } from './app/product-form.component';
import { loggingInterceptor } from './app/logging.interceptor';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsListComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'add-product', component: ProductFormComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loggingInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
}).catch(err => console.error(err));