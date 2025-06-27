import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'terms-and-conditions', 
    children : [
      {
        path: 'cgu',
        loadComponent: () => import('./components/terms-and-conditions/terms-and-conditions.component')
          .then(m => m.TermsAndConditionsComponent),
        data: { isCGU: true } // Indique que c'est pour les CGU
      },
      {
        path: 'cgv',
        loadComponent: () => import('./components/terms-and-conditions/terms-and-conditions.component')
          .then(m => m.TermsAndConditionsComponent),
        data: { isCGV: true } // Indique que c'est pour les CGV  
      }
    ]
  },
  
  // Routes d'authentification avec paramètres pour le type d'utilisateur
  { 
    path: 'auth',
    // :userType pour distinguer entre "particulier" et "prestataire"
    children: [
      { 
        path: 'login/:userType', 
        loadComponent: () => import('./components/auth-form/auth-form.component')
          .then(m => m.AuthFormComponent),
        //   Utilisé la propriété data pour passer des informations supplémentaires aux composants chargés (comme isRegister)
        data: { isRegister: false }
      },
      { 
        path: 'register/:userType', 
        loadComponent: () => import('./components/register-form/register-form.component')
          .then(m => m.RegisterFormComponent),
        //   Utilisé la propriété data pour passer des informations supplémentaires aux composants chargés (comme isRegister)
        data: { isRegister: true }
      }
    ]
  },
  
  // Route wildcard pour gérer les URLs non trouvées
  { path: '**', redirectTo: 'home' }
];