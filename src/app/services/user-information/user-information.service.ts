import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/User';
import { EnvService } from '../EnvService';

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
} 