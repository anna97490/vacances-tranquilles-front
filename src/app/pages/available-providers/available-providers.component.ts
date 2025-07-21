import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderCardComponent } from '../../components/provider-card/provider-card.component';
import { MOCK_SERVICES } from '../../components/provider-card/mock-service';
import { Service } from '../../services/interfaces/interfaceService';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

/**
 * Composant listant les prestataires disponibles.
 * Fournit la liste des services disponibles au composant provider-card.
 */
@Component({
  selector: 'app-available-providers',
  standalone: true,
  imports: [
    ProviderCardComponent, 
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule],
  templateUrl: './available-providers.component.html',
  styleUrl: './available-providers.component.scss'
})
export class AvailableProvidersComponent {
  /**
   * Liste des services à afficher.
   */
  services: Service[] = MOCK_SERVICES;
  noteOptions = ['5 étoiles', '4+ étoiles', '3+ étoiles'];
  priceOptions = ['< 25 €', '25 - 50 €', '> 50 €'];
  distanceOptions = ['< 5 km', '5 - 10 km', '10 - 20 km', 'Toutes distances'];
}
