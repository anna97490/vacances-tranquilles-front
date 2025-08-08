import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.loadReservationDetails();
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
    return new Date(date).toLocaleDateString('fr-FR');
  }

  formatPrice(price: number): string {
    if (!price) return '0';
    return price.toFixed(2);
  }

  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'PENDING': 'En attente',
      'CONFIRMED': 'Confirmée',
      'CANCELLED': 'Annulée',
      'COMPLETED': 'Terminée'
    };
    return statusLabels[status] || status;
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'PENDING': '#f39c12',
      'CONFIRMED': '#27ae60',
      'CANCELLED': '#e74c3c',
      'COMPLETED': '#3498db'
    };
    return statusColors[status] || '#95a5a6';
  }
}
