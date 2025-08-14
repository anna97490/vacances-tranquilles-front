import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { mapStatusColor, mapStatusLabel } from '../../models/reservation-status';
import { take } from 'rxjs/operators';
import { ReservationService, ReservationResponseDTO, UpdateReservationStatusDTO } from '../../services/reservation/reservation.service';

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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.determineUserRole();
  }

  private determineUserRole(): void {
    // TODO: Récupérer le rôle de l'utilisateur depuis le service d'authentification
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
        },
        error: (err: any) => {
          this.error = 'Erreur lors du chargement des réservations';
          this.isLoading = false;
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

  formatTime(timeString: string): string {
    if (!timeString) return '';
    // Extrait l'heure et les minutes du format ISO
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }
}
