import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

/**
 * Interface pour la création d'une nouvelle review.
 *
 * @description
 * Cette interface définit la structure des données requises
 * pour créer une nouvelle review dans le système.
 *
 * @property {number} note - La note attribuée (généralement entre 1 et 5)
 * @property {string} commentaire - Le commentaire textuel de la review
 * @property {number} reservationId - L'identifiant de la réservation associée
 * @property {number} reviewerId - L'identifiant de l'utilisateur qui écrit la review
 * @property {number} reviewedId - L'identifiant de l'utilisateur/service évalué
 */
export interface ReviewCreateRequest {
  note: number;
  commentaire: string;
  reservationId: number;
  reviewerId: number;
  reviewedId: number;
}

/**
 * Interface représentant une review complète dans le système.
 *
 * @description
 * Cette interface définit la structure complète d'une review
 * telle qu'elle est stockée et retournée par l'API.
 *
 * @property {number} id - L'identifiant unique de la review
 * @property {number} note - La note attribuée (généralement entre 1 et 5)
 * @property {string} commentaire - Le commentaire textuel de la review
 * @property {number} reservationId - L'identifiant de la réservation associée
 * @property {number} reviewerId - L'identifiant de l'utilisateur qui a écrit la review
 * @property {number} reviewedId - L'identifiant de l'utilisateur/service évalué
 * @property {string} createdAt - La date de création de la review (format ISO)
 */
export interface Review {
  id: number;
  note: number;
  commentaire: string;
  reservationId: number;
  reviewerId: number;
  reviewedId: number;
  createdAt: string;
}

/**
 * Interface représentant une review avec les informations du reviewer.
 *
 * @description
 * Cette interface étend Review en ajoutant les informations
 * du reviewer pour l'affichage dans l'interface utilisateur.
 *
 * @property {number} id - L'identifiant unique de la review
 * @property {number} note - La note attribuée (généralement entre 1 et 5)
 * @property {string} commentaire - Le commentaire textuel de la review
 * @property {number} reservationId - L'identifiant de la réservation associée
 * @property {number} reviewerId - L'identifiant de l'utilisateur qui a écrit la review
 * @property {number} reviewedId - L'identifiant de l'utilisateur/service évalué
 * @property {string} createdAt - La date de création de la review (format ISO)
 * @property {string} reviewerFirstName - Le prénom du reviewer
 */
export interface ReviewWithReviewer {
  id: number;
  note: number;
  commentaire: string;
  reservationId: number;
  reviewerId: number;
  reviewedId: number;
  createdAt: string;
  reviewerFirstName: string;
}

/**
 * Service de gestion des reviews et évaluations.
 */
@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  /**
   * Crée une nouvelle review dans le système.
   *
   * @param {ReviewCreateRequest} review - Les données de la review à créer
   * @returns {Observable<Review>} Un Observable contenant la review créée
   */
  createReview(review: ReviewCreateRequest): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  /**
   * Récupère toutes les reviews disponibles.
   *
   * @returns {Observable<Review[]>} Un Observable contenant la liste de toutes les reviews
   */
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  /**
   * Récupère une review spécifique par son identifiant.
   *
   * @param {number} id - L'identifiant de la review à récupérer
   * @returns {Observable<Review>} Un Observable contenant la review demandée
   */
  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  /**
   * Récupère toutes les reviews d'un fournisseur spécifique.
   *
   * @param {number} providerId - L'identifiant du fournisseur
   * @returns {Observable<Review[]>} Un Observable contenant les reviews du fournisseur
   */
  getReviewsByProviderId(providerId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/provider/${providerId}`);
  }

  /**
   * Récupère les reviews d'un fournisseur avec les informations du reviewer.
   *
   * @param {number} providerId - L'identifiant du fournisseur
   * @returns {Observable<ReviewWithReviewer[]>} Un Observable contenant les reviews avec les infos du reviewer
   */
  getReviewsWithReviewerByProviderId(providerId: number): Observable<ReviewWithReviewer[]> {
    return this.http.get<ReviewWithReviewer[]>(`${this.apiUrl}/provider/${providerId}/with-reviewer`);
  }

  /**
   * Récupère toutes les reviews écrites par l'utilisateur connecté.
   *
   * @returns {Observable<Review[]>} Un Observable contenant les reviews écrites par l'utilisateur
   */
  getReviewsWrittenByUser(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/writer`);
  }

  /**
   * Récupère toutes les reviews reçues par l'utilisateur connecté.
   *
   * @returns {Observable<Review[]>} Un Observable contenant les reviews reçues par l'utilisateur
   */
  getReviewsReceivedByUser(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/received`);
  }

  /**
   * Vérifie si une review existe pour une réservation donnée.
   *
   * Cette méthode est utile pour déterminer si un utilisateur
   * peut encore écrire une review pour une réservation spécifique.
   *
   * @param {number} reservationId - L'identifiant de la réservation
   * @returns {Observable<boolean>} Un Observable retournant true si une review existe, false sinon
   */
  hasReviewForReservation(reservationId: number): Observable<boolean> {
    return this.http.get<Review[]>(`${this.apiUrl}/reservation/${reservationId}`).pipe(
      map(reviews => reviews.length > 0)
    );
  }
}
