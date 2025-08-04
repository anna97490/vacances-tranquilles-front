import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipListboxChange } from '@angular/material/chips';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { ReservationService } from '../../services/reservation.service';
import { Reservation, ReservationFilters, PaginationInfo } from '../../services/interfaces/reservation.interface';

/**
 * Composant pour afficher la liste des réservations
 */
@Component({
  selector: 'app-reservation-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatPaginatorModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.scss']
})
export class ReservationListComponent implements OnInit, OnDestroy {
  reservations: Reservation[] = [];
  pagination: PaginationInfo = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  };
  
  loading = false;
  searchControl = new FormControl('');
  currentFilters: ReservationFilters = {};
  currentSort: 'date' | 'price' | 'status' = 'date';
  currentSortOrder: 'asc' | 'desc' = 'desc';
  
  private destroy$ = new Subject<void>();

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.loadReservations();
    this.setupSearchListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Configure l'écouteur pour la recherche avec debounce
   */
  private setupSearchListener(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.currentFilters.search = searchTerm || undefined;
        this.loadReservations();
      });
  }

  /**
   * Charge les réservations avec les filtres actuels
   */
  loadReservations(): void {
    this.loading = true;
    
    const filters: ReservationFilters = {
      ...this.currentFilters,
      sortBy: this.currentSort,
      sortOrder: this.currentSortOrder
    };

    this.reservationService.getReservations(filters, this.pagination.currentPage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.reservations = response.reservations;
          this.pagination = response.pagination;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des réservations:', error);
          this.loading = false;
        }
      });
  }

  /**
   * Gère le changement de page
   */
  onPageChange(event: PageEvent): void {
    this.pagination.currentPage = event.pageIndex + 1;
    this.pagination.itemsPerPage = event.pageSize;
    this.loadReservations();
  }

  /**
   * Gère le changement de filtre par statut
   */
  onStatusFilterChange(event: MatChipListboxChange): void {
    const selectedValue = event.value;
    if (selectedValue && selectedValue.length > 0) {
      this.currentFilters.status = selectedValue[0];
    } else {
      delete this.currentFilters.status;
    }
    this.pagination.currentPage = 1;
    this.loadReservations();
  }

  /**
   * Gère le changement de tri
   */
  onSortChange(sortBy: 'date' | 'price' | 'status'): void {
    if (this.currentSort === sortBy) {
      this.currentSortOrder = this.currentSortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.currentSort = sortBy;
      this.currentSortOrder = 'desc';
    }
    this.pagination.currentPage = 1;
    this.loadReservations();
  }

  /**
   * Formate le statut pour l'affichage
   */
  getStatusDisplay(status: string): string {
    const statusMap: { [key: string]: string } = {
      'CONFIRMEE': 'Confirmée',
      'EN_ATTENTE': 'En attente',
      'ANNULEE': 'Annulée',
      'TERMINEE': 'Terminée'
    };
    return statusMap[status] || status;
  }

  /**
   * Retourne la classe CSS pour le statut
   */
  getStatusClass(status: string): string {
    const statusClassMap: { [key: string]: string } = {
      'CONFIRMEE': 'status-confirmed',
      'EN_ATTENTE': 'status-pending',
      'ANNULEE': 'status-cancelled',
      'TERMINEE': 'status-completed'
    };
    return statusClassMap[status] || 'status-default';
  }

  /**
   * Formate la date pour l'affichage
   */
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * Formate le prix pour l'affichage
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  }

  /**
   * Retourne le nom complet de l'utilisateur
   */
  getFullName(user?: { firstName: string; lastName: string }): string {
    if (!user) return 'Utilisateur inconnu';
    return `${user.firstName} ${user.lastName}`;
  }

  /**
   * Retourne l'icône de tri
   */
  getSortIcon(sortBy: 'date' | 'price' | 'status'): string {
    if (this.currentSort !== sortBy) return '';
    return this.currentSortOrder === 'asc' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }
} 