import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';

export interface ReservationDetail {
  id: string;
  date: string;
  time: string;
  clientName: string;
  location: string;
  serviceDescription: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

export type ReservationAction = 'cancel' | 'validate';

@Component({
  selector: 'app-reservation-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './reservation-detail.component.html',
  styleUrl: './reservation-detail.component.scss'
})
export class ReservationDetailComponent implements OnInit, OnDestroy {
  @Input() reservation: ReservationDetail | null = null;
  @Input() showActions: boolean = true;
  @Input() readonly: boolean = false;
  
  @Output() actionClicked = new EventEmitter<{ action: ReservationAction; reservation: ReservationDetail }>();
  @Output() reservationLoaded = new EventEmitter<ReservationDetail>();

  testReservation: ReservationDetail = {
      id: 'RES12345',
      date: '2024-06-15',
      time: '14:30',
      clientName: 'Jean Dupont',
      location: 'Paris, 12 rue de la Paix',
      serviceDescription: 'Nettoyage complet',
      status: 'PENDING'
  };
  private readonly destroy$ = new Subject<void>();

  // Properties for template binding
  statusConfig: { [key: string]: { label: string; color: string; icon: string } } = {
    'PENDING': { label: 'En attente', color: 'warn', icon: 'schedule' },
    'CONFIRMED': { label: 'Confirmé', color: 'primary', icon: 'check_circle' },
    'CANCELLED': { label: 'Annulé', color: 'accent', icon: 'cancel' },
    'COMPLETED': { label: 'Terminé', color: 'primary', icon: 'done_all' }
  };

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise le composant et émet l'événement de chargement
   */
  private initializeComponent(): void {
    if (this.reservation) {
      this.reservationLoaded.emit(this.reservation);
    } else {
        // Mock de réservation pour le comportement de la page
        // Si aucune réservation n'est fournie, on peut émettre une réservation de test
        this.reservation = this.testReservation;
        this.reservationLoaded.emit(this.reservation);
    }
  }

  /**
   * Formate la date pour l'affichage
   */
  getFormattedDate(dateString: string): string {
    if (!dateString || dateString === '00/00/00') {
      return 'Date non définie';
    }
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Retourne la chaîne originale si pas valide
      }
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  }

  /**
   * Formate l'heure pour l'affichage
   */
  getFormattedTime(timeString: string): string {
    if (!timeString || timeString === '00h00') {
      return 'Heure non définie';
    }
    
    // Si déjà au bon format (XXhXX)
    if (/^\d{2}h\d{2}$/.test(timeString)) {
      return timeString;
    }
    
    // Si au format HH:MM
    if (/^\d{2}:\d{2}$/.test(timeString)) {
      return timeString.replace(':', 'h');
    }
    
    return timeString;
  }

  /**
   * Retourne la configuration du statut
   */
  getStatusConfig(status: string) {
    return this.statusConfig[status] || { 
      label: status, 
      color: 'primary', 
      icon: 'info' 
    };
  }

  /**
   * Vérifie si une action est autorisée selon le statut
   */
  isActionAllowed(action: ReservationAction): boolean {
    if (this.readonly || !this.reservation) {
      return false;
    }

    switch (action) {
      case 'cancel':
        return this.reservation.status === 'PENDING' || this.reservation.status === 'CONFIRMED';
      case 'validate':
        return this.reservation.status === 'PENDING';
      default:
        return false;
    }
  }

  /**
   * Gère le clic sur une action
   */
  onActionClick(action: ReservationAction): void {
    if (!this.reservation || !this.isActionAllowed(action)) {
      return;
    }

    this.actionClicked.emit({
      action,
      reservation: this.reservation
    });
  }

  /**
   * Retourne l'icône d'action appropriée
   */
  getActionIcon(action: ReservationAction): string {
    switch (action) {
      case 'cancel':
        return 'cancel';
      case 'validate':
        return 'check';
      default:
        return 'action';
    }
  }

  /**
   * Retourne le libellé d'action approprié
   */
  getActionLabel(action: ReservationAction): string {
    switch (action) {
      case 'cancel':
        return 'Annuler';
      case 'validate':
        return 'Valider';
      default:
        return 'Action';
    }
  }

  /**
   * Retourne la couleur d'action appropriée
   */
  getActionColor(action: ReservationAction): string {
    switch (action) {
      case 'cancel':
        return 'warn';
      case 'validate':
        return 'primary';
      default:
        return 'primary';
    }
  }

  /**
   * Vérifie si la réservation a des données valides
   */
  hasValidReservation(): boolean {
    return !!(this.reservation?.id && this.reservation?.clientName);
  }

  /**
   * Retourne un tooltip informatif pour les actions désactivées
   */
  getActionTooltip(action: ReservationAction): string {
    if (!this.reservation) {
      return 'Aucune réservation sélectionnée';
    }
    
    if (this.readonly) {
      return 'Mode lecture seule';
    }

    if (!this.isActionAllowed(action)) {
      switch (action) {
        case 'cancel':
          return 'Impossible d\'annuler une réservation avec ce statut';
        case 'validate':
          return 'Impossible de valider une réservation avec ce statut';
        default:
          return 'Action non autorisée';
      }
    }

    return '';
  }
}