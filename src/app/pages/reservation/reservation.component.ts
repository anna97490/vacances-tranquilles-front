import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { mapStatusColor, mapStatusLabel } from '../../models/reservation-status';
import { take } from 'rxjs/operators';
import { ReservationService, ReservationResponseDTO, UpdateReservationStatusDTO } from '../../services/reservation/reservation.service';
import { ConversationsService } from '../../services/conversation/conversations.service';

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

  constructor(
    private reservationService: ReservationService,
    private conversationsService: ConversationsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.determineUserRole();
  }

  private determineUserRole(): void {
    // Pour l'instant, on simule un prestataire
    this.isProvider = true;
  }

    loadReservations(): void {
    this.isLoading = true;
    this.error = '';

    this.reservationService.getAllReservations()
      .pipe(take(1))
      .subscribe({
        next: (data: Reservation[]) => {
          this.reservations = data;
          this.isLoading = false;

          console.log('📋 RÉSERVATIONS CHARGÉES:', data);
          console.log('📊 NOMBRE DE RÉSERVATIONS:', data.length);

          // Log détaillé de chaque réservation
          data.forEach((reservation, index) => {
            console.log(`📋 RÉSERVATION ${index + 1}:`, {
              id: reservation.id,
              status: reservation.status,
              clientId: reservation.clientId,
              clientName: reservation.clientName,
              providerId: reservation.providerId,
              providerName: reservation.providerName,
              conversationId: reservation.conversationId,
              reservationDate: reservation.reservationDate,
              startDate: reservation.startDate,
              endDate: reservation.endDate,
              totalPrice: reservation.totalPrice,
              serviceName: reservation.serviceName,
              propertyName: reservation.propertyName,
              comments: reservation.comments,
              services: reservation.services,
              createdAt: reservation.createdAt,
              updatedAt: reservation.updatedAt
            });
          });
        },
        error: (err: any) => {
          this.error = 'Erreur lors du chargement des réservations';
          this.isLoading = false;
          console.error('❌ Erreur chargement réservations:', err);
        }
      });
  }

  selectReservation(reservation: Reservation): void {
    this.selectedReservation = reservation;
  }

  closeReservationDetails(): void {
    this.selectedReservation = null;
  }

  onCardKeydown(event: KeyboardEvent, reservation: Reservation): void {
    const key = event.key;
    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      this.selectReservation(reservation);
    }
  }

  viewReservationDetails(reservation: Reservation): void {
    this.router.navigate(['/reservations', reservation.id]);
  }

  updateReservationStatus(reservationId: number, newStatus: string): void {
    if (!this.isProvider) {
      alert('Seuls les prestataires peuvent modifier le statut des réservations');
      return;
    }

    const updateRequest: UpdateReservationStatusDTO = { status: newStatus };

    this.reservationService.updateReservationStatus(reservationId, updateRequest)
      .subscribe({
        next: (updatedReservation: Reservation) => {
          // Mettre à jour la réservation dans la liste
          const index = this.reservations.findIndex(r => r.id === reservationId);
          if (index !== -1) {
            this.reservations[index] = updatedReservation;
          }

          // Mettre à jour la réservation sélectionnée si c'est la même
          if (this.selectedReservation?.id === reservationId) {
            this.selectedReservation = updatedReservation;
          }

          alert('Statut mis à jour avec succès');
          this.liveMessage = `Statut mis à jour: ${this.getStatusLabel(updatedReservation.status)}`;
        },
        error: (err: any) => {
          alert('Erreur lors de la mise à jour du statut');
          console.error('Erreur mise à jour statut:', err);
        }
      });
  }

  getStatusColor(status: string): string {
    // Adapter à la charte couleur de la liste (proches du détail)
    const color = mapStatusColor(status);
    if (color === '#95a5a6') return '#6C757D';
    return color;
  }

  getStatusLabel(status: string): string {
    return mapStatusLabel(status);
  }

  canUpdateStatus(reservation: Reservation): boolean {
    if (!this.isProvider) return false;

    // Logique pour déterminer si le statut peut être modifié
    switch (reservation.status) {
      case 'PENDING':
        return true; // Peut passer à IN_PROGRESS ou CANCELLED
      case 'IN_PROGRESS':
        return true; // Peut passer à CLOSED
      case 'CLOSED':
      case 'CANCELLED':
        return false; // Statuts finaux
      default:
        return false;
    }
  }

  getAvailableStatuses(reservation: Reservation): string[] {
    if (!this.isProvider) return [];

    switch (reservation.status) {
      case 'PENDING':
        return ['IN_PROGRESS', 'CANCELLED'];
      case 'IN_PROGRESS':
        return ['CLOSED'];
      default:
        return [];
    }
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
   * Détermine l'ID de l'autre utilisateur pour créer la conversation
   */
  getOtherUserId(reservation: Reservation): number {
    // Pour l'instant, on simule un utilisateur connecté avec l'ID 53 (client)
    const currentUserId = 53; // À remplacer par le vrai ID de l'utilisateur connecté

    console.log('🔍 Détermination otherUserId:', {
      currentUserId,
      clientId: reservation.clientId,
      providerId: reservation.providerId
    });

    // Si l'utilisateur connecté est le client, l'autre utilisateur est le provider
    if (currentUserId === reservation.clientId) {
      console.log('✅ Utilisateur connecté = CLIENT, otherUserId = providerId');
      return reservation.providerId;
    }

    // Si l'utilisateur connecté est le provider, l'autre utilisateur est le client
    if (currentUserId === reservation.providerId) {
      console.log('✅ Utilisateur connecté = PROVIDER, otherUserId = clientId');
      return reservation.clientId;
    }

    // Si l'utilisateur connecté n'est ni le client ni le provider, erreur
    console.error('❌ Utilisateur connecté n\'est ni le client ni le provider de cette réservation');
    throw new Error('Utilisateur non autorisé pour cette réservation');
  }

      /**
   * Crée une nouvelle conversation pour la réservation
   */
  startConversation(reservation: Reservation): void {
    console.log('🔍 DIAGNOSTIC - Tentative de création de conversation:', {
      reservationId: reservation.id,
      isProvider: this.isProvider,
      clientId: reservation.clientId,
      providerId: reservation.providerId,
      status: reservation.status,
      conversationId: reservation.conversationId,
      reservation: reservation
    });

    console.log('📋 DÉTAILS COMPLETS DE LA RÉSERVATION:', {
      id: reservation.id,
      status: reservation.status,
      clientId: reservation.clientId,
      clientName: reservation.clientName,
      providerId: reservation.providerId,
      providerName: reservation.providerName,
      conversationId: reservation.conversationId,
      reservationDate: reservation.reservationDate,
      startDate: reservation.startDate,
      endDate: reservation.endDate,
      totalPrice: reservation.totalPrice,
      serviceName: reservation.serviceName,
      propertyName: reservation.propertyName,
      comments: reservation.comments,
      services: reservation.services,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt
    });

    this.conversationsService.createConversation(reservation.id)
      .pipe(take(1))
      .subscribe({
        next: (conversation) => {
          console.log('Conversation créée avec succès:', conversation);

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
          console.error('Erreur lors de la création de la conversation:', error);
          console.error('Détails de l\'erreur:', {
            status: error.status,
            message: error.message,
            error: error.error
          });

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
