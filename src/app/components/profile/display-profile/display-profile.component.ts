import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProfileHeaderComponent } from "../display-profile/utils/display-profile-header/display-profile-header.component";
import { DisplayProfileServicesComponent } from './utils/display-profile-services/display-profile-services.component';
import { User } from '../../../models/User';
import { Service } from '../../../models/Service';
import { UserRole } from '../../../models/User';
import { UserInformationService } from '../../../services/user-information/user-information.service';

@Component({
  selector: 'app-display-profile',
  standalone: true,
  imports: [CommonModule, DisplayProfileHeaderComponent, DisplayProfileServicesComponent],
  templateUrl: './display-profile.component.html',
  styleUrl: './display-profile.component.scss'
})
export class DisplayProfileComponent implements OnInit {
  @Input() user!: User;
  @Input() services!: Service[];
  @Input() userRole!: UserRole;

  constructor(private userInformationService: UserInformationService) {}

  ngOnInit() {
    // Charge les données du profil depuis le backend si pas fournies
    if (!this.user) {
      this.loadUserProfile();
    }
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
        console.error('Erreur lors du chargement du profil utilisateur:', error);
      }
    });

    // Charger les services séparément
    this.userInformationService.getMyServices().subscribe({
      next: (services: Service[]) => {
        this.services = services;
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des services:', error);
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
