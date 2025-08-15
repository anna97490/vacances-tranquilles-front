import { Component, Input, Output, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/User';
import { Service } from '../../../models/Service';
import { UserRole } from '../../../models/User';
import { UpdateUserDTO } from '../../../models/UpdateUserDTO';
import { UserInformationService } from '../../../services/user-information/user-information.service';
import { UpdateProfileHeaderComponent } from './utils/update-profile-header/update-profile-header.component';
import { UpdateProfileServicesComponent } from './utils/update-profile-services/update-profile-services.component';
import { Observable } from 'rxjs';

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
  @Output() validationError = new EventEmitter<string>();
  @Output() saveSuccess = new EventEmitter<void>();
  @Output() saveError = new EventEmitter<string>();

  @ViewChild(UpdateProfileHeaderComponent) headerComponent!: UpdateProfileHeaderComponent;

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
   * Gère les erreurs de validation du header
   */
  onHeaderValidationError(errorMessage: string) {
    this.validationError.emit(errorMessage);
  }

  /**
   * Gère les changements de services
   */
  onServicesChange(newServices: Service[]) {
    this.services = newServices;
    this.profileDataChange.emit({ services: newServices });
  }

  /**
   * Valide le formulaire avant la sauvegarde
   */
  validateForm(): boolean {
    if (this.headerComponent) {
      return this.headerComponent.validateForm();
    }
    return true;
  }

  /**
   * Sauvegarde les modifications du profil vers le backend
   * @returns Observable qui émet true en cas de succès, false en cas d'échec
   */
  saveProfile(): Observable<boolean> {
    return new Observable(observer => {
      // Valider le formulaire avant la sauvegarde
      if (!this.validateForm()) {
        observer.next(false);
        observer.complete();
        return;
      }

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
          this.saveSuccess.emit();
  
          observer.next(true);
          observer.complete();
        },
        error: (error: any) => {
          console.error('Erreur lors de la mise à jour du profil:', error);
          this.saveError.emit('Erreur lors de la sauvegarde du profil');
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
