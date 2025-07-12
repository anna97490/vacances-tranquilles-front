import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { User, UserRole } from '../../../../../services/interfaces/interfaceUser';

/**
 * Composant d’en-tête de profil utilisateur.
 * Affiche les informations principales du profil, avec gestion des droits d’accès selon le rôle.
 */

@Component({
  selector: 'app-display-profile-header',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatGridListModule
  ],
  templateUrl: './display-profile-header.component.html',
  styleUrls: ['./display-profile-header.component.scss']
})
export class DisplayProfileHeaderComponent {
  /**
   * Données de l'utilisateur à afficher.
   */
  @Input() user!: User;

  /**
   * Rôle de l'utilisateur connecté (pour l'affichage conditionnel).
   */
  @Input() currentUserRole!: UserRole;

  // À remplacer par des vraies valeurs dynamiques si tu les as
  rating: number = 3.5;
  reviewsCount: number = 142;

  /**
   * Retourne true si l'utilisateur connecté est admin.
   */
  get isAdmin(): boolean {
    return this.currentUserRole === UserRole.ADMIN;
  }

  /**
   * Retourne l'URL de la photo de profil, ou une image par défaut si non renseignée.
   */
  get profilePictureUrl(): string {
    return this.user.profilePicture || 'assets/pictures/logo.png';
  }

  get fullStars(): any[] {
    return Array(Math.floor(this.rating));
  }
  get hasHalfStar(): boolean {
    return this.rating % 1 >= 0.5;
  }
  get emptyStars(): any[] {
    return Array(5 - Math.ceil(this.rating));
  }
} 