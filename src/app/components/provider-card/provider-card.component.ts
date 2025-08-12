import { Component, Input, OnChanges, SimpleChanges, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../../models/User';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { Service } from '../../models/Service';
import { RatingStarsComponent } from '../shared/rating-stars/rating-stars.component';
import { PaymentService } from '../../services/payment/payment.service';
import { EnvService } from '../../services/env/env.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * Composant carte prestataire (affichage d'un User de rôle PROVIDER)
 * @example <app-provider-card [user]="user"></app-provider-card>
 */
@Component({
  selector: 'app-provider-card',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule, 
    MatDividerModule, 
    RatingStarsComponent
  ],
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

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvService,
    private readonly authStorage: AuthStorageService,
    private readonly injector: Injector,
    private readonly router: Router
  ) {}

  private get paymentService(): PaymentService {
    return this.injector.get(PaymentService);
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



  /**
   * Calcule la durée en heures à partir des heures de début et fin
   */
  calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  }

  /**
   * Calcule le prix total à partir des heures de début et fin
   */
  calculateTotalPrice(startTime: string, endTime: string): number {
    const duration = this.calculateDuration(startTime, endTime);
    const pricePerHour = this.service?.price || 0;
    return duration * pricePerHour;
  }



  /**
   * Crée une session de paiement Stripe et redirige vers le checkout
   */
  async createCheckoutSession(): Promise<void> {
    if (!this.service || !this.providerInfo) {
      console.error('Service ou prestataire non défini');
      return;
    }

    // Récupérer l'ID du client connecté depuis le service d'authentification
    const customerId = this.authStorage.getUserId();
    
    if (!customerId) {
      console.error('Utilisateur non connecté');
      return;
    }

    let providerId: number | null = null;
    if (this.providerInfo?.idUser) {
      providerId = Number(this.providerInfo.idUser);
    } else if (this.service.providerId) {
      providerId = Number(this.service.providerId);
    }

    // Récupérer les critères de recherche depuis le localStorage
    const searchCriteriaStr = localStorage.getItem('searchCriteria');
    if (!searchCriteriaStr) {
      console.error('Aucun critère de recherche trouvé. Veuillez effectuer une recherche d\'abord.');
      return;
    }

    const searchCriteria = JSON.parse(searchCriteriaStr);
    const { date, startTime, endTime } = searchCriteria;

    // Vérifier que les données de recherche sont présentes
    if (!date || !startTime || !endTime) {
      console.error('Critères de recherche incomplets');
      return;
    }

    const payload = {
      serviceId: Number(this.service.id),
      customerId: Number(customerId),
      providerId: providerId,
      date: date,                             // Date de recherche
      startTime: startTime,                   // Heure de début de recherche
      endTime: endTime,                       // Heure de fin de recherche
      duration: this.calculateDuration(startTime, endTime), // Durée calculée
      totalPrice: this.calculateTotalPrice(startTime, endTime) // Prix total calculé
    };

    console.log('Payload envoyé:', payload);

    try {
      const token = this.authStorage.getToken();
      
      if (!token) {
        console.error('Token d\'authentification non trouvé');
        return;
      }
      
      const headers = { 'Authorization': `Bearer ${token}` };

      const response = await firstValueFrom(
        this.http.post<{ [key: string]: string }>(
          `${this.envService.apiUrl}/stripe/create-checkout-session`,
          payload,
          { headers }
        )
      );

      const sessionId = response['sessionId'];
      if (sessionId) {
        await this.paymentService.redirectToStripe(sessionId);
      } else {
        console.error('Session ID non reçu');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la session de paiement:', error);
    }
  }

  /**
   * Navigue vers la page de profil de l'utilisateur affiché
   */
  navigateToProfile(): void {
    let userId: number | undefined;
    
    if (this.user?.idUser) {
      userId = this.user.idUser;
    } else if (this.service?.providerId) {
      userId = this.service.providerId;
    }
    
    if (userId) {
      // Stocker l'ID de l'utilisateur à afficher dans le localStorage
      // pour que la page de profil puisse le récupérer
      localStorage.setItem('displayedUserId', userId.toString());
      this.router.navigate(['/profile']);
    } else {
      console.error('Impossible de naviguer: aucun ID utilisateur disponible');
    }
  }
}
