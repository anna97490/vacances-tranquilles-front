import { Component, Input } from '@angular/core';
import { User } from '../../models/User';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Service } from '../../models/Service';
import { RatingStarsComponent } from '../shared/rating-stars/rating-stars.component';
import { OnChanges, SimpleChanges } from '@angular/core';
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
export class ProviderCardComponent implements OnChanges {

  /**
   * Prestataire (User) correspondant au service affiché.
   * @type {User | undefined}
   */
  public user?: User;

  /**
   * Service à afficher dans la carte.
   * @type {Service}
   */
  private _service?: Service;

  @Input()
  /**
   * Setter pour le service.
   * Met à jour le service et utilise les données mockées par défaut.
   */
  set service(service: Service) {
    this._service = service;
  }

  /**
   * Getter pour le service.
   * @returns {Service} Le service associé à la carte.
   */
  get service(): Service | undefined {
    return this._service;
  }

  /**
   * Informations du prestataire fournies directement
   * @type {User | undefined}
   */
  private _providerInfo?: User;

  @Input()
  /**
   * Setter pour les informations du prestataire.
   * Met à jour les informations du prestataire.
   */
  set providerInfo(providerInfo: User | undefined) {
    this._providerInfo = providerInfo;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this._service && this._providerInfo) {
      this.user = this._providerInfo;
    }
  }

  /**
   * Getter pour les informations du prestataire.
   * @returns {User | undefined} Les informations du prestataire.
   */
  get providerInfo(): User | undefined {
    return this._providerInfo;
  }
}
