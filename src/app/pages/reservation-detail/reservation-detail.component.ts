import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { ReservationService } from '../../services/reservation/reservation.service';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.scss'
})
export class ReservationDetailComponent implements OnInit {
  reservation: any = null;
  isLoading = true;
  error: string | null = null;
  isUpdating = false;
  liveMessage = '';
  isProvider = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private authStorage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.determineUserRole();
    this.loadReservationDetails();
  }

  private determineUserRole(): void {
    const role = this.authStorage.getUserRole();
    this.isProvider = role === 'PROVIDER' || role === 'PRESTATAIRE';
  }

  loadReservationDetails(): void {
    const reservationId = this.route.snapshot.paramMap.get('id');

    if (!reservationId) {
      this.error = 'ID de réservation manquant';
      this.isLoading = false;
      return;
    }

    this.reservationService.getReservationById(parseInt(reservationId)).subscribe({
      next: (response) => {
        this.reservation = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des détails:', error);
        this.error = 'Erreur lors du chargement des détails de la réservation';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/reservations']);
  }

  formatDate(date: string): string {
    if (!date) return '';
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('fr-FR');
    }
    const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
      return d.toLocaleDateString('fr-FR');
    }
    return date;
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toFixed(2);
  }

  formatTime(time: string): string {
    if (!time) return '';
    const match = time.match(/^(\d{2}:\d{2})/);
    return match ? match[1] : time;
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'IN_PROGRESS': 'En cours',
      'CANCELLED': 'Annulée',
      'CLOSED': 'Clôturée'
    };
    return statusLabels[status] || status;
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'PENDING': '#f39c12',
      'IN_PROGRESS': '#27ae60',
      'CANCELLED': '#e74c3c',
      'CLOSED': '#3498db'
    };
    return statusColors[status] || '#95a5a6';
  }

  updateStatus(newStatus: 'IN_PROGRESS' | 'CANCELLED' | 'CLOSED'): void {
    if (!this.isProvider) {
      this.error = 'Seuls les prestataires peuvent modifier le statut des réservations';
      return;
    }
    if (!this.reservation || !this.reservation.id) {
      return;
    }
    this.isUpdating = true;
    this.error = null;
    this.reservationService
      .updateReservationStatus(this.reservation.id, { status: newStatus })
      .subscribe({
        next: (updated) => {
          this.reservation = updated;
          this.isUpdating = false;
          this.liveMessage = `Statut mis à jour: ${this.getStatusLabel(updated.status)}`;
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour du statut:', err);
          this.error = "Impossible de mettre à jour le statut de la réservation.";
          this.isUpdating = false;
        },
      });
  }
}
