import { Component } from '@angular/core';
import { DisplayProfileComponent } from '../../components/profile/display-profile/display-profile.component';
import { UpdateProfileComponent } from '../../components/profile/update-profile/update-profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DisplayProfileComponent, UpdateProfileComponent, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './profilePage.component.html',
  styleUrl: './profilePage.component.scss'
})
export class ProfilePageComponent {
  /**
   * Indique si le mode édition est activé
   */
  isEditMode = false;

  /**
   * Bascule entre le mode affichage et le mode édition
   */
  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
  }

  /**
   * Retourne le texte du bouton selon le mode actuel
   * @returns Le texte à afficher sur le bouton
   */
  getButtonText(): string {
    return this.isEditMode ? 'Valider les modifications' : 'Modifier';
  }
}
