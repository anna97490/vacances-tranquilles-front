// Service de gestion de l'authentification
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService {

  /**
   * Stocke les données d'authentification en localStorage
   * @param token Le token JWT
   * @param userRole Le rôle de l'utilisateur
   */
  storeAuthenticationData(token: string, userRole: string = ''): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userRole);
  }

  /**
   * Récupère le token stocké
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Récupère le rôle utilisateur stocké
   */
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  /**
   * Vérifie si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Supprime toutes les données d'authentification
   */
  clearAuthenticationData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }
}