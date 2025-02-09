import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CollectionProcessingComponent } from './pages/dashboard/collection-processing/collection-processing.component';
import { PointsComponent } from './pages/dashboard/points/points.component';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component')
      .then(m => m.DashboardComponent),
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      {
        path: 'profile',
        loadComponent: () => import('./pages/dashboard/profile/profile.component')
          .then(m => m.ProfileComponent)
      },
      {
        path: 'collections',
        loadComponent: () => import('./pages/dashboard/collections/collections.component')
          .then(m => m.CollectionsComponent),
        canActivate: [RoleGuard],
        data: { role: 'particulier' }
      },
      {
        path: 'collector-process',
        loadComponent: () => import('./pages/dashboard/collector-process/collector-process.component')
          .then(m => m.CollectorProcessComponent),
        canActivate: [RoleGuard],
        data: { role: 'collecteur' }
      },
      {
        path: 'processing',
        component: CollectionProcessingComponent,
        canActivate: [authGuard]
      },
      {
        path: 'points',
        component: PointsComponent,
        canActivate: [authGuard]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
