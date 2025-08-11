import { Component, OnInit, ViewChild } from '@angular/core';
import { DisplayProfileComponent } from '../../components/profile/display-profile/display-profile.component';
import { UpdateProfileComponent } from '../../components/profile/update-profile/update-profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { User } from '../../models/User';
import { Service } from '../../models/Service';
import { UserInformationService } from '../../services/user-information/user-information.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { UserRole } from '../../models/User';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DisplayProfileComponent, UpdateProfileComponent, MatButtonModule, MatIconModule, MatSnackBarModule, CommonModule],
  templateUrl: './profilePage.component.html',
  styleUrl: './profilePage.component.scss'
})
export class ProfilePageComponent implements OnInit {
  @ViewChild(DisplayProfileComponent) displayProfileComponent!: DisplayProfileComponent;
  @ViewChild(UpdateProfileComponent) updateProfileComponent!: UpdateProfileComponent;

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

  /**
   * Indique si une sauvegarde est en cours
   */
  isSaving = false;

  displayedUser: User | null = null;
  services: Service[] = [];
  loggedUser: User | null = null;
  userRole: UserRole | null = null;

  constructor(
    private readonly userInformationService: UserInformationService,
    private readonly authStorageService: AuthStorageService,
    private readonly snackBar: MatSnackBar
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
        } as User;
        
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

    // Charger les services séparément si l'utilisateur est un prestataire
    if (this.userRole === 'PROVIDER') {
      this.userInformationService.getMyServices().subscribe({
        next: (services: Service[]) => {
          this.services = services;
        },
        error: (error) => {
          console.error('Erreur lors de la récupération des services:', error);
          this.services = [];
        }
      });
    }
  }

  /**
   * Recharge les données utilisateur
   */
  retryLoadData(): void {
    this.loadLoggedUserData();
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      // Si on sort du mode édition, sauvegarder les modifications
      this.saveProfileChanges();
    } else {
      // Entrer en mode édition
      this.isEditMode = true;
    }
  }

  getButtonText(): string {
    if (this.isSaving) {
      return 'Sauvegarde...';
    }
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
   * Sauvegarde les modifications du profil vers le backend
   */
  private saveProfileChanges(): void {
    if (!this.displayedUser) {
      this.snackBar.open('Aucune donnée à sauvegarder', 'Fermer', { duration: 3000 });
      return;
    }

    this.isSaving = true;

    // Appeler la méthode saveProfile du composant update-profile
    if (this.updateProfileComponent) {
      this.updateProfileComponent.saveProfile();
    }

    // Attendre un peu pour simuler la sauvegarde puis sortir du mode édition
    setTimeout(() => {
      this.isEditMode = false;
      this.isSaving = false;
      
      // Mettre à jour le composant d'affichage
      if (this.displayProfileComponent && this.displayedUser) {
        this.displayProfileComponent.updateProfileData(this.displayedUser, this.services);
      }
      
      this.snackBar.open('Profil mis à jour avec succès', 'Fermer', { duration: 3000 });
    }, 1000);
  }

  /**
   * Vérifie si le profil affiché est celui de l'utilisateur connecté
   * @returns true si l'utilisateur affiché est le même que l'utilisateur connecté
   */
  isCurrentUserProfile(): boolean {
    return this.displayedUser?.idUser === this.loggedUser?.idUser;
  }
}
