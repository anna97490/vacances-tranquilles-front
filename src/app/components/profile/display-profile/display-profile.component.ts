import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProfileHeaderComponent } from "../display-profile/utils/display-profile-header/display-profile-header.component";
import { DisplayProfileServicesComponent } from './utils/display-profile-services/display-profile-services.component';
import { DisplayProfileReviewsComponent } from './utils/display-profile-reviews/display-profile-reviews.component';
import { User, UserRole } from '../../../models/User';
import { Service } from '../../../models/Service';
import { UserInformationService } from '../../../services/user-information/user-information.service';

@Component({
  selector: 'app-display-profile',
  standalone: true,
  imports: [CommonModule, DisplayProfileHeaderComponent, DisplayProfileServicesComponent, DisplayProfileReviewsComponent],
  templateUrl: './display-profile.component.html',

})
export class DisplayProfileComponent implements OnInit, OnChanges {
  @Input() user!: User;
  @Input() services!: Service[];
  @Input() userRole!: UserRole;

  isProviderProfile = false;

  constructor(private readonly userInformationService: UserInformationService) {}

  ngOnInit() {
    // Vérifie si on est sur la page provider-profile
    const displayedUserId = localStorage.getItem('displayedUserId');
    this.isProviderProfile = displayedUserId !== null;

    // Charge les données du profil depuis le backend si pas fournies
    if (!this.user) {
      this.loadUserProfile();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Méthode vide car les logs ont été retirés
  }

  /**
   * Charge le profil utilisateur depuis le backend
   */
  private loadUserProfile(): void {
    // Charger les données utilisateur
    this.userInformationService.getUserProfile().subscribe({
      next: (userData: User) => {
        this.user = userData;
      },
      error: (error: any) => {
        // Gestion d'erreur silencieuse
      }
    });

    // Charger les services séparément
    this.userInformationService.getMyServices().subscribe({
      next: (services: Service[]) => {
        this.services = services;
      },
      error: (error: any) => {
        this.services = [];
      }
    });
  }

  /**
   * Met à jour les données du profil
   */
  updateProfileData(user: User, services: Service[]): void {
    this.user = user;
    this.services = services;
  }
}
