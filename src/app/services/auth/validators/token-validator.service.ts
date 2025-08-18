import { Injectable } from '@angular/core';
import { AuthStorageService } from '../../login/auth-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TokenValidatorService {

  constructor(private readonly authStorage: AuthStorageService) {}

  /**
   * Vérifie si le token est présent et valide
   */
  isTokenValid(): boolean {
    const token = this.authStorage.getToken();

    if (!token) {
      return false;
    }

    try {
      // Décoder le token JWT (partie payload)
      const payload = this.decodeToken(token);

      if (!payload) {
        this.authStorage.clearAuthenticationData();

        return false;
      }

      // Vérifier si le token a expiré
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        this.authStorage.clearAuthenticationData();

        return false;
      }

      // Vérifier l'identité de l'utilisateur
      if (!this.verifyTokenIdentity(payload)) {
        this.authStorage.clearAuthenticationData();

        return false;
      }

      return true;
    } catch (error) {
      this.authStorage.clearAuthenticationData();

      return false;
    }
  }

  /**
   * Vérifie que l'ID utilisateur dans le token correspond à celui stocké
   */
  private verifyTokenIdentity(payload: any): boolean {
    try {
      // Extraire l'ID utilisateur du token (subject)
      const tokenUserId = payload.sub;

      if (!tokenUserId) {
        return false;
      }

      // Récupérer l'ID utilisateur stocké dans le localStorage
      const storedUserId = this.authStorage.getUserId();

      if (!storedUserId) {
        return false;
      }

      // Comparer les IDs
      if (tokenUserId !== storedUserId.toString()) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Décode un token JWT
   */
  private decodeToken(token: string): any {
    try {
      // Vérifier que le token a le bon format (3 parties séparées par des points)
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const base64Url = parts[1];
      if (!base64Url) {
        return null;
      }

      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }

  /**
   * Vérifie si l'utilisateur doit être redirigé vers la page de connexion
   */
  shouldRedirectToLogin(): boolean {
    return !this.isTokenValid();
  }
}
