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
  },
  {
    path: 'frame-view-pdf',
    loadComponent: () => import('./features/frame-view-pdf/frame-view-pdf.component')
      .then(m => m.FrameViewPdfComponent)
  },
  {
    path: 'frame-libre-office',
    loadComponent: () => import('./features/frame-libre-office/frame-libre-office.component')
      .then(m => m.FrameLibreOfficeComponent)
  },
  {
    path: 'libre-office/:id',
    loadComponent: () => import('./features/frame-libre-office-editor/frame-libre-office-editor.component')
      .then(m => m.FrameLibreOfficeEditorComponent),
  },
  {
    path: 'websocket',
    loadComponent: () => import('./features/websocket/websocket.component')
      .then(m => m.WebsocketComponent),
  },
  {
    path: 'sse-streaming',
    loadComponent: () => import('./features/sse-streaming/sse-streaming.component')
      .then(m => m.SseStreamingComponent),
  }
];
