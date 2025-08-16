import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { User, UserRole } from '../../../../../models/User';
import { RatingStarsComponent } from '../../../../../components/shared/rating-stars/rating-stars.component';

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
    MatGridListModule,
    RatingStarsComponent
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
  @Input() userRole!: UserRole;


}
