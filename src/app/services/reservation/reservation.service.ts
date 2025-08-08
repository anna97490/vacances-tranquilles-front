// Service pour la gestion des réservations
import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';

// Interfaces pour les données de réservation
export interface ReservationDTO {
  startDate: string;
  endDate: string;
  propertyId: number;
  services: string[];
  comments?: string;
}

export interface ReservationResponseDTO {
  id: number;
  reservationDate: string;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'CLOSED' | 'CANCELLED';
  totalPrice: number;

  // Informations sur les utilisateurs
  clientId: number;
  clientName: string;
  clientEmail: string;
  providerId: number;
  providerName: string;
  providerEmail: string;

  // Informations sur le service
  serviceId: number;
  serviceName: string;
  serviceDescription: string;

  // Informations sur le paiement
  paymentId?: number;
  paymentStatus?: string;

  // Champs additionnels pour l'affichage
  propertyName: string;
  propertyAddress?: string;
  comments?: string;
  services: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
}

export interface UpdateReservationStatusDTO {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {}

  /**
   * Récupère toutes les réservations de l'utilisateur authentifié
   * @returns Observable contenant la liste des réservations
   */
  getAllReservations(): Observable<ReservationResponseDTO[]> {
    const apiUrl = this.configService.apiUrl;
    const url = `${apiUrl}/reservations`;
    console.log('🌐 Appel API - URL:', url);
    console.log('🔧 API URL configurée:', apiUrl);
    return this.http.get<ReservationResponseDTO[]>(url);
  }

  /**
   * Récupère une réservation spécifique par son ID
   * @param id L'identifiant de la réservation
   * @returns Observable contenant la réservation
   */
  getReservationById(id: number): Observable<ReservationResponseDTO> {
    const apiUrl = this.configService.apiUrl;
    return this.http.get<ReservationResponseDTO>(`${apiUrl}/reservations/${id}`);
  }

  /**
   * Crée une nouvelle réservation
   * @param reservationData Les données de la réservation à créer
   * @returns Observable contenant la réservation créée
   */
  createReservation(reservationData: ReservationDTO): Observable<ReservationResponseDTO> {
    const apiUrl = this.configService.apiUrl;
    return this.http.post<ReservationResponseDTO>(`${apiUrl}/reservations`, reservationData);
  }

  /**
   * Met à jour le statut d'une réservation (pour les prestataires)
   * @param id L'identifiant de la réservation
   * @param statusData Les données de mise à jour du statut
   * @returns Observable contenant la réservation mise à jour
   */
  updateReservationStatus(id: number, statusData: UpdateReservationStatusDTO): Observable<ReservationResponseDTO> {
    const apiUrl = this.configService.apiUrl;
    return this.http.patch<ReservationResponseDTO>(`${apiUrl}/reservations/${id}/status`, statusData);
  }

  /**
   * Supprime une réservation (si autorisé)
   * @param id L'identifiant de la réservation à supprimer
   * @returns Observable de la réponse HTTP
   */
  deleteReservation(id: number): Observable<HttpResponse<any>> {
    const apiUrl = this.configService.apiUrl;
    return this.http.delete(`${apiUrl}/reservations/${id}`, { observe: 'response' });
  }

  /**
   * Récupère les réservations avec filtres optionnels
   * @param filters Objet contenant les filtres (statut, dates, etc.)
   * @returns Observable contenant la liste filtrée des réservations
   */
  getReservationsWithFilters(filters: {
    status?: string;
    startDate?: string;
    endDate?: string;
    propertyId?: number;
  }): Observable<ReservationResponseDTO[]> {
    const apiUrl = this.configService.apiUrl;
    const params = new URLSearchParams();

    if (filters.status) params.append('status', filters.status);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.propertyId) params.append('propertyId', filters.propertyId.toString());

    const queryString = params.toString();
    const url = queryString ? `${apiUrl}/reservations?${queryString}` : `${apiUrl}/reservations`;

    return this.http.get<ReservationResponseDTO[]>(url);
  }

  /**
   * Récupère les statistiques des réservations
   * @returns Observable contenant les statistiques
   */
  getReservationStats(): Observable<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  }> {
    const apiUrl = this.configService.apiUrl;
    return this.http.get<{
      total: number;
      pending: number;
      inProgress: number;
      completed: number;
      cancelled: number;
    }>(`${apiUrl}/reservations/stats`);
  }
}
