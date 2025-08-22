import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayProfileHeaderComponent } from '../../components/profile/display-profile/utils/display-profile-header/display-profile-header.component';
import { DisplayProfileReviewsComponent } from '../../components/profile/display-profile/utils/display-profile-reviews/display-profile-reviews.component';
import { User, UserRole } from '../../models/User';
import { UserInformationService } from '../../services/user-information/user-information.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { BackButtonComponent } from '../../components/shared/back-button/back-button.component';

/**
 * Composant pour afficher le profil d'un prestataire.
 * Charge et affiche les informations d'un prestataire spécifique à partir de son ID.
 */
@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports: [
    CommonModule,
    DisplayProfileHeaderComponent,
    DisplayProfileReviewsComponent,
    MatButtonModule,
    BackButtonComponent
  ],
  templateUrl: './provider-profile.component.html',
  styleUrl: './provider-profile.component.scss'
})
export class ProviderProfileComponent implements OnInit {
  /** Les informations du prestataire à afficher */
  provider: User | null = null;

  /** Indique si les données sont en cours de chargement */
  isLoading = true;

  /** Indique s'il y a eu une erreur lors du chargement */
  hasError = false;

  /**
   * Crée une instance de ProviderProfileComponent.
   * @param userInformationService - Service pour récupérer les informations utilisateur
   * @param router - Service de navigation Angular
   */
  constructor(
    private readonly userInformationService: UserInformationService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadProviderData();
  }

  /**
   * Charge les données du prestataire depuis le localStorage et l'API.
   * Récupère l'ID du prestataire depuis le localStorage et fait un appel API
   * pour obtenir les informations complètes du prestataire.
   * Redirige vers la page d'accueil si aucun ID n'est trouvé.
   */
  private loadProviderData(): void {
    const displayedUserId = localStorage.getItem('displayedUserId');

    if (!displayedUserId) {
      // Si aucun displayedUserId n'est trouvé, rediriger vers la page d'accueil
      this.router.navigate(['/home']);
      return;
    }

    const userId = parseInt(displayedUserId, 10);

    // Charger les données du prestataire
    this.userInformationService.getUserById(userId).subscribe({
      next: (userData: User) => {
        this.provider = {
          ...userData,
          idUser: userData.idUser || userId,
          role: UserRole.PROVIDER // Forcer le rôle à PROVIDER pour cette page
        };
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  /**
   * Permet de réessayer le chargement des données en cas d'erreur.
   * Réinitialise l'état de chargement et d'erreur, puis relance le chargement.
   */
  retryLoadData(): void {
    this.isLoading = true;
    this.hasError = false;
    this.loadProviderData();
  }

  /**
   * Navigue vers la page précédente.
   * Retourne à la page des prestataires disponibles.
   */
  goBack(): void {
    this.router.navigate(['/available-providers']);
  }
}
