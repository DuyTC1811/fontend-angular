import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Eager — trang chính, user luôn cần
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },

  // Lazy — trang ít dùng hơn
  {
    path: 'signup',
    loadComponent: () => import('./features/signup/signup.component')
      .then(m => m.SignupComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/forgot-password/forgot-password.component')
      .then(m => m.ForgotPasswordComponent)
  },
  {
    path: 'category',
    loadComponent: () => import('./features/category/category.component')
      .then(m => m.CategoryComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component')
      .then(m => m.ProfileComponent)
  }
];
