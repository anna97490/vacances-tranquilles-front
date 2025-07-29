import { Component, Input } from '@angular/core';
import { User } from '../../models/User';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Service } from '../../models/Service';
import { PROVIDERS_MOCK } from './mock-user';
import { RatingStarsComponent } from '../shared/rating-stars/rating-stars.component';

/**
 * Composant carte prestataire (affichage d'un User de rôle PROVIDER)
 * @example <app-provider-card [user]="user"></app-provider-card>
 */
@Component({
  selector: 'app-provider-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatDividerModule, RatingStarsComponent],
  templateUrl: './provider-card.component.html',
  styleUrl: './provider-card.component.scss'
})
export class ProviderCardComponent {

  /**
   * Prestataire (User) correspondant au service affiché.
   * @type {User | undefined}
   */
  public user?: User;

  /**
   * Service à afficher dans la carte. Recherche automatiquement le user correspondant.
   * @type {Service}
   */
  private _service!: Service;

  @Input()
  /**
   * Setter pour le service.
   * Met à jour le service et recherche l'utilisateur associé dans les données mockées.
   */
  set service(service: Service) {
    this._service = service;
    this.user = PROVIDERS_MOCK.find((u: User) => u.idUser === service.providerId);
  }
  /**
   * Getter pour le service.
   * @returns {Service} Le service associé à la carte.
   */
  get service(): Service {
    return this._service;
  }
}
