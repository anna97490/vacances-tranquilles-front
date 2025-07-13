import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { NgClass } from '@angular/common';
import { MOCK_SERVICES } from '../../../mock-service';
import { Service} from '../../../../../services/interfaces/interfaceService'

/**
 * Composant d'affichage des services proposés dans le profil utilisateur.
 * Utilise Angular Material pour une présentation moderne et accessible.
 *
 * @example
 * <app-display-profile-services></app-display-profile-services>
 */
@Component({
  selector: 'app-display-profile-services',
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgFor, NgClass],
  templateUrl: './display-profile-services.component.html',
  styleUrl: './display-profile-services.component.scss'
})
export class DisplayProfileServicesComponent {
  @Input() services!: Service[];
}
