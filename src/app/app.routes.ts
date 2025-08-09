import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfilePageComponent } from './pages/ProfilePage/profilePage.component';

import { ServiceSearchComponent } from './pages/service-search/service-search.component';
import { AvailableProvidersComponent } from './pages/available-providers/available-providers.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'service-search', component: ServiceSearchComponent },
  { path: 'available-providers', component: AvailableProvidersComponent },
  { path: 'success', 
    loadComponent: () => import('./pages/success/success.component')
      .then(m => m.SuccessComponent)
  },
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
  { path: 'profile', component: ProfilePageComponent },
  { path: 'service-search', component: ServiceSearchComponent },
  { path: 'avalaible-providers', component: AvailableProvidersComponent },
  
    // Routes d'authentification avec paramètres pour le type d'utilisateur
  { 
    path: 'auth',
    // :userType pour distinguer entre "particulier" et "prestataire"
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
        //   Utilisé la propriété data pour passer des informations supplémentaires aux composants chargés (comme isRegister)
        data: { isRegister: true }
      }
    ]
  }
];