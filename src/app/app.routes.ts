import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  
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
        loadComponent: () => import('./components/auth-form/auth-form.component')
          .then(m => m.AuthFormComponent),
        //   Utilisé la propriété data pour passer des informations supplémentaires aux composants chargés (comme isRegister)
        data: { isRegister: true }
      }
    ]
  },
  
  // Route wildcard pour gérer les URLs non trouvées
  { path: '**', redirectTo: 'home' }
];