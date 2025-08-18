import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ProviderProfileComponent } from './pages/provider-profile/provider-profile.component';

import { ReservationComponent } from './pages/reservation/reservation.component';
import { ReservationDetailComponent } from './pages/reservation-detail/reservation-detail.component';
import { ServiceSearchComponent } from './pages/service-search/service-search.component';
import { AvailableProvidersComponent } from './pages/available-providers/available-providers.component';
import { ConversationComponent } from './pages/conversation/conversation.component';
import { MessageComponent } from './pages/message/message.component';
import { ReviewComponent } from './pages/review/review.component';
import { AuthGuard } from './services/auth/guards/auth.guard';

export const routes: Routes = [
  // Routes publiques (pas de protection)
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'terms-and-conditions',
    children : [
      {
        path: 'cgu',
        loadComponent: () => import('./pages/terms-and-conditions/terms-and-conditions.component')
          .then(m => m.TermsAndConditionsComponent),
        data: { isCGU: true }
      },
      {
        path: 'cgv',
        loadComponent: () => import('./pages/terms-and-conditions/terms-and-conditions.component')
          .then(m => m.TermsAndConditionsComponent),
        data: { isCGV: true }
      }
    ]
  },

  // Routes d'authentification (pas de protection)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login-form.component')
          .then(m => m.LoginFormComponent)
      },
      {
        path: 'register/:userType',
        loadComponent: () => import('./pages/register/register-form.component')
          .then(m => m.RegisterFormComponent),
        data: { isRegister: true }
      }
    ]
  },

  // Routes protégées (avec AuthGuard)
  {
    path: 'success',
    loadComponent: () => import('./pages/success/success.component')
      .then(m => m.SuccessComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'available-providers',
    component: AvailableProvidersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'service-search',
    component: ServiceSearchComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'provider-profile',
    component: ProviderProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reservations',
    component: ReservationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reservations/:id',
    component: ReservationDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'review',
    component: ReviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messaging',
    component: ConversationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'conversations/:id',
    component: ConversationComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'messages/:id',
    component: MessageComponent,
    canActivate: [AuthGuard]
  }
];
