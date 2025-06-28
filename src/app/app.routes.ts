import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FeedbackComponent } from './pages/feedback/feedback/feedback.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'feedback', component: FeedbackComponent },

  // Route wildcard pour gérer les URLs non trouvées
  { path: '**', redirectTo: 'home' }
];