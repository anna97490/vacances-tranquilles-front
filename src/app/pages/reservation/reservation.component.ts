import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { mapStatusColor, mapStatusLabel } from '../../models/reservation-status';
import { take } from 'rxjs/operators';
import { ReservationService, ReservationResponseDTO, UpdateReservationStatusDTO } from '../../services/reservation/reservation.service';
import { ConversationsService } from '../../services/conversation/conversations.service';
import { ReviewService } from '../../services/review/review.service';
import { AuthStorageService } from '../../services/login/auth-storage.service';

// Utilise les interfaces du service
type Reservation = ReservationResponseDTO;

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  selectedReservation: Reservation | null = null;
  isLoading = false;
  error = '';
  isProvider = false; // À déterminer selon le rôle de l'utilisateur
  liveMessage = '';
  currentUserId: number | null = null;
  reservationReviews: { [reservationId: number]: boolean } = {};

  constructor(
    private reservationService: ReservationService,
    private conversationsService: ConversationsService,
    private reviewService: ReviewService,
    private authStorageService: AuthStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.determineUserRole();
    this.getCurrentUserId();
  }

  private determineUserRole(): void {
    const userRole = this.authStorageService.getUserRole();
    this.isProvider = userRole === 'PROVIDER';
  }

  private getCurrentUserId(): void {
    this.currentUserId = this.authStorageService.getUserId();
  }

    loadReservations(): void {
    this.isLoading = true;
    this.error = '';

    this.reservationService.getAllReservations()
      .pipe(take(1))
      .subscribe({
        next: (data: Reservation[]) => {
          this.reservations = data;
          this.loadReviewsForReservations();
          this.isLoading = false;
        },
        error: (err: any) => {
          this.error = 'Erreur lors du chargement des réservations';
          this.isLoading = false;
        }
      });
  }

  /**
   * Charge les informations de review pour toutes les réservations
   */
  private loadReviewsForReservations(): void {
    this.reservations.forEach(reservation => {
      this.reviewService.hasReviewForReservation(reservation.id)
        .pipe(take(1))
        .subscribe({
          next: (hasReview: boolean) => {
            this.reservationReviews[reservation.id] = hasReview;
          },
          error: (err: any) => {
            this.reservationReviews[reservation.id] = false;
          }
        });
    });
  }

  selectReservation(reservation: Reservation): void {
    this.selectedReservation = reservation;
  }

  getStatusLabel(status: string): string {
    return mapStatusLabel(status);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  /**
   * Vérifie si le bouton "Commencer une conversation" doit être affiché
   */
  shouldShowConversationButton(reservation: Reservation): boolean {
    return reservation.status === 'IN_PROGRESS' && !reservation.conversationId;
  }

  /**
   * Vérifie si le bouton "Noter le prestataire" doit être affiché
   */
  shouldShowReviewButton(reservation: Reservation): boolean {
    // Vérifie que l'utilisateur connecté est le client
    if (!this.currentUserId) {
      return false;
    }

    if (this.currentUserId !== reservation.clientId) {
      return false;
    }

    // Vérifie que la réservation est fermée
    if (reservation.status !== 'CLOSED') {
      return false;
    }

    // Vérifie qu'aucune review n'existe pour cette réservation
    const hasReview = this.reservationReviews[reservation.id];

    const shouldShow = !hasReview;
    return shouldShow;
  }

  /**
   * Navigue vers la page de review avec les paramètres de la réservation
   */
  goToReview(reservation: Reservation): void {
    // Stocke les informations de la réservation pour la page de review
    localStorage.setItem('reviewReservationId', reservation.id.toString());
    localStorage.setItem('reviewProviderId', reservation.providerId.toString());
    localStorage.setItem('reviewServiceName', reservation.serviceName);

    this.router.navigate(['/review']);
  }

      /**
   * Crée une nouvelle conversation pour la réservation
   */
  startConversation(reservation: Reservation): void {

    this.conversationsService.createConversation(reservation.id)
      .pipe(take(1))
      .subscribe({
        next: (conversation) => {

          // Mettre à jour la réservation avec l'ID de la conversation
          reservation.conversationId = conversation.id;

          // Afficher un message de succès
          this.liveMessage = 'Conversation créée avec succès';

          // Naviguer vers la page de messagerie pour voir la conversation créée
          setTimeout(() => {
            this.router.navigate(['/messaging']);
          }, 1500); // 1.5 secondes de délai pour voir le message de succès
        },
        error: (error) => {

          // Afficher un message d'erreur plus détaillé
          if (error.status === 0) {
            this.error = 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré.';
          } else if (error.status === 400) {
            this.error = `Erreur de validation: ${error.error?.message || error.message}`;
          } else if (error.status === 403) {
            this.error = 'Vous n\'êtes pas autorisé à créer cette conversation.';
          } else if (error.status === 404) {
            this.error = 'Réservation ou utilisateur non trouvé.';
          } else {
            this.error = `Erreur lors de la création de la conversation: ${error.error?.message || error.message}`;
          }
        }
      });
  }
}
