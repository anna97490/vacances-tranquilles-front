import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/User';
import { Service } from '../../models/Service';
import { UpdateUser } from '../../models/UpdateUser';
import { UserProfile } from '../../models/UserProfile';
import { EnvService } from '../env/env.service';

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {
  private readonly urlApi: string;

  constructor(
    private readonly http: HttpClient,
    private readonly envService: EnvService
  ) {
    this.urlApi = this.envService.apiUrl;
  }

  /**
   * Récupère les informations d'un utilisateur par son ID
   * @param userId ID de l'utilisateur
   * @returns Observable<User> Les informations de l'utilisateur
   */
  getUserById(userId: number): Observable<User> {
    const url = `${this.urlApi}/users/${userId}`;

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.get<User>(url);
    }

    // Configuration des headers avec token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(url, { headers });
  }

  /**
   * Récupère le profil de l'utilisateur authentifié
   * @returns Observable<User> Le profil de l'utilisateur
   */
  getUserProfile(): Observable<User> {
    const url = `${this.urlApi}/users/profile`;

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.get<User>(url);
    }

    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(url, { headers });
  }

  /**
   * Récupère plusieurs utilisateurs par leurs IDs
   * @param userIds Liste des IDs d'utilisateurs
   * @returns Observable<User[]> Les informations des utilisateurs
   */
  getUsersByIds(userIds: number[]): Observable<User[]> {
    const url = `${this.urlApi}/users/batch`;

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.post<User[]>(url, { userIds });
    }

    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<User[]>(url, { userIds }, { headers });
  }

  /**
   * Met à jour le profil de l'utilisateur authentifié
   * @param updateDTO Les données de mise à jour du profil
   * @returns Observable<UserProfile> Le profil mis à jour
   */
  updateUserProfile(updateDTO: UpdateUser): Observable<UserProfile> {
    const url = `${this.urlApi}/users/profile`;

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.patch<UserProfile>(url, updateDTO);
    }

    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<UserProfile>(url, updateDTO, { headers });
  }

  /**
   * Récupère le profil complet de l'utilisateur avec ses services
   * @returns Observable<UserProfile> Le profil complet de l'utilisateur
   */
  getUserProfileWithServices(): Observable<UserProfile> {
    const url = `${this.urlApi}/users/profile`;

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.get<UserProfile>(url);
    }

    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserProfile>(url, { headers });
  }

  /**
   * Récupère les services de l'utilisateur authentifié
   * @returns Observable<Service[]> Les services de l'utilisateur
   */
  getMyServices(): Observable<Service[]> {
    const url = `${this.urlApi}/services/my-services`;



    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.get<Service[]>(url);
    }
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Service[]>(url, { headers });
  }

  /**
   * Récupère les services d'un utilisateur spécifique
   * @param userId ID de l'utilisateur
   * @returns Observable<Service[]> Les services de l'utilisateur
   */
  getUserServices(userId: number): Observable<Service[]> {
    const url = `${this.urlApi}/users/${userId}/services`;



    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.get<Service[]>(url);
    }
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Service[]>(url, { headers });
  }

  /**
   * Crée un nouveau service
   * @param service Les données du service à créer
   * @returns Observable<Service> Le service créé
   */
  createService(service: Service): Observable<Service> {
    const url = `${this.urlApi}/services`;



    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.post<Service>(url, service);
    }
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<Service>(url, service, { headers });
  }

  /**
   * Met à jour un service existant
   * @param serviceId L'ID du service à mettre à jour
   * @param service Les données du service à mettre à jour
   * @returns Observable<Service> Le service mis à jour
   */
  updateService(serviceId: number, service: Service): Observable<Service> {
    const url = `${this.urlApi}/services/${serviceId}`;

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.patch<Service>(url, service);
    }
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<Service>(url, service, { headers });
  }

  /**
   * Supprime un service
   * @param serviceId L'ID du service à supprimer
   * @returns Observable<void>
   */
  deleteService(serviceId: number): Observable<void> {
    const url = `${this.urlApi}/services/${serviceId}`;

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');

    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.delete<void>(url);
    }
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<void>(url, { headers });
  }
}
