import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FeedbackComponent } from './pages/feedback/feedback/feedback.component';
import { ServiceSearchComponent } from './pages/service-search/service-search.component';

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
  { path: 'service-search', component: ServiceSearchComponent },
  
  // Route wildcard pour gérer les URLs non trouvées
  { path: '**', redirectTo: 'home' }
];