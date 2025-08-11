import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/User';
import { Service } from '../../models/Service';
import { UpdateUserDTO } from '../../models/UpdateUserDTO';
import { UserProfileDTO } from '../../models/UserProfileDTO';
import { ConfigService } from '../config/config.service';

@Injectable({
  providedIn: 'root'
})
export class UserInformationService {
  private urlApi: string;

  constructor(
    private http: HttpClient,
    private readonly configService: ConfigService
  ) {
    this.urlApi = this.configService.apiUrl;
  }

  /**
   * Récupère les informations d'un utilisateur par son ID
   * @param userId ID de l'utilisateur
   * @returns Observable<User> Les informations de l'utilisateur
   */
  getUserById(userId: number): Observable<User> {
    const url = `${this.configService.apiUrl}/users/${userId}`;
    
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
    const url = `${this.configService.apiUrl}/users/profile`;
    
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
    const url = `${this.configService.apiUrl}/users/batch`;
    
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
   * @returns Observable<UserProfileDTO> Le profil mis à jour
   */
  updateUserProfile(updateDTO: UpdateUserDTO): Observable<UserProfileDTO> {
    const url = `${this.configService.apiUrl}/users/profile`;
    
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.patch<UserProfileDTO>(url, updateDTO);
    }
    
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch<UserProfileDTO>(url, updateDTO, { headers });
  }

  /**
   * Récupère le profil complet de l'utilisateur avec ses services
   * @returns Observable<UserProfileDTO> Le profil complet de l'utilisateur
   */
  getUserProfileWithServices(): Observable<UserProfileDTO> {
    const url = `${this.configService.apiUrl}/users/profile`;
    
    // Récupération du token depuis le localStorage
    const token = localStorage.getItem('token');
    
    // Si pas de token, essayer d'accéder sans authentification
    if (!token) {
      console.warn('Aucun token d\'authentification disponible, tentative d\'accès sans token');
      return this.http.get<UserProfileDTO>(url);
    }
    
    // Configuration des headers
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserProfileDTO>(url, { headers });
  }

  /**
   * Récupère les services de l'utilisateur authentifié
   * @returns Observable<Service[]> Les services de l'utilisateur
   */
  getMyServices(): Observable<Service[]> {
    const url = `${this.configService.apiUrl}/services/my-services`;
    
    console.log('Récupération des services depuis:', url);
    
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
    const url = `${this.configService.apiUrl}/services`;
    
    console.log('Création d\'un nouveau service vers:', url);
    console.log('Données du service:', service);
    
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
    const url = `${this.configService.apiUrl}/services/${serviceId}`;
    
    console.log('Mise à jour du service vers:', url);
    console.log('Données du service:', service);
    
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
    const url = `${this.configService.apiUrl}/services/${serviceId}`;
    
    console.log('Suppression du service vers:', url);
    
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