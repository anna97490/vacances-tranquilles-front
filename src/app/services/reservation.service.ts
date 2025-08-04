import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Reservation, ReservationFilters, PaginationInfo } from './interfaces/reservation.interface';

/**
 * Service pour gérer les réservations
 */
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly apiUrl = 'http://localhost:8080/api/reservations'; // URL à adapter selon votre configuration

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des réservations avec filtres et pagination
   */
  getReservations(filters?: ReservationFilters, page: number = 1): Observable<{ reservations: Reservation[], pagination: PaginationInfo }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', '10');

    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }
    if (filters?.sortOrder) {
      params = params.set('sortOrder', filters.sortOrder);
    }

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => ({
        reservations: response.content || [],
        pagination: {
          currentPage: response.number + 1,
          totalPages: response.totalPages,
          totalItems: response.totalElements,
          itemsPerPage: response.size
        }
      })),
      catchError(() => {
        // En cas d'erreur, retourner des données de démonstration
        return of(this.getMockReservations(filters, page));
      })
    );
  }

  /**
   * Récupère une réservation par son ID
   */
  getReservationById(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        // En cas d'erreur, retourner une réservation de démonstration
        return of(this.getMockReservation(id));
      })
    );
  }

  /**
   * Crée une nouvelle réservation
   */
  createReservation(reservation: Partial<Reservation>): Observable<Reservation> {
    return this.http.post<Reservation>(this.apiUrl, reservation);
  }

  /**
   * Met à jour une réservation
   */
  updateReservation(id: number, reservation: Partial<Reservation>): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.apiUrl}/${id}`, reservation);
  }

  /**
   * Supprime une réservation
   */
  deleteReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Données de démonstration pour les tests
   */
  private getMockReservations(filters?: ReservationFilters, page: number = 1): { reservations: Reservation[], pagination: PaginationInfo } {
    const mockReservations: Reservation[] = [
      {
        id: 1,
        status: 'CONFIRMEE',
        reservationDate: '2024-01-15T10:00:00',
        comment: 'Réservation pour un séjour en bord de mer',
        startDate: '2024-02-15T14:00:00',
        endDate: '2024-02-20T10:00:00',
        totalPrice: 850.00,
        customerId: 1,
        providerId: 2,
        serviceId: 1,
        customer: {
          id: 1,
          firstName: 'Antoine',
          lastName: 'Bayern',
          email: 'antoine.bayern@email.com',
          userRole: 'PARTICULIER'
        },
        provider: {
          id: 2,
          firstName: 'Marie',
          lastName: 'Dupont',
          email: 'marie.dupont@email.com',
          userRole: 'PRESTATAIRE'
        },
        service: {
          id: 1,
          title: 'Location Villa Bord de Mer',
          description: 'Magnifique villa avec vue sur la mer',
          category: 'Hébergement',
          price: 170.00
        }
      },
      {
        id: 2,
        status: 'EN_ATTENTE',
        reservationDate: '2024-01-14T15:30:00',
        comment: 'Séjour en montagne pour les vacances d\'hiver',
        startDate: '2024-03-01T16:00:00',
        endDate: '2024-03-08T10:00:00',
        totalPrice: 1200.00,
        customerId: 3,
        providerId: 4,
        serviceId: 2,
        customer: {
          id: 3,
          firstName: 'Lucas',
          lastName: 'Martin',
          email: 'lucas.martin@email.com',
          userRole: 'PARTICULIER'
        },
        provider: {
          id: 4,
          firstName: 'Sophie',
          lastName: 'Bernard',
          email: 'sophie.bernard@email.com',
          userRole: 'PRESTATAIRE'
        },
        service: {
          id: 2,
          title: 'Chalet Montagne',
          description: 'Chalet confortable en station de ski',
          category: 'Hébergement',
          price: 150.00
        }
      },
      {
        id: 3,
        status: 'CONFIRMEE',
        reservationDate: '2024-01-13T09:15:00',
        comment: 'Week-end détente en campagne',
        startDate: '2024-02-10T14:00:00',
        endDate: '2024-02-12T11:00:00',
        totalPrice: 450.00,
        customerId: 5,
        providerId: 6,
        serviceId: 3,
        customer: {
          id: 5,
          firstName: 'Emma',
          lastName: 'Rousseau',
          email: 'emma.rousseau@email.com',
          userRole: 'PARTICULIER'
        },
        provider: {
          id: 6,
          firstName: 'Pierre',
          lastName: 'Leroy',
          email: 'pierre.leroy@email.com',
          userRole: 'PRESTATAIRE'
        },
        service: {
          id: 3,
          title: 'Gîte Rural',
          description: 'Gîte authentique au cœur de la campagne',
          category: 'Hébergement',
          price: 90.00
        }
      }
    ];

    // Filtrage des données de démonstration
    let filteredReservations = mockReservations;
    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredReservations = mockReservations.filter(reservation =>
        reservation.customer?.firstName.toLowerCase().includes(searchTerm) ||
        reservation.customer?.lastName.toLowerCase().includes(searchTerm) ||
        reservation.service?.title.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.status) {
      filteredReservations = filteredReservations.filter(reservation =>
        reservation.status === filters.status
      );
    }

    // Tri des données
    if (filters?.sortBy) {
      filteredReservations.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'date':
            aValue = new Date(a.reservationDate);
            bValue = new Date(b.reservationDate);
            break;
          case 'price':
            aValue = a.totalPrice;
            bValue = b.totalPrice;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        } else {
          return aValue > bValue ? 1 : -1;
        }
      });
    }

    return {
      reservations: filteredReservations,
      pagination: {
        currentPage: page,
        totalPages: 5,
        totalItems: filteredReservations.length,
        itemsPerPage: 10
      }
    };
  }

  private getMockReservation(id: number): Reservation {
    return {
      id: id,
      status: 'CONFIRMEE',
      reservationDate: '2024-01-15T10:00:00',
      comment: 'Réservation de démonstration',
      startDate: '2024-02-15T14:00:00',
      endDate: '2024-02-20T10:00:00',
      totalPrice: 850.00,
      customerId: 1,
      providerId: 2,
      serviceId: 1,
      customer: {
        id: 1,
        firstName: 'Antoine',
        lastName: 'Bayern',
        email: 'antoine.bayern@email.com',
        userRole: 'PARTICULIER'
      },
      provider: {
        id: 2,
        firstName: 'Marie',
        lastName: 'Dupont',
        email: 'marie.dupont@email.com',
        userRole: 'PRESTATAIRE'
      },
      service: {
        id: 1,
        title: 'Location Villa Bord de Mer',
        description: 'Magnifique villa avec vue sur la mer',
        category: 'Hébergement',
        price: 170.00
      }
    };
  }
} 