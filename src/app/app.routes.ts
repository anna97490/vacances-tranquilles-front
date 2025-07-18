import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ServiceSearchComponent } from './pages/service-search/service-search.component';
import { AvailableProvidersComponent } from './pages/available-providers/available-providers.component';

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
  { path: 'avalaible-providers', component: AvailableProvidersComponent },
  
  // Route wildcard pour gérer les URLs non trouvées
  { path: '**', redirectTo: 'home' }
];