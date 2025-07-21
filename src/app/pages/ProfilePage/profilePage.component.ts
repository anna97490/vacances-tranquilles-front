import { Component } from '@angular/core';
import { DisplayProfileComponent } from '../../components/profile/display-profile/display-profile.component';
import { UpdateProfileComponent } from '../../components/profile/update-profile/update-profile.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MOCK_USER, LOGGED_USER } from '../../components/profile/mock-user';
import { MOCK_SERVICES } from '../../components/provider-card/mock-service';
import { User } from '../../models/User';
import { Service } from '../../models/Service';

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

  user: User = { ...MOCK_USER };
  services = [...MOCK_SERVICES];
  loggedUser: User = { ...LOGGED_USER };

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
    if (event.user) this.user = { ...event.user };
    if (event.services) this.services = [...event.services];
  }
}
