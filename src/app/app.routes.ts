import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ReservationDetailComponent } from './pages/reservation-detail/reservation-detail.component';
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
  {
    path: 'reservation',
    children: [
      {
        path: 'detail',
        component: ReservationDetailComponent
      }
    ]
  },
  
  // Route wildcard pour gérer les URLs non trouvées
  { path: '**', redirectTo: 'home' }
];