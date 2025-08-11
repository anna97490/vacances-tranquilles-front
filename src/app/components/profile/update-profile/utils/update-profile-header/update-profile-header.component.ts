import { Component, Input, Output, EventEmitter } from '@angular/core';
import { User } from '../../../../../models/User';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

/**
 * Composant d'en-tête de mise à jour du profil utilisateur.
 * Permet la modification du nom, et des informations principales.
 */
@Component({
  selector: 'app-update-profile-header',
  standalone: true,
  imports: [FormsModule, MatIconModule, CommonModule],
  templateUrl: './update-profile-header.component.html',
  styleUrl: './update-profile-header.component.scss'
})
export class UpdateProfileHeaderComponent {
  /** Utilisateur affiché et modifié */
  @Input() user!: User;
  /** Liste des services associés à l'utilisateur */
  @Input() services!: any[];
  /** Événement émis quand l'utilisateur est modifié */
  @Output() userChange = new EventEmitter<User>();

  /** Nom du fichier sélectionné pour la photo de profil */
  fileName: string = '';

  /**
   * Émet l'événement de changement d'utilisateur
   */
  onUserChange(): void {
    this.userChange.emit(this.user);
  }
}
