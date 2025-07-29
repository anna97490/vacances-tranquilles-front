import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderCardComponent } from '../../components/provider-card/provider-card.component';
import { Service } from '../../models/Service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Router } from '@angular/router';

/**
 * Composant listant les prestataires disponibles.
 * Fournit la liste des services disponibles au composant provider-card.
 */
@Component({
  selector: 'app-available-providers',
  standalone: true,
  imports: [
    ProviderCardComponent, 
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule],
  templateUrl: './available-providers.component.html',
  styleUrl: './available-providers.component.scss'
})
export class AvailableProvidersComponent implements OnInit {
  /**
   * Liste des services à afficher.
   */
  services: Service[] = [];
  noteOptions = ['5 étoiles', '4+ étoiles', '3+ étoiles'];
  priceOptions = ['< 25 €', '25 - 50 €', '> 50 €'];
  distanceOptions = ['< 5 km', '5 - 10 km', '10 - 20 km', 'Toutes distances'];

  /** Critères de recherche utilisés */
  searchCriteria: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Récupération des résultats de recherche depuis le localStorage
    const searchResults = localStorage.getItem('searchResults');
    const searchCriteria = localStorage.getItem('searchCriteria');

    if (searchResults) {
      try {
        this.services = JSON.parse(searchResults);
        if (searchCriteria) {
          this.searchCriteria = JSON.parse(searchCriteria);
        }
      } catch (error) {
        console.error('Erreur lors du parsing des résultats:', error);
        this.services = [];
      }
    } else {
      // Si pas de résultats, rediriger vers la page de recherche
      this.router.navigate(['/service-search']);
    }
  }

  /**
   * Retourne le nombre de services trouvés
   */
  get servicesCount(): number {
    return this.services.length;
  }

  /**
   * Retourne les critères de recherche formatés
   */
  get formattedCriteria(): string {
    if (!this.searchCriteria) return '';
    
    const { category, postalCode, date, startTime, endTime } = this.searchCriteria;
    return `${category} - ${postalCode} - ${date} ${startTime}-${endTime}`;
  }

  /**
   * Navigation vers la page de recherche
   */
  navigateToSearch(): void {
    this.router.navigate(['/service-search']);
  }
}
