import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { EnvService } from '../../services/env/env.service';
import { finalize, take } from 'rxjs/operators';

/**
 * Composant pour afficher la page de succès après un paiement Stripe.
 * Ce composant confirme automatiquement la réservation en utilisant
 * l'ID de session Stripe reçu en paramètre de requête.
 */
@Component({
  selector: 'app-success',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {
  /** Service pour accéder aux paramètres de route */
  private readonly route = inject(ActivatedRoute);
  /** Service pour la navigation */
  private readonly router = inject(Router);
  /** Service HTTP pour les requêtes API */
  private readonly http = inject(HttpClient);
  /** Service pour récupérer les variables d'environnement */
  private readonly envService = inject(EnvService);

  /** Message à afficher à l'utilisateur */
  message = '';
  /** Type de message : succès ou erreur */
  messageType: 'success' | 'error' = 'success';
  /** Indicateur de chargement */
  isLoading = true;

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (!sessionId) {
      this.isLoading = false;
      this.messageType = 'error';
      this.message = 'Paramètre de session manquant.';
      return;
    }
    this.confirmReservation(sessionId);
  }

  /**
   * Confirme la réservation en envoyant l'ID de session Stripe au serveur.
   * Met à jour le message et le type selon le résultat de la confirmation.
   * @param sessionId - L'identifiant de session Stripe à confirmer
   * @private
   */
  private confirmReservation(sessionId: string): void {
    this.http.post(`${this.envService.apiUrl}/stripe/confirm-reservation`, { sessionId })
      .pipe(finalize(() => (this.isLoading = false)), take(1))
      .subscribe({
        next: () => {
          this.messageType = 'success';
          this.message = 'Réservation confirmée !';
        },
        error: (error) => {
          console.error('Erreur lors de la confirmation:', error);
          this.messageType = 'error';
          this.message = 'Une erreur est survenue lors de la confirmation.';
        }
      });
  }

  /**
   * Navigue vers la page des réservations.
   * Permet à l'utilisateur de consulter ses réservations après la confirmation.
   */
  goToReservations(): void {
    this.router.navigate(['/reservations']);
  }
}
