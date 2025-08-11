import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';
import { Service } from '../../../models/Service';
import { UserRole } from '../../../models/User';
import { UpdateUserDTO } from '../../../models/UpdateUserDTO';
import { UserInformationService } from '../../../services/user-information/user-information.service';
import { UpdateProfileHeaderComponent } from './utils/update-profile-header/update-profile-header.component';
import { UpdateProfileServicesComponent } from './utils/update-profile-services/update-profile-services.component';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [CommonModule, UpdateProfileHeaderComponent, UpdateProfileServicesComponent],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent implements OnInit {
  @Input() user!: User;
  @Input() services!: Service[];
  @Input() userRole!: UserRole;
  @Output() profileDataChange = new EventEmitter<{ user?: User; services?: Service[] }>();

  constructor(private userInformationService: UserInformationService) {}

  ngOnInit() {
    // Charge les données du profil depuis le backend si pas fournies
    if (!this.user || !this.services) {
      this.loadUserProfile();
    }
  }

  /**
   * Charge le profil utilisateur depuis le backend
   */
  private loadUserProfile(): void {
    this.userInformationService.getUserProfileWithServices().subscribe({
      next: (profile: any) => {
        this.user = profile.user;
        this.profileDataChange.emit({ user: this.user });
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement du profil:', error);
      }
    });

    // Charger les services séparément
    this.userInformationService.getMyServices().subscribe({
      next: (services: Service[]) => {
        this.services = services;
        this.profileDataChange.emit({ services: this.services });
      },
      error: (error: any) => {
        console.error('Erreur lors du chargement des services:', error);
        this.services = [];
        this.profileDataChange.emit({ services: this.services });
      }
    });
  }

  /**
   * Gère les changements d'informations utilisateur
   */
  onUserChange(newUser: User) {
    this.user = newUser;
    this.profileDataChange.emit({ user: newUser });
  }

  /**
   * Gère les changements de services
   */
  onServicesChange(newServices: Service[]) {
    this.services = newServices;
    this.profileDataChange.emit({ services: newServices });
  }

  /**
   * Sauvegarde les modifications du profil vers le backend
   */
  saveProfile(): void {
    const updateDTO: UpdateUserDTO = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      phoneNumber: this.user.phoneNumber,
      address: this.user.address,
      city: this.user.city,
      postalCode: this.user.postalCode,
      siretSiren: this.user.siretSiren,
      companyName: this.user.companyName,
      rcNumber: this.user.rcNumber,
      kbisUrl: this.user.kbisUrl,
      autoEntrepreneurAttestationUrl: this.user.autoEntrepreneurAttestationUrl,
      insuranceCertificateUrl: this.user.insuranceCertificateUrl,
      description: this.user.description
    };

    this.userInformationService.updateUserProfile(updateDTO).subscribe({
      next: (updatedProfile: any) => {
        this.user = updatedProfile.user;
        this.services = updatedProfile.services;
        this.profileDataChange.emit({ user: this.user, services: this.services });
        console.log('Profil mis à jour avec succès');
      },
      error: (error: any) => {
        console.error('Erreur lors de la mise à jour du profil:', error);
      }
    });
  }
}
