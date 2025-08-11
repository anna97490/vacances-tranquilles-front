import { Component, OnInit } from '@angular/core';
import { DisplayProfileComponent } from '../../components/profile/display-profile/display-profile.component';
import { UpdateProfileComponent } from '../../components/profile/update-profile/update-profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { User } from '../../models/User';
import { Service } from '../../models/Service';
import { UserInformationService } from '../../services/user-information/user-information.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { UserRole } from '../../models/User';

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

  displayedUser: User | null = null;
  services: Service[] = [];
  loggedUser: User | null = null;
  userRole: UserRole | null = null;

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

    // Récupérer le userRole depuis le localStorage
    const storedUserRole = localStorage.getItem('userRole');
    if (storedUserRole) {
      this.userRole = storedUserRole as UserRole;
    }

    // Récupérer les informations de l'utilisateur connecté
    this.userInformationService.getUserProfile().subscribe({
      next: (userData: User) => {
        // Créer l'objet loggedUser avec les données de l'API + le role du localStorage
        this.loggedUser = {
          ...userData,
          role: this.userRole || UserRole.CLIENT // fallback par défaut
        };
        
        // Si c'est le profil de l'utilisateur connecté, on met aussi à jour displayedUser
        this.displayedUser = { ...this.loggedUser };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
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
    return this.displayedUser?.idUser === this.loggedUser?.idUser;
  }
}
