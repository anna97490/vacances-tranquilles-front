import { Component, Input } from '@angular/core';
import { User } from '../../../../../models/User';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

/**
 * Composant d'en-tête de mise à jour du profil utilisateur.
 * Permet la modification de la photo, du nom, et des informations principales.
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

  /** Nom du fichier sélectionné pour la photo de profil */
  fileName: string = '';

  /**
   * Gère le changement de photo de profil et met à jour l'aperçu et le nom du fichier.
   * @param event Événement de sélection de fichier
   */
  onProfilePictureChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.fileName = input.files[0].name;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.user.profilePicture = e.target.result;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
