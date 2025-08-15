import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { DisplayProfileComponent } from '../../components/profile/display-profile/display-profile.component';
import { UpdateProfileComponent } from '../../components/profile/update-profile/update-profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { User, UserRole } from '../../models/User';
import { Service } from '../../models/Service';
import { UserInformationService } from '../../services/user-information/user-information.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DisplayProfileComponent, UpdateProfileComponent, MatButtonModule, MatIconModule, MatSnackBarModule, CommonModule],
  templateUrl: './profilePage.component.html',
  styleUrl: './profilePage.component.scss'
})
export class ProfilePageComponent implements OnInit, OnDestroy {
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

  ngOnDestroy(): void {
    // Nettoyer le localStorage quand l'utilisateur quitte la page
    localStorage.removeItem('displayedUserId');
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

    // Vérifier s'il y a un displayedUserId dans le localStorage
    const displayedUserId = localStorage.getItem('displayedUserId');
    const loggedUserId = this.authStorageService.getUserId();

    // Si un displayedUserId est spécifié et différent de l'utilisateur connecté
    if (displayedUserId && displayedUserId !== loggedUserId?.toString()) {
      // Charger les données de l'utilisateur à afficher avec getUserById
      this.loadDisplayedUserData(parseInt(displayedUserId, 10));
      // Charger les données de l'utilisateur connecté séparément pour loggedUser
      this.loadLoggedUserDataOnly();
    } else {
      // Si c'est le profil de l'utilisateur connecté, utiliser getUserProfile
      this.loadLoggedUserDataOnly();
    }
  }

  /**
   * Charge uniquement les données de l'utilisateur connecté
   */
  private loadLoggedUserDataOnly(): void {
    // Récupérer les informations de l'utilisateur connecté
    this.userInformationService.getUserProfile().subscribe({
      next: (userData: User) => {
        // Créer l'objet loggedUser avec les données de l'API + le role du localStorage
        this.loggedUser = {
          ...userData,
          role: this.userRole || UserRole.CLIENT // fallback par défaut
        } as User;
        
        // Si aucun displayedUserId spécifié, c'est le profil de l'utilisateur connecté
        const displayedUserId = localStorage.getItem('displayedUserId');
        if (!displayedUserId) {
          this.displayedUser = { ...this.loggedUser };
        }
        
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
   * Charge les données de l'utilisateur à afficher
   */
  private loadDisplayedUserData(userId: number): void {
    this.userInformationService.getUserById(userId).subscribe({
      next: (userData: User) => {
        // S'assurer que l'idUser est présent
        const completeUserData: User = {
          ...userData,
          idUser: userData.idUser || userId, // Utiliser l'idUser de l'API ou l'userId passé en paramètre
          role: userData.role || UserRole.CLIENT
        };
        
        this.displayedUser = completeUserData;
        this.isLoading = false;
        
        // Charger les services de cet utilisateur s'il est prestataire
        if (this.displayedUser.role === UserRole.PROVIDER) {
          this.userInformationService.getUserServices(userId).subscribe({
            next: (services: Service[]) => {
              this.services = services;
            },
            error: (error: any) => {
              console.error('Erreur lors de la récupération des services:', error);
              this.services = [];
            }
          });
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des données de l\'utilisateur affiché:', error);
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
   * Gère les erreurs de validation
   */
  onValidationError(errorMessage: string) {
    this.snackBar.open(errorMessage, 'Fermer', { 
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Gère le succès de la sauvegarde
   */
  onSaveSuccess(): void {
    this.isSaving = false;
    this.isEditMode = false;
    
    // Mettre à jour le composant d'affichage
    if (this.displayProfileComponent && this.displayedUser) {
      this.displayProfileComponent.updateProfileData(this.displayedUser, this.services);
    }
    
    this.snackBar.open('Profil mis à jour avec succès', 'Fermer', { duration: 3000 });
  }

  /**
   * Gère l'erreur de sauvegarde
   */
  onSaveError(errorMessage: string): void {
    this.isSaving = false;
    this.snackBar.open(errorMessage, 'Fermer', { 
      duration: 5000,
      panelClass: ['error-snackbar']
    });
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
      this.updateProfileComponent.saveProfile().subscribe({
        next: () => {
          this.onSaveSuccess();
        },
        error: (error) => {
          this.onSaveError('Erreur lors de la sauvegarde');
        }
      });
    } else {
      this.isSaving = false;
      this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 });
    }
  }

  /**
   * Vérifie si le profil affiché est celui de l'utilisateur connecté
   * @returns true si l'utilisateur affiché est le même que l'utilisateur connecté
   */
  isCurrentUserProfile(): boolean {
    return this.displayedUser?.idUser === this.loggedUser?.idUser;
  }
}
