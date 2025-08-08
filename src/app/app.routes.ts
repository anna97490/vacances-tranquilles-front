import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
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