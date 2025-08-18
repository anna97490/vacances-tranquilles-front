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
   * @param userId L'ID de l'utilisateur (optionnel, extrait du token si non fourni)
   */
  storeAuthenticationData(token: string, userRole: string = '', userId?: number): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', userRole);

    // Si userId n'est pas fourni, l'extraire du token
    if (!userId) {
      const extractedUserId = this.getUserIdFromToken();
      if (extractedUserId) {
        userId = extractedUserId;
      }
    }

    if (userId) {
      localStorage.setItem('userId', userId.toString());
    }
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
   * Récupère l'ID utilisateur stocké
   */
  getUserId(): number | null {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      return parseInt(storedUserId, 10);
    }
    return null;
  }

  /**
   * Extrait l'userId du token JWT
   */
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }

    try {
      // Décoder le token JWT (format: header.payload.signature)
      const parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1];

      // Décoder le payload base64
      const decodedPayload = JSON.parse(atob(payload));

      // Chercher l'userId dans le payload
      // Les clés possibles peuvent être: userId, user_id, id, sub, etc.
      const userId = decodedPayload.userId ||
                    decodedPayload.user_id ||
                    decodedPayload.id ||
                    decodedPayload.sub;

      // Convertir en number si c'est une string
      let userIdNumber: number | null = null;
      if (typeof userId === 'string') {
        userIdNumber = parseInt(userId, 10);
      } else if (typeof userId === 'number') {
        userIdNumber = userId;
      }

      if (userIdNumber && userIdNumber >= 1) {
        return userIdNumber;
      }

      return null;
    } catch (error) {
      return null;
    }
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
    localStorage.removeItem('userId');
  }
}
