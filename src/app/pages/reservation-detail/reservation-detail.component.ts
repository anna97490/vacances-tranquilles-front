
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuthStorageService } from '../../services/login/auth-storage.service';
import { ReservationService, ReservationResponseDTO } from '../../services/reservation/reservation.service';
import { mapStatusColor, mapStatusLabel } from '../../models/reservation-status';
import { take } from 'rxjs/operators';

/**
 * Composant pour afficher les détails d'une réservation spécifique.
 * Permet de visualiser toutes les informations d'une réservation et de mettre à jour son statut.
 */
@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.scss'
})
export class ReservationDetailComponent implements OnInit {
  /** La réservation à afficher */
  reservation: ReservationResponseDTO | null = null;
  /** Indique si les données sont en cours de chargement */
  isLoading = true;
  /** Message d'erreur éventuel */
  error: string | null = null;
  /** Indique si une mise à jour de statut est en cours */
  isUpdating = false;
  /** Message de confirmation pour l'utilisateur */
  liveMessage = '';
  /** Indique si l'utilisateur connecté est un prestataire */
  isProvider = false;

  /**
   * Constructeur du composant.
   * @param route - Service pour accéder aux paramètres de route
   * @param router - Service de navigation
   * @param reservationService - Service pour gérer les réservations
   * @param authStorage - Service pour accéder aux informations d'authentification
   */
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private authStorage: AuthStorageService
  ) {}

  /**
   * Initialise le composant en déterminant le rôle de l'utilisateur et en chargeant les détails de la réservation.
   */
  ngOnInit(): void {
    this.determineUserRole();
    this.loadReservationDetails();
  }

  /**
   * Détermine le rôle de l'utilisateur connecté (client ou prestataire).
   * Met à jour la propriété isProvider en conséquence.
   */
  private determineUserRole(): void {
    const role = this.authStorage.getUserRole();
    this.isProvider = role === 'PROVIDER' || role === 'PRESTATAIRE';
  }

  /**
   * Charge les détails de la réservation à partir de l'ID dans l'URL.
   * Affiche une erreur si l'ID est manquant ou si le chargement échoue.
   */
  loadReservationDetails(): void {
    const reservationId = this.route.snapshot.paramMap.get('id');

    if (!reservationId) {
      this.error = 'ID de réservation manquant';
      this.isLoading = false;
      return;
    }

    this.reservationService.getReservationById(parseInt(reservationId)).pipe(take(1)).subscribe({
      next: (response) => {
        this.reservation = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Erreur lors du chargement des détails de la réservation';
        this.isLoading = false;
      }
    });
  }

  /**
   * Navigue vers la page de liste des réservations.
   */
  goBack(): void {
    this.router.navigate(['/reservations']);
  }

  /**
   * Formate une date au format français.
   * @param date - La date à formater (format ISO ou YYYY-MM-DD)
   * @returns La date formatée au format français (DD/MM/YYYY)
   */
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

  /**
   * Formate un prix au format français avec le symbole euro.
   * @param price - Le prix à formater
   * @returns Le prix formaté avec le symbole euro (ex: "120,00 €")
   */
  formatPrice(price: number | null | undefined): string {
    if (price === null || price === undefined || price === 0) {
      return '0,00 €';
    }

    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  /**
   * Formate une heure au format français (HH:MM).
   * @param time - L'heure à formater (format LocalDateTime ou LocalTime)
   * @returns L'heure formatée (HH:MM)
   */
  formatTime(time: string): string {
    if (!time) return '';

    // Si c'est un format LocalDateTime complet (ex: 2024-01-15T22:29:02)
    if (time.includes('T')) {
      const date = new Date(time);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }

    // Si c'est un format LocalTime (ex: 22:29:02)
    const match = time.match(/^(\d{2}):(\d{2})/);
    if (match) {
      return `${match[1]}:${match[2]}`;
    }

    // Fallback: retourner la valeur originale
    return time;
  }

  /**
   * Retourne le libellé traduit d'un statut de réservation.
   * @param status - Le statut à traduire
   * @returns Le libellé traduit du statut
   */
  getStatusLabel(status: string): string {
    return mapStatusLabel(status);
  }

  /**
   * Retourne la couleur associée à un statut de réservation.
   * @param status - Le statut pour lequel obtenir la couleur
   * @returns Le code couleur hexadécimal
   */
  getStatusColor(status: string): string {
    return mapStatusColor(status);
  }

  /**
   * Met à jour le statut d'une réservation.
   * Seuls les prestataires peuvent modifier le statut des réservations.
   * @param newStatus - Le nouveau statut à appliquer
   */
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
      .pipe(take(1))
      .subscribe({
        next: (updated) => {
          this.reservation = updated;
          this.isUpdating = false;
          this.liveMessage = `Statut mis à jour: ${this.getStatusLabel(updated.status)}`;
        },
        error: (err) => {
          this.error = "Impossible de mettre à jour le statut de la réservation.";
          this.isUpdating = false;
        },
      });
  }
}
