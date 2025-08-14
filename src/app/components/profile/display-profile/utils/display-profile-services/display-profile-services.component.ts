import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { NgClass } from '@angular/common';
import { Service } from '../../../../../models/Service';
import { IconService } from '../../../../../services/icon.service';

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
  imports: [CommonModule, MatCardModule, MatIconModule, NgFor, NgClass],
  templateUrl: './display-profile-services.component.html',
  styleUrl: './display-profile-services.component.scss'
})
export class DisplayProfileServicesComponent {
  @Input() services!: Service[];

  constructor(public iconService: IconService) {}
}
