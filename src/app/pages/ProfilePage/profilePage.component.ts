import { Component, OnInit } from '@angular/core';
import { DisplayProfileComponent } from '../../components/profile/display-profile/display-profile.component';
import { UpdateProfileComponent } from '../../components/profile/update-profile/update-profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MOCK_USER, LOGGED_USER } from '../../components/profile/mock-user';
import { MOCK_SERVICES } from '../../components/provider-card/mock-service';
import { User } from '../../models/User';
import { Service } from '../../models/Service';
import { UserInformationService } from '../../services/user-information/user-information.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DisplayProfileComponent, UpdateProfileComponent, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './profilePage.component.html',
  styleUrl: './profilePage.component.scss'
})
export class ProfilePageComponent implements OnInit {
  /**
   * Indique si le mode édition est activé
   */
  isEditMode = false;

  /**
   * Indique si les données sont en cours de chargement
   */
  isLoading = true;

  /**
   * Indique s'il y a eu une erreur lors du chargement
   */
  hasError = false;

  displayedUser: User = { ...MOCK_USER };
  services = [...MOCK_SERVICES];
  loggedUser: User = { ...LOGGED_USER };

  constructor(
    private readonly userInformationService: UserInformationService,
    private readonly authStorageService: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.loadLoggedUserData();
  }

  /**
   * Charge les données de l'utilisateur connecté
   */
  private loadLoggedUserData(): void {
    this.isLoading = true;
    this.hasError = false;

    // Récupérer les informations de l'utilisateur connecté
    this.userInformationService.getUserProfile().subscribe({
      next: (userData: User) => {
        console.log('Données utilisateur connecté récupérées:', userData);
        this.loggedUser = userData;
        // Si c'est le profil de l'utilisateur connecté, on met aussi à jour displayedUser
        this.displayedUser = userData;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
        // En cas d'erreur, on garde les données mock par défaut
        this.loggedUser = { ...LOGGED_USER };
        this.displayedUser = { ...MOCK_USER };
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  /**
   * Recharge les données utilisateur
   */
  retryLoadData(): void {
    this.loadLoggedUserData();
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  getButtonText(): string {
    return this.isEditMode ? 'Valider les modifications' : 'Modifier';
  }

  /**
   * Met à jour l'utilisateur ou les services depuis un enfant
   */
  onProfileDataChange(event: { user?: User; services?: Service[] }) {
    if (event.user) this.displayedUser = { ...event.user };
    if (event.services) this.services = [...event.services];
  }

  /**
   * Vérifie si le profil affiché est celui de l'utilisateur connecté
   * @returns true si l'utilisateur affiché est le même que l'utilisateur connecté
   */
  isCurrentUserProfile(): boolean {
    return this.displayedUser.idUser === this.loggedUser.idUser;
  }
}
