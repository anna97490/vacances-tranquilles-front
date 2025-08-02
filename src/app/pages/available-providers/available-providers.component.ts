import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderCardComponent } from '../../components/provider-card/provider-card.component';
import { Service } from '../../models/Service';
import { User } from '../../models/User';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Router } from '@angular/router';
import { ServicesService } from '../../services/services/services.service';
import { UserInformationService } from '../../services/user-information/user-information.service';

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
  /**
   * Map des informations des prestataires par ID
   */
  providersInfo: Map<number, User> = new Map();

  /** Critères de recherche utilisés */
  searchCriteria: any = null;

  constructor(
    private router: Router,
    private servicesService: ServicesService,
    private userInformationService: UserInformationService
  ) {}

  ngOnInit(): void {
    // Récupération des critères de recherche depuis le localStorage
    const searchCriteria = localStorage.getItem('searchCriteria');

    if (searchCriteria) {
      try {
        this.searchCriteria = JSON.parse(searchCriteria);
        
        // Recherche des services avec les critères
        this.searchServices();
      } catch (error) {
        console.error('Erreur lors du parsing des critères:', error);
        this.router.navigate(['/service-search']);
      }
    } else {
      // Si pas de critères, rediriger vers la page de recherche
      this.router.navigate(['/service-search']);
    }
  }

  /**
   * Recherche des services selon les critères
   */
  private searchServices(): void {
    if (!this.searchCriteria) {
      console.error('Aucun critère de recherche disponible');
      return;
    }

    const { category, postalCode, date, startTime, endTime } = this.searchCriteria;

    this.servicesService.searchServices(category, postalCode, date, startTime, endTime)
      .subscribe({
        next: (services) => {
          this.services = services;
          
          // Récupérer les informations des prestataires
          this.loadProvidersInfo();
        },
        error: (error) => {
          console.error('Erreur lors de la recherche des services:', error);
          this.services = [];
        }
      });
  }

  /**
   * Charge les informations des prestataires pour les services trouvés
   */
  private loadProvidersInfo(): void {
    // Extraire les IDs des prestataires uniques
    const providerIds = [...new Set(this.services.map(service => service.providerId))];
    
    if (providerIds.length === 0) {
      return;
    }

    // Récupérer les informations de chaque prestataire
    providerIds.forEach(providerId => {
      this.userInformationService.getUserById(providerId)
        .subscribe({
          next: (user) => {
            this.providersInfo.set(providerId, user);
          },
          error: (error) => {
            console.error(`Erreur lors de la récupération du prestataire ${providerId}:`, error);
          }
        });
    });
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
   * Récupère les informations d'un prestataire par son ID
   * @param providerId ID du prestataire
   * @returns User | undefined Les informations du prestataire
   */
  getProviderInfo(providerId: number): User | undefined {
    return this.providersInfo.get(providerId);
  }

  /**
   * Navigation vers la page de recherche
   */
  navigateToSearch(): void {
    this.router.navigate(['/service-search']);
  }
}
